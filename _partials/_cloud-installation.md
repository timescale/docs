import CreateAccountConsole from "versionContent/_partials/_create-account-console.mdx";

You create a $ACCOUNT_LONG to manage your $SERVICE_SHORTs and data in a centralized and efficient manner in $CONSOLE. From there, you can create and delete $SERVICE_SHORTs, run queries, manage access and billing, integrate other services, contact support, and more.

<Tabs label="Create a Tiger Cloud account" persistKey="source-cloud">

<Tab title="Tiger Cloud" label="tiger-cloud">

You create a standalone account to manage $CLOUD_LONG as a separate unit in your infrastructure, which includes separate billing and invoicing.

<CreateAccountConsole />

</Tab>

<Tab title="AWS Marketplace" label="aws">

To have $CLOUD_LONG as a part of your AWS infrastructure, you create or link your $ACCOUNT_LONG through AWS Marketplace. In this 
case, $CLOUD_LONG is a line item in your AWS invoice.

<Procedure>

To set up $CLOUD_LONG via AWS:

1. **Open [AWS Marketplace][aws-marketplace] and search for `Tiger Cloud`** 

   You see two pricing options, [pay-as-you-go][aws-paygo] and [annual commit][aws-annual-commit]. 

1. **Select the pricing option that suits you and click `View purchase options`**

1. **Review and configure the purchase details, then click `Subscribe`**

1. **Click `Set up your account` at the top of the page**

   You are redirected to $CONSOLE.

1. **Sign up for a $500 credit, 30-day free trial**

   Add your details, then click `Start your free trial`. If you want to link an existing $ACCOUNT_LONG to AWS, log in with your existing credentials.  

1. **Select the [pricing plan][pricing-plans]**

   You are now logged into $CONSOLE_LONG. You can change the pricing plan later to better accommodate your growing needs on the [`Billing` page][console-billing].

1. **In `Confirm AWS Marketplace connection`, click `Connect`**

    Your $CLOUD_LONG and AWS accounts are now connected.

</Procedure>

</Tab>

</Tabs>

[aws-annual-commit]: https://aws.amazon.com/marketplace/pp/prodview-ezxwlmjyr6x4u?applicationId=AWSMPContessa&ref_=beagle&sr=0-2
[aws-marketplace]: https://aws.amazon.com/marketplace
[aws-paygo]: https://aws.amazon.com/marketplace/pp/prodview-iestawpo5ihca?applicationId=AWSMPContessa&ref_=beagle&sr=0-1
[console-billing]: https://console.cloud.timescale.com/dashboard/billing/plans
[pricing-plans]: /about/:currentVersion:/pricing-and-account-management/
