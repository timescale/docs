import CreateAccountConsole from "versionContent/_partials/_create-account-console.mdx";

You create a $ACCOUNT_LONG to manage your $SERVICE_SHORTs and data in a centralized and efficient manner in $CONSOLE. From there, you can create and delete $SERVICE_SHORTs, run queries, manage access and billing, integrate other services, contact support, and more.

<Tabs label="Create a Tiger Cloud account" persistKey="source-cloud">

<Tab title="Tiger Cloud" label="tiger-cloud">

You create a standalone account to manage $CLOUD_LONG as a separate unit in your infrastructure, which includes separate billing and invoicing.

<CreateAccountConsole />

</Tab>

<Tab title="Azure Marketplace" label="azure">

To have $CLOUD_LONG as a part of your Azure infrastructure, you create or link your $ACCOUNT_LONG through Azure Marketplace. In this
case, $CLOUD_LONG is a line item in your Azure invoice.

<Procedure>

To set up $CLOUD_LONG via Azure:

1. **Open [Azure Marketplace][azure-marketplace] and search for `Tiger Data`**

   You see two pricing options, [pay-as-you-go][azure-paygo] and [annual commit][azure-annual-commit]. Select and click the right pricing option.

1. **Review product details**

   Review the details for the pricing option you have selected, then click `Subscribe`.

1. **Configure project and SaaS details**

   Select the Azure subscription and resource group, provide a name for your subscription to $CLOUD_LONG, configure auto-renew settings, then click `Review & subscribe`.

1. **Review the legal terms** 

   Review the Terms of use, Privacy policy, and your subscription basics, then click `Subscribe`. Your SaaS resource is being created. 

1. **Click `Configure account`**

   You are redirected to $CONSOLE_LONG. 

1. **Sign up for a 30-day free trial**

   Add your details, then click `Start your free trial`. If you want to link an existing $ACCOUNT_LONG to Azure, log in with your existing credentials.

1. **Select the [pricing plan][pricing-plans]**

   You are now logged into $CONSOLE_LONG. You can change the pricing plan later to better accommodate your growing needs on the [`Billing` page][console-billing].

1. **In `Confirm Azure Marketplace connection`, click `Connect`**

   Your $CLOUD_LONG and Azure accounts are now connected.

</Procedure>

</Tab>

</Tabs>

[azure-annual-commit]: https://portal.azure.com/#view/Microsoft_Azure_Marketplace/GalleryItemDetailsBladeNopdl/id/timescale1759504210261.tigerdata-annualcommit
[azure-marketplace]: https://portal.azure.com/#view/Microsoft_Azure_Marketplace/MarketplaceOffersBlade/selectedMenuItemId/home
[azure-paygo]: https://portal.azure.com/#view/Microsoft_Azure_Marketplace/GalleryItemDetailsBladeNopdl/id/timescale1759504210261.tigerdata-payg
[console-billing]: https://console.cloud.tigerdata.com/dashboard/billing/plans
[pricing-plans]: /about/:currentVersion:/pricing-and-account-management/
