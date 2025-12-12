---
title: Install TimescaleDB on Kubernetes
excerpt: Run TimescaleDB inside Kubernetes using the TimescaleDB Docker container image
products: [self_hosted]
keywords: [installation, self-hosted, Kubernetes]
---

import TestingEnv from "versionContent/_partials/_selfhosted_production_alert.mdx" ;
import KubernetesPrereqs from "versionContent/_partials/_kubernetes-prereqs.mdx";
import KubernetesInstallSelf from "versionContent/_partials/_kubernetes-install-self-hosted.mdx";


# Install $TIMESCALE_DB on Kubernetes

You can run TimescaleDB inside Kubernetes using the TimescaleDB Docker container images. 

<TestingEnv />

## Prerequisites

To follow the steps on this page:

<KubernetesPrereqs />

## Integrate $TIMESCALE_DB in a Kubernetes cluster

<KubernetesInstallSelf />

## Install with $PG Kubernetes operators

You can also use $PG Kubernetes operators to simplify installation, configuration, and life cycle. The operators which our community members have 
told us work well are:

- [StackGres][stackgres] (includes TimescaleDB images)
- [$PG Operator (Patroni)][patroni] 
- [PGO][pgo]
- [CloudNativePG][cnpg]

[stackgres]: https://github.com/ongres/stackgres
[patroni]: https://github.com/zalando/postgres-operator
[pgo]: https://github.com/CrunchyData/postgres-operator
[cnpg]: https://github.com/cloudnative-pg/cloudnative-pg
