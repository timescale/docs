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
        href: "concepts",
        excerpt: "Key concepts for working with vector data in PostgreSQL",
      },
      {
        title: "SQL interface",
        href: "sql-interface",
        excerpt: "SQL interface for Timescale Vector and pgvector in PostgreSQL",
      },
      {
        title: "Python interface",
        href: "python-interface",
        excerpt: "Python interface for Timescale Vector and pgvector in PostgreSQL",
      },
      {
        title: "LangChain integration",
        href: "langchain-integration",
        excerpt: "Integration of LangChain with Timescale Vector",
      },
      {
        title: "LlamaIndex integration",
        href: "llamaindex-integration",
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
