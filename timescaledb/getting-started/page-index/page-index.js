module.exports = [
    {
        title: "Getting Started",
        href: "getting-started",
        pageComponents: ['featured-cards'],
        children: [
          {
            title: "1. Launch your first instance",
            href: "launch-timescaledb"
          },
          {
            title: "2. Access your database",
            href: "access-timescaledb",
            pageComponents: ['featured-cards'],
            children: [
                {
                    href: "psql"
                },
                {
                    title: "pgAdmin",
                    href: "pgadmin"
                },
                {
                    title: "DBeaver",
                    href: "dbeaver"
                },
                {
                    href: "azure-data-studio"
                }
            ]
          },
          {
            title: "3. Add time-series data",
            href: "add-data"
          },
          {
            title: "4. Create a Continuous Aggregate",
            href: "create-cagg"
          },
          {
            title: "5. Save space with Compression",
            href: "compress-data"
          },
          {
            title: "6. Learn about Data Retention",
            href: "data-retention"
          },
          {
            title: "7. Analyze your data",
            href: "analyze-data"
          },
          {
            title: "8. Next steps!",
            href: "next-steps"
          }
        ]
      }
]