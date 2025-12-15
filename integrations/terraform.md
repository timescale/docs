---
title: Integrate Terraform with Tiger
excerpt: Manage your Tiger Cloud services with a Terraform provider
products: [cloud, self_hosted]
keywords: [Terraform, configuration, deployment]
tags: [integrate]
---

import IntegrationPrereqs from "versionContent/_partials/_integration-prereqs.mdx";

# Integrate Terraform with $CLOUD_LONG

[Terraform][terraform] is an infrastructure-as-code tool that enables you to safely and predictably provision and manage infrastructure. 

This page explains how to configure Terraform to manage your $SERVICE_LONG or $SELF_LONG. 

## Prerequisites

<IntegrationPrereqs />

* [Download and install][terraform-install] Terraform.

## Configure Terraform 

Configure Terraform based on your deployment type:

<Tabs label="Configure Terraform for your service" persistKey="source-database">

<Tab title="Tiger" label="tiger-cloud">

You use the [$COMPANY Terraform provider][terraform-provider] to manage $SERVICE_LONGs:

<Procedure>

1. **Generate client credentials for programmatic use**

   1. In [$CONSOLE][services-portal], click `Projects` and save your `Project ID`, then click `Project settings`.
   
   1. Click `Create credentials`, then save `Public key` and `Secret key`.

1. **Configure $COMPANY Terraform provider**

   1. Create a `main.tf` configuration file with at least the following content. Change `x.y.z` to the [latest version][terraform-provider] of the provider.

       ```hcl
       terraform {
         required_providers {
           timescale = {
             source  = "timescale/timescale"
             version = "x.y.z"
           }
         }
       }

       # Authenticate using client credentials generated in Tiger Cloud Console.
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
   
   1. Create a `terraform.tfvars` file in the same directory as your `main.tf` to pass in the variable values:

       ```hcl
       export TF_VAR_ts_project_id="<your-timescale-project-id>"
       export TF_VAR_ts_access_key="<your-timescale-access-key>"
       export TF_VAR_ts_secret_key="<your-timescale-secret-key>"
       ```
      
1. **Add your resources**

   Add your $SERVICE_LONGs or $VPC connections to the `main.tf` configuration file. For example:

   ```hcl
   resource "timescale_service" "test" {
     name              = "test-service"   
     milli_cpu         = 500
     memory_gb         = 2
     region_code       = "us-east-1"
     enable_ha_replica = false
   
     timeouts = {
       create = "30m"
     }
   }
   
   resource "timescale_vpc" "vpc" {
     cidr         = "10.10.0.0/16"  
     name         = "test-vpc"
     region_code  = "us-east-1"
   }
   ```
   
You can now manage your resources with Terraform. See more about [available resources][terraform-resources] and [data sources][terraform-data-sources].

</Procedure>

</Tab>

<Tab title="Self-hosted TimescaleDB" label="self-hosted">

You use the [`cyrilgdn/postgresql`][pg-provider] $PG provider to connect to your $SELF_LONG instance. 

Create a `main.tf` configuration file with the following content, using your [connection details][connection-info]:

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
    port            = "your-timescaledb-port"
    database        = "your-database-name"
    username        = "your-username"
    password        = "your-password"
    sslmode         = "require" # Or "disable" if SSL isn't enabled
   }
```

You can now manage your database with Terraform.

</Tab>

</Tabs>

[connection-info]: /integrations/:currentVersion:/find-connection-details/
[pg-provider]: https://registry.terraform.io/providers/cyrilgdn/postgresql/latest
[services-portal]: https://console.cloud.timescale.com/dashboard/services
[terraform-data-sources]: https://registry.terraform.io/providers/timescale/timescale/latest/docs/data-sources/products
[terraform-install]: https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli
[terraform-provider]: https://registry.terraform.io/providers/timescale/timescale/latest/docs
[terraform-resources]: https://registry.terraform.io/providers/timescale/timescale/latest/docs/resources/peering_connection
[terraform]: https://developer.hashicorp.com/terraform
