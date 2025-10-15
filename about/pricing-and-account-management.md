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
import BillingForInactiveServices from "versionContent/_partials/_billing-for-inactive-services.mdx";

# Pricing plans and account management

As we enhance our offerings and align them with your evolving needs,
$PRICING_PLANs provide more value, flexibility, and efficiency for your business.
Whether you're a growing startup or a well-established enterprise, our plans
are structured to support your journey towards greater success. 

![Tiger pricing plans](https://assets.timescale.com/docs/images/tiger-cloud-console/tiger-pricing.svg)

This page explains pricing plans for $CLOUD_LONG, and how to easily manage your $ACCOUNT_LONG.

$PRICING_PLAN_CAPs give you:

* **Enhanced performance**: with increased CPU and storage capacities, your apps run smoother and more
  efficiently, even under heavy loads.
* **Improved scalability**: as your business grows, so do your demands. $PRICING_PLAN_CAPs scale with
  you, they provide the resources and support you need at each stage of your growth. Scale up or down 
  based on your current needs, ensuring that you only pay for what you use.
* **Better support**: access to enhanced support options, including production support and dedicated
  account management, ensures you have the help you need when you need it.
* **Greater flexibility**: we know that one size doesn't fit all. $PRICING_PLAN_CAPs give you the
  flexibility to choose the features and support levels that best match your business
  and engineering requirements. The ability to add features like $IO_BOOST and customize your $PRICING_PLAN means you can tailor $SERVICE_LONGs to fit your specific needs.
* **Cost efficiency**: by aligning our pricing with the value delivered, we ensure that you get the most
  out of every dollar spent. Our goal is to help you achieve more with less.

It’s that simple! You don't pay for automated backups or networking costs, such as data ingest or egress.
There are no per-query fees, nor additional costs to read or write data. It's all completely transparent, easily understood, and up to you.

Using $SELF_LONG and our open-source products is still free. 

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

## How your bill is calculated

You are billed at the end of each month in arrears. Your monthly invoice
includes an itemized cost accounting for each $SERVICE_LONG and any additional charges.

$CLOUD_LONG charges are based on consumption and your pricing plan:

- **Compute**: metered on an hourly basis. You can scale compute up and down at any time.
- **Storage**: metered based on your average GB consumption per hour. Storage grows and shrinks automatically
  with your data.

For example, over the last month your $SERVICE_LONG has been running compute for 500 hours total:

- 375 hours with 2 CPU
- 125 hours 4 CPU

and consumed high-performance storage for 720 hours total:

- 200 hours with 100 GB
- 520 hours with 150 GB

**Compute cost** = (`375` x `hourly price for 2 CPU`) + (`125` x `hourly price for 4 CPU`)

**High-performance storage cost** = (`200` x `100 GB` x `hourly price per GB`) + (`520` x `150 GB` x `hourly price per GB`)

<BillingForInactiveServices />

Some add-ons such as tiered storage, HA replicas, and connection pooling may incur
additional charges. These charges are clearly marked in your billing snapshot in $CONSOLE.
  
## Use $CLOUD_LONG for free

Are you just starting out with $CLOUD_LONG? On our Free pricing plan, you can create up to 2 zero-cost $SERVICE_SHORTs with [limited  resources][plan-features]. When a free $SERVICE_SHORT reaches the resource limit, it converts to the read-only state. 

Ready to try a more feature-rich paid plan? Request a 30-day free trial of our $PERFORMANCE or $SCALE plan with no credit card required. During your trial, if a $SERVICE_SHORT doesn’t receive any queries for 7 days, it is paused to conserve resources. Your data remains intact during the trial, and you can easily resume your $SERVICE_SHORT in $CONSOLE. After your trial ends, we may remove your data unless you’ve added a payment method.

After you have completed your 30-day trial period, choose the 
[$PRICING_PLAN][plan-features] that suits your business and engineering needs. And even when you upgrade from the Free pricing plan, you can still have up to 2 zero-cost $SERVICE_SHORTs—or convert the ones you already have into standard ones, to have more resources. 

If you want to try out features in a higher $PRICING_PLAN before upgrading, once you become a paying user, we can enable some features in the higher plan so you can run your tests. 

## Upgrade or downgrade your pricing plans at any time

You can upgrade or downgrade between the Free, $PERFORMANCE, and $SCALE plans 
whenever you want using [$CONSOLE][cloud-login]. To downgrade to the Free plan, you must only have free services running in your project. 

If you switch your $PRICING_PLAN mid-month, 
your prices are prorated to when you switch. Your $SERVICE_SHORTs are not interrupted when you switch, so 
you can keep working without any hassle. To move to $ENTERPRISE, [get in touch with $COMPANY][contact-company].

## Monitor usage and costs

You keep track of your monthly usage in [$CONSOLE][cloud-billing]. $CONSOLE_SHORT shows your 
resource usage and dashboards with performance insights. This allows you to closely monitor your 
$SERVICE_SHORTs’ performance, and any need to scale your $SERVICE_SHORTs or upgrade your $PRICING_PLAN.

$CONSOLE_SHORT also shows your month-to-date accrued charges, as well as a forecast of your expected 
month-end bill. Your previous invoices are also available as PDFs for download.

<BillingForInactiveServices />

## $COMPANY support 

$COMPANY runs a global support organization with Customer Satisfaction (CSAT) scores above 99%.
Support covers all timezones, and is fully staffed at weekend hours. 

All paid $PRICING_PLANs have free Developer Support through email with a target response time of 1 business 
day; we are often faster. If you need 24x7 responsiveness, talk to us about 
[Production Support][production-support].

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

* **Free**: for small non-production projects. 
* **$PERFORMANCE**: for cost-focused, smaller projects. No credit card required to start.
* **$SCALE**: for developers handling critical and demanding apps.
* **$ENTERPRISE**: for enterprises with mission-critical apps.

The features included in each [$PRICING_PLAN][pricing-plans] are:

| Feature                                                       | Free                | $PERFORMANCE                           | $SCALE                                         | $ENTERPRISE                                      |
|---------------------------------------------------------------|---------------------|----------------------------------------|------------------------------------------------|--------------------------------------------------|
| **Compute and storage**                                       |                     |                                        |                                                |                                                  |
| Number of $SERVICE_SHORTs	                                    | Up to 2 free services | Up to 2 free and 4 standard services 	 | Up to 2 free and and unlimited standard services	  | Up to 2 free and and unlimited standard services |
| CPU limit per $SERVICE_SHORT                                  | Shared           | 	Up to 8 CPU	                          | Up to 32 CPU	                                  | Up to 64 CPU                                     |
| Memory limit per $SERVICE_SHORT                               | Shared                | 	Up to 32 GB                           | 	Up to 128 GB                                  | 	Up to 256 GB                                    |
| Storage limit per $SERVICE_SHORT	                             | 750 MB              | Up to 16 TB	                           | Up to 16 TB	                                   | Up to 64 TB                                      |
| Bottomless storage on S3	                                     |                     |                                        | 	Unlimited	                                    | Unlimited                                        |
| Independently scale compute and storage	                      |                     | Standard services only                 | 	Standard services only	                           | Standard services only                           |
| **Data services and workloads**                               |                     |                                        |                                                |
| Relational                                                    | ✓                   | ✓                                      | ✓                                              | ✓                                                |
| Time-series                                                   | ✓                   | ✓                                      | ✓                                              | ✓                                                |
| Vector search                                                 | ✓                   | ✓                                      | ✓                                              | ✓                                                |
| AI workflows (coming soon)                                    | ✓                   | ✓                                      | ✓                                              | ✓                                                |
| Cloud SQL editor                                              |  3 seats             | 3 seats                                | 10 seats                                       | 20 seats                                         |
| Charts                                                        | ✓                   | ✓                                      | ✓                                              | ✓                                                |
| Dashboards                                                    |                     | 2                                      | Unlimited                                      | Unlimited                                        |
| **Storage and performance**                                   |                     |                                        |                                                |                                                  |
| IOPS                                                          | Up to 2,000	        | 	3,000 - 5,000	                        | 5,000 - 8,000                                  | 5,000 - 8,000                                    |
| Bandwidth (autoscales)	                                       | Up to 100 Mbps      | 125 - 250 Mbps                         | 	250 - 500 Mbps                                | 	Up to 500 mbps                                  |
| I/O boost	                                                    |                     |                                        | 	Add-on: <br/>Up to 16K IOPS, 1000 Mbps BW	    | Add-on: <br/>Up to 32K IOPS, 4000 Mbps BW        |
| **Availability and monitoring**                               |                     |                                        |                                                |                                                  |
| High-availability replicas <br/>(Automated multi-AZ failover) |                     | ✓                                      | ✓                                              | ✓                                                |
| Read replicas		                                               |                     |                                        | ✓                                              | ✓                                                |
| Cross-region backup                                           |                     |                                        |                                                | ✓                                                |
| Backup reports                                                |                     |                                        | 14 days                                        | 14 days                                          |
| Point-in-time recovery and forking                            | 	1 day              | 	3 days                                | 14 days                                        | 14 days                                          |
| Performance insights                                          | Limited             | ✓                                      | ✓                                              | ✓                                                |
| Metrics and log exporters	                                    |                     |                                        | ✓                                              | ✓                                                |
| **Security and compliance**                                   |                     |                                        |                                                |                                                  |
| Role-based access                                             | ✓                   | ✓                                      | ✓                                              | ✓                                                |
| End-to-end encryption                                         | ✓                   | ✓                                      | ✓                                              | ✓                                                |
| Private Networking (VPC)                                      |                     | 1 multi-attach VPC	                    | Unlimited multi-attach VPCs                    | 	Unlimited multi-attach VPCs                     |
| AWS Transit Gateway                                           |                     |                                        | ✓                                              | ✓                                                |
| [HIPAA compliance][hipaa-compliance]                          |                     |                                        |                                                | ✓                                                |
| IP address allow list                                         |  1 list with up to 10 IP addresses                   | 1 list with up to 10 IP addresses      | Up to 10 lists with up to 10 IP addresses each | Up to 10 lists with up to 100 IP addresses each  |
| Multi-factor authentication                                   | ✓                   | ✓                                      | ✓                                              | ✓                                                |
| Federated authentication (SAML)			                            |                     |                                        |                                                | ✓                                                |
| SOC 2 Type 2 report		                                         |                     |                                        | ✓                                              | ✓                                                |
| Penetration testing report                                    |                     |                                        |                                                | ✓                                                |
| Security questionnaire and review                             |                     |                                        |                                                | ✓                                                |
| Pay by invoice                                                |                     | 	Available at minimum spend	           | Available at minimum spend                     | ✓                                                |
| [Uptime SLAs][commercial-sla]                                 | 	                   | 	Standard                              | 	Standard                                      | 	Enterprise                                      |
| **Support and technical services**                            |                     |                                        |                                                |                                                  |
| Community support                                             | ✓                   | ✓                                      | ✓                                              | ✓                                                |
| Email support                                                 |                     | ✓                                      | ✓                                              | ✓                                                |
| Production support                                            | 	                   | 	Add-on                                | 	Add-on                                        | ✓                                                |
| Named account manager                                         |                     |                                        |                                                | ✓                                                |
| JOIN services (Jumpstart Onboarding and INtegration)          |                     |                                        | Available at minimum spend                     | ✓                                                |

For a personalized quote, [get in touch with $COMPANY][contact-company].

## Manage your $CLOUD_LONG $PRICING_PLAN

You handle all details about your $CLOUD_LONG project including updates to your $PRICING_PLAN, 
payment methods, and add-ons in the [billing section in $CONSOLE][cloud-billing]:

<img class="main-content__illustration"
src="https://assets.timescale.com/docs/images/tiger-cloud-console/tiger-console-billing.png"
alt="Adding a payment method in Tiger"/>

- **Details**: an overview of your $PRICING_PLAN, usage, and payment details. You can add up 
  to three credit cards to your `Wallet`. If you prefer to pay by invoice, 
  [contact $COMPANY][contact-company] and ask to change to corporate billing.

- **History**: the list of your downloadable $CLOUD_LONG invoices.
- **Emails**: the addresses $COMPANY uses to communicate with you. Payment 
  confirmations and alerts are sent to the email address you signed up with.
  Add another address to send details to other departments in your organization. 

- **$PRICING_PLAN_CAP**: choose the $PRICING_PLAN supplying the [features][plan-features] that suit your business and
  engineering needs.

- **Add-ons**: add `Production support` and improved database performance for mission-critical workloads.  

## AWS Marketplace pricing

When you get $CLOUD_LONG at AWS Marketplace, the following pricing options are available:

- **Pay-as-you-go**: your consumption is calculated at the end of the month and included in your AWS invoice. No upfront costs, standard $CLOUD_LONG rates apply. 
- **Annual commit**: your consumption is calculated at the end of the month ensuring predictable pricing and seamless billing through your AWS account. We confirm the contract terms with you before finalizing the commitment.

[cloud-login]: https://console.cloud.timescale.com/
[data-tiering]: /use-timescale/:currentVersion:/data-tiering/
[cloud-billing]: https://console.cloud.timescale.com/dashboard/billing/details
[commercial-sla]: https://www.timescale.com/legal/timescale-cloud-terms-of-service
[pricing-plans]: https://www.timescale.com/pricing
[plan-features]: /about/:currentVersion:/pricing-and-account-management/#features-included-in-each-pricing-plan
[production-support]: https://www.timescale.com/support
[hipaa-compliance]: https://www.hhs.gov/hipaa/for-professionals/index.html
[aws-pricing]: /about/:currentVersion:/pricing-and-account-management/#aws-marketplace-pricing
[contact-company]: https://www.tigerdata.com/contact/
[change-compute]: /use-timescale/:currentVersion:/services/change-resources/
[read-replication]: /use-timescale/:currentVersion:/ha-replicas/read-scaling/