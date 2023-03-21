---
title: Time-weighted average functions
excerpt: Calculate time-weighted averages for unevenly sampled data
keywords: [time-weighted, average, hyperfunctions, Toolkit]
tags: [mean]
---

# Time-weighted average functions <Tag type="toolkit">Toolkit</Tag>

This section contains functions related to time-weighted averages and integrals.
Time weighted averages and integrals are commonly used in cases where a time
series is not evenly sampled, so a traditional average gives misleading results.
For more information about these functions, see the
[hyperfunctions documentation][hyperfunctions-time-weight-average].

Some hyperfunctions are included in the default TimescaleDB product. For
additional hyperfunctions, you need to install the
[Timescale Toolkit][install-toolkit] PostgreSQL extension.

<HyperfunctionTable
    hyperfunctionFamily='time-weighted averages'
    includeExperimental
    sortByType
/>

[hyperfunctions-time-weight-average]: /use-timescale/:currentVersion:/hyperfunctions/time-weighted-averages/
[install-toolkit]: /self-hosted/:currentVersion:/tooling/install-toolkit/
