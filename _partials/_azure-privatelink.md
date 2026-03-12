import IntegrationPrereqsNoConnection from "versionContent/_partials/_prereqs-cloud-no-connection.mdx";

## Prerequisites

<IntegrationPrereqsNoConnection />

* Create an [Azure account](https://azure.microsoft.com/en-gb/pricing/purchase-options/azure-account) with an active subscription.
* Configure [permissions](https://learn.microsoft.com/en-us/azure/private-link/rbac-permissions) to create private endpoints and manage network resources.
* Create an [Azure Virtual Network](https://learn.microsoft.com/en-us/azure/virtual-network/quickstart-create-virtual-network?tabs=portal) with a subnet for the resources you will connect to $CLOUD_LONG.

## Set up Azure Private Link connection

<Highlight type="note">

Azure Private Link is currently in private preview. To request access in $CONSOLE_LONG, go to `Security` > `Private Endpoints` and click `Request access`. Then refresh the page and follow the steps below. 

</Highlight>

Take the following steps to connect $CLOUD_LONG to Azure with Private Link: 

<Procedure>

1. **Create a Private Link subscription authorization**

   1. In [$CONSOLE_LONG][console-azure-privatelink], select `Security` > `Private Endpoints` > `Configure Private Endpoint Connection`. 

   1. Enter your [Azure subscription ID](https://learn.microsoft.com/en-us/azure/azure-portal/get-subscription-tenant-id#find-your-azure-subscription) and specify a name for the Private Link authorization, then click a checkmark next to it. 

     ![Azure Private Link authorization][azure-privatelink-authorization]
   
   1. Under `Alias`, copy the alias for the region in which you need to create the connection.

      Choose the region closest to your Azure resources for optimal performance. 

   1. Click `Done`. 

      $CLOUD_LONG confirms your authorization. Once it is confirmed, you can create multiple private endpoints from the same authorized subscription.

      ![Azure Private Link authorization complete][azure-privatelink-authorization-complete]    

1. **Create a private endpoint** 

   1. In [Azure Portal](https://azure.microsoft.com/en-us/get-started/azure-portal), go to `Private endpoints` and click `Create`. 

      ![Create Azure Private Endpoint][create-azure-endpoint]    

   1. Configure the endpoint: 
      1. In `Subscription`, select the subscription you have previously authorized in $CLOUD_LONG. 
      1. In `Resource group`, select an existing resource group or create a new one for your private endpoint. 
      1. Provide a name for your endpoint. 
      1. Select the region where your Virtual Network is deployed, then click `Next: Resource`.
      1. In `Connection method`, select `Connect to an Azure resource by resource ID or alias`. 
      1. In `Resource ID or alias`, paste the alias you have copied from $CONSOLE_LONG. 
      1. In `Request message`, enter your [$PROJECT_LONG ID][find-connection-details], then click `Next: Virtual Network`.
      1. Select the Virtual Network and subnet for your endpoint, optionally select an application security group, then click `Next: DNS`.
      1. Optionally configure private DNS integration and tags for your endpoint, then click `Next: Review + create`. 
      1. Review your config and click `Create`. 
         Azure creates your private endpoint. Wait for the deployment to succeed. 
      1. Go to `Private endpoints` and copy the private endpoint IP from the `Private IP` column.

1. **Sync the connection**

   1. In [$CONSOLE_LONG][console-azure-privatelink] > `Security` > `Private Link`, click `Refresh`. $CLOUD_LONG automatically approves connections from authorized subscriptions. Your connection appears in the list. 

     ![Azure Private Endpoint IP][azure-private-endpoint-ip]

   1. Click `Add IP` and paste the IP address you have copied from Azure Portal.

   1. Click the three dots next to your connection and select `+ Attach service`. Select your $SERVICE_SHORT from the dropdown and click `Attach`. You can attach a $SERVICE_SHORT to one Private Endpoint connection. 

     <Highlight type="important">

     After attaching a $SERVICE_SHORT to a Private Endpoint, it is no longer accessible from the public internet. Make sure all your applications are configured to connect through the Private Endpoint before attaching your $SERVICE_SHORT.

     </Highlight>

   1. From a VM inside your Azure VNet, connect to your $SERVICE_SHORT using a connection string with your [connection details][find-connection-details]. You should be able to connect successfully.

</Procedure>


## Manage connections

- To detach a $SERVICE_SHORT from a Private Endpoint connection, go to `Security` > `Private Endpoints` and expand the details of the corresponding connection. Click the trash bin icon and confirm detaching your $SERVICE_SHORT. 
- To edit or remove a connection, click the three dots next to the connection in the list and select `Edit` or `Disconnect`, respectively. Detach $SERVICE_SHORTs from the connection before deleting it. 
- To remove an authorization, click `Manage Authorizations` > trash bin icon. Disconnect all relevant connections before removing an authorization.


[console-azure-privatelink]: https://console.cloud.timescale.com/dashboard/azure-privatelink
[find-connection-details]: /integrations/:currentVersion:/find-connection-details/
[regions]: /about/:currentVersion:/supported-platforms/#available-regions
[azure-privatelink-authorization]: https://assets.timescale.com/docs/images/tiger-cloud-console/configure-private-link-authorization.png
[azure-privatelink-authorization-complete]: https://assets.timescale.com/docs/images/tiger-cloud-console/private-link-authorization-complete.png
[azure-private-endpoint-ip]: https://assets.timescale.com/docs/images/tiger-cloud-console/private-link-add-ip.png
[create-azure-endpoint]: https://assets.timescale.com/docs/images/tiger-cloud-console/create-private-endpoint-azure.png