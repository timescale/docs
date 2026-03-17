---
title: Vectorizer and in-database LLM calls deprecation
excerpt: Migration guide for the deprecation of managed vectorizer and in-database LLM calls on Timescale Cloud
products: [cloud]
keywords: [vectorizer, llm]
tags: [vectorizer, llm]
---

# Vectorizer and in-database LLM calls deprecation notice

We are deprecating the following AI capabilities from $CLOUD_LONG:

1. **Managed Vectorizer** — The cloud-managed service that automatically runs vectorizer workers will be removed. Your vectorizer definitions and embedding tables remain intact, but you will need to run the vectorizer worker yourself.

2. **In-database LLM Calls** — Functions for calling LLM APIs from within the database (`ai.openai_embed`, `ai.openai_chat_complete`, `ai.anthropic_generate`, `ai.ollama_embed`, `ai.cohere_embed`, etc.) will be removed from Cloud. These functions will no longer be available in SQL queries.

**Effective date: June 30, 2026.**

Your **data is not affected**. All tables, embeddings, and vectorizer configurations remain in your database. Only the cloud-managed execution and the in-database LLM calls are being removed.

**What is NOT changing:** Semantic search powered by [pgvector][pgvector] and [pgvectorscale][pgvectorscale], and keyword search with BM25 powered by [pg_textsearch][pg_textsearch] — the building blocks for hybrid search — remain fully available on $CLOUD_LONG. We continue to actively invest in these extensions.

---

## Part 1: Migrating the vectorizer

Your vectorizer definitions and embedding tables stay in your database. The only change is that you now run the worker yourself instead of relying on the cloud-managed scheduler.

### Important: customers running pgai extension versions before 0.10.0

In extension version **0.10.0**, the vectorizer code was moved out of the pgai extension and into the standalone `pgai` Python library. If you are running a pgai extension version **older than 0.10.0** (versions 0.4.0 through 0.9.x), the vectorizer SQL objects (tables, functions) are still owned by the extension. You must upgrade before following the steps below.

To check your current pgai extension version, run:

```sql
SELECT extversion FROM pg_extension WHERE extname = 'ai';
```

If the result is `0.9.x` or earlier, follow the upgrade steps below. If it is `0.10.0` or later, skip ahead to [Step 1: Disable the cloud scheduling](#step-1-disable-the-cloud-scheduling).

1. **Upgrade the pgai extension** to the latest version:

   ```sql
   ALTER EXTENSION ai UPDATE;
   ```

   This runs a migration that detaches the vectorizer objects from the extension without dropping them. Your vectorizer definitions and data remain intact.

2. **Install the pgai library** to manage the vectorizer SQL objects going forward:

   Via pip:

   ```bash
   pip install "pgai[vectorizer-worker]"
   pgai install -d "postgres://tsdbadmin:<password>@<host>:<port>/tsdb?sslmode=require"
   ```

   Or via Docker:

   ```bash
   docker run --pull always --rm --entrypoint python \
     timescale/pgai-vectorizer-worker:latest \
     -m pgai install -d "postgres://tsdbadmin:<password>@<host>:<port>/tsdb?sslmode=require"
   ```

After completing these steps, proceed with the migration steps below.

### Step 1: Disable the cloud scheduling

Connect to your database and remove the cloud scheduler from all your vectorizers. This deletes the TimescaleDB background jobs and switches the scheduling config to `none`, while keeping the vectorizers enabled so the self-hosted worker can pick them up:

```sql
-- Delete the TimescaleDB scheduled jobs
SELECT public.delete_job((config->'scheduling'->>'job_id')::int)
FROM ai.vectorizer
WHERE config->'scheduling'->>'implementation' = 'timescaledb';

-- Switch scheduling to none
UPDATE ai.vectorizer
SET config = jsonb_set(config, '{scheduling}', '{"config_type": "scheduling", "implementation": "none"}'::jsonb)
WHERE config->'scheduling'->>'implementation' = 'timescaledb';
```

### Step 2: Get your connection string

Get your $CLOUD_LONG connection string from the Cloud console. It looks like:

```
postgres://tsdbadmin:<password>@<host>:<port>/tsdb?sslmode=require
```

### Step 3: Run the vectorizer worker

Choose one of the following methods to run the worker yourself.

#### Option A: Docker (recommended)

Create a `.env` file with your API keys:

```
OPENAI_API_KEY=sk-your-openai-api-key
```

Run the worker:

```bash
docker run \
  --env-file .env \
  timescale/pgai-vectorizer-worker:latest \
  --db-url "postgres://tsdbadmin:<password>@<host>:<port>/tsdb?sslmode=require" \
  --poll-interval 5m \
  -c 4
```

#### Option B: Docker Compose

```yaml
name: pgai-vectorizer
services:
  vectorizer-worker:
    image: timescale/pgai-vectorizer-worker:latest
    environment:
      PGAI_VECTORIZER_WORKER_DB_URL: "postgres://tsdbadmin:<password>@<host>:<port>/tsdb?sslmode=require"
      OPENAI_API_KEY: "sk-your-openai-api-key"
    command: ["--poll-interval", "5m", "-c", "4"]
    restart: unless-stopped
```

Start it:

```bash
docker compose up -d
```

#### Option C: CLI

Install the pgai package:

```bash
pip install pgai[vectorizer-worker]
```

Run the worker:

```bash
export OPENAI_API_KEY=sk-your-openai-api-key
pgai vectorizer worker -d "postgres://tsdbadmin:<password>@<host>:<port>/tsdb?sslmode=require" --poll-interval 5m -c 4
```

#### Option D: Python integration

```python
import asyncio
from pgai import Worker

worker = Worker(
    db_url="postgres://tsdbadmin:<password>@<host>:<port>/tsdb?sslmode=require",
    poll_interval=timedelta(minutes=5),
    concurrency=4,
)
asyncio.run(worker.run())
```

For the full worker configuration reference, see the [pgai vectorizer worker documentation][pgai-worker-docs].

---

## Part 2: Migrating away from in-database LLM calls

The in-database LLM calls (`ai.openai_embed`, `ai.openai_chat_complete`, `ai.anthropic_generate`, etc.) are being removed. You need to move these calls to application code.

### Migrating embedding calls

**Before** — embedding generated inside the database:

```sql
SELECT id, content
FROM documents
ORDER BY embedding <=> ai.openai_embed('text-embedding-3-small', 'search query')
LIMIT 5;
```

**After** — generate the embedding in Python, pass it to the query:

```python
import openai
import psycopg2

client = openai.OpenAI()  # uses OPENAI_API_KEY env var

def semantic_search(query: str, limit: int = 5):
    # Generate the embedding in your application
    response = client.embeddings.create(
        model="text-embedding-3-small",
        input=query,
    )
    embedding = response.data[0].embedding

    # Pass the embedding as a parameter to the query
    conn = psycopg2.connect("postgres://tsdbadmin:<password>@<host>:<port>/tsdb?sslmode=require")
    cur = conn.cursor()
    cur.execute(
        """
        SELECT id, content
        FROM documents
        ORDER BY embedding <=> %s::vector
        LIMIT %s
        """,
        (embedding, limit),
    )
    return cur.fetchall()
```

Or with `asyncpg`:

```python
import openai
import asyncpg

client = openai.OpenAI()

async def semantic_search(query: str, limit: int = 5):
    response = client.embeddings.create(
        model="text-embedding-3-small",
        input=query,
    )
    embedding = response.data[0].embedding

    conn = await asyncpg.connect("postgres://tsdbadmin:<password>@<host>:<port>/tsdb?sslmode=require")
    rows = await conn.fetch(
        """
        SELECT id, content
        FROM documents
        ORDER BY embedding <=> $1::vector
        LIMIT $2
        """,
        str(embedding),
        limit,
    )
    return rows
```

### Migrating chat completion calls

**Before** — chat completion inside the database:

```sql
SELECT ai.openai_chat_complete(
  'gpt-4o',
  jsonb_build_array(
    jsonb_build_object('role', 'user', 'content', 'Summarize this: ' || doc.content)
  )
)->'choices'->0->'message'->>'content' AS summary
FROM documents doc
WHERE doc.id = 1;
```

**After** — call the API from your application:

```python
import openai

client = openai.OpenAI()

def summarize(content: str) -> str:
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": f"Summarize this: {content}"}],
    )
    return response.choices[0].message.content
```

### Migrating Anthropic calls

**Before:**

```sql
SELECT ai.anthropic_generate(
  'claude-sonnet-4-20250514',
  jsonb_build_array(
    jsonb_build_object('role', 'user', 'content', 'Explain this concept')
  )
);
```

**After:**

```python
import anthropic

client = anthropic.Anthropic()

def generate(prompt: str) -> str:
    message = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1024,
        messages=[{"role": "user", "content": prompt}],
    )
    return message.content[0].text
```

### Migrating Cohere reranking

**Before:**

```sql
SELECT ai.cohere_rerank(
  'rerank-english-v3.0',
  'search query',
  jsonb_agg(content)
)
FROM documents
LIMIT 100;
```

**After:**

```python
import cohere

client = cohere.Client()

def rerank(query: str, documents: list[str]) -> list:
    response = client.rerank(
        model="rerank-english-v3.0",
        query=query,
        documents=documents,
    )
    return response.results
```

### Summary of function replacements

| Deprecated function                             | Replacement                                                               |
| ----------------------------------------------- | ------------------------------------------------------------------------- |
| `ai.openai_embed(model, text)`                  | `openai.OpenAI().embeddings.create(model=model, input=text)`              |
| `ai.openai_chat_complete(model, messages)`      | `openai.OpenAI().chat.completions.create(model=model, messages=messages)` |
| `ai.openai_chat_complete_simple(model, prompt)` | `openai.OpenAI().chat.completions.create(model=model, messages=[...])`    |
| `ai.openai_moderate(model, input)`              | `openai.OpenAI().moderations.create(model=model, input=input)`            |
| `ai.anthropic_generate(model, messages)`        | `anthropic.Anthropic().messages.create(model=model, messages=messages)`   |
| `ai.ollama_embed(model, text)`                  | `ollama.embed(model=model, input=text)`                                   |
| `ai.ollama_generate(model, prompt)`             | `ollama.generate(model=model, prompt=prompt)`                             |
| `ai.ollama_chat_complete(model, messages)`      | `ollama.chat(model=model, messages=messages)`                             |
| `ai.cohere_embed(model, text)`                  | `cohere.Client().embed(model=model, texts=[text])`                        |
| `ai.cohere_rerank(model, query, docs)`          | `cohere.Client().rerank(model=model, query=query, documents=docs)`        |
| `ai.cohere_chat_complete(model, messages)`      | `cohere.Client().chat(model=model, messages=messages)`                    |
| `ai.voyageai_embed(model, text)`                | `voyageai.Client().embed(texts=[text], model=model)`                      |
| `ai.voyageai_rerank(model, query, docs)`        | `voyageai.Client().rerank(query=query, documents=docs, model=model)`      |

### General migration pattern

For any `ai.*` function call:

1. **Identify the provider** — the function prefix tells you (`openai_`, `anthropic_`, `ollama_`, `cohere_`, `voyageai_`)
2. **Install the provider's Python SDK** — `pip install openai`, `pip install anthropic`, etc.
3. **Move the call to your application** — call the SDK from your app code before or after your database queries
4. **Pass results as query parameters** — for embeddings, generate the vector in your app and pass it as a parameter to your SQL query

[pgvector]: https://github.com/pgvector/pgvector
[pgvectorscale]: https://github.com/timescale/pgvectorscale
[pg_textsearch]: https://github.com/timescale/pg_textsearch
[pgai-worker-docs]: https://github.com/timescale/pgai/blob/main/docs/vectorizer/worker.md
