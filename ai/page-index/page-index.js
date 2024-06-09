module.exports = [
  {
    title: "AI with pgai on Timescale",
    href: "ai",
    filePath: "index.md",
    pageComponents: ["featured-cards"],
    excerpt:
      "Information about pgai on Timescale and how to use it.",
    children: [
      {
        title: "Key vector database concepts",
        href: "key-vector-database-concepts-for-understanding-pgvector",
        excerpt: "Key concepts for working with pgvector data in PostgreSQL",
      },
      {
        title: "SQL interface",
        href: "sql-interface-for-pgvector-and-timescale-vector",
        excerpt: "SQL interface for pgai, pgvector and pgvectorscale in PostgreSQL",
      },
      /*{
        title: "Python interface",
        href: "python-interface-for-pgvector-and-timescale-vector",
        excerpt: "Python interface for pgai, pgvector, and pgvectorscale in PostgreSQL",
      },
      {
        title: "LangChain integration",
        href: "langchain-integration-for-pgvector-and-timescale-vector",
        excerpt: "Integration of LangChain with pgvector and pgvectorscale",
      },
      {
        title: "LlamaIndex integration",
        href: "llamaindex-integration-for-pgvector-and-timescale-vector",
        excerpt: "Integration of LlamaIndex with pgvector and pgvectorscale",
      },*/
      {
        title: "Embed PostgreSQL data with PgVectorizer",
        href: "pgvectorizer",
        excerpt: "Create vector embeddings from PostgreSQL data with PgVectorizer",
      },
    ],
  },
];
