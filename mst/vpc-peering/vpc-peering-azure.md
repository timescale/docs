---
title: Set up Virtual Private Cloud (VPC) peering on Azure
excerpt: Secure your Managed Service for TimescaleDB instance with VPC peering on Azure
products: [mst]
keywords: [vpc, peer, azure]
---

# Configure VPC peering on Azure

You can Configure VPC peering for your Managed Service for TimescaleDB project,
using the VPC on Azure.

## Before you begin

*   Installed [Aiven Client][aiven-client-install].
*   Signed in to your [Managed Service for TimescaleDB dashboard][mst-login].
*   Set up a VPC peering for your project in MST.

## Configuring a VPC peering on Azure

<Procedure>

1.  Log in with an Azure admin account, using the Azure CLI:

    ```bash
    az account clear
    az login
    ```

    This should open a window in your browser prompting you to choose an Azure
    account to log in with. You need an account with at least the Application
    administrator role to create VPC peering. If you manage multiple Azure
    subscriptions, configure the Azure CLI to default to the correct
    subscription using the command:

    ```bash
    az account set --subscription <subscription name or id>
    ```

1.  Create application object in your AD tenant, using the Azure CLI:

    ```bash
    az ad app create --display-name "<NAME>" --available-to-other-tenants --key-type Password
    ```

    This creates an entity to your AD that can be used to log into multiple AD
    tenants (--available-to-other-tenants ), but only the home tenant or the
    tenant the app was created in has the credentials to authenticate the app.
    Save the `appId`  field from the output - this is referred to as
    `$user_app_id`.

1.  Create a service principal for your app object. Ensure that the service
    principal is created to the Azure subscription containing the VNet you wish to peer:

    ```bash
    az ad sp create --id $user_app_id
    ```

    This creates a service principal to your subscription that may have
    permissions to peer your VNet. Save the `objectId` field from the output - this
    is referred to as `$user_sp_id`.

1.  Set a password for your app object:

     ```bash
        az ad app credential reset --id $user_app_id
    ```

    Save the password  field from the output - this is referred to as `$user_app_secret`.

1.  Find the id properties of your virtual network:

    ```bash
    az network vnet list
    ```

    Make a note of these:
    *   The id field, which is referred to as `$user_vnet_id`
    *   The Azure Subscription ID, which is the part after `/subscriptions/` in the
        `resource ID`. This is referred to as `$user_subscription_id`.
    *   The resource group name  or the `resourceGroup` field in the output.
        This is referred to as `$user_resource_group`.
    *   The Vnet name or the name  field from the output as `$user_vnet_name`
        The `$user_vnet_id` should have the format:
        `/subscriptions/$user_subscription_id/resourceGroups/$user_resource_group/providers/Microsoft.Network/virtualNetworks/$user_vnet_name`.

1.  Grant your service principal permissions to peer. The service principal that
    you created needs to be assigned a role that has permission for the
    `Microsoft.Network/virtualNetworks/virtualNetworkPeerings/write` action on
    the scope of your VNet. To limit the permissions granted to the app object
    and service principal, you can create a custom role with just that
    permission. The built-in `Network Contributor` role includes that
    permission, and can be found using `az role definition list --name "Network
    Contributor"` The id  field from the output is used as
    `$network_contributor_role_id` to assign the service principal that role:

    ```bash
    az role assignment create --role $network_contributor_role_id --assignee-object-id $user_sp_id --scope $user_vnet_id
    ```

    This allows the application object to manage the network in the `--scope`.
    Because you control the application object, it may also be given permission
    for the scope of an entire resource group, or the whole subscription to
    allow create other peerings later without assigning the role again for each
    VNet separately.

1.  Create a service principal for the Managed Service for TimescaleDB
    application object

    The Managed Service for TimescaleDB AD tenant contains an application object
    similar to the one you created and Timescale platform uses to
    create a peering from the Project VPC VNet in the Timescale subscription to the
    VNet in your Azure subscription. For this the Timescale app object needs a
    service principal in your subscription:

    ```bash
    az ad sp create --id <ID_OF_THE_TIMESCALE_APPLICATION_OBJECT>
    ```

    Save the `objectId` field from the output - it is referred to as `$aiven_sp_id`.

    If this fails with the error "When using this permission, the backing
    application of the service principal being created must in the local tenant"
    then your account does not have the correct permissions. Use an account
    with at least the Application administrator role assigned.

1.  Create a custom role for the Managed Service for TimescaleDB application object

    The Timescale application now has a service principal that can be given
    permissions. In order to target a network in your subscription with a peering
    and nothing else, you can create a this a custom role definition, with only a
    single action allowing to do that and only that:

    ```bash
    az role definition create --role-definition '{"Name": "<name of your choosing>",
    "Description": "Allows creating a peering to vnets in scope (but not from)",
    "Actions": ["Microsoft.Network/virtualNetworks/peer/action"],
    "AssignableScopes": ["/subscriptions/'$user_subscription_id'"]}'
    ```

    Creating a custom role must include your subscription's id in
    `AssignableScopes` . This in itself does not give permissions to your
    subscription - it merely restricts which scopes a role assignment can
    include. Save the id  field from the output - this is referred to as
    `$aiven_role_id`.

1.  Assign the custom role to the Timescale service principal to peer with your
    VNet, assign the role that you created in the previous step to the Timescale
    service principal with the scope of your VNet:

    ```bash
    az role assignment create --role $aiven_role_id --assignee-object-id $aiven_sp_id --scope $user_vnet_id
    ```

1.  Get your Azure Active Directory (AD) tenant id:

   ```bash
   az account list
   ```

   Make note of the `tenantId` field from the output. It is referred to as `$user_tenant_id`.

1.  Create a peering connection from the Timescale Project VPC using Aiven CLI:

    ```bash
    avn vpc peering-connection create --project-vpc-id $aiven_project_vpc_id --peer-cloud-account $user_subscription_id --peer-resource-group $user_resource_group --peer-vpc $user_vnet_name --peer-azure-app-id $user_app_id --peer-azure-tenant-id $user_tenant_id
    ```

    `$aiven_project_vpc_id` is the ID of the TimescaleProject VPC, and can be
    found using the `avn vpc list` command.

    The Timescale platform creates a peering from the VNet in the Timescale
    Project VPC to the VNet in your subscription. In addition, it creates a
    service principal for the application object in your tenant
    `--peer-azure-app-id $user_app_id`, giving it permission to target the
    Timescale subscription VNet with a peering. Your AD tenant ID is also needed
    in order for the Timescale application object to authenticate with your
    tenant to give it access to the service principal that you created
    `--peer-azure-tenant-id $user_tenant_id`.

    Ensure that the arguments starting with `$user_` are in lower case. Azure
    resource names are case-agnostic, but the Aiven API currently only accepts
    names in lower case. If no error is shown, the peering connection is being set
    up by the Timescale platform.

1.  Run the following command until the state is no longer `APPROVED` , but
    `PENDING_PEER`:

    ```bash
    avn vpc peering-connection get -v --project-vpc-id $aiven_project_vpc_id --peer-cloud-account $user_subscription_id --peer-resource-group $user_resource_group --peer-vpc $user_vnet_name
    ```

    A state such as `INVALID_SPECIFICATION`  or `REJECTED_BY_PEER`  may be shown
    if the VNet specified did not exist, or the Timescale app object wasn't
    given permissions to peer with it. If that occurs, check your configuration
    and then recreate the peering connection. If everything went as expected,
    the state changes to `PENDING_PEER`  within a couple of minutes showing
    details to set up the peering connection from your VNet to the Project VPC's
    VNet in the Timescale subscription.

    Save the `to-tenant-id` field in the output. It is referred to as the
    `aiven_tenant_id`. The `to-network-id`  field from the output is referred to
    as the `$aiven_vnet_id`.

1.  Log out the Azure user you logged in using:

    ```bash
    az account clear
    ```

1.  Log in the application object you created to your AD tenant using:

    ```bash
    az login --service-principal -u $user_app_id -p $user_app_secret --tenant $user_tenant_id
    ```

1.  Log in the same application object to the Timescale AD tenant:

    ```bash
    az login --service-principal -u $user_app_id -p $user_app_secret --tenant
    $aiven_tenant_id
    ```

    Now your application object has a session with both AD tenants

1.  Create a peering from your VNet to the VNet in the Timescale subscription:

    ```bash
    az network vnet peering create --name <peering name of your choosing> --remote-vnet $aiven_vnet_id --vnet-name $user_vnet_name --resource-group $user_resource_group --subscription $user_subscription_id --allow-vnet-access
    ```

    If you do not specify `--allow-vnet-access` no traffic is allowed to flow
    from the peered VNet and Timescale services cannot be reached through the
    peering. After the peering has been created, the peering should be in the state
    connected.

    In case you get the following error, it's possible the role assignment hasn't taken
    effect yet. If that is the case, try logging in again and creating the
    peering again after waiting a bit by repeating the commands in this step. If
    the error message persists, check the role assignment was correct.

    The client `<random uuid>` with object id `<another random uuid>` does not have
    authorization to perform action
    `Microsoft.Network/virtualNetworks/virtualNetworkPeerings/write` over scope
    '$user_vnet_id' If access was recently granted, refresh your credentials.

1.  In the Aiven CLI, check if the peering connection is `ACTIVE`:

    ```bash
    avn vpc peering-connection get -v --project-vpc-id $aiven_project_vpc_id --peer-cl
    ```

    The Timescale platform polls peering connections in state `PENDING_PEER`
    regularly to see if the your subscription has created a peering connection to
    the Timescale Project VPC's VNet. After this is detected, the state changes from
    `PENDING_PEER`  to `ACTIVE`. After this services in the Project VPC can be
    reached through the peering.

</Procedure>

[aiven-client-install]: /mst/:currentVersion:/aiven-client/aiven-client-install/
[create-service]: /mst/:currentVersion:/installation-mst/#create-your-first-service
[mst-login]: https://portal.managed.timescale.com
