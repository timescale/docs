---
title: Integrate Terraform with Timescale Cloud
excerpt: Manage your Timescale Cloud services with a Terraform provider
products: [cloud]
keywords: [Terraform, configuration, deployment]
tags: [integrate]
---

import IntegrationPrereqs from "versionContent/_partials/_integration-prereqs.mdx";

# Integrate Terraform with $CLOUD_LONG

[Terraform][terraform] is an infrastructure-as-code tool that enables you to safely and predictably provision and manage infrastructure. 

This page explains how to configure Terraform to manage your $SERVICE_LONG or a self-hosted database. 

## Prerequisites

<IntegrationPrereqs />

* [Download and install][terraform-install] Terraform.

## Configure Terraform 

Configure Terraform based on your deployment type:

<Tabs label="Configure Terraform for your service">

<Tab title="Timescale Cloud">

You use the [$COMPANY Terraform provider][terraform-provider] to manage $SERVICE_LONGs:

<Procedure>

1. **Generate client credentials for programmatic use**

   In [$CONSOLE][console], open `Project settings` and click `Create credentials`.

1. **Configure $COMPANY Terraform provider**

   Create a `main.tf` configuration file with the following content. Change `x.y.z` to the latest version of the provider. 

   ```hcl
   terraform {
     required_providers {
       timescale = {
         source  = "timescale/timescale"
         version = "x.y.z"
       }
     }
   }

   # Authenticate using client credentials generated in Timescale Console.
   # When required, these credentials will change to a short-lived JWT to do the calls.
   provider "timescale" {
    project_id = var.ts_project_id
    access_key = var.ts_access_key
    secret_key = var.ts_secret_key
   }

   variable "ts_project_id" {
    type = string
   }

   variable "ts_access_key" {
    type = string
   }

   variable "ts_secret_key" {
    type = string
   }
   ```
   
You can now manage your $SERVICE_SHORTs with Terraform. See more about [available resources][terraform-resources] and [data sources][terraform-data-sources].

</Procedure>

</Tab>

<Tab title="Self-hosted TimescaleDB">

You use the Terraform PostgreSQL provider to manage your self-hosted database with TimescaleDB. Add the provider to your Terraform configuration. Use your [connection details][connection-info] to fill in authentication fields: 

```hcl
   terraform {
    required_providers {
     postgresql = {
      source  = "cyrilgdn/postgresql"
      version = ">= 1.15.0"
     }
    }
   }

   provider "postgresql" {
    host            = "your-timescaledb-host"
    port            = 5432
    database        = "your-database-name"
    username        = "your-username"
    password        = "your-password"
    sslmode         = "require" # Or "disable" if SSL isn't enabled
   }
```

You can now manage your database with Terraform.

</Tab>

</Tabs>

[terraform-install]: https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli
[terraform]: https://www.terraform.io/
[console]: https://console.cloud.timescale.com/dashboard/services
[terraform-provider]: https://registry.terraform.io/providers/timescale/timescale/latest/docs
[connection-info]: /use-timescale/:currentVersion:/integrations/find-connection-details/
[terraform-resources]: https://registry.terraform.io/providers/timescale/timescale/latest/docs/resources/peering_connection
[terraform-data-sources]: https://registry.terraform.io/providers/timescale/timescale/latest/docs/data-sources/products