---
title: LangChain Integration
excerpt: LangChain integration for Timescale Vector
products: [cloud]
keywords: [ai, vector, pgvector, timescale vector, python, langchain]
tags: [ai, vector, python, langchain]
---

# LangChain integration

[LangChain](https://www.langchain.com/) is a popular framework for development applications powered by LLMs. Timescale Vector has a native LangChain integration, enabling you to use Timescale Vector as a vectorstore and leverage all its capabilities in your applications built with LangChain.

Here are resources about using Timescale Vector with LangChain:

- [Getting started with LangChain and Timescale Vector](https://python.langchain.com/docs/integrations/vectorstores/timescalevector): You'll learn how to use Timescale Vector for (1) semantic search, (2) time-based vector search, (3) self-querying, and (4) how to create indexes to speed up queries.
- [PostgreSQL Self Querying](https://python.langchain.com/docs/integrations/retrievers/self_query/timescalevector_self_query): Learn how to use Timescale Vector with self-querying in LangChain.
- [LangChain template: RAG with conversational retrieval](https://github.com/langchain-ai/langchain/tree/master/templates/rag-timescale-conversation): This template is used for conversational retrieval, which is one of the most popular LLM use-cases. It passes both a conversation history and retrieved documents into an LLM for synthesis.
- [LangChain template: RAG with time-based search and self-query retrieval](https://github.com/langchain-ai/langchain/tree/master/templates/rag-timescale-hybrid-search-time):This template shows how to use timescale-vector with the self-query retriver to perform hybrid search on similarity and time. This is useful any time your data has a strong time-based component.
- [Learn more about Timescale Vector and LangChain](https://blog.langchain.dev/timescale-vector-x-langchain-making-postgresql-a-better-vector-database-for-ai-applications/)