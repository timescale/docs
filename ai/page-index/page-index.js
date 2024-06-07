module.exports = [
  {
    title: "AI with pgvectorscale",
    href: "ai",
    filePath: "index.md",
    pageComponents: ["featured-cards"],
    excerpt:
      "Information about pgvectorscale and how to use it.",
    children: [
      {
        title: "Key vector database concepts",
        href: "key-vector-database-concepts-for-understanding-pgvector",
        excerpt: "Key concepts for working with pgvector data in PostgreSQL",
      },
      {
        title: "SQL interface",
        href: "sql-interface-for-pgvector-and-timescale-vector",
        excerpt: "SQL interface for pgvectorscale and pgvector in PostgreSQL",
      },
      {
        title: "Python interface",
        href: "python-interface-for-pgvector-and-timescale-vector",
        excerpt: "Python interface for pgvectorscale and pgvector in PostgreSQL",
      },
      {
        title: "LangChain integration",
        href: "langchain-integration-for-pgvector-and-timescale-vector",
        excerpt: "Integration of LangChain with pgvectorscale and pgvector",
      },
      {
        title: "LlamaIndex integration",
        href: "llamaindex-integration-for-pgvector-and-timescale-vector",
        excerpt: "Integration of LlamaIndex with pgvectorscale and pgvector",
      },
      {
        title: "Embed PostgreSQL data with PgVectorizer",
        href: "pgvectorizer",
        excerpt: "Create vector embeddings from PostgreSQL data with PgVectorizer",
      },
    ],
  },
];
