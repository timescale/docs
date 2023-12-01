---
title: Overview of Timescale Vector
excerpt: A description of Timescale Vector and vectors in general
products: [cloud]
keywords: [ai, vector, pgvector, timescale vector]
tags: [ai, vector]
---

# Overview of Timescale Vector

## What is Timescale Vector
Timescale Vector is PostgreSQL++ for AI applications. With Timescale Vector, you can power production AI applications with PostgreSQL as your vector database, storing both vector embeddings, relational data (e.g., metadata), and time-based data in the same database.

Timescale Vector is a cloud-based vector database. There is no self-hosted version at this time. To use Timescale Vector, [sign up here](https://console.cloud.timescale.com/signup?utm_campaign=vectorlaunch&utm_source=tsv-docs&utm_medium=direct).

## Timescale Vector vs. pgvector
[Pgvector](https://github.com/pgvector/pgvector) is a popular open-source extension for vector storage and similarity search in PostgreSQL. Pgvector is packaged as part of Timescale Vector, so you can think of Timescale Vector as a complement, not a replacement for pgvector. Timescale Vector uses the same vector data type as pgvector, offering all its other capabilities (like HNSW and ivfflat indexes). Timescale Vector also offers features not present in pgvector, such as the Timescale Vector index and time-based vector search.

This makes it easy to migrate your existing pgvector deployment and take advantage of additional features for scale in Timescale Vector. You also have the flexibility to create different index types suited to your needs. See the [vector search indexing][vector-search-indexing] section for more sections.

## What are vector embeddings?

Embeddings offer a way to represent the semantic essence of data and to allow comparing data according to how closely related it is in terms of meaning. In the database context, this is extremely powerful: think of this as full-text search on steroids. Vector databases allow storing embeddings associated with data and then searching for embeddings that are similar to a given query.

## Applications of vector embeddings
There are many applications where this is useful:

*Semantic search*: Transcend the limitations of traditional keyword-driven search methods by creating systems that understand the intent and contextual meaning of a query, thereby returning more relevant results. Semantic search doesn't just seek exact word matches; it grasps the deeper intent behind a user's query. The result? Even if search terms differ in phrasing, relevant results are surfaced. Taking advantage of hybrid search, which marries lexical and semantic search methodologies, offers users a search experience that's both rich and accurate. It's not just about finding direct matches anymore; it's about tapping into contextually and conceptually similar content to meet user needs.

*Recommendation systems*: Imagine a user who has shown interest in several articles on a singular topic. With embeddings, the recommendation engine can delve deep into the semantic essence of those articles, surfacing other database items that resonate with the same theme. Recommendations, thus, move beyond just the superficial layers like tags or categories and dive into the very heart of the content.

*Retrieval Augmented Generation (RAG)*: Supercharge generative AI by providing additional context to Large Language Models (LLMs) like OpenAI’s GPT-4, Anthropic’s Claude 2, and open-source modes like Llama 2. When a user poses a query, relevant database content is fetched and used to supplement the query as additional information for the LLM. This helps reduce LLM hallucinations, as it ensures the model's output is more grounded in specific and relevant information, even if it wasn't part of the model's original training data.

*Clustering*: Furthermore, embeddings offer a robust solution for clustering data. Transforming data into these vectorized forms allows for nuanced comparisons between data points in a high-dimensional space. Through algorithms like K-means or hierarchical clustering, data can be categorized into semantic categories, offering insights that surface-level attributes might miss. This deepens our grasp of inherent data patterns, enriching both exploration and decision-making processes.


## Vector similarity search: How does it work

On a high level, embeddings help a database to look for data that is similar to a given piece of information (similarity search. This process includes a few steps:

- First, embeddings are created for data. This can take place either in an application or in the database itself. Then, embeddings are inserted into the database.
- Second, when a user has a search query (e.g., a question), that query is then transformed into an embedding. We’ll call this query embedding.
- Third, the database takes the query embedding and searches for the closest matching (i.e., most similar) embeddings already stored in the database.

Under the hood, embeddings are represented as a vector (i.e., a list of numbers) that capture the essence of the data. To determine how similar two pieces of data are, the database uses mathematical operations on vectors to get a distance measure (commonly Euclidean or cosine distance). During a search, the database should return those stored items where the distance between the query embedding and the stored embedding is as small as possible, suggesting the items are most similar.


## Embedding models

Timescale Vector works with the most popular embedding models that have output vectors of 2,000 dimensions or less. Here are some popular choices for text embeddings for use with Timescale Vector:

- [OpenAI embedding models](https://platform.openai.com/docs/guides/embeddings): text-embedding-ada-002 is OpenAI’s recommended embedding generation model.
- [Sentence transformers](https://huggingface.co/sentence-transformers): Several popular open source models for embedding generation from text.
- [Cohere representation models](https://docs.cohere.com/docs/models#representation): Cohere offers many models that can be used to generate embeddings from text in English or multiple languages.

See the [HuggingFace Massive Text Embedding Benchmark (MTEB) Leaderboard](https://huggingface.co/spaces/mteb/leaderboard) for more embedding model options.


And here are some popular choices for image embeddings:

- [OpenAI CLIP](https://github.com/openai/CLIP): Useful for applications involving text and images.
- [VGG](https://pytorch.org/vision/stable/models/vgg.html)
- [Vision Transformer (ViT)](https://github.com/lukemelas/PyTorch-Pretrained-ViT)

[vector-search-indexing]: /ai/:currentVersion:/concepts/#vector-search-indexing-approximate-nearest-neighbor-search