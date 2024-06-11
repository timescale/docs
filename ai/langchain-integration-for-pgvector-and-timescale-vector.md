---
title: LangChain Integration for pgvector, pgvectorscale, and pgai
excerpt: Integrating LangChain with pgvector, pgvectorscale and pgai
products: [cloud]
keywords: [ai, vector, pgvector, python, langchain, pgvectorscale, pgai]
tags: [ai, vector, python, langchain]
---

# LangChain integration for pgvector, pgvectorscale, and pgai

[LangChain](https://www.langchain.com/) is a popular framework for development applications powered by LLMs. pgai on Timescale has a native LangChain integration, enabling you to use it as a vector store and leverage all its capabilities in your applications built with LangChain.

Here are resources about using pgai on Timescale with LangChain:

- [Getting started with LangChain and pgvectorscale](https://python.langchain.com/docs/integrations/vectorstores/timescalevector): You'll learn how to use pgai on Timescale for (1) semantic search, (2) time-based vector search, (3) self-querying, and (4) how to create indexes to speed up queries.
- [PostgreSQL Self Querying](https://python.langchain.com/docs/integrations/retrievers/self_query/timescalevector_self_query): Learn how to use pgai on Timescale with self-querying in LangChain.
- [LangChain template: RAG with conversational retrieval](https://github.com/langchain-ai/langchain/tree/master/templates/rag-timescale-conversation): This template is used for conversational retrieval, which is one of the most popular LLM use-cases. It passes both a conversation history and retrieved documents into an LLM for synthesis.
- [LangChain template: RAG with time-based search and self-query retrieval](https://github.com/langchain-ai/langchain/tree/master/templates/rag-timescale-hybrid-search-time): This template shows how to use timescale-vector with the self-query retriever to perform hybrid search on similarity and time. This is useful any time your data has a strong time-based component.
- [Learn more about pgai on Timescale and LangChain](https://blog.langchain.dev/timescale-vector-x-langchain-making-postgresql-a-better-vector-database-for-ai-applications/):  A blog post about the unique capabilities that pgai on Timescale brings to the LangChain ecosystem.
