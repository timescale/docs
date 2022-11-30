---
title: Scalability and high availability
excerpt: Configure Promscale for scaling and high availability
product: promscale
---

# Scalability and high availability
Promscale consists of the Promscale Connector, and TimescaleDB. Promscale
benefits from the scalability and high availability capabilities that
TimescaleDB and PostgreSQL provide.

The Promscale Connector is a stateless service that can be horizontally
scaled. It can also be used with a load balancer for high availability.

*   Run Promscale in [high availability][high-availability] mode.
*   Configure Promscale [multi-tenancy for Prometheus][multi-tenancy]

[high-availability]: /promscale/:currentVersion:/scale-ha/high-availability/
[multi-tenancy]: /promscale/:currentVersion:/scale-ha/prometheus-multi-tenancy/
