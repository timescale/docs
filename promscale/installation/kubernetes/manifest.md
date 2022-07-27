---
title: Install Promscale on Kubernetes using a manifest file
excerpt: Install Promscale on a Kubernetes cluster using a manifest file
product: promscale
keywords: [Kubernetes, analytics, Helm]
tags: [install]
related_pages: 
  - /promscale/:currentVersion:/installation/resource-recomm/
  - /promscale/:currentVersion:/send-data/
---
## Install Promscale with a manifest file
To install Promscale using a manifest file you must first deploy TimescaleDB on Kubernetes using [helm charts][install-helm] or [install TimescaleDB on a host][install-binary].

<procedure>

#### Installing the Promscale Connector with a manifest
1.  Download the [template manifest file][template-manifest]:
    ```bash
    curl https://raw.githubusercontent.com/timescale/promscale/0.13.0/deploy/static/deploy.yaml --output promscale-connector.yaml
    ```
1.  Edit the manifest and configure the TimescaleDB database details using the
    parameters starting with <PROMSCALE_DB>.
1.  Deploy the manifest:
    ```bash
    kubectl apply -f promscale-connector.yaml
    ```

</procedure>

After you have installed Promscale, you can ingest data.
For instructions, see the [send data][send-data] section.

## Database configurations
<PromscaleConfigurationRecommendations />

[template-manifest]: https://github.com/timescale/promscale/blob/0.13.0/deploy/static/deploy.yaml
[install-binary]: /install/:currentVersion:/self-hosted/
[install-helm]: /promscale/:currentVersion:/installation/kubernetes/helm/#install-timescaledb-using-a-helm-chart
[send-data]: /promscale/:currentVersion:/send-data/