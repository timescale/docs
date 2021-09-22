module.exports = [
    {
        title: "Getting started",
        href: "getting-started",
        pageComponents: ['featured-cards'],
        children: [
          {
            title: "Install TimescaleDB",
            href: "install-timescaledb",
            pageComponents: ['featured-cards'],
            tags: ['timescaledb', 'install'],
            keywords: ['install', 'TimescaleDB'],
            excerpt: 'Install TimescaleDB',
            children: [
              {
                title: "Timescale Forge",
                href: "installation-forge",
                tags: ['tsf', 'install'],
                keywords: ['install', 'Timescale Forge'],
                excerpt: 'Install Timescale Forge'
              },
              {
                title: "Timescale Cloud",
                href: "installation-cloud",
                tags: ['tsc', 'install'],
                keywords: ['install', 'Timescale Cloud'],
                excerpt: 'Install Timescale Cloud',
              },
              {
                title: "Self hosted (including containers)",
                href: "self-hosted",
                type: 'react-page',
                options: { pg_version: ["12", "11"] },
                component: "InstallationPage",
                showNewsletterForm: true,
                tags: ['install', 'timescaledb'],
                keywords: ['TimescaleDB', 'install', 'self-hosted'],
                excerpt: 'Install self-hosted TimescaleDB',
                children: [
                  {
                    title: "Docker",
                    type: 'redirect-to-child-page',
                    href: "docker",
                    iconSrc: "//assets.iobeam.com/images/docs/moby.png",
                    children: [
                      {
                        title: "Docker",
                        type: 'non-menu-page',
                        href: "installation-docker",
                        tags: ['install', 'docker', 'timescaledb'],
                        keywords: ['TimescaleDB', 'install', 'self-hosted', 'Docker'],
                        excerpt: 'Install self-hosted TimescaleDB with Docker'
                      },
                    ],
                  },
                  {
                    title: "Ubuntu",
                    type: 'redirect-to-child-page',
                    href: "ubuntu",
                    iconSrc: "//assets.iobeam.com/images/docs/cof_orange_hex.svg",
                    children: [
                      {
                        title: "apt",
                        type: 'non-menu-page',
                        href: "installation-apt-ubuntu",
                        tags: ['install', 'ubuntu', 'apt', 'timescaledb'],
                        keywords: ['TimescaleDB', 'install', 'self-hosted', 'Ubuntu'],
                        excerpt: 'Install self-hosted TimescaleDB on Ubuntu using apt'
                      },
                      {
                        title: "Source (Ubuntu)",
                        type: 'non-menu-page',
                        href: "installation-source",
                      },
                    ],
                  },
                  {
                    title: "Debian",
                    type: 'redirect-to-child-page',
                    href: "debian",
                    iconSrc: "//assets.iobeam.com/images/docs/Debian_logo.svg",
                    children: [
                      {
                        title: "apt (Debian)",
                        type: 'non-menu-page',
                        href: "installation-apt-debian",
                        tags: ['install', 'debian', 'apt', 'timescaledb'],
                        keywords: ['TimescaleDB', 'install', 'self-hosted', 'Debian'],
                        excerpt: 'Install self-hosted TimescaleDB on Debian using apt'
                      },
                      {
                        title: "Source (Debian)",
                        type: 'non-menu-page',
                        href: "installation-source",
                        tags: ['install', 'debian', 'source', 'timescaledb'],
                        keywords: ['TimescaleDB', 'install', 'self-hosted', 'Debian'],
                        excerpt: 'Install self-hosted TimescaleDB on Debian from source'
                      },
                    ],
                  },
                  {
                    title: "RHEL/CentOS",
                    type: 'redirect-to-child-page',
                    href: "rhel-centos",
                    iconSrc: "//assets.iobeam.com/images/docs/Centos_Red_Hat_logo.svg",
                    children: [
                      {
                        title: "yum/dnf",
                        type: 'non-menu-page',
                        href: "installation-yum",
                        tags: ['install', 'rhel', 'centos', 'yum', 'timescaledb'],
                        keywords: ['TimescaleDB', 'install', 'self-hosted', 'RHEL', 'CentOS'],
                        excerpt: 'Install self-hosted TimescaleDB on Red Hat or CentOS using yum or dnf'
                      },
                      {
                        title: "Source (Red Hat or CentOS)",
                        type: 'non-menu-page',
                        href: "installation-source",
                        tags: ['install', 'rhel', 'centos', 'source', 'timescaledb'],
                        keywords: ['TimescaleDB', 'install', 'self-hosted', 'RHEL', 'CentOS'],
                        excerpt: 'Install self-hosted TimescaleDB on Red Hat or CentOS from source'
                      },
                    ],
                  },
                  {
                    title: "Windows",
                    type: 'redirect-to-child-page',
                    href: "windows",
                    iconSrc: "//assets.iobeam.com/images/docs/Windows_logo_-_2012.svg",
                    children: [
                      {
                        title: "Installer (.zip)",
                        type: 'non-menu-page',
                        href: "installation-windows",
                        tags: ['install', 'mswin', 'exe', 'timescaledb'],
                        keywords: ['TimescaleDB', 'install', 'self-hosted', 'MS Windows',],
                        excerpt: 'Install self-hosted TimescaleDB on Microsoft Windows using a zipped .exe file'
                      },
                      {
                        title: "Source (Windows)",
                        type: 'non-menu-page',
                        href: "installation-source-windows",
                        tags: ['install', 'mswin', 'exe', 'source', 'timescaledb'],
                        keywords: ['TimescaleDB', 'install', 'self-hosted', 'MS Windows'],
                        excerpt: 'Install self-hosted TimescaleDB on Microsoft Windows from source'
                      },
                    ],
                  },
                  {
                    title: "AMI",
                    type: 'redirect-to-child-page',
                    href: "ami",
                    iconSrc: "//assets.iobeam.com/images/docs/aws_logo.svg",
                    children: [
                      {
                        title: "Amazon AMI (Ubuntu)",
                        type: 'non-menu-page',
                        href: "installation-ubuntu-ami",
                        tags: ['install', 'aws', 'ami', 'ubuntu', 'Timescaledb'],
                        keywords: ['TimescaleDB', 'install', 'self-hosted', 'AWS', 'AMI', 'Ubuntu'],
                        excerpt: 'Install self-hosted TimescaleDB on Amazon with an Ubuntu AMI'
                      },
                    ],
                  },
                  {
                    title: "MacOS",
                    type: 'redirect-to-child-page',
                    href: "macos",
                    iconSrc: "//assets.iobeam.com/images/docs/Apple_logo_black.svg",
                    children: [
                      {
                        title: "Homebrew",
                        type: 'non-menu-page',
                        href: "installation-homebrew",
                        tags: ['install', 'macos', 'homebrew', 'timescaledb'],
                        keywords: ['timescaledb', 'install', 'self-hosted', 'MacOS', 'homebrew'],
                        excerpt: 'Install self-hosted TimescaleDB on MacOS using homebrew'
                      },
                      {
                        title: "Source (MacOS)",
                        type: 'non-menu-page',
                        href: "installation-source",
                        tags: ['install', 'macos', 'source', 'timescaledb'],
                        keywords: ['TimescaleDB', 'install', 'self-hosted', 'MacOS'],
                        excerpt: 'Install self-hosted TimescaleDB on MacOS from source'
                      },
                    ],
                  }
                ],
              },
              {
                title: "Post-install setup",
                href: "post-install-setup",
                tags: ['install', 'setup', 'selfhosted', 'timescaledb'],
                keywords: ['TimescaleDB', 'install', 'setup', 'self-hosted'],
                excerpt: 'Set up self-hosted TimescaleDB after installation'
              }
            ]
          },
          {
            title: "1. Launch your first instance",
            href: "launch-timescaledb",
            tags: ['learn', 'create', 'tsc'],
            keywords: ['tutorial', 'Timescale Forge'],
            excerpt: "Use Timescale Forge to launch your first TimescaleDB instance"
          },
          {
            title: "2. Access your database",
            href: "access-timescaledb",
            tags: ['psql', 'connect', 'learn', 'timescaledb'],
            keywords: ['psql', 'tutorial', 'TimescaleDB'],
            excerpt: "Connect to your database using psql"
          },
          {
            title: "3. Create a hypertable",
            href: "create-hypertable",
            tags: ['hypertables', 'create', 'learn', 'timescaledb'],
            keywords: ['hypertables', 'tutorial', 'TimescaleDB'],
            excerpt: "Create a hypertable in TimescaleDB"
          },
          {
            title: "4. Add time-series data",
            href: "add-data",
            tags: ['hypertables', 'data', 'ingest', 'learn', 'timescaledb'],
            keywords: ['hypertables', 'tutorial', 'TimescaleDB'],
            excerpt: "Add sample data to your TimescaleDB instance"
          },
          {
            title: "5. Query your data",
            href: "query-data",
            tags: ['data', 'query', 'learn', 'timescaledb'],
            keywords: ['tutorial', 'TimescaleDB'],
            excerpt: "Query your data using full SQL in TimescaleDB"
          },
          {
            title: "6. Create a continuous aggregate",
            href: "create-cagg",
            tags: ['caggs', 'create', 'learn', 'timescaledb'],
            keywords: ['continuous aggregates', 'tutorial', 'TimescaleDB'],
            excerpt: "Establish continuous aggregates in TimescaleDB"
          },
          {
            title: "7. Save space with compression",
            href: "compress-data",
            tags: ['compression', 'data', 'learn', 'timescaledb'],
            keywords: ['compression', 'tutorial', 'TimescaleDB'],
            excerpt: "Use TimescaleDB's native compression to save space"
          },
          {
            title: "8. Learn about data retention",
            href: "data-retention",
            tags: ['data', 'manage', 'learn', 'timescaledb'],
            keywords: ['data', 'tutorial', 'TimescaleDB'],
            excerpt: "Create a database retention policy for your TimescaleDB instance"
          },
          {
            title: "9. Next steps",
            href: "next-steps",
            tags: ['migrate', 'visualize', 'manage', 'learn', 'timescaledb'],
            keywords: ['tutorial', 'TimescaleDB'],
            excerpt: "Learn how to migrate, visualize and connect your data to TimescaleDB"
          }
        ]
      }
]
