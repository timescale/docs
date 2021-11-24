module.exports = [
  {
    title: "Install",
    href: "install",
    pageComponents: ["featured-cards"],
    tags: ["timescaledb", "install"],
    keywords: ["install", "TimescaleDB"],
    excerpt: "Install TimescaleDB",
    filePath: "index.md",
    children: [
      {
        title: "Timescale Cloud",
        href: "installation-cloud",
        title: "Timescale Cloud",
        href: "installation-cloud",
        tags: ["tsc", "install"],
        keywords: ["install", "Timescale Cloud"],
        excerpt: "Install Timescale Cloud",
      },
      {
        title: "Self hosted",
        href: "self-hosted",
        type: "react-page",
        component: "InstallationPage",
        showNewsletterForm: true,
        tags: ["install", "timescaledb"],
        keywords: ["TimescaleDB", "install", "self-hosted"],
        excerpt: "Install self-hosted TimescaleDB",
        children: [
          {
            title: "Debian/Ubuntu",
            href: "installation-debian",
            tags: ["install", "debian", "apt", "timescaledb"],
            keywords: ["TimescaleDB", "install", "self-hosted", "Debian"],
            iconSrc: "//assets.iobeam.com/images/docs/debian_ubuntu.png",
            excerpt: "Install self-hosted TimescaleDB on Debian using apt",
          },
          {
            title: "RHEL/CentOS",
            href: "installation-redhat",
            tags: ["install", "rhel", "centos", "dnf", "timescaledb"],
            keywords: [
              "TimescaleDB",
              "install",
              "self-hosted",
              "RHEL",
              "CentOS",
            ],
            iconSrc: "//assets.iobeam.com/images/docs/redhat_centos.png",
            excerpt:
              "Install self-hosted TimescaleDB on Red Hat or CentOS using dnf",
          },
          {
            title: "Windows",
            href: "installation-windows",
            tags: ["install", "mswin", "exe", "timescaledb"],
            keywords: ["TimescaleDB", "install", "self-hosted", "MS Windows"],
            iconSrc: "//assets.iobeam.com/images/docs/Windows_logo_-_2012.svg",
            excerpt:
              "Install self-hosted TimescaleDB on Microsoft Windows using a zipped .exe file",
          },
          {
            title: "MacOS",
            href: "installation-macos",
            tags: ["install", "macos", "homebrew", "timescaledb"],
            keywords: [
              "timescaledb",
              "install",
              "self-hosted",
              "MacOS",
              "homebrew",
            ],
            iconSrc: "//assets.iobeam.com/images/docs/Apple_logo_black.svg",
            excerpt: "Install self-hosted TimescaleDB on MacOS using homebrew",
          },
          {
            title: "From source",
            href: "installation-source",
            tags: ["install", "source", "timescaledb"],
            keywords: ["timescaledb", "install", "self-hosted", "source"],
            iconSrc: "//assets.iobeam.com/images/docs/source.png",
            excerpt:
              "Install self-hosted TimescaleDB on any operating system from source",
          },
        ],
      },
      {
        title: "Pre-built containers",
        href: "installation-docker",
        tags: ["install", "docker", "timescaledb"],
        keywords: ["TimescaleDB", "install", "self-hosted", "Docker"],
        excerpt:
          "Install self-hosted TimescaleDB with a pre-built Docker container",
      },
      {
        title: "Pre-built cloud images",
        href: "installation-cloud-image",
        tags: ["install", "aws", "ami", "ubuntu", "Timescaledb"],
        keywords: [
          "TimescaleDB",
          "install",
          "self-hosted",
          "AWS",
          "AMI",
          "Ubuntu",
        ],
        excerpt: "Install self-hosted TimescaleDB on Amazon with an Ubuntu AMI",
      },
      {
        title: "Managed Service for TimescaleDB",
        href: "installation-mst",
        tags: ["mst", "install"],
        keywords: ["install", "Managed Service for TimescaleDB"],
        excerpt: "Install a managed service for TimescaleDB",
      },
    ],
  },
];
