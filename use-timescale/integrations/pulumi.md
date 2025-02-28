---
title: Integrate Pulumi with Timescale Cloud
excerpt: Manage your Timescale Cloud services with a Terraform provider
products: [cloud]
keywords: [Terraform, configuration, deployment]
tags: [integrate]
---

import IntegrationPrereqs from "versionContent/_partials/_integration-prereqs.mdx";

# Integrate Pulumi with $CLOUD_LONG

Pulumi is an open-source infrastructure as code platform that enables you to define, deploy, and manage your infrastructure and applications across multi-cloud and on-premises environments.

This page explains how to configure Pulumi to manage your $SERVICE_LONG or a self-hosted database.

## Prerequisites

<IntegrationPrereqs />

* [Download and install][pulumi-install] Pulumi v1.0 or later.

## Configure Pulumi

You use the [$COMPANY Terraform provider][terraform-provider] with Pulumi to manage $SERVICE_LONGs:

<Procedure>

1. **Generate client credentials for programmatic use**

    1. In [$CONSOLE][console], click `Timescale project` and save your `Project ID`, then click `Project settings`.

    1. Click `Create credentials`, then save `Public key` and `Secret key`.

1. **Create a root Pulumi directory**

    For example:

    ```shell 
    mkdir pulumi-timescale
    cd pulumi-timescale
    ```

1. **Configure Pulumi**

    In the root Pulumi directory, create a `Pulumi.yaml` file and use the programmatic credentials you have created earlier to add the following minimal configuration: 

    ```yaml
    name: timescale-yaml-project
    runtime: yaml
    description: A Pulumi project to manage Timescale Cloud resources using YAML
    config:
      timescale:accessKey:
        value: "<YOUR_ACCESS_KEY>"
      timescale:secretKey:
        value: "<YOUR_SECRET_KEY>"
      timescale:projectId:
        value: "<YOUR_PROJECT_ID>"
      aws:region:
        value: "us-east-1"
    ```

1. **Install $COMPANY Terraform provider**
 
    ```bash
    pulumi package add terraform-provider timescale/timescale
    ```
   
1. **Configure your stack**

    Create a `Pulumi.dev.yaml` file and use the programmatic credentials you have created earlier to add the following minimal configuration:

    ```yaml
    config:
      timescale:accessKey: "<YOUR_ACCESS_KEY>"
      timescale:secretKey: "<YOUR_SECRET_KEY>"
      timescale:projectId: "<YOUR_PROJECT_ID>"
      aws:region: "us-east-1"
    ```

1. **Add your resources**

   Create a `program.yaml` file to define your resources. For example, to create a service: 

   ```yaml
   resources:
     timescaleService:
       type: timescale:Service
       properties:
         name: "example-service"
         projectId: "<YOUR_PROJECT_ID>"
         password: "secure-password"
         regionCode: "us-east-1" 
         milliCpu: 1000 
         memoryGb: 4
   ```
   
1. **Run Pulumi**

   ```
   pulumi up
   ```

You can now manage your resources with Pulumi. See more about [available resources][terraform-resources] and [data sources][terraform-data-sources].

</Procedure>

[pulumi-install]: https://www.pulumi.com/docs/iac/download-install/
[console]: https://console.cloud.timescale.com/dashboard/services
[terraform-provider]: https://registry.terraform.io/providers/timescale/timescale/latest/docs
[connection-info]: /use-timescale/:currentVersion:/integrations/find-connection-details/
[terraform-resources]: https://registry.terraform.io/providers/timescale/timescale/latest/docs/resources/peering_connection
[terraform-data-sources]: https://registry.terraform.io/providers/timescale/timescale/latest/docs/data-sources/products
[pg-provider]: https://registry.terraform.io/providers/cyrilgdn/postgresql/latest