---
title: Data retention
excerpt: TimescaleDB enables you to save on storage space with data retention policies. Learn how to use, set up, and troubleshoot data retention in your database
products: [cloud, mst, self_hosted]
keywords: [continuous aggregates, data retention, downsample]
---

# Data retention

Data retention helps you save on storage costs by deleting old data. You can
combine data retention with [continuous aggregates][caggs] to downsample your
data.

In this section:

*   [Learn about data retention][data-retention] before you start using it
*   [Learn about data retention with continuous aggregates][retention-with-caggs]
    for downsampling data
*   Create a [data retention policy][retention-policy]
*   [Manually drop chunks][manually-drop] of data
*   [Troubleshoot] data retention

[caggs]: /use-timescale/:currentVersion:/continuous-aggregates/
[data-retention]: /use-timescale/:currentVersion:/data-retention/about-data-retention/
[manually-drop]: /use-timescale/:currentVersion:/data-retention/manually-drop-chunks
[retention-policy]: /use-timescale/:currentVersion:/data-retention/create-a-retention-policy
[retention-with-caggs]: /use-timescale/:currentVersion:/data-retention/data-retention-with-continuous-aggregates
[Troubleshoot]: /use-timescale/:currentVersion:/data-retention/troubleshooting/
