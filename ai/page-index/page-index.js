module.exports = [
  {
    title: "Integrate AI with Tiger Data",
    href: "ai",
    filePath: "index.md",
    pageComponents: ["featured-cards"],
    excerpt:
      "Integrate AI with your Tiger Data products",
    children: [
      {
        title: "Vectorizer and in-database LLM calls deprecation",
        href: "vectorizer-deprecation",
        excerpt: "Migration guide for the deprecation of managed vectorizer and in-database LLM calls on Timescale Cloud",
      },
      {
        title: "Integrate Tiger Cloud with your AI Assistant",
        href: "mcp-server",
        excerpt: "Manage your services and optimize your schema and queries with your AI Assistant",
      },
      {        
        title: "Aggregate organizational data with AI agents",
        href: "tiger-eon",
        excerpt: "Unify company knowledge with slack-native AI agents",
      },
      {
        title: "Integrate a slack-native AI agent",
        href: "tiger-agents-for-work",
        excerpt: "Configure a Slack-native AI agent to do what you want",
      },
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
