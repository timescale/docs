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
        title: "Key vector database concepts",
        href: "key-vector-database-concepts-for-understanding-pgvector",
        excerpt: "Key concepts for working with pgvector data in PostgreSQL",
      },
      {
        title: "SQL interface",
        href: "sql-interface-for-pgvector-and-timescale-vector",
        excerpt: "SQL interface for Timescale Vector and pgvector in PostgreSQL",
      },
      {
        title: "Python interface",
        href: "python-interface-for-pgvector-and-timescale-vector",
        excerpt: "Python interface for Timescale Vector and pgvector in PostgreSQL",
      },
      {
        title: "LangChain integration",
        href: "langchain-integration-for-pgvector-and-timescale-vector",
        excerpt: "Integration of LangChain with Timescale Vector and pgvector",
      },
      {
        title: "LlamaIndex integration",
        href: "llamaindex-integration-for-pgvector-and-timescale-vector",
        excerpt: "Integration of LlamaIndex with Timescale Vector and pgvector",
      },
      {
        title: "Embed PostgreSQL data with PgVectorizer",
        href: "PgVectorizer",
        excerpt: "Create vector embeddings from PostgreSQL data with PgVectorizer",
      },
    ],
  },
];
