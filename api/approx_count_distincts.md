---
title: Approximate count distincts
excerpt: Approximately count the number of distinct items in a dataset
keywords: [count, hyperfunctions]
tags: [approximate, distinct, toolkit]
---

# Approximate count distincts
This section includes functions related to approximating distinct counts.
Approximate count distincts are used to find the number of unique values, or
cardinality, in a large dataset. For more information about approximate count
distinct functions, see the
[hyperfunctions documentation][hyperfunctions-approx-count-distincts].

Some hyperfunctions are included in the default TimescaleDB product. For
additional hyperfunctions, you need to install the
[Timescale Toolkit][install-toolkit] PostgreSQL extension.

<hyperfunctionTable
    hyperfunctionFamily='approximate count distinct'
    includeExperimental
    sortByType
/>

[hyperfunctions-approx-count-distincts]: timescaledb/:currentVersion:/how-to-guides/hyperfunctions/approx-count-distincts/
[install-toolkit]: timescaledb/:currentVersion:/how-to-guides/hyperfunctions/install-toolkit
