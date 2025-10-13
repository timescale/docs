---
title: Billing and account management
excerpt: Manage billing and account information for your TigerData account
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

# Pricing plans and account management

<Tabs label="Tiger Cloud on AWS and Azure" persistKey="tiger-platform-clouds">

<Tab title="Tiger Cloud on AWS" label="aws-cloud">

<PricingPlansIntro />

If you create a $ACCOUNT_LONG from AWS Marketplace, the pricing options are pay-as-you-go and annual commit. See [AWS pricing][aws-pricing] for details.

## Disaggregated, consumption-based compute and storage

With $CLOUD_LONG, you are not limited to pre-set compute and storage. Get as much as you need when
provisioning your $SERVICE_SHORTs or later, as your needs grow.

* **Compute**: pay only for the compute resources you run. Compute is metered on an hourly
  basis, and you can [scale it up to 64,000 IOPS][change-compute] at any time. You can also [scale out using replicas][read-replication]
  as your application grows. We also provide services to help you lower your compute needs
  while improving query performance. $CLOUD_LONG is very efficient and generally needs less compute than other databases to deliver
  the same performance. The best way to size your needs is to sign up for a free trial and test
  with a realistic workload.

* **Storage**: pay only for the storage you consume. You have high-performance storage for more-accessed data, and
  [low-cost bottomless storage in S3][data-tiering] for other data. The high-performance storage offers you up to 64 TB of compressed
  (typically 80-100 TB uncompressed) data and is metered on your average GB consumption per hour. We can help you compress your data by up to 98% so you pay even less. <TieredStorageBilling />
  For easy upgrades, each $SERVICE_SHORT stores the $TIMESCALE_DB binaries. This contributes up to 900 MB to overall storage, which amounts to less than $.80/month in additional storage costs.

<CloudFreeTrial />

<UpgradeMonitor />

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

The available $PRICING_PLANs are:

* **$PERFORMANCE**: for cost-focused, smaller projects. No credit card required to start.
* **$SCALE**: for developers handling critical and demanding apps.
* **$ENTERPRISE**: for enterprises with mission-critical apps.

The features included in each [$PRICING_PLAN][pricing-plans] are:

| Feature                                                       | $PERFORMANCE                      | $SCALE                                         | $ENTERPRISE                                     |
|---------------------------------------------------------------|-----------------------------------|------------------------------------------------|-------------------------------------------------|
| **Compute and storage**                                       |                                   |                                                |                                                 |
| Number of $SERVICE_SHORTs	                                    | Up to 4	                          | Unlimited	                                     | Unlimited                                       |
| CPU limit per $SERVICE_SHORT                                  | 	Up to 8 CPU	                     | Up to 32 CPU	                                  | Up to 64 CPU                                    | 
| Memory limit per $SERVICE_SHORT                               | 	Up to 32 GB                      | 	Up to 128 GB                                  | 	Up to 256 GB                                   | 
| Storage limit per $SERVICE_SHORT	                             | Up to 16 TB	                      | Up to 16 TB	                                   | Up to 64 TB                                     |
| Bottomless storage on S3	                                     |                                   | 	Unlimited	                                    | Unlimited                                       |
| Independently scale compute and storage	                      | ✓                                 | 	✓	                                            | ✓                                               |
| **Data services and workloads**                               |                                   |                                                |
| Relational                                                    | ✓                                 | ✓                                              | ✓                                               | 
| Time-series                                                   | ✓                                 | ✓                                              | ✓                                               |
| Vector search                                                 | ✓                                 | ✓                                              | ✓                                               |
| AI workflows (coming soon)                                    | ✓                                 | ✓                                              | ✓                                               |
| Cloud SQL editor                                              | 3 seats                           | 10 seats                                       | 20 seats                                        |
| Charts                                                        | ✓                                 | ✓                                              | ✓                                               |
| Dashboards                                                    | 2                                 | Unlimited                                      | Unlimited                                       |
| **Storage and performance**                                   |                                   |                                                |                                                 |
| IOPS                                                          | 	3,000 - 5,000	                   | 5,000 - 8,000                                  | 5,000 - 8,000                                   | 
| Bandwidth (autoscales)	                                       | 125 - 250 Mbps                    | 	250 - 500 Mbps                                | 	Up to 500 mbps                                 | 
| I/O boost	                                                    |                                   | 	Add-on: <br/>Up to 16K IOPS, 1000 Mbps BW	    | Add-on: <br/>Up to 32K IOPS, 4000 Mbps BW       | 
| **Availability and monitoring**                               |                                   |                                                |                                                 |
| High-availability replicas <br/>(Automated multi-AZ failover) | ✓                                 | ✓                                              | ✓                                               |
| Read replicas		                                               |                                   | ✓                                              | ✓                                               |
| Cross-region backup                                           |                                   |                                                |  ✓                                               |
| Backup reports                                                |                                   | 14 days                                        | 14 days                                          |
| Point-in-time recovery and forking                            | 	3 days                           | 14 days                                        | 14 days                                         |
| Performance insights                                          | ✓                                 | ✓                                              | ✓                                               |
| Metrics and log exporters	                                    |                                   | ✓                                              | ✓                                               |
| **Security and compliance**                                   |                                   |                                                |                                                 |
| Role-based access                                             | ✓                                 | ✓                                              | ✓                                               |
| End-to-end encryption                                         | ✓                                 | ✓                                              | ✓                                               |
| Private Networking (VPC)                                      | 1 multi-attach VPC	               | Unlimited multi-attach VPCs                    | 	Unlimited multi-attach VPCs                    | 
| AWS Transit Gateway                                           |                                   | ✓                                              | ✓                                               |
| [HIPAA compliance][hipaa-compliance]                          |                                   |                                                | ✓                                               |
| IP address allow list                                         | 1 list with up to 10 IP addresses | Up to 10 lists with up to 10 IP addresses each | Up to 10 lists with up to 100 IP addresses each |
| Multi-factor authentication                                   | ✓                                 | ✓                                              | ✓                                               |
| Federated authentication (SAML)			                            |                                   |                                                | ✓                                               |
| SOC 2 Type 2 report		                                         |                                   | ✓                                              | ✓                                               |
| Penetration testing report                                    |                                   |                                                | ✓                                               |			
| Security questionnaire and review                             |                                   |                                                | ✓                                               |			
| Pay by invoice                                                | 	Available at minimum spend	      | Available at minimum spend                     | ✓                                               |
| [Uptime SLAs][commercial-sla]                                 | 	Standard                         | 	Standard                                      | 	Enterprise                                     |
| **Support and technical services**                            |                                   |                                                |                                                 |
| Community support                                             | ✓                                 | ✓                                              | ✓                                               |
| Email support                                                 | ✓                                 | ✓                                              | ✓                                               |
| Production support                                            | 	Add-on                           | 	Add-on                                        | ✓                                               |
| Named account manager                                         |                                   |                                                | ✓                                               |
| JOIN services (Jumpstart Onboarding and INtegration)          |                                   | Available at minimum spend                     | ✓                                               |

For a personalized quote, [get in touch with $COMPANY][contact-company].

<BillingExample />

<ManagePricing />

## AWS Marketplace pricing

When you get $CLOUD_LONG at AWS Marketplace, the following pricing options are available:

- **Pay-as-you-go**: your consumption is calculated at the end of the month and included in your AWS invoice. No upfront costs, standard $CLOUD_LONG rates apply. 
- **Annual commit**: your consumption is calculated at the end of the month ensuring predictable pricing and seamless billing through your AWS account. We confirm the contract terms with you before finalizing the commitment.

</Tab>

<Tab title="Tiger Cloud on Azure" label="azure-cloud">

<PricingPlansIntro />

This page explains pricing plans for $CLOUD_LONG, and how to easily manage your $ACCOUNT_LONG.

## Disaggregated, consumption-based compute and storage

With $CLOUD_LONG, you are not limited to pre-set compute and storage. Get as much as you need when
provisioning your $SERVICE_SHORTs or later, as your needs grow.

* **Compute**: pay only for the compute resources you run. Compute is metered on an hourly
  basis, and you can [scale it up to 64,000 IOPS][change-compute] at any time. You can also [scale out using replicas][read-replication]
  as your application grows. We also provide services to help you lower your compute needs
  while improving query performance. $CLOUD_LONG is very efficient and generally needs less compute than other databases to deliver
  the same performance. The best way to size your needs is to sign up for a free trial and test
  with a realistic workload.

* **Storage**: pay only for the storage you consume. The high-performance storage offers you up to 64 TB of compressed
  (typically 80-100 TB uncompressed) data and is metered on your average GB consumption per hour. We can help you compress your data by up to 98% so you pay even less. 
  For easy upgrades, each $SERVICE_SHORT stores the $TIMESCALE_DB binaries. This contributes up to 900 MB to overall storage, which amounts to less than $.80/month in additional storage costs.

<CloudFreeTrial />

<UpgradeMonitor />

<SupportPlans />

## Charging for HA and read replicas

HA and $READ_REPLICAs are both charged at the same rate as your primary $SERVICE_SHORTs, based on the
compute and primary storage consumed by your replicas. 

## Charging over regions

Storage is priced the same across all regions. However, compute prices vary depending on the
region. This is because our cloud provider prices infrastructure differently based on region.

## Features included in each pricing plan

The available $PRICING_PLANs are:

* **$PERFORMANCE**: for cost-focused, smaller projects. No credit card required to start.
* **$SCALE**: for developers handling critical and demanding apps.
* **$ENTERPRISE**: for enterprises with mission-critical apps.

The features included in each [$PRICING_PLAN][pricing-plans] are:

| Feature                                                       | $PERFORMANCE                      | $SCALE                                         | $ENTERPRISE                                     |
|---------------------------------------------------------------|-----------------------------------|------------------------------------------------|-------------------------------------------------|
| **Compute and storage**                                       |                                   |                                                |                                                 |
| Number of $SERVICE_SHORTs	                                    | Up to 4	                          | Unlimited	                                     | Unlimited                                       |
| CPU limit per $SERVICE_SHORT                                  | 	Up to 8 CPU	                     | Up to 32 CPU	                                  | Up to 64 CPU                                    | 
| Memory limit per $SERVICE_SHORT                               | 	Up to 32 GB                      | 	Up to 128 GB                                  | 	Up to 256 GB                                   | 
| Storage limit per $SERVICE_SHORT	                             | Up to 16 TB	                      | Up to 16 TB	                                   | Up to 16 TB                                     | |
| Independently scale compute and storage	                      | ✓                                 | 	✓	                                            | ✓                                               |
| **Data services and workloads**                               |                                   |                                                |
| Relational                                                    | ✓                                 | ✓                                              | ✓                                               | 
| Time-series                                                   | ✓                                 | ✓                                              | ✓                                               |
| Vector search                                                 | ✓                                 | ✓                                              | ✓                                               |
| AI workflows (coming soon)                                    | ✓                                 | ✓                                              | ✓                                               |
| Cloud SQL editor                                              | 3 seats                           | 10 seats                                       | 20 seats                                        |
| Charts                                                        | ✓                                 | ✓                                              | ✓                                               |
| Dashboards                                                    | 2                                 | Unlimited                                      | Unlimited                                       |
| **Storage and performance**                                   |                                   |                                                |                                                 |
| IOPS                                                          | 	3,000 - 5,000	                   | 5,000 - 8,000                                  | 5,000 - 8,000                                   | 
| Bandwidth (autoscales)	                                       | 125 - 250 Mbps                    | 	250 - 500 Mbps                                | 	Up to 500 mbps                                 | 
| I/O boost	                                                    |                                   | 	Add-on: <br/>Up to 16K IOPS, 1000 Mbps BW	    | Add-on: <br/>Up to 16K IOPS, 1000 Mbps BW       | 
| **Availability and monitoring**                               |                                   |                                                |                                                 |
| High-availability replicas <br/>(Automated multi-AZ failover) | ✓                                 | ✓                                              | ✓                                               |
| Read replicas		                                               |                                   | ✓                                              | ✓                                               |
| Backup reports                                                |                                   | 14 days                                        | 14 days                                         |
| Point-in-time recovery and forking                            | 	3 days                           | 14 days                                        | 14 days                                         |
| Performance insights                                          | ✓                                 | ✓                                              | ✓                                               |
| Metrics and log exporters	                                    |                                   | ✓                                              | ✓                                               |
| **Security and compliance**                                   |                                   |                                                |                                                 |
| Role-based access                                             | ✓                                 | ✓                                              | ✓                                               |
| End-to-end encryption                                         | ✓                                 | ✓                                              | ✓                                               |
| [HIPAA compliance][hipaa-compliance]                          |                                   |                                                | ✓                                               |
| IP address allow list                                         | 1 list with up to 10 IP addresses | Up to 10 lists with up to 10 IP addresses each | Up to 10 lists with up to 100 IP addresses each |
| Multi-factor authentication                                   | ✓                                 | ✓                                              | ✓                                               |
| Federated authentication (SAML)			                            |                                   |                                                | ✓                                               |
| SOC 2 Type 2 report		                                         |                                   | ✓                                              | ✓                                               |
| Penetration testing report                                    |                                   |                                                | ✓                                               |			
| Security questionnaire and review                             |                                   |                                                | ✓                                               |			
| Pay by invoice                                                | 	Available at minimum spend	      | Available at minimum spend                     | ✓                                               |
| [Uptime SLAs][commercial-sla]                                 | 	Standard                         | 	Standard                                      | 	Enterprise                                     |
| **Support and technical services**                            |                                   |                                                |                                                 |
| Community support                                             | ✓                                 | ✓                                              | ✓                                               |
| Email support                                                 | ✓                                 | ✓                                              | ✓                                               |
| Production support                                            | 	Add-on                           | 	Add-on                                        | ✓                                               |
| Named account manager                                         |                                   |                                                | ✓                                               |
| JOIN services (Jumpstart Onboarding and INtegration)          |                                   | Available at minimum spend                     | ✓                                               |

For a personalized quote, [get in touch with $COMPANY][contact-company].

<BillingExample />

<ManagePricing />

</Tab>

</Tabs>

[cloud-login]: https://console.cloud.timescale.com/
[data-tiering]: /use-timescale/:currentVersion:/data-tiering/
[cloud-billing]: https://console.cloud.timescale.com/dashboard/billing/details
[commercial-sla]: https://www.timescale.com/legal/timescale-cloud-terms-of-service
[pricing-plans]: https://www.timescale.com/pricing
[plan-features]: /about/:currentVersion:/pricing-and-account-management/#features-included-in-each-plan
[production-support]: https://www.timescale.com/support
[hipaa-compliance]: https://www.hhs.gov/hipaa/for-professionals/index.html
[aws-pricing]: /about/:currentVersion:/pricing-and-account-management/#aws-marketplace-pricing
[contact-company]: https://www.tigerdata.com/contact/
[change-compute]: /use-timescale/:currentVersion:/services/change-resources/
[read-replication]: /use-timescale/:currentVersion:/ha-replicas/read-scaling/