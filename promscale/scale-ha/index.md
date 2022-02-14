# Scalability and high availability
Promscale consists of the Promscale Connector, and TimescaleDB. Promscale
benefits from the scalability and high availability capabilities that
TimescaleDB and PostgreSQL provide.

The Promscale Connector is a stateless service that can be horizontally
scaled. It can also be used with a load balancer for high availability.

*   Run Promscale in [high availability][high-availability] mode.
*   Scale Promscale with a [TimescaleDB multi-node database][multi-node]
*   Configure Promscale [multi-tenancy for Prometheus][multi-tenancy]

[high-availability]: /scale-ha/high-availability/
[multi-node]: /scale-ha/multi-node/
[multi-tenancy]: /scale-ha/prometheus-multi-tenancy/
