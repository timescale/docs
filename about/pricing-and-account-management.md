---
title: Billing and account management
excerpt: Manage billing and account information for your Timescale account
products: [cloud]
keywords: [billing, accounts, admin]
tags: [payment, billing, costs]
cloud_ui:
    path:
        - [billing]
---

import UsageBasedStorage from "versionContent/_partials/_usage-based-storage-intro.mdx";

# Pricing plans and account management

As we enhance our offerings and align them with your evolving needs, tiered
pricing plans provide more value, flexibility, and efficiency for your business.
Whether you're a growing startup or a well-established enterprise, our new tiers
are structured to support your journey towards greater success.

Tiered pricing plans give you:

* **Enhanced performance**: with increased CPU and storage capacities, your apps run smoother and more
  efficiently, even under heavy loads.
* **Improved scalability**: as your business grows, so do your demands. Tiered pricing plans scale with
  you, they provide the resources and support you need at each stage of your growth. scale up or down 
  based on your current needs, ensuring that you only pay for what you use.
* **Better support**: access to enhanced support options, including production support and dedicated
  account management, ensures you have the help you need when you need it.
* **Greater flexibility**: we know that one size doesn't fit all. Tiered pricing plans give you the
  flexibility to choose the features and support levels that best match your business
  and engineering requirements. The ability to add features like IO Boost and customize your plan means you
  can tailor Timescale services to fit your specific needs.
* **Cost efficiency**: by aligning our pricing with the value delivered, we ensure that you get the most
  out of every dollar spent. Our goal is to help you achieve more with less.

Using self-hosted TimescaleDB and our open-source products is still free.  

This page explains tiered pricing plans for Timescale Cloud, and how to easily manage your
Timescale account.

## How plans work

Tiered pricing plans are designed to give you the best value as your project moves 
from initial development through to mission critical enterprise applications. 

* **Compute**: pay only for the compute resources you run. Compute is metered on an hourly 
   basis, and you can scale it up and down at any time. You an also scale out using replicas 
  as your application grows. We even provide services to help you lower your compute needs 
  while improving query performance.

* **Storage**: pay only for the storage you consume. Storage is metered on your average GB 
   consumption per hour; it grows and shrinks automatically with your data. You have 
   high-performance storage for more-accessed data, and [tiered storage][data-tiering] 
   for low-cost, bottomless storage. We can help you compress your data up to 10x or more 
   so you pay even less.

* **It’s that simple**: you don't pay for backups or networking costs, such as data ingest 
   or egress.  There are no per-query fees, nor additional costs to read or write data. It's all completely 
   transparent, easily understood, and up to you.

  
### Timescale Cloud free trial for the different tiers

We offer new users a free, 30-day trial period of our Performance plan with no credit card required.  
During your trial, you can contact sales@timescale.com to request information about, and access
to, our Scale plan to determine how it fits your needs. Once you become a paying user, we can make 
certain features of higher plans available to you for testing without upgrading your entire plan.

After you have completed your 30 day trial period on the Performance plan, choose the 
[Pricing plan][plan-features] that suits your business and engineering needs.

### Upgrade or downgrade your plan at any time

You can easily upgrade or downgrade or downgrade between the Performance and Scale plans 
whenever you want using [Timescale Console][cloud-login]. If you switch your plan mid-month, 
your prices are pro-rated to when you switch. Your services are not interrupted when you switch, 
you can keep working without any hassle. To move to Enterprise, [get in touch with Timescale][get-in-touch].

### Monitor usage and costs

You keep track of your monthly usage in [Timescale Console][cloud-billing]. Console shows your 
resource usage and dashboards with performance insights. This allows you to closely monitor your 
services’ performance, and any need to scale your services or upgrade your plan.

Console also shows your month-to-date accrued charges, as well as a forecast of your expected 
month-end bill. Your previous invoices are also available as PDFs for download.

### Timescale support 

Timescale runs a global support organization with Customer Satisfaction (CSAT) scores above 99%.
Support covers all timezones, and is fully staffed at weekend hours. 

All plans have free Developer Support through email with a target response time of 1 business 
day; we are often faster. If you need 24x7 responsiveness, talk to us about 
[Production Support][production-support].

### Don’t worry about storage or sizing

Unlike Amazon RDS or self-managed infrastructure where you pre-provision your disk and pay for
its allocation, Timescale charges by the actual storage used. As your data volume grows, at
no additional cost within your plan’s range, Timescale Cloud autoscales the IOPS and storage
bandwidth of your service to meet those needs.

We make it easy for you to store unlimited amounts of data using Tiered Storage; a high-performance
storage tier and a low-cost bottomless storage tier. You can keep up to 16 TB compressed
(typically 80-100 TBs uncompressed) in the high-performance storage tier, and configure less-frequently
accessed data to be moved to our low-cost storage tier built on S3.

Timescale Cloud is very efficient and generally needs less compute than other databases to deliver
the same performance. The best way to size your needs is to signup for a free trial and to test
with a realistic workload.

### Charging for HA and read replicas

HA and read replicas are both charged at the same rate as your primary service, based on the 
compute and primary storage consumed by your replicas.  Data tiered to our bottomless storage 
tier is shared by all database replicas; replicas accessing tiered storage do not add to your 
bill.

### Charging over regions

Storage is priced the same across all regions. However, compute prices vary depending on the 
region. This is because our cloud provider (AWS) prices infrastructure differently based on region.

## Features included in each plan

The available plans are:

* **Performance**: for cost-focused, smaller projects. No credit card required to start.
* **Scale**: for developers handling critical and demanding apps.
* **Enterprise**: for enterprises with mission-critical apps.

The features included in each [plan][pricing-plans] are:

| Feature                                                       | Performance                  | Scale                                 | Enterprise                          |
|---------------------------------------------------------------|------------------------------|---------------------------------------|-------------------------------------|
| **Compute and storage**                                       |                              |                                       |                                     |
| Number of services	                                           | Up to 4	                     | Unlimited	                            | Unlimited                           |
| CPU limit per service                                         | 	Up to 8 CPU	                | Up to 32 CPU	                         | Up to 32 CPU                        | 
| Memory limit per service                                      | 	Up to 32 GB                 | 	Up to 128 GB                     | 	Up to 128 GB                       | 
| Storage limit per service	                                    | Up to 16 TB	                 | Up to 16 TB	                      | Up to 16 TB                         | 
| Tiered storage on S3	                                         |                              | 	Unlimited	                           | Unlimited                           |
| Independently scale compute and storage	                      | ✓                            | 	✓	                                   | ✓                                   |
| **Data Services and Workloads**                               |                              |                                       |
| Relational                                                    | ✓                            | ✓                                     | ✓                                   | 
| Time-series                                                   | ✓                            | ✓                                     | ✓                                   |
| Vector search                                                 | ✓                            | ✓                                     | ✓                                   |
| AI workflows (coming soon)                                    | ✓                            | ✓                                     | ✓                                   |
| Cloud SQL editor                               | 3 seats                      | 10 seats                              | 20 seats                            |
| Charts                                                        | ✓                            | ✓                                     | ✓                                   |
| Dashboards                                                    | 2                            | Unlimited                             | Unlimited                           |
| **Storage and performance**                                   |                              |                                       |                                     |
| IOPS (autoscales)                                             | 	3,000 - 5,000	              | 5,000 - 8,000                         | 5,000 - 8,000                       | 
| Bandwidth (autoscales)	                                       | 125 - 250 Mbps               | 	250 - 500 Mbps                       | 	Up to 500 mbps                     | 
| IO Boost	                                                     |                              | 	Add-on: <br/>16K IOPS, 1000 Mbps BW	 | Add-on: <br/>16K IOPS, 1000 Mbps BW | 
| **Availability and monitoring**                               |                              |                                       |                                     |
| High-availability replicas <br/>(Automated multi-AZ failover) | ✓                            | ✓                                     | ✓                                   |
| Read replicas		                                               |                              | ✓                                     | ✓                                   |
| Point-in-time recovery and forking                            | 	3 days                      | 14 days                               | 14 days                             |
| Performance insights                                          | ✓                            | ✓                                     | ✓                                   |
| Metrics and log exporters	                                    |                              | ✓                                     | ✓                                   |
| **Security and compliance**                                   |                              |                                       |                                     |
| End-to-end encryption                                         | ✓                            | ✓                                     | ✓                                   |
| Private Networking (VPC)                                      | 1 multi-attach VPC	          | Unlimited multi-attach VPCs           | 	Unlimited multi-attach VPCs        | 
| Multi-factor authentication                                   | ✓                            | ✓                                     | ✓                                   |
| Federated authentication (SAML)			                            |                              |                                       | ✓                                   |
| SOC 2 Type 2 report		                                         |                              | ✓                                     | ✓                                   |
| Penetration testing report                                    |                              |                                       | ✓                                   |			
| Security questionnaire and review                             |                              |                                       | ✓                                   |			
| Pay by invoice                                                | 	Available at minimum spend	 | Available at minimum spend            |✓  |
| [Uptime SLAs][commercial-sla]                                 | 	Standard                    | 	Standard                             | 	Enterprise                         |
| **Support and technical services**                            |                              |                                       |                                     |
| Community support                                             | ✓                            | ✓                                     | ✓                                   |
| Email support                                                 | ✓                            | ✓                                     | ✓                                   |
| Production support                                            | 	Add-on                      | 	Add-on                               | ✓                                   |
| Named account manager                                         |                              |                                       | ✓                                   |
|JOIN services (Jumpstart Onboarding and INtegration)|                              | Available at minimum spend            | ✓ | 

If you want to estimate your costs ahead of the billing cycle, you can use the
[pricing calculator](http://timescale.com/pricing/calculator).
However, the pricing calculator does not include volume discounts. For a personalized quote, [get in touch with Timescale][get-in-touch].


## Example billing calculation

You are billed at the end of each month in arrears, based on your actual usage that month.  
Your monthly invoice includes an itemized cost accounting for each Timescale Cloud service and 
any additional charges.

Timescale Cloud charges are based on consumption: 

- **Compute**: metered on an hourly basis. You can scale compute up and down at any time.  
- **Storage**: metered based on your average GB consumption per hour. Storage grows and shrinks automatically 
  with your data.


Your monthly price for compute and storage is computed similarly. For example, over the last month your 
Timescale Cloud service has been running Compute for 500 hours total:
  - 375 hours with 2 CPU 
  - 125 hours 4 CPU 
   
**Compute cost** = (`375` x `hourly price for 2 CPU`) + (`125` x `hourly price for 4 CPU`)  
 
Some add-ons such as Elastic storage, Tiered storage  and Connection pooling may incur 
additional charges. These charges are clearly marked in your billing snapshot: 

<img class="main-content__illustration"
src="https://assets.timescale.com/docs/images/billing-snapshot.png"
alt="Adding a payment method in Timescale"/>

## Manage your Timescale plan

You handle all details about your Timescale project including updates to your pricing plan, 
payment methods, and add-ons in the [billing section in Timescale Console][cloud-billing]:

<img class="main-content__illustration"
src="https://assets.timescale.com/docs/images/timescale-console-billing.png"
alt="Adding a payment method in Timescale"/>

- **Details**: an overview of your plan, usage and payment details. You can add up 
  to three credit cards to your `Wallet`. If you prefer to pay by invoice, 
  [contact Timescale](https://www.timescale.com/contact/) and ask to change to corporate billing.

- **Details**: the list of your downloadable Timescale invoices.
- **Emails**: the addresses Timescale uses to communicate with you. Pyment 
  confirmations and alerts are sent to the email address you signed up with.
  Add another address to send details to other departments in your organization. 

- **Plans**: choose the plan supplying the [features][plan-features] that suit your business and
  engineering needs.

- **Add-ons**: add top-tier support and improved database performance for mission critical workloads.  

[cloud-login]: https://console.cloud.timescale.com/
[compression]: /use-timescale/:currentVersion:/compression/
[data-tiering]: /use-timescale/:currentVersion:/data-tiering/
[cloud-billing]: https://console.cloud.timescale.com/dashboard/billing/details
[commercial-sla]: https://www.timescale.com/legal/timescale-cloud-terms-of-service
[pricing-plans]: https://www.timescale.com/pricing
[plan-features]: /about/:currentVersion:/pricing-and-account-management/#features-included-in-each-plan
[production-support]: https://www.timescale.com/support
[get-in-touch]: https://www.timescale.com/contact