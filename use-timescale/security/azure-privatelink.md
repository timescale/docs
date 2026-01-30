---
title: Azure Private Link
excerpt: Azure Private Link ensures that your Tiger Cloud services are only accessible through your secured Azure infrastructure. Set up Private Link connections in Tiger Cloud Console
products: [cloud]
price_plans: [performance, scale, enterprise]
keywords: [PrivateLink, Azure, private endpoint, services, operations, security]
tags: [azure, security]
cloud_ui:
    path:
        - [services, :serviceId, operations, azure-privatelink]
---

import IntegrationPrereqsCloud from "versionContent/_partials/_integration-prereqs-cloud-only.mdx";

# Secure your $CLOUD_LONG services with Azure Private Link

Azure Private Link creates a private connection between your Azure Virtual Network and $CLOUD_LONG services, eliminating exposure to the public internet. Applications in your Azure VNet connect to a Private Endpoint with a private IP address, which links to $CLOUD_LONG. Once connected, your $SERVICE_SHORTs become accessible only through the Private Endpoint, providing enhanced security, reduced attack surface, and compliance with data isolation requirements.

![Azure Private Link architecture][azure-privatelink-architecture]

## Prerequisites

<IntegrationPrereqsCloud />

* Get an Azure subscription with permissions to create Private Endpoints and query network resources
* Create an Azure Virtual Network with a subnet with private endpoint network policies disabled

## Set up Azure Private Link connection

<Procedure>

1. **Get your Azure subscription ID**

    In Azure Portal, search for `Subscriptions` and copy the ID of the subscription you are going to use. 

1. **In [$CONSOLE > `Security` > `Private Link`][console-azure-privatelink], click `Authorize Subscription`**

1. **Enter your Azure subscription ID and click `Authorize`**

   $CLOUD_LONG adds your subscription to the visibility list for all Azure region Private Link Services.

1. **Note the Private Link Service alias for your chosen region**

   $CONSOLE displays the aliases you'll need to create Private Endpoints. These look like:

   ```
   /subscriptions/xxxxx/resourceGroups/xxxxx/providers/Microsoft.Network/privateLinkServices/tiger-eastus
   ```

   Choose the alias for the region closest to your Azure resources for optimal performance.

1. **Create the Private Endpoint using the alias from the previous step**

   Replace `<PRIVATE_LINK_SERVICE_ALIAS>` with the alias for your chosen region:

   ```bash
   az network private-endpoint create \
     --name tiger-private-endpoint \
     --resource-group <YOUR_RESOURCE_GROUP> \
     --vnet-name <YOUR_VNET_NAME> \
     --subnet <YOUR_SUBNET_NAME> \
     --private-connection-resource-id <PRIVATE_LINK_SERVICE_ALIAS> \
     --connection-name tiger-connection \
     --manual-request true \
     --location <YOUR_REGION>
   ```

6. **Query the Private Endpoint IP address**

   ```bash
   az network private-endpoint show \
     --name tiger-private-endpoint \
     --resource-group <YOUR_RESOURCE_GROUP> \
     --query 'customDnsConfigs[0].ipAddresses[0]' \
     --output tsv
   ```

   Save this IP address for the next step.

7. **In [$CONSOLE > Security > Azure Private Link][console-azure-privatelink], click `Sync Connections`**

   $CLOUD_LONG automatically approves connections from authorized subscriptions. Your connection status changes from "Pending" to "Approved".

8. **Click on your connection to view details**

9. **Enter the Private Endpoint IP address from step 6 and click `Update`**

10. **Select the $SERVICE_LONG you want to connect to this Private Endpoint**

11. **Click `Create Binding`**

    $CLOUD_LONG performs several backend operations:
    * Disables public internet access to your $SERVICE_LONG
    * Configures routing based on your Private Endpoint IP
    * Updates the service certificate
    * Generates a DNS record
    * Returns a hostname for your connection

12. **Copy the hostname provided**

    Use this hostname to connect to your database:

    ```
    postgresql://username:password@your-service.eastus.tiger.cloud:5432/database
    ```

Your $SERVICE_LONG is now accessible only through your Azure Private Endpoint.

</Procedure>

## Test the connection

After setting up Private Link, verify that the connection works.

<Procedure>

1. **From a resource inside your Azure VNet** (such as a VM or Azure App Service), test the connection:

   ```bash
   psql "postgresql://username:password@your-service.eastus.tiger.cloud:5432/database"
   ```

2. **Verify that the connection succeeds**

3. **Try connecting from outside your VNet** (such as your local machine)

   The connection should fail, confirming that public access is disabled.

</Procedure>

## Manage Private Link connections

### View connection status

In [$CONSOLE > Security > Azure Private Link][console-azure-privatelink], you can view:
* All authorized Azure subscriptions
* Active Private Endpoint connections
* Connection status (Pending, Approved, Rejected)
* Service bindings

### Remove a Private Link connection

To disconnect a $SERVICE_LONG from a Private Endpoint:

<Procedure>

1. **In [$CONSOLE > Security > Azure Private Link][console-azure-privatelink], select your connection**
2. **Click the service binding you want to remove**
3. **Click `Remove Binding`**

The $SERVICE_LONG returns to public access (if no other Private Link connection is active).

</Procedure>

### Delete a Private Endpoint in Azure

If you delete a Private Endpoint in Azure, the connection becomes broken. Update your $CONSOLE to reflect this change:

<Procedure>

1. **Delete the Private Endpoint in Azure**

   ```bash
   az network private-endpoint delete \
     --name tiger-private-endpoint \
     --resource-group tiger-privatelink-rg
   ```

2. **In [$CONSOLE > Security > Azure Private Link][console-azure-privatelink], click `Sync Connections`**

   $CLOUD_LONG detects the removed connection and updates the status.

</Procedure>

## Regional considerations

* **Cross-region connectivity**: Private Endpoints can connect to Private Link Services in different Azure regions, but for best performance, use the same region
* **Multiple regions**: You can create Private Endpoints in multiple regions connecting to the same $CLOUD_LONG region, or to different $CLOUD_LONG regions
* **Available regions**: Private Link Services are available in all [$CLOUD_LONG supported Azure regions][regions]

<Highlight type="important">

After attaching a $SERVICE_SHORT to a Private Endpoint, it is no longer accessible from the public internet. Make sure all your applications are configured to connect through the Private Endpoint before creating the binding.

</Highlight>

[azure-privatelink-architecture]: /static/images/azure-privatelink-architecture.svg
[console-azure-privatelink]: https://console.cloud.timescale.com/dashboard/azure-privatelink
[regions]: /about/:currentVersion:/supported-platforms/#available-regions