module.exports = [
  {
    title: "Data security and reliability",
    href: "data-security-and-reliability",
    filePath: "index.md",
    excerpt:
      "Install and manage your deployment, control user access, and integrate third party tooling",
    children: [
      {
        title: "Backup, restore, and PITR",
        href: "backup-restore",
        children: [
          {
            title: "Backup and restore",
            href: "backup-restore-cloud",
            excerpt: "Timescale backup and restore",
          },
          {
            title: "Point-in-time recovery",
            href: "point-in-time-recovery",
            excerpt: "PITR on Timescale services"
          }
        ]
      },
      {
        title: "Ensure data availability and accessibility",
        href: "data-replication",
        excerpt: "Key concepts for working with pgvector data in PostgreSQL",
      },
      {
        title: "High availability and read replication",
        href: "ha-replicas",
        excerpt: "Timescale high availability and read replication",
        children: [
          {
            title: "Manage high availability",
            href: "high-availability",
            excerpt: "Set up HA replicas on Timescale for high availability",
          },
          {
            title: "Manage read replication",
            href: "read-scaling",
            excerpt: "Understand how read scaling works in Timescale",
          },
        ],
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
    ],
  },
];

