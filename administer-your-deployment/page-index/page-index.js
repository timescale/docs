module.exports = [
  {
    title: "Administer your deployment",
    href: "administer-your-deployment",
    filePath: "index.md",
    excerpt:
      "Create, configure, optimize and administer your Timescale installation.",
    children: [
      {
        title: "PostgreSQL extensions",
        href: "extensions",
        excerpt: "Timescale PostgreSQL extensions",
        children: [
          {
            title: "pgcrypto extension",
            href: "pgcrypto",
            excerpt: "Using the pgcrypto PostgreSQL extension",
          },
          {
            title: "pgvector extension",
            href: "pgvector",
            excerpt: "Using the pgvector PostgreSQL extension",
          },
          {
            title: "postgis extension",
            href: "postgis",
            excerpt: "Using the postgis PostgreSQL extension",
          },
        ]
      },
      {
        title: "Security",
        href: "security",
        excerpt: "Learn how your Timescale instance is secured",
        children: [
          {
            title: "About security in Timescale Cloud",
            href: "overview",
            excerpt: "Get an overview of Timescale security",
          },
          {
            title: "Client credentials",
            href: "client-credentials",
            excerpt: "Client credentials to programmatically access your Timescale account",
          },
          {
            title: "Connect with a stricter SSL mode",
            href: "strict-ssl",
            excerpt:
              "Connect to Timescale with a stricter SSL mode of verify-ca or verify-full",
          },
          {
            title: "Multi-factor Authentication",
            href: "multi-factor-authentication",
            excerpt: "Multi-factor authentication for your Timescale account",
          },
          {
            title: "Read only role",
            href: "read-only-role",
            excerpt: "Create a read-only role to access your database",
          },
          {
            title: "SAML authentication",
            href: "saml",
            excerpt: "SAML / SSO authentication for your Timescale account",
          },
        ],
      },
      {
        title: "Tiered storage",
        href: "data-tiering",
        excerpt: "Save on storage costs by tiering older data to a low-cost bottomless object storage tier",
        children: [
          {
            title: "About the object storage tier",
            href: "about-data-tiering",
            excerpt:
              "Learn how the object storage tier helps you save on storage costs",
          },
          {
            title: "Creating tiering policies",
            href: "creating-data-tiering-policy",
            excerpt:
              "How to create a tiering policy",
          },
          {
            title: "Enabling the object storage tier",
            href: "enabling-data-tiering",
            excerpt:
              "How to enable the object storage tier",
          },
          {
            title: "Manually tier data",
            href: "manual-tier-chunk",
            excerpt:
              "How to manually tier data to the object storage tier",
          },
          {
            title: "Manually untier data",
            href: "untier-data",
            excerpt: "How to manualy untier data from the object storage tier",
          },
          {
            title: "Querying tiered data",
            href: "querying-tiered-data",
            excerpt:
              "How to query tiered data",
          },
          {
            title: "Replicas and forks with tiered data",
            href: "tiered-data-replicas-forks",
            excerpt:
              "How tiered data works on replicas and forks",
          },
          {
            title: "Tour of tiered storage",
            href: "tour-data-tiering",
            excerpt:
              "A quick tour of tiered storage",
          },
          {
            title: "Troubleshooting",
            href: "troubleshooting",
            type: "placeholder",
          },
        ],
      },
      {
        title: "Timescale Cloud regions",
        href: "regions",
        excerpt: "Timescale AWS regions",
      },
      {
        title: "Timescale limitations",
        href: "limitations",
        excerpt: "Current limitations of Timescale features",
      },
      {
        title: "User management",
        href: "members",
        excerpt: "User management in Timescale Cloud",
        children: [
          {
            title: "Members list",
            href: "members-list",
            excerpt: "Timescale members list",
          },
          {
            title: "Project Ownership",
            href: "project-ownership",
            excerpt: "Timescale project ownership",
          },
        ],
      },
      {
        title: "VPC Peering and AWS PrivateLink",
        href: "vpc",
        excerpt: "Secure your Timescale Service with VPC Peering and AWS PrivateLink",
      },
    ],
  },
];
