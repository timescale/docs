---
title: Integrate AI with Tiger Data
excerpt: Build AI assistants with Tiger Data using pgvector, Tiger Eon, Tiger Agents, and MCP server for seamless data integration
products: [cloud, mst, self_hosted]
keywords: [ai, vector, pgvector, pgvectorscale, pgai, tiger-eon, tiger-agents, mcp-server]
tags: [ai, vector, agents, assistants]
---

# Integrate AI with Tiger Data

You can build and deploy AI assistants that understand, analyze, and act on your organizational data using
$COMPANY. Whether you're building semantic search applications, recommendation systems, or intelligent agents 
that answer complex business questions, $COMPANY provides the tools and infrastructure you need.

$COMPANY's AI ecosystem combines $PG with advanced vector capabilities, intelligent agents, and seamless 
integrations. Your AI assistants can:

- Access organizational knowledge from Slack, GitHub, Linear, and other data sources
- Understand context using advanced vector search and embeddings across large datasets
- Execute tasks, generate reports, and interact with your $SERVICE_LONGs through natural language
- Scale reliably with enterprise-grade performance for concurrent conversations

## $EON_LONG for complete organizational AI

[$EON_LONG](/ai/:currentVersion:/tiger-eon/) automatically integrates $AGENTS_LONG with your organizational 
data. You can:

- Get instant access to company knowledge from Slack, GitHub, and Linear
- Process data in real-time as conversations and updates happen
- Store data efficiently with time-series partitioning and compression
- Deploy quickly with Docker and an interactive setup wizard

Use $EON_SHORT when you want to unlock knowledge from your communication and development tools.

## $AGENTS_LONG for enterprise Slack AI

[$AGENTS_LONG](/ai/:currentVersion:/tiger-agents-for-work/) provides enterprise-grade Slack-native AI agents. 
You get:

- Durable event handling with $PG-backed processing
- Horizontal scalability across multiple $AGENTS_SHORT instances
- Flexibility to choose AI models and customize prompts
- Integration with specialized data sources through MCP servers
- Complete observability and monitoring with Logfire

Use $AGENTS_SHORT when you need reliable, customizable AI agents for high-volume conversations.

## $MCP_SHORT for direct AI Assistant integration

The [$MCP_LONG](/ai/:currentVersion:/mcp-server/) integrates directly with popular AI Assistants. You can:

- Work with Claude Code, Cursor, VS Code, and other editors
- Manage $SERVICE_SHORTs and optimize queries through natural language
- Access comprehensive $COMPANY documentation during development
- Use secure authentication and access control

Use the $MCP_SHORT when you want to manage $COMPANY resources from your AI assistant.


<!-- vale Google.Headings = NO -->
## pgvectorscale and️ pgvector
<!-- vale Google.Headings = Yes -->

[Pgvector](https://github.com/pgvector/pgvector) is a popular open source extension for vector storage and similarity search in $PG and [pgvectorscale](https://github.com/timescale/pgvectorscale) adds advanced indexing capabilities to pgvector. pgai on $CLOUD_LONG offers both extensions so you can use all the capabilities already available in pgvector (like HNSW and ivfflat indexes) and also make use of the StreamingDiskANN index in pgvectorscale to speed up vector search.

This makes it easy to migrate your existing pgvector deployment and take advantage of the additional performance features in pgvectorscale. You also have the flexibility to create different index types suited to your needs. See the [vector search indexing][vector-search-indexing] section for more information.


Embeddings offer a way to represent the semantic essence of data and to allow comparing data according to how closely related it is in terms of meaning. In the database context, this is extremely powerful: think of this as full-text search on steroids. Vector databases allow storing embeddings associated with data and then searching for embeddings that are similar to a given query.

- Semantic search: transcend the limitations of traditional keyword-driven search methods by creating systems that understand the intent and contextual meaning of a query, thereby returning more relevant results. Semantic search doesn't just seek exact word matches; it grasps the deeper intent behind a user's query. The result? Even if search terms differ in phrasing, relevant results are surfaced. Taking advantage of hybrid search, which marries lexical and semantic search methodologies, offers users a search experience that's both rich and accurate. It's not just about finding direct matches anymore; it's about tapping into contextually and conceptually similar content to meet user needs.

- Recommendation systems: imagine a user who has shown interest in several articles on a singular topic. With embeddings, the recommendation engine can delve deep into the semantic essence of those articles, surfacing other database items that resonate with the same theme. Recommendations, thus, move beyond just the superficial layers like tags or categories and dive into the very heart of the content.

- Retrieval augmented generation (RAG): supercharge generative AI by providing additional context to Large Language Models (LLMs) like OpenAI's GPT-4, Anthropic's Claude 2, and open source modes like Llama 2. When a user poses a query, relevant database content is fetched and used to supplement the query as additional information for the LLM. This helps reduce LLM hallucinations, as it ensures the model's output is more grounded in specific and relevant information, even if it wasn't part of the model's original training data.

- Clustering: embeddings also offer a robust solution for clustering data. Transforming data into these vectorized forms allows for nuanced comparisons between data points in a high-dimensional space. Through algorithms like K-means or hierarchical clustering, data can be categorized into semantic categories, offering insights that surface-level attributes might miss. This surfaces inherent data patterns, enriching both exploration and decision-making processes.


### Vector similarity search: How does it work

On a high level, embeddings help a database to look for data that is similar to a given piece of information (similarity search). This process includes a few steps:

- First, embeddings are created for data and inserted into the database. This can take place either in an application or in the database itself.
- Second, when a user has a search query (for example, a question in chat), that query is then transformed into an embedding.
- Third, the database takes the query embedding and searches for the closest matching (most similar) embeddings it has stored.

Under the hood, embeddings are represented as a vector (a list of numbers) that capture the essence of the data. To determine the similarity of two pieces of data, the database uses mathematical operations on vectors to get a distance measure (commonly Euclidean or cosine distance). During a search, the database should return those stored items where the distance between the query embedding and the stored embedding is as small as possible, suggesting the items are most similar.


### Embedding models

pgai on $CLOUD_LONG works with the most popular embedding models that have output vectors of 2,000 dimensions or less.:

- [OpenAI embedding models](https://platform.openai.com/docs/guides/embeddings/): text-embedding-ada-002 is OpenAI's recommended embedding generation model.
- [Cohere representation models](https://docs.cohere.com/docs/models#representation): Cohere offers many models that can be used to generate embeddings from text in English or multiple languages.


And here are some popular choices for image embeddings:

- [OpenAI CLIP](https://github.com/openai/CLIP): Useful for applications involving text and images.
- [VGG](https://docs.pytorch.org/vision/stable/models/vgg.html)
- [Vision Transformer (ViT)](https://github.com/lukemelas/PyTorch-Pretrained-ViT)

[vector-search-indexing]: /ai/:currentVersion:/key-vector-database-concepts-for-understanding-pgvector/#vector-search-indexing-approximate-nearest-neighbor-search
