module.exports = [
  {
    title: "AI  and Vector: pgai on Tiger",
    href: "ai",
    filePath: "index.md",
    pageComponents: ["featured-cards"],
    excerpt:
      "Information about pgai on Tiger Data and how to use it.",
    children: [
      {
        title: "Key vector database concepts",
        href: "key-vector-database-concepts-for-understanding-pgvector",
        excerpt: "Key concepts for working with pgvector data in Postgres",
      },
      {
        title: "SQL interface",
        href: "sql-interface-for-pgvector-and-timescale-vector",
        excerpt: "SQL interface for pgai, pgvector and pgvectorscale in Postgres",
      },
      /*{
        title: "Python interface",
        href: "python-interface-for-pgvector-and-timescale-vector",
        excerpt: "Python interface for pgai, pgvector, and pgvectorscale in Postgres",
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
      },
      {
        title: "Embed Postgres data with PgVectorizer",
        href: "pgvectorizer",
        excerpt: "Create vector embeddings from Postgres data with PgVectorizer",
      },*/
    ],
  },
];
