---
title: LangChain Integration for pgvector and pgvectorscale
excerpt: Integrating LangChain with pgvector and pgvectorscale
products: [cloud]
keywords: [ai, vector, pgvector, Timescale vector, python, langchain, pgvectorscale]
tags: [ai, vector, python, langchain]
---

# LangChain integration for pgvector and pgvectorscale

[LangChain](https://www.langchain.com/) is a popular framework for development applications powered by LLMs. pgvectorscale has a native LangChain integration, enabling you to use pgvectorscale as a vector store and leverage all its capabilities in your applications built with LangChain.

Here are resources about using pgvectorscale with LangChain:

- [Getting started with LangChain and pgvectorscale](https://python.langchain.com/docs/integrations/vectorstores/timescalevector): You'll learn how to use pgvectorscale for (1) semantic search, (2) time-based vector search, (3) self-querying, and (4) how to create indexes to speed up queries.
- [PostgreSQL Self Querying](https://python.langchain.com/docs/integrations/retrievers/self_query/timescalevector_self_query): Learn how to use pgvectorscale with self-querying in LangChain.
- [LangChain template: RAG with conversational retrieval](https://github.com/langchain-ai/langchain/tree/master/templates/rag-timescale-conversation): This template is used for conversational retrieval, which is one of the most popular LLM use-cases. It passes both a conversation history and retrieved documents into an LLM for synthesis.
- [LangChain template: RAG with time-based search and self-query retrieval](https://github.com/langchain-ai/langchain/tree/master/templates/rag-timescale-hybrid-search-time): This template shows how to use timescale-vector with the self-query retriever to perform hybrid search on similarity and time. This is useful any time your data has a strong time-based component.
- [Learn more about pgvectorscale and LangChain](https://blog.langchain.dev/timescale-vector-x-langchain-making-postgresql-a-better-vector-database-for-ai-applications/):  A blog post about the unique capabilities that pgvectorscale brings to the LangChain ecosystem.
