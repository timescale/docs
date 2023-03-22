---
title: Gapfilling and interpolation
excerpt: Fill in gaps for unevenly collected data
keywords: [gapfilling, interpolate, hyperfunctions, Toolkit]
---

# Gapfilling and interpolation

This section contains functions related to gapfilling and interpolation. You can
use a gapfilling function to create additional rows of data in any gaps,
ensuring that the returned rows are in chronological order, and contiguous. For
more information about gapfilling and interpolation functions, see the
[hyperfunctions documentation][hyperfunctions-gapfilling].

Some hyperfunctions are included in the default TimescaleDB product. For
additional hyperfunctions, you need to install the
[Timescale Toolkit][install-toolkit] PostgreSQL extension.

<HyperfunctionTable
    hyperfunctionFamily='gapfilling and interpolation'
    includeExperimental
    sortByType
/>

[hyperfunctions-gapfilling]: /use-timescale/:currentVersion:/hyperfunctions/gapfilling-interpolation/
[install-toolkit]: /self-hosted/:currentVersion:/tooling/install-toolkit/
