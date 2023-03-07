module.exports = [
  {
    title: "Install TimescaleDB",
    href: "install",
    pageComponents: ["featured-cards"],
    excerpt: "Install TimescaleDB",
    filePath: "index.md",
    children: [
      {
        title: "Timescale Cloud",
        href: "installation-cloud",
        excerpt: "Install Timescale Cloud",
      },
      {
        title: "Self hosted",
        href: "self-hosted",
        type: "react-page",
        component: "InstallationPage",
        showNewsletterForm: true,
        excerpt: "Install self-hosted TimescaleDB",
        children: [
          {
            title: "Linux",
            href: "installation-linux",
            iconSrc: "https://assets.iobeam.com/images/docs/linux-icon.svg",
            excerpt: "Install self-hosted TimescaleDB on Linux",
          },
          {
            title: "Windows",
            href: "installation-windows",
            iconSrc:
              "https://assets.iobeam.com/images/docs/Windows_logo_-_2012.svg",
            excerpt:
              "Install self-hosted TimescaleDB on Microsoft Windows using a zipped .exe file",
          },
          {
            title: "MacOS",
            href: "installation-macos",
            iconSrc:
              "https://assets.iobeam.com/images/docs/Apple_logo_black.svg",
            excerpt: "Install self-hosted TimescaleDB on MacOS using homebrew",
          },
          {
            title: "From source",
            href: "installation-source",
            iconSrc: "https://assets.iobeam.com/images/docs/source.png",
            excerpt:
              "Install self-hosted TimescaleDB on any operating system from source",
          },
        ],
      },
      {
        title: "Pre-built containers",
        href: "installation-docker",
        excerpt:
          "Install self-hosted TimescaleDB with a pre-built Docker container",
      },
      {
        title: "Kubernetes",
        href: "installation-kubernetes",
        excerpt: "Install TimescaleDB on Kubernetes",
      },
      {
        title: "Pre-built cloud images",
        href: "installation-cloud-image",
        excerpt: "Install self-hosted TimescaleDB on Amazon with an Ubuntu AMI",
      },
      {
        title: "Managed Service for TimescaleDB",
        href: "installation-mst",
        excerpt: "Install a managed service for TimescaleDB",
      },
      {
        title: "Troubleshooting",
        href: "troubleshooting",
        type: "placeholder",
      },
    ],
  },
];
