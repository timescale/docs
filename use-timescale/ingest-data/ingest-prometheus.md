---
title: Prometheus
excerpt: Use TimescaleDB to store your Prometheus metrics
products: [cloud, mst, self_hosted]
keywords: [ingest, Prometheus]
tags: [insert]
---

# Prometheus

Prometheus is used to monitor infrastructure metrics. It scrapes any endpoints
that expose metrics in a compatible format. The metrics are stored in
Prometheus, and you can query them using PromQL (Prometheus Query Language).
Prometheus is not intended for long-term metrics storage, but it supports a
variety of remote storage solutions for that purpose.
Timescale supports Grafana using [PostgreSQL][postgres-grafana] data sources.

[postgres-grafana]: https://grafana.com/docs/grafana/latest/datasources/postgres/
