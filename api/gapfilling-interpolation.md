# Gapfilling and interpolation
This section contains functions related to gapfilling and interpolation. You can
use a gapfilling function to create additional rows of data in any gaps,
ensuring that the returned rows are in chronological order, and contiguous. For
more information about gapfilling and interpolation functions, see the
[hyperfunctions documentation][hyperfunctions-gapfilling].

Some hyperfunctions are included in the default TimescaleDB product. For
additional hyperfunctions, you need to install the
[Timescale Toolkit][install-toolkit] PostgreSQL extension.

<hyperfunctionTable
    hyperfunctionFamily='gapfilling and interpolation'
    includeExperimental
    sortByType
/>

[hyperfunctions-gapfilling]: timescaledb/:currentVersion:/how-to-guides/hyperfunctions/gapfilling-interpolation/
[install-toolkit]: timescaledb/:currentVersion:/how-to-guides/hyperfunctions/install-toolkit
