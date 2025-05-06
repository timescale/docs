---
title: Error loading the timescaledb extension
section: troubleshooting
products: [self_hosted]
topics: [Install]
errors:
  - language: sql
    message: |-
      ERROR: could not load library "C:/Program Files/PostgreSQL/16/lib/timescaledb-2.14.2.dll": The specified module could not be found.
keywords: [install]
tags: [install]
---

If you see a message saying that $PG cannot load the $TIMESCALE_DB library `timescaledb-<version>.dll`, start a new psql
session to your self-hosted instance and create the `timescaledb` extension as the first command:  

```bash
psql -X -d "postgres://<user>:<password>@<source_host>:<source_port>/<db_name>" -c "CREATE EXTENSION IF NOT EXISTS timescaledb;"
```
