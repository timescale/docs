import IntegrationPrereqsCloud from "versionContent/_partials/_integration-prereqs-cloud-only.mdx";

## Prerequisites

<IntegrationPrereqsCloud />

* Create an [Azure account](https://azure.microsoft.com/en-gb/pricing/purchase-options/azure-account) with an active subscription.
* Configure [permissions](https://learn.microsoft.com/en-us/azure/private-link/rbac-permissions) to create private endpoints and manage network resources.
* Create an [Azure Virtual Network](https://learn.microsoft.com/en-us/azure/virtual-network/quickstart-create-virtual-network?tabs=portal) with a subnet.

## Set up Azure Private Link connection

Take the following steps to connect $CLOUD_LONG to Azure with Private Link: 

<Procedure>

1. **Create a Private Link authorization**

   1. In [$CONSOLE_LONG][console-azure-privatelink], select `Security` > `Private Endpoints` > `Configure Private Endpoint Connection`. 

   1. Enter your [Azure subscription ID](https://learn.microsoft.com/en-us/azure/azure-portal/get-subscription-tenant-id#find-your-azure-subscription) and specify a name for the Private Link connection.
   
   1. Under `Alias`, copy the alias for the region in which you need to create the connection.

      Cross-region connection is possible, but it is recommended to choose the region closest to your Azure resources, for optimal performance. 

   1. Click `Done`. 

1. **Create a private endpoint** 

   1. In [Azure Portal](https://azure.microsoft.com/en-us/get-started/azure-portal), search for and click `Private Link`. 
   1. Click `Private endpoints` in the navigation tree on the left, then click `Create`. 
   1. Configure the endpoint: 
      1. In `Subscription`, select the subscription you have previously authorized in $CLOUD_LONG. 
      1. In `Resource group`, select an existing resource group or create a new one for your private endpoint. 
      1. Provide a name for your endpoint. 
      1. Select the region where your Virtual Network is deployed.
      1. Click `Next: Resource`.
      1. In `Connection method`, select `Connect to an Azure resource by resource ID or alias`. 
      1. In `Resource ID or alias`, paste the alias you have copied from $CONSOLE_LONG. 
      1. In `Request message`, enter your [$PROJECT_LONG ID][find-connection-details]. 
      1. Click `Next: Virtual Network`.
      1. Select the Virtual Network and subnet for your endpoint, optionally select an application security group, then click `Next: DNS`.
      1. Optionally configure private DNS integration, then click `Next: Tags`. 
      1. Optionally provide tags for your endpoint, then click `Next: Review + create`. 
      1. Review your config and click `Create`. 
 
   Azure deploys your private endpoint. Wait for the deployment to succeed. 

1. **Sync the connection**

   In [$CONSOLE_LONG][console-azure-privatelink] > `Security` > `Private Link`, click the refresh icon next to your connection. $CLOUD_LONG automatically approves connections from authorized subscriptions. Your connection status changes from `Pending` to `Approved`.

1. **Copy your private endpoint IP**

   1. In [Azure Portal](https://azure.microsoft.com/en-us/get-started/azure-portal) >`Private Link` > `Private endpoints`, check that the connection state for your private endpoint is `Approved`.  

   1. Copy the private endpoint IP from the `Private IP` column. 

1. **Update the connection with your private endpoint IP**

   In [$CONSOLE_LONG][console-azure-privatelink] > `Security` > `Private Link`, click the pencil icon under the IP address column for your connection, then paste the IP address you have copied from Azure Portal.

1. **Attach your $SERVICE_SHORT to the private endpoint connection** 

   1. In [$CONSOLE_LONG][console-azure-privatelink], select the $SERVICE_SHORT and click `Operations` > `Security` > `Private Link`.
   1. Select the private endpoint connection in the drop-down and click `Attach`.

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

[console-azure-privatelink]: https://console.cloud.timescale.com/dashboard/azure-privatelink
[find-connection-details]: /integrations/:currentVersion:/find-connection-details/
[regions]: /about/:currentVersion:/supported-platforms/#available-regions