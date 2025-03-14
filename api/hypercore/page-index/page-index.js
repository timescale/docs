module.exports = [
  {
    title: "Hypercore",
    href: "hypercore",
    excerpt:
      "Seamlessly switch between row-oriented and column-oriented storage",
    children: [
      {
        title: "add_columnstore_policy",
        href: "add_columnstore_policy",
        excerpt: "Convert a chunk to columnstore automatically in the background after it reaches a given age",
      },
      {
        title: "chunk_columnstore_settings",
        href: "chunk_columnstore_settings",
        excerpt: "Show the columnstore settings for each chunk that is a columnstore",
      },
      {
        title: "chunk_columnstore_stats",
        href: "chunk_columnstore_stats",
        excerpt: "Get statistics for columnstore chunks",
      },
      {
        title: "columnstore_settings",
        href: "columnstore_settings",
        excerpt: "Get information about columnstore-related settings for hypertables",
      },
      {
        title: "convert_to_columnstore",
        href: "convert_to_columnstore",
        excerpt: "Convert a specific chunk from rowstore to columnstore",
      },
      {
        title: "convert_to_rowstore",
        href: "convert_to_rowstore",
        excerpt: "Convert a specific chunk from columnstore to rowstore",
      },
      {
        title: "hypertable_columnstore_settings",
        href: "hypertable_columnstore_settings",
        excerpt: "Returns information about the columnstore settings for each hypertable",
      },
      {
        title: "hypertable_columnstore_stats",
        href: "hypertable_columnstore_stats",
        excerpt: "Get columnstore statistics for hypertables",
      },
      {
        title: "remove_columnstore_policy",
        href: "remove_columnstore_policy",
        excerpt: "Remove the columnstore policy",
      },
    ],
  },
];
