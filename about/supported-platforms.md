---
title: Supported platforms
excerpt: The platforms and systems supported by Timescale products.
products: [ cloud, self_hosted]
keywords: [platforms, systems]
tags: [platforms, os, versions]
---

import ServiceTypes from "versionContent/_partials/_timescale-cloud-services.mdx";
import Regions from "versionContent/_partials/_timescale-cloud-regions.mdx";
import RegionsAzure from "versionContent/_partials/_timescale-cloud-regions-azure.mdx";
import Platforms from "versionContent/_partials/_timescale-cloud-platforms.mdx";

# Supported platforms and regions

This page lists the platforms and systems that $COMPANY products have been tested on for the 
following options:

* **$CLOUD_LONG**: all the latest features that just work. A reliable and worry-free $PG cloud for all your workloads. 
* **Self-hosted products**: create your best app from the comfort of your own developer environment. 

## $CLOUD_LONG

$CLOUD_LONG always runs the latest version of all $COMPANY products. With $CLOUD_LONG you:

* Build everything on one service, and each service hosts one database
* Get faster queries using less compute
* Compress data without sacrificing performance
* View insights on performance, queries, and more
* Reduce storage with automated retention policies

See the available [service capabilities][service-types] and [regions][regions].

### Available service capabilities

<ServiceTypes />

### Available regions

<Tabs label="Tiger Cloud on AWS and Azure" persistKey="tiger-platform-clouds">

<Tab title="Tiger Cloud on AWS" label="aws-cloud">

<Regions />

</Tab>

<Tab title="Tiger Cloud on Azure" label="azure-cloud">

<RegionsAzure />

</Tab>

</Tabs>

## Self-hosted products

<Platforms />

[regions]: /about/:currentVersion:/supported-platforms/#available-regions
[service-types]: /about/:currentVersion:/supported-platforms/#available-service-capabilities
