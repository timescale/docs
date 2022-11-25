---
title: Frequency analysis
excerpt: Measure how often values occur in a dataset
keywords: [frequency, hyperfunctions, Toolkit]
---

# Frequency analysis

This section includes functions used to measure how often particular values
occur. These are broken further into state aggregate APIs, which measure the
time spent in a relatively small number of states, and frequency aggregate APIs,
which find the most common elements out of a set of vastly more varied values.

Some hyperfunctions are included in the default TimescaleDB product. For
additional hyperfunctions, you need to install the
[Timescale Toolkit][install-toolkit] PostgreSQL extension.

<hyperfunctionTable
    hyperfunctionFamily='frequency analysis'
    includeExperimental
    sortByType
/>

[install-toolkit]: /timescaledb/:currentVersion:/how-to-guides/hyperfunctions/install-toolkit
