module.exports = [
  {
    title: "AI / Timescale Vector",
    href: "ai",
    filePath: "index.md",
    pageComponents: ["featured-cards"],
    excerpt:
      "Information about Timescale Vector and how to use it.",
    children: [
      {
        title: "Key vector database concepts for understanding pgvector",
        href: "key-vector-database-concepts-for-understanding-pgvector",
        excerpt: "Key concepts for working with vector data in PostgreSQL",
      },
      {
        title: "SQL interface for pgvector and Timescale Vector",
        href: "sql-interface-for-pgvector-and-timescale-vector",
        excerpt: "SQL interface for Timescale Vector and pgvector in PostgreSQL",
      },
      {
        title: "Python interface for pgvector and Timescale Vector",
        href: "python-interface-for-pgvector-and-timescale-vector",
        excerpt: "Python interface for Timescale Vector and pgvector in PostgreSQL",
      },
      {
        title: "LangChain integration for pgvector and Timescale Vector",
        href: "langchain-integration-for-pgvector-and-timescale-vector",
        excerpt: "Integration of LangChain with Timescale Vector",
      },
      {
        title: "LlamaIndex integration for pgvector and Timescale Vector",
        href: "llamaindex-integration-for-pgvector-and-timescale-vector",
        excerpt: "Integration of LlamaIndex with Timescale Vector",
      },
      {
        title: "Embed PostgreSQL data with PgVectorize",
        href: "pgvectorize",
        excerpt: "Create vector embeddings from PostgreSQL data with PgVectorize",
      },
    ],
  },
];
