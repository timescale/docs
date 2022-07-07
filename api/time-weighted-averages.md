---
title: Time-weighted average functions
excerpt: Calculate time-weighted averages for unevenly sampled data
keywords: [time-weighted, average, hyperfunctions, toolkit]
tags: [mean]
---

# Time-weighted average functions <tag type="toolkit">Toolkit</tag>
This section contains functions related to time-weighted averages. Time weighted
averages are commonly used in cases where a time series is not evenly sampled,
so a traditional average gives misleading results. For more information
about time-weighted average functions, see the
[hyperfunctions documentation][hyperfunctions-time-weight-average].

Some hyperfunctions are included in the default TimescaleDB product. For
additional hyperfunctions, you need to install the
[Timescale Toolkit][install-toolkit] PostgreSQL extension.

<hyperfunctionTable
    hyperfunctionFamily='time-weighted averages'
    includeExperimental
    sortByType
/>

[hyperfunctions-time-weight-average]: timescaledb/:currentVersion:/how-to-guides/hyperfunctions/time-weighted-averages/
[install-toolkit]: timescaledb/:currentVersion:/how-to-guides/hyperfunctions/install-toolkit
