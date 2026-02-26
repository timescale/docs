---
title: Billing and account management
excerpt: Manage billing and account information for your Tiger Data account for Tiger Cloud on AWS and Tiger Cloud on Azure
products: [cloud]
keywords: [billing, accounts, admin]
tags: [payment, billing, costs]
cloud_ui:
    path:
        - [billing]
---

import TieredStorageBilling from "versionContent/_partials/_tiered-storage-billing.mdx";
import EarlyAccessGeneral from "versionContent/_partials/_early_access.mdx";
import PricingPlansIntro from "versionContent/_partials/_pricing-plans-intro.mdx";
import CloudFreeTrial from "versionContent/_partials/_cloud-free-trial.mdx";
import UpgradeMonitor from "versionContent/_partials/_upgrade-plan-monitor-usage.mdx";
import SupportPlans from "versionContent/_partials/_support-plans.mdx";
import BillingExample from "versionContent/_partials/_billing-example.mdx";
import ManagePricing from "versionContent/_partials/_manage-pricing-plan.mdx";
import BillingForInactiveServices from "versionContent/_partials/_billing-for-inactive-services.mdx";
import FreeBeta from "versionContent/_partials/_free-plan-beta.mdx";
import DisaggregatedComputeStorage from "versionContent/_partials/_disaggregated-compute-storage.mdx";
import DisaggregatedComputeStorageAzure from "versionContent/_partials/_disaggregated-compute-storage-azure.mdx";
import AwsFeatures from "versionContent/_partials/_aws-features.mdx";
import AzureFeatures from "versionContent/_partials/_azure-features.mdx";

# Pricing plans and account management

<Tabs label="Tiger Cloud on AWS and Azure" persistKey="tiger-platform-clouds">

<Tab title="Tiger Cloud on AWS" label="aws-cloud">

<PricingPlansIntro />

If you create a $ACCOUNT_LONG from AWS Marketplace, the pricing options are pay-as-you-go and annual commit. See [AWS pricing][aws-pricing] for details.

## Disaggregated, consumption-based compute and storage

<DisaggregatedComputeStorage />

## How your bill is calculated

<BillingExample />

## Use $CLOUD_LONG for free

<CloudFreeTrial />

## Upgrade or downgrade your pricing plans at any time

<UpgradeMonitor />

## $CLOUD_LONG support

<SupportPlans />

## Charging for HA and read replicas

HA and $READ_REPLICAs are both charged at the same rate as your primary $SERVICE_SHORTs, based on the 
compute and primary storage consumed by your replicas. Data tiered to our bottomless storage 
tier is shared by all database replicas; replicas accessing tiered storage do not add to your 
bill.

## Charging over regions

Storage is priced the same across all regions. However, compute prices vary depending on the 
region. This is because our cloud provider (AWS) prices infrastructure differently based on region.

## Features included in each pricing plan

<AwsFeatures />

## Manage your $CLOUD_LONG $PRICING_PLAN

<ManagePricing />

## AWS Marketplace pricing

When you get $CLOUD_LONG at AWS Marketplace, the following pricing options are available:

- **Pay-as-you-go**: your consumption is calculated at the end of the month and included in your AWS invoice. No upfront costs, standard $CLOUD_LONG rates apply. 
- **Annual commit**: your consumption is calculated at the end of the month ensuring predictable pricing and seamless billing through your AWS account. We confirm the contract terms with you before finalizing the commitment.

</Tab>

<Tab title="Tiger Cloud on Azure" label="azure-cloud">

<PricingPlansIntro />

If you create a $ACCOUNT_LONG from Azure Marketplace, the pricing options are pay-as-you-go and annual commit. See [Azure pricing][azure-pricing] for details.

## Disaggregated, consumption-based compute and storage

<DisaggregatedComputeStorageAzure />

## How your bill is calculated

<BillingExample />

## Use $CLOUD_LONG for free

<CloudFreeTrial />

## Upgrade or downgrade your pricing plans at any time

<UpgradeMonitor />

## $CLOUD_LONG support

<SupportPlans />

## Charging for HA and read replicas

HA and $READ_REPLICAs are both charged at the same rate as your primary $SERVICE_SHORTs, based on the
compute and primary storage consumed by your replicas. Data tiered to our bottomless storage
tier is shared by all database replicas; replicas accessing tiered storage do not add to your
bill.

## Charging over regions

Storage is priced the same across all regions. However, compute prices vary depending on the
region. This is because our cloud provider prices infrastructure differently based on region.

## Features included in each pricing plan

<AzureFeatures />

## Manage your $CLOUD_LONG $PRICING_PLAN

<ManagePricing />

## Azure Marketplace pricing

When you get $CLOUD_LONG at Azure Marketplace, the following pricing options are available:

- **Pay-as-you-go**: your consumption is calculated at the end of the month and included in your Azure invoice. No upfront costs, standard $CLOUD_LONG rates apply.
- **Annual commit**: your consumption is calculated at the end of the month ensuring predictable pricing and seamless billing through your Azure account. We confirm the contract terms with you before finalizing the commitment.

Looking for a private offer? [Get in touch](mailto:$CONTACT_SALES) with our sales team.

</Tab>

</Tabs>

[aws-pricing]: /about/:currentVersion:/pricing-and-account-management/#aws-marketplace-pricing
[azure-pricing]: /about/:currentVersion:/pricing-and-account-management/#azure-marketplace-pricing
