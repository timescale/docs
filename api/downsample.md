---
title: Downsample
excerpt: Downsample data to a smaller, representative subset
keywords: [downsample, hyperfunctions, Toolkit]
products: [cloud, mst, self_hosted]
---

# Downsample

This section includes functions used to downsample data. Downsampling
is used to replace a set of values with a much smaller set that is highly
representative of the original data. This is particularly useful for
graphing applications.

Some hyperfunctions are included in the default TimescaleDB product. For
additional hyperfunctions, you need to install the
[$TOOLKIT_LONG][install-toolkit] PostgreSQL extension.

<HyperfunctionTable
    hyperfunctionFamily='downsample'
    includeExperimental
    sortByType
/>

[install-toolkit]: /self-hosted/:currentVersion:/tooling/install-toolkit/
