---
title: Real-time analytics with Timescale Cloud and Grafana
excerpt: Simulate an IOT dataset in your Timescale Cloud service
products: [cloud, mst, self_hosted]
keywords: [IoT, simulate]
---


import GrafanaConnect from "versionContent/_partials/_grafana-connect.mdx";
import ImportData from "versionContent/_partials/_import-data-nyc-taxis.mdx";

# Real-time analytics with Timescale Cloud and Grafana

[Grafana](https://grafana.com/docs/) enables you to query, visualize, alert on, and explore your metrics, logs, and traces wherever they’re stored.

This page shows you how to integrate Grafana with a $SERVICE_LONG, create a dashboard and panel, then visualize geospatial data.

## Prerequisites

import IntegrationPrereqs from "versionContent/_partials/_integration-prereqs.mdx";

<IntegrationPrereqs />

* Install [self-managed Grafana][grafana-self-managed] or sign up for [Grafana Cloud][grafana-cloud].

## Optimize time-series data in hypertables

<ImportData />


<GrafanaConnect />

## Simulate a dataset


[grafana-self-managed]: https://grafana.com/get/?tab=self-managed
[grafana-cloud]: https://grafana.com/get/
