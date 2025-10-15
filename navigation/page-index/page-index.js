module.exports = [
  {
    title: "Find a docs page",
    href: "navigation",
    excerpt: "Help tools for finding a docs page",
    filePath: "index.md",
    children: [
      {
        title: "Find by Console location",
        overrideHref: "/console",
        excerpt: "Browse topics by Tiger Console location.",
        type: "placeholder",
      },
      {
        title: "Find by keyword",
        overrideHref: "/keywords",
        excerpt: "Browse topics by keywords.",
        type: "placeholder",
      },
      {
        title: "Full search",
        overrideHref: "/search/?query=Tiger",
        excerpt: "Search TigerData docs, blog, and forum.",
        type: "placeholder",
      },
    ],
  },
];
