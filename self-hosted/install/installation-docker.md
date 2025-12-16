---
title: Install TimescaleDB on Docker
excerpt: Install self-hosted TimescaleDB on any local system from a pre-built Docker container
products: [self_hosted]
keywords: [installation, self-hosted, Docker]
---

import WhereTo from "versionContent/_partials/_where-to-next.mdx";
import TestingEnv from "versionContent/_partials/_selfhosted_production_alert.mdx" ;
import SelfHostedDocker from "versionContent/_partials/_install-self-hosted-docker-based.mdx";
import AddTimescaleDBToDB from "versionContent/_partials/_add-timescaledb-to-a-database.mdx";

# Install $TIMESCALE_DB from a Docker container

$TIMESCALE_DB is a [$PG extension](https://www.postgresql.org/docs/current/external-extensions.html) for
time series and demanding workloads that ingest and query high volumes of data. You can install a $TIMESCALE_DB 
instance on any local system from a pre-built Docker container. 

This section shows you how to 
[Install and configure $TIMESCALE_DB on $PG][install-and-configure-timescaledb-on-postgresql-link].

< TestingEnv/>

### Prerequisites

To run, and connect to a $PG installation on Docker, you need to install:

- [Docker][docker-install]
- [psql][install-psql]


## Install and configure $TIMESCALE_DB on $PG

This section shows you how to install the latest version of $PG and
$TIMESCALE_DB using containers supplied by $COMPANY.

<SelfHostedDocker />


And that is it! You have $TIMESCALE_DB running on a database on a self-hosted instance of $PG.

## Where to next

<WhereTo />

[docker-install]: https://docs.docker.com/get-started/get-docker/
[install-psql]: /integrations/:currentVersion:/psql/

[install-and-configure-timescaledb-on-postgresql-link]: /self-hosted/:currentVersion:/install/installation-docker/#install-and-configure-timescaledb-on-postgres
