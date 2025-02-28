---
title: Integrate Pulumi with Timescale Cloud
excerpt: Manage your Timescale Cloud services with a Terraform provider
products: [cloud]
keywords: [Terraform, configuration, deployment]
tags: [integrate]
---

import IntegrationPrereqs from "versionContent/_partials/_integration-prereqs.mdx";

# Integrate Pulumi with $CLOUD_LONG

Pulumi is an open-source infrastructure as code platform that enables you to define, deploy, and manage your infrastructure and applications across multi-cloud, Kubernetes, and on-premises environments.

This page explains how to configure Pulumi to manage your $SERVICE_LONG or a self-hosted database.

## Prerequisites

<IntegrationPrereqs />

* [Download and install][pulumi-install] Pulumi v1.0 or later.

## Configure Pulumi

You use the [$COMPANY Terraform provider][terraform-provider] with Pulumi to manage $SERVICE_LONGs:

<Procedure>

1. 

1. **Install $COMPANY Terraform provider**
 
    ```bash
    pulumi package add terraform-provider timescale/timescale
    ```

1. **Generate client credentials for programmatic use**

    1. In [$CONSOLE][console], click `Timescale project` and save your `Project ID`, then click `Project settings`.

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

You can now manage your resources with Pulumi. See more about [available resources][terraform-resources] and [data sources][terraform-data-sources].

</Procedure>


[pulumi-install]: https://www.pulumi.com/docs/iac/download-install/
[terraform]: https://www.terraform.io/
[console]: https://console.cloud.timescale.com/dashboard/services
[terraform-provider]: https://registry.terraform.io/providers/timescale/timescale/latest/docs
[connection-info]: /use-timescale/:currentVersion:/integrations/find-connection-details/
[terraform-resources]: https://registry.terraform.io/providers/timescale/timescale/latest/docs/resources/peering_connection
[terraform-data-sources]: https://registry.terraform.io/providers/timescale/timescale/latest/docs/data-sources/products
[pg-provider]: https://registry.terraform.io/providers/cyrilgdn/postgresql/latest