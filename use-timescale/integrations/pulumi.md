---
title: Integrate Pulumi with Timescale Cloud
excerpt: Manage your Timescale Cloud services with a Terraform provider
products: [cloud]
keywords: [Pulumi, Terraform, configuration, deployment]
tags: [integrate]
---

import IntegrationPrereqs from "versionContent/_partials/_integration-prereqs.mdx";

# Integrate Pulumi with $CLOUD_LONG

Pulumi is an open-source infrastructure as code platform that enables you to define, deploy, and manage your infrastructure and applications across multi-cloud and on-premises environments.

This page explains how to configure Pulumi to manage your $SERVICE_LONG or a self-hosted database.

## Prerequisites

<IntegrationPrereqs />

* [Download and install][pulumi-install] Pulumi v1.0 or later.

<Procedure>

1. **Generate client credentials for programmatic use**

    1. In [$CONSOLE][console], click `Timescale project` and save your `Project ID`, then click `Project settings`.

    2. Click `Create credentials`, then save `Public key` and `Secret key`.

1. **Initialize a new Pulumi project**

    1. Create a new directory:  

    ```bash
    mkdir pulumi-timescale
    cd pulumi-timescale
    ```

    2. Initialize a new Pulumi project using YAML runtime:

    ```bash
    pulumi new yaml
    ```

    3. Set the following fields or use default values as prompted:
    `Project name (project): pulumi-timescaledb`
    `Project description (A minimal Pulumi YAML program): A Pulumi project to manage Timescale Cloud resources using YAML`
    `Stack name (dev): dev`

    Create a password:
    `Enter your passphrase to protect config/secrets:`

    You should see something like this:

    ```bash
    Created stack 'dev'

    Your new project is ready to go! 

    To perform an initial deployment, run `pulumi up`
    ```

1. **Configure Pulumi**

    Modify the `Pulumi.yaml` file to this:

    ```yaml
    name: pulumi-timescaledb
    runtime: yaml
    description: Deploy TimescaleDB VPC without AWS

    config:
    tsProjectId:
      type: string
    tsAccessKey:
      type: string
    tsSecretKey:
      type: string
    tsRegion:
      type: string
      default: us-east-1

    resources:
      # TimescaleDB VPC
      timescaleVpc:
        type: timescale:Vpcs
        properties:
          cidr: "10.10.0.0/16"
          name: "timescale-vpc"
          regionCode: ${tsRegion}

    outputs:
      timescaleVpcId: ${timescaleVpc.vpcsId}
    ```

1. **Configure the Pulumi stack**

    To configure the stack, use `pulumi-config` along with your saved `Public key`, `Secret key` and `Timescale Project ID`:

    ```bash
    pulumi config set tsAccessKey "<Public Key>" --secret
    pulumi config set tsSecretKey "<Secret Key>" --secret
    pulumi config set tsProjectId "<Project ID>"
    ```

1. **Install $COMPANY Terraform provider**

    ```bash
    pulumi package add terraform-provider timescale/timescale
    ```

1. **Run the Pulumi project** 

    To view the Timescale VPC, deploy the Pulumi project:

    ```bash
    pulumi up
    ```

You can now manage your resources with Pulumi. See more about [available resources][terraform-resources] and [data sources][terraform-data-sources].

</Procedure>

[pulumi-install]: https://www.pulumi.com/docs/iac/download-install/
[console]: https://console.cloud.timescale.com/dashboard/services
[terraform-resources]: https://registry.terraform.io/providers/timescale/timescale/latest/docs/resources/peering_connection
[terraform-data-sources]: https://registry.terraform.io/providers/timescale/timescale/latest/docs/data-sources/products