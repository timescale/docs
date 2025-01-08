module.exports = [
  {
    title: "Hypercore",
    href: "hypercore",
    filePath: "index.md",
    excerpt:
      "Seamlessly switch between row-oriented and column-oriented storage",
    children: [
      {
        title: "add_columnstore_policy",
        href: "add_columnstore_policy",
        excerpt: "Compresses a chunk automatically in the background after it reaches a given age",
      },
      {
        title: "ALTER TABLE",
        href: "alter_table",
        excerpt: "Enable the columnstore for a hypertable.",
      },
      {
        title: "chunk_columnstore_settings",
        href: "chunk_columnstore_settings",
        excerpt: "Show the compression settings for each chunk that has compression enabled",
      },
      {
        title: "chunk_columnstore_stats",
        href: "chunk_columnstore_stats",
        excerpt: "Get chunk-specific statistics related to hypertable compression",
      },
      {
        title: "columnstore_settings",
        href: "columnstore_settings",
        excerpt: "Get information about compression-related settings for hypertables",
      },
      {
        title: "convert_to_columnstore",
        href: "convert_to_columnstore",
        excerpt: "Compress or recompress a specific chunk in the rowstore and add it to the columnstore",
      },
      {
        title: "convert_to_rowstore",
        href: "convert_to_rowstore",
        excerpt: "Decompress a chunk from the columnstore and add it to the rowstore",
      },
      {
        title: "hypertable_columnstore_settings",
        href: "hypertable_columnstore_settings",
        excerpt: "Returns information about the compression settings for each hypertable in the columnstore.",
      },
      {
        title: "hypertable_columnstore_stats",
        href: "hypertable_columnstore_stats",
        excerpt: "Get statistics related to hypertable compression",
      },
      {
        title: "remove_columnstore_policy",
        href: "remove_columnstore_policy",
        excerpt: "Remove the compression policy",
      },
    ],
  },
];

