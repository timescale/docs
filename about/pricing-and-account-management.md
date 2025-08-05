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

# Pricing plans and account management

As we enhance our offerings and align them with your evolving needs,
$PRICING_PLANs provide more value, flexibility, and efficiency for your business.
Whether you're a growing startup or a well-established enterprise, our plans
are structured to support your journey towards greater success.

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
  and engineering requirements. The ability to add features like $IO_BOOST, and customize your $PRICING_PLAN means you can tailor $SERVICE_LONGs to fit your specific needs.
* **Cost efficiency**: by aligning our pricing with the value delivered, we ensure that you get the most
  out of every dollar spent. Our goal is to help you achieve more with less.

Using $SELF_LONG and our open-source products is still free. 

If you create a $ACCOUNT_LONG from AWS Marketplace, the pricing options are pay-as-you-go and annual commit. See [AWS pricing][aws-pricing] for details. 

This page explains pricing plans for $CLOUD_LONG, and how to easily manage your $ACCOUNT_LONG.

## How pricing plans work

$PRICING_PLAN_CAPs are designed to give you the best value as your project moves 
from initial development through to mission-critical enterprise applications. 

* **Compute**: pay only for the compute resources you run. Compute is metered on an hourly 
   basis, and you can scale it up and down at any time. You can also scale out using replicas 
  as your application grows. We even provide services to help you lower your compute needs 
  while improving query performance.

* **Storage**: pay only for the storage you consume. Storage is metered on your average GB 
   consumption per hour; it grows and shrinks automatically with your data. You have 
   high-performance storage for more-accessed data, and [low-cost bottomless storage][data-tiering] 
   for other data. We can help you compress your data up to 10x or more so you pay even less.
   For easy upgrades, each $SERVICE_SHORT stores the $TIMESCALE_DB binaries. This contributes up to 900 
   megabytes to overall storage, which amounts to less than $.80/month in additional storage costs.

* **It’s that simple**: you don't pay for backups or networking costs, such as data ingest 
   or egress. There are no per-query fees, nor additional costs to read or write data. It's all completely 
   transparent, easily understood, and up to you.
  
### $CLOUD_LONG free trial for the different price plans

We offer new users a free, 30-day trial period of our $PERFORMANCE plan with no credit card required.  
During your trial, you can contact $CONTACT_SALES to request information about, and access
to, our $SCALE plan to determine how it fits your needs. During your trial, if a $SERVICE_SHORT doesn’t receive any queries for 7 days, it is paused to conserve resources. Your data remains intact during the trial, and you can easily resume your $SERVICE_SHORT in $CONSOLE. After your trial ends, we may remove your data unless you’ve added a payment method.

After you have completed your 30-day trial period on the $PERFORMANCE plan, choose the 
[$PRICING_PLAN][plan-features] that suits your business and engineering needs. 

After you become a paying user, we can enable some features in the higher $PRICING_PLANs so you can test them before upgrading. 

### Upgrade or downgrade your pricing plans at any time

You can easily upgrade or downgrade between the $PERFORMANCE and $SCALE plans 
whenever you want using [$CONSOLE][cloud-login]. If you switch your $PRICING_PLAN mid-month, 
your prices are prorated to when you switch. Your $SERVICE_SHORTs are not interrupted when you switch, so 
you can keep working without any hassle. To move to $ENTERPRISE, [get in touch with $COMPANY][contact-company].

### Monitor usage and costs

You keep track of your monthly usage in [$CONSOLE][cloud-billing]. $CONSOLE_SHORT shows your 
resource usage and dashboards with performance insights. This allows you to closely monitor your 
$SERVICE_SHORTs’ performance, and any need to scale your $SERVICE_SHORTs or upgrade your $PRICING_PLAN.

$CONSOLE_SHORT also shows your month-to-date accrued charges, as well as a forecast of your expected 
month-end bill. Your previous invoices are also available as PDFs for download.

### $COMPANY support 

$COMPANY runs a global support organization with Customer Satisfaction (CSAT) scores above 99%.
Support covers all timezones, and is fully staffed at weekend hours. 

All $PRICING_PLANs have free Developer Support through email with a target response time of 1 business 
day; we are often faster. If you need 24x7 responsiveness, talk to us about 
[Production Support][production-support].

### Don’t worry about storage or sizing

Unlike Amazon RDS or self-managed infrastructure where you pre-provision your disk and pay for
its allocation, $COMPANY charges by the actual storage used. As your data volume grows, you can upgrade to as much as 64TB and 32,000 IOPS. 

We make it easy for you to store unlimited amounts of data using tiered storage; a high-performance
storage tier and a low-cost bottomless storage tier. You can keep up to 64TB compressed (typically 80-100TB uncompressed) in the high-performance storage tier, and move less-frequently accessed data to our low-cost storage tier built on S3.

<TieredStorageBilling />

$CLOUD_LONG is very efficient and generally needs less compute than other databases to deliver
the same performance. The best way to size your needs is to sign up for a free trial and test
with a realistic workload.

### Charging for HA and read replicas

HA and $READ_REPLICAs are both charged at the same rate as your primary $SERVICE_SHORTs, based on the 
compute and primary storage consumed by your replicas. Data tiered to our bottomless storage 
tier is shared by all database replicas; replicas accessing tiered storage do not add to your 
bill.

### Charging over regions

Storage is priced the same across all regions. However, compute prices vary depending on the 
region. This is because our cloud provider (AWS) prices infrastructure differently based on region.

## Features included in each pricing plan

The available $PRICING_PLANs are:

* **$PERFORMANCE**: for cost-focused, smaller projects. No credit card required to start.
* **$SCALE**: for developers handling critical and demanding apps.
* **$ENTERPRISE**: for enterprises with mission-critical apps.

The features included in each [$PRICING_PLAN][pricing-plans] are:

| Feature                                                       | $PERFORMANCE                      | $SCALE                                         | $ENTERPRISE                                    |
|---------------------------------------------------------------|-----------------------------------|------------------------------------------------|------------------------------------------------|
| **Compute and storage**                                       |                                   |                                                |                                                |
| Number of $SERVICE_SHORTs	                                    | Up to 4	                          | Unlimited	                                     | Unlimited                                      |
| CPU limit per $SERVICE_SHORT                                  | 	Up to 8 CPU	                     | Up to 32 CPU	                                  | Up to 32 CPU                                   | 
| Memory limit per $SERVICE_SHORT                               | 	Up to 32 GB                      | 	Up to 128 GB                                  | 	Up to 128 GB                                  | 
| Storage limit per $SERVICE_SHORT	                             | Up to 16 TB	                      | Up to 16 TB	                                   | Up to 64 TB                                    |
| Bottomless storage on S3	                                     |                                   | 	Unlimited	                                    | Unlimited                                      |
| Independently scale compute and storage	                      | ✓                                 | 	✓	                                            | ✓                                              |
| **Data services and workloads**                               |                                   |                                                |
| Relational                                                    | ✓                                 | ✓                                              | ✓                                              | 
| Time-series                                                   | ✓                                 | ✓                                              | ✓                                              |
| Vector search                                                 | ✓                                 | ✓                                              | ✓                                              |
| AI workflows (coming soon)                                    | ✓                                 | ✓                                              | ✓                                              |
| Cloud SQL editor                                              | 3 seats                           | 10 seats                                       | 20 seats                                       |
| Charts                                                        | ✓                                 | ✓                                              | ✓                                              |
| Dashboards                                                    | 2                                 | Unlimited                                      | Unlimited                                      |
| **Storage and performance**                                   |                                   |                                                |                                                |
| IOPS                                                          | 	3,000 - 5,000	                   | 5,000 - 8,000                                  | 5,000 - 8,000                                  | 
| Bandwidth (autoscales)	                                       | 125 - 250 Mbps                    | 	250 - 500 Mbps                                | 	Up to 500 mbps                                | 
| I/O boost	                                                    |                                   | 	Add-on: <br/>Up to 16K IOPS, 1000 Mbps BW	    | Add-on: <br/>Up to 32K IOPS, 4000 Mbps BW      | 
| **Availability and monitoring**                               |                                   |                                                |                                                |
| High-availability replicas <br/>(Automated multi-AZ failover) | ✓                                 | ✓                                              | ✓                                              |
| Read replicas		                                               |                                   | ✓                                              | ✓                                              |
| Point-in-time recovery and forking                            | 	3 days                           | 14 days                                        | 14 days                                        |
| Performance insights                                          | ✓                                 | ✓                                              | ✓                                              |
| Metrics and log exporters	                                    |                                   | ✓                                              | ✓                                              |
| **Security and compliance**                                   |                                   |                                                |                                                |
| Role-based access                                            | ✓                                 | ✓                                              | ✓                                              |
| End-to-end encryption                                         | ✓                                 | ✓                                              | ✓                                              |
| Private Networking (VPC)                                      | 1 multi-attach VPC	               | Unlimited multi-attach VPCs                    | 	Unlimited multi-attach VPCs                   | 
| AWS Transit Gateway                                           |                                   | ✓                                              | ✓                                              |
| [HIPAA compliance][hipaa-compliance]                          |                                   |                                                | ✓                                              |
| IP address allow list                                         | 1 list with up to 10 IP addresses | Up to 10 lists with up to 10 IP addresses each | Up to 10 lists with up to 10 IP addresses each |
| Multi-factor authentication                                   | ✓                                 | ✓                                              | ✓                                              |
| Federated authentication (SAML)			                            |                                   |                                                | ✓                                              |
| SOC 2 Type 2 report		                                         |                                   | ✓                                              | ✓                                              |
| Penetration testing report                                    |                                   |                                                | ✓                                              |			
| Security questionnaire and review                             |                                   |                                                | ✓                                              |			
| Pay by invoice                                                | 	Available at minimum spend	      | Available at minimum spend                     | ✓                                              |
| [Uptime SLAs][commercial-sla]                                 | 	Standard                         | 	Standard                                      | 	Enterprise                                    |
| **Support and technical services**                            |                                   |                                                |                                                |
| Community support                                             | ✓                                 | ✓                                              | ✓                                              |
| Email support                                                 | ✓                                 | ✓                                              | ✓                                              |
| Production support                                            | 	Add-on                           | 	Add-on                                        | ✓                                              |
| Named account manager                                         |                                   |                                                | ✓                                              |
| JOIN services (Jumpstart Onboarding and INtegration)          |                                   | Available at minimum spend                     | ✓                                              |

For a personalized quote, [get in touch with $COMPANY][contact-company].

## Example billing calculation

You are billed at the end of each month in arrears, based on your actual usage that month. Your monthly invoice 
includes an itemized cost accounting for each $SERVICE_LONG and any additional charges.

$CLOUD_LONG charges are based on consumption: 

- **Compute**: metered on an hourly basis. You can scale compute up and down at any time.  
- **Storage**: metered based on your average GB consumption per hour. Storage grows and shrinks automatically 
  with your data.

Your monthly price for compute and storage is computed similarly. For example, over the last month your
$SERVICE_LONG has been running compute for 500 hours total:
  - 375 hours with 2 CPU 
  - 125 hours 4 CPU 
   
**Compute cost** = (`375` x `hourly price for 2 CPU`) + (`125` x `hourly price for 4 CPU`)  
 
Some add-ons such as Elastic storage, Tiered storage, and Connection pooling may incur 
additional charges. These charges are clearly marked in your billing snapshot in $CONSOLE.

## Manage your $CLOUD_LONG $PRICING_PLAN

You handle all details about your $CLOUD_LONG project including updates to your $PRICING_PLAN, 
payment methods, and add-ons in the [billing section in $CONSOLE][cloud-billing]:

<img class="main-content__illustration"
src="https://assets.timescale.com/docs/images/tiger-cloud-console/tiger-cloud-billing.png"
alt="Adding a payment method in Timescale"/>

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
[plan-features]: /about/:currentVersion:/pricing-and-account-management/#features-included-in-each-plan
[production-support]: https://www.timescale.com/support
[hipaa-compliance]: https://www.hhs.gov/hipaa/for-professionals/index.html
[aws-pricing]: /about/:currentVersion:/pricing-and-account-management/#aws-marketplace-pricing
[contact-company]: https://www.tigerdata.com/contact/