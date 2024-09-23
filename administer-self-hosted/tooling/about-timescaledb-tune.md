---
title: About timescaledb-tune
excerpt: Automatically tune your TimescaleDB database to match your system resources and PostgreSQL version
products: [self_hosted]
keywords: [configuration, timescaledb-tune]
tags: [tune, settings]
---

# About timescaledb-tune

Get better performance by tuning your TimescaleDB database to match your system
resources and PostgreSQL version.  `timescaledb-tune` is an open source command
line tool that analyzes and adjusts your database settings.

## Install timescaledb-tune

`timescaledb-tune` is packaged with binary releases of TimescaleDB. If you
installed TimescaleDB from any binary release, including Docker, you already
have access. For more install instructions, see the
[GitHub repository][github-tstune].

## Tune your database with timescaledb-tune

Run `timescaledb-tune` from the command line. The tool analyzes your
`postgresql.conf` file to provide recommendations for memory, parallelism,
write-ahead log, and other settings. These changes are written to your
`postgresql.conf`. They take effect on the next restart.

<Procedure>

1.  At the command line, run `timescaledb-tune`. To accept all recommendations
    automatically, include the `--yes` flag.

    ```bash
    timescaledb-tune
    ```

1.  If you didn't use the `--yes` flag, respond to each prompt to accept or
    reject the recommendations.
1.  The changes are written to your `postgresql.conf`.

</Procedure>

<Highlight type="note">
For detailed instructions and other options, see the documentation in the
[Github repository](https://github.com/timescale/timescaledb-tune).
</Highlight>

[github-tstune]: https://github.com/timescale/timescaledb-tune
