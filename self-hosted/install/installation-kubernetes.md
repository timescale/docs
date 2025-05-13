---
title: Install TimescaleDB on Kubernetes
excerpt: Run TimescaleDB inside Kubernetes using the TimescaleDB Docker container image
products: [self_hosted]
keywords: [installation, self-hosted, Kubernetes]
---

import TestingEnv from "versionContent/_partials/_selfhosted_production_alert.mdx" ;

# Install TimescaleDB on Kubernetes

TimescaleDB can be run inside Kubernetes using the TimescaleDB Docker 
container images. In the past Timescale maintained Helm charts to 
manage the Kubernetes deployment, but we now recommend that Kubernetes
users rely on one of the amazing PostgreSQL Kubernetes operators to 
simplify installation, configuration, and life-cycle.

<TestingEnv />

The operators which our community members have told us work well are:

- [StackGres][stackgres] (includes TimescaleDB images)
- [Postgres Operator (Patroni)][patroni] 
- [PGO][pgo]
- [CloudNativePG][cnpg]


[stackgres]: https://github.com/ongres/stackgres
[patroni]: https://github.com/zalando/postgres-operator
[pgo]: https://github.com/CrunchyData/postgres-operator
[cnpg]: https://github.com/cloudnative-pg/cloudnative-pg

