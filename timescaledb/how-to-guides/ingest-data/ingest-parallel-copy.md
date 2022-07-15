---
title: TimescaleDB parallel copy
excerpt: Bulk copy historical data into TimescaleDB with TimescaleDB parallel copy
keywords: [ingest, copy, timescaledb-parallel-copy]
tags: [insert]
---

# TimescaleDB parallel copy
For bulk inserting historical data, you can use the TimescaleDB parallel copy
tool, called `timescaledb-parallel-copy`. Install the tool from the TimescaleDB
repository with this command:

```bash
go get github.com/timescale/timescaledb-parallel-copy/cmd/timescaledb-parallel-copy
```

For more information about the parallel copy tool, see the
[developer documentation][gh-parallel-copy].

[gh-parallel-copy]: https://github.com/timescale/timescaledb-parallel-copy
