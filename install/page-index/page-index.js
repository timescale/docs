module.exports = [
  {
    title: "Install TimescaleDB",
    href: "install",
    pageComponents: ["featured-cards"],
    tags: ["timescaledb", "install"],
    excerpt: "Install TimescaleDB",
    filePath: "index.md",
    children: [
      {
        title: "Timescale Cloud",
        href: "installation-cloud",
        tags: ["timescaledb", "install"],
        excerpt: "Install Timescale Cloud",
      },
      {
        title: "Self hosted",
        href: "self-hosted",
        type: "react-page",
        component: "InstallationPage",
        showNewsletterForm: true,
        tags: ["install", "timescaledb"],
        excerpt: "Install self-hosted TimescaleDB",
        children: [
          {
            title: "Debian/Ubuntu",
            href: "installation-debian",
            tags: ["install", "debian", "apt", "timescaledb"],
            iconSrc: "//assets.iobeam.com/images/docs/debian_ubuntu.png",
            excerpt: "Install self-hosted TimescaleDB on Debian using apt",
          },
          {
            title: "RHEL/CentOS",
            href: "installation-redhat",
            tags: ["install", "rhel", "centos", "dnf", "timescaledb"],
            iconSrc: "//assets.iobeam.com/images/docs/redhat_centos.png",
            excerpt:
              "Install self-hosted TimescaleDB on Red Hat or CentOS using dnf",
          },
          {
            title: "Arch Linux",
            href: "installation-archlinux",
            tags: ["install", "archlinux", "timescaledb"],
            iconSrc:
              "//assets.iobeam.com/images/docs/archlinux-logo-light-1200dpi.7ccd81fd52dc.png",
            excerpt:
              "Install self-hosted TimescaleDB on Arch Linux using pacman",
          },
          {
            title: "Windows",
            href: "installation-windows",
            tags: ["install", "mswin", "exe", "timescaledb"],
            iconSrc: "//assets.iobeam.com/images/docs/Windows_logo_-_2012.svg",
            excerpt:
              "Install self-hosted TimescaleDB on Microsoft Windows using a zipped .exe file",
          },
          {
            title: "MacOS",
            href: "installation-macos",
            tags: ["install", "macos", "homebrew", "timescaledb", "macports"],
            iconSrc: "//assets.iobeam.com/images/docs/Apple_logo_black.svg",
            excerpt: "Install self-hosted TimescaleDB on MacOS using homebrew",
          },
          {
            title: "From source",
            href: "installation-source",
            tags: ["install", "source", "timescaledb"],
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
        excerpt:
          "Install self-hosted TimescaleDB with a pre-built Docker container",
      },
      {
        title: "Kubernetes",
        href: "installation-kubernetes",
        title: "Kubernetes",
        href: "installation-kubernetes",
        tags: ["timescaledb", "install", "self-hosted", "kubernetes", "helm"],
        excerpt: "Install TimescaleDB on Kubernetes",
      },
      {
        title: "Pre-built cloud images",
        href: "installation-cloud-image",
        tags: [
          "install",
          "aws",
          "ami",
          "ubuntu",
          "Timescaledb",
          "cloud images",
        ],
        excerpt: "Install self-hosted TimescaleDB on Amazon with an Ubuntu AMI",
      },
      {
        title: "Managed Service for TimescaleDB",
        href: "installation-mst",
        tags: ["mst", "install"],
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
