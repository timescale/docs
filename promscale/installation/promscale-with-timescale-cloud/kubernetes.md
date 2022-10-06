---
title: Kubernetes
excerpt: Install Promscale Connector on a Kubernetes cluster with Timescale Cloud
product: promscale
keywords: [Kubernetes, analytics, Helm]
tags: [install]
related_pages:
  - /promscale/:currentVersion:/guides/resource-recomm/
  - /promscale/:currentVersion:/send-data/
---

import PromscaleInstallPrerequisite from 'versionContent/_partials/_promscale-install-pre-requisite.mdx';
import PromscaleSendData from 'versionContent/_partials/_promscale-send-data.mdx';

# Install Promscale on Kubernetes

You can install Promscale on Kubernetes using Helm or using a manifest file.

<PromscaleInstallPrerequisite />

## Before you begin

*   Install Helm. For more information, including packages and installation
    instructions, see the [Helm documentation][install-helm].
*   Create a [TimescaleDB service] [create-service] on Timescale Cloud.

### Install the Promscale using Helm chart

When you have your TimescaleDB Helm chart installed, you can install the
Promscale Helm chart. Promscale needs to access your TimescaleDB database. You
can provide the database URI, or specify connection parameters.

<procedure>

#### Installing the Promscale using Helm chart

1.  Add the TimescaleDB Helm chart repository:

    ```bash
    helm repo add timescale 'https://charts.timescale.com'
    ```

1.  Check that the repository is up to date:

    ```bash
    helm repo update
    ```

1.  Install the Promscale Helm chart:

    ```bash
    helm install <RELEASE_NAME> timescale/promscale --set connection.uri=<TS_CLOUD_DB_URI>
    ```

    <highlight type="note">
    Replace `&lt;RELEASE_NAME&gt;` with the name of your choice and
    `&lt;TS_CLOUD_DB_URI&gt;` with the `Service URL` that you made note of when
    you created the TimescaleDB service.

</highlight>

</procedure>

### Install Promscale with a manifest file

This section includes instructions to install the Promscale Connector using a
manifest file.

<procedure>

#### Installing the Promscale Connector with a manifest

1.  Download the [template manifest file][template-manifest]:

    ```bash
    curl https://raw.githubusercontent.com/timescale/promscale/0.14.0/deploy/static/deploy.yaml --output promscale-connector.yaml
    ```

1.  Edit the manifest and configure the TimescaleDB database details by adding the
    parameter `<PROMSCALE_DB_URI>` in promscale secret and remove the other `<PROMSCALE_DB_*>`
    parameters because Promscale Connector integrates with Timescale Cloud.

1.  Deploy the manifest:

    ```bash
    kubectl apply -f promscale-connector.yaml
    ```

</procedure>

<PromscaleSendData />

[install-helm]: /promscale/:currentVersion:/installation/kubernetes/#install-promscale-with-helm
[template-manifest]: https://github.com/timescale/promscale/blob/0.14.0/deploy/static/deploy.yaml
[create-service]: /promscale/:currentVersion:/installation/promscale-with-timescale-cloud/