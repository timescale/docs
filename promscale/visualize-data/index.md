# Visualize data in Promscale
You can visualize data in Promscale using tools such as
[Grafana][grafana-homepage] and [Jaeger][jaeger-homepage].

* **Grafana** is a interactive visualization web application that allows you to monitor and
  analyze metrics, logs, and traces. It allows you to query, visualize, alert on
  and understand your data no matter where it is stored. You can connect
  Promscale to Grafana [to visualize metrics and traces][grafana-promscale].
  By configuring Promscale as:
    * [Prometheus data source][promscale-as-prometheus]. 
    * [Jaeger data source][promscale-as-jaeger].
    * [PostgreSQL data source][promscale-as-postgresql]. 

* **Jaeger** is an open source distributed tracing system used for monitoring
and troubleshooting microservices-based distributed systems. You can connect
Promscale to `jaeger-query` component [to visualize traces][jaeger-promscale].

[grafana-promscale]: /visualize-data/grafana
[jaeger-promscale]: /visualize-data/jaeger
[grafana-homepage]:https://grafana.com
[jaeger-homepage]: https://www.jaegertracing.io/
[promscale-as-prometheus]:
    /visualize-data/grafana/#promscale-as-prometheus-datasource
[promscale-as-jaeger]: /visualize-data/grafana/#promscale-as-jaeger-datasource
[promscale-as-postgresql]:
    /visualize-data/grafana/#promscale-as-postgresql-datasource
