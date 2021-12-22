# Scalability and high availability in Promscale
Promscale is made of two components: The Promscale Connector and TimescaleDB, which
is built on top of PostgreSQL. As a result Promscale benefits from the scalability
and high availability capabilities that TimescaleDB and PostgreSQL provides.

The Promscale Connector is a stateless service which can be easily horizontally 
scaled and put behind a load balander for high availability.

* Run Promscale in [high availability][high-availability] mode.
* Scale Promscale with a [TimescaleDB multi-node database][multi-node]
* Configure Promscale [multi-tenancy for Prometheus][multi-tenancy]

[high-availability]: /scale/high-availability/
[multi-node]: /scale/multi-node/
[multi-tenancy]: /scale/prometheus-multi-tenancy/