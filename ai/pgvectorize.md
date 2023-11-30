---
title: Embed your PostgreSQL data with PgVectorize
excerpt: Create and sync vector embeddings from data in PostgreSQL with PgVectorize
products: [cloud]
keywords: [ai, vector, pgvector, timescale vector, pgvectorize]
tags: [ai, vector, pgvectorize]
---

## PgVectorize your PostgreSQL data

PgVectorize enables you to create vector embeddings from any data that
you already have stored in PostgreSQL. You can get more background
information in our [blog
post](https://www.timescale.com/blog/a-complete-guide-to-creating-and-storing-embeddings-for-postgresql-data/)
announcing this feature, as well as a [“how we built
in”](https://www.timescale.com/blog/how-we-designed-a-resilient-vector-embedding-creation-system-for-postgresql-data/)
post going into the details of the design.

To create vector embeddings, simply attach PgVectorize to any PostgreSQL
table, and it will automatically sync that table’s data with a set of
embeddings stored in Timescale Vector. For example, let’s say you have a
blog table defined in the following way:

``` python
import psycopg2
from langchain.docstore.document import Document
from langchain.text_splitter import CharacterTextSplitter
from timescale_vector import client, pgvectorizer
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores.timescalevector import TimescaleVector
from datetime import timedelta
```

``` python
with psycopg2.connect(service_url) as conn:
    with conn.cursor() as cursor:
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS blog (
            id              SERIAL PRIMARY KEY NOT NULL,
            title           TEXT NOT NULL,
            author          TEXT NOT NULL,
            contents        TEXT NOT NULL,
            category        TEXT NOT NULL,
            published_time  TIMESTAMPTZ NULL --NULL if not yet published
        );
        ''')
```

You can insert some data as follows:

``` python
with psycopg2.connect(service_url) as conn:
    with conn.cursor() as cursor:
        cursor.execute('''
            INSERT INTO blog (title, author, contents, category, published_time) VALUES ('First Post', 'Matvey Arye', 'some super interesting content about cats.', 'AI', '2021-01-01');
        ''')
```

Now, say you want to embed these blogs in Timescale Vector. First, you
need to define an `embed_and_write` function that takes a set of blog
posts, creates the embeddings, and writes them into TimescaleVector. For
example, if using LangChain, it could look something like the following.

``` python
def get_document(blog):
    text_splitter = CharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
    )
    docs = []
    for chunk in text_splitter.split_text(blog['contents']):
        content = f"Author {blog['author']}, title: {blog['title']}, contents:{chunk}"
        metadata = {
            "id": str(client.uuid_from_time(blog['published_time'])),
            "blog_id": blog['id'],
            "author": blog['author'],
            "category": blog['category'],
            "published_time": blog['published_time'].isoformat(),
        }
        docs.append(Document(page_content=content, metadata=metadata))
    return docs

def embed_and_write(blog_instances, vectorizer):
    embedding = OpenAIEmbeddings()
    vector_store = TimescaleVector(
        collection_name="blog_embedding",
        service_url=service_url,
        embedding=embedding,
        time_partition_interval=timedelta(days=30),
    )

    # delete old embeddings for all ids in the work queue. locked_id is a special column that is set to the primary key of the table being
    # embedded. For items that are deleted, it is the only key that is set.
    metadata_for_delete = [{"blog_id": blog['locked_id']} for blog in blog_instances]
    vector_store.delete_by_metadata(metadata_for_delete)

    documents = []
    for blog in blog_instances:
        # skip blogs that are not published yet, or are deleted (in which case it will be NULL)
        if blog['published_time'] != None:
            documents.extend(get_document(blog))

    if len(documents) == 0:
        return

    texts = [d.page_content for d in documents]
    metadatas = [d.metadata for d in documents]
    ids = [d.metadata["id"] for d in documents]
    vector_store.add_texts(texts, metadatas, ids)
```

Then, all you have to do is run the following code in a scheduled job
(cron job, Lambda job, etc):

``` python
# this job should be run on a schedule
vectorizer = pgvectorizer.Vectorize(service_url, 'blog')
while vectorizer.process(embed_and_write) > 0:
    pass
```

Every time that job runs, it will sync the table with your embeddings. It
will sync all inserts, updates, and deletes to an embeddings table called
`blog_embedding`.

Now, you can simply search the embeddings as follows (again, using
LangChain in the example):

``` python
embedding = OpenAIEmbeddings()
vector_store = TimescaleVector(
    collection_name="blog_embedding",
    service_url=service_url,
    embedding=embedding,
    time_partition_interval=timedelta(days=30),
)

res = vector_store.similarity_search_with_score("Blogs about cats")
res
```

    [(Document(page_content='Author Matvey Arye, title: First Post, contents:some super interesting content about cats.', metadata={'id': '4a784000-4bc4-11eb-855a-06302dbc8ce7', 'author': 'Matvey Arye', 'blog_id': 1, 'category': 'AI', 'published_time': '2021-01-01T00:00:00+00:00'}),
      0.12595687795193833)]


