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
* **Improved scalability**: scale up or down based on your current needs, ensuring that you only pay
  for what you use.
* **Better support**: access to enhanced support options, including production support and dedicated
  account management, ensures you have the help you need when you need it.
* **Greater flexibility**: the ability to add features like IO Boost and customize your plan means you
  can tailor Timescale services to fit your specific needs.
* **Cost efficiency**: by aligning our pricing with the value delivered, we help you maximize your return
  on investment.

Using self-hosted TimescaleDB and our open-source products is still free.  

This page explains tiered pricing plans for Timescale Cloud, and how to easily manage your
Timescale account.

## Why we moved to tiered pricing plans

We understand that every business is unique, with its own set of challenges and opportunities.
Tiered pricing plans are tailored solutions that ensure you get the most out of our platform. Here's
why we've revamped our plans:

- **Scalability**: as your business grows, so do your demands. Tiered pricing plans scale with
  you, they provide the resources and support you need at each stage of your growth.
- **Flexibility**: we know that one size doesn't fit all. Tiered pricing plans give you the
  flexibility to choose the features and support levels that best match your business
  and engineering requirements.
- **Value**: by aligning our pricing with the value delivered, we ensure that you get the most
  out of every dollar spent. Our goal is to help you achieve more with less.

## How plans work

Tiered pricing plans are designed to give you the best value as your project moves 
from initial development through to mission critical enterprise applications. 

* **Compute**: pay the base rate for your plan, and only what you use. We even provide services 
  that help you lower your compute needs and improve query performance at the same time.
* **Storage**: use standard storage for your most-often used data, then use [tiered storage][data-tiering]
  for low-cost, long-term storage. How you use each is up to you, but we can help you compress your data 
  10x or more, so you pay even less.
* **That’s it**: you don't pay for backups, or networking costs such as data ingest/egress. There are 
  no per-query fees. Timescale pricing is completely transparent and up to you.

After you have completed your 30 day trial period on the Performance plan, choose the [Pricing plan][plan-features] 
that suits your business and engineering needs. You easily upgrade or downgrade your plan whenever you need in 
[Timescale Console][cloud-login]. You are billed monthly on the date you signed up. Any changes to your plan or 
add-ons are reflected in your next billing cycle.

You keep track of your monthly usage in [Timescale Console][cloud-billing]. It provides detailed insights 
into your current usage alerts you if you approach the limits for your plan. If you exceed plan limits, we don't 
interrupt your service when you upgrade, you can keep working without any hassle.

## Features included in each plan

The available plans are:

* **Performance**: for small to mid-sized businesses that need robust performance without the overhead
  of managing large-scale infrastructure.
* **Scale**: for larger businesses and apps that demand higher performance and scalability.
* **Enterprise**: for enterprises with complex requirements and a need for dedicated support and compliance.

The features included in each [plan][pricing-plans] are:

|                                    | Performance   | Scale                                | Enterprise |
|------------------------------------|---------------|--------------------------------------|-----------|
| Compute and storage                |               |                                      |           |
| Number of services	                | 4	            | Unlimited	                           |Unlimited|
| CPU limit per service              | 	Up to 8 CPU	 | Up to 32 CPU	                        | Up to 32 CPU | 
| Memory limit per service           | 	Up to 16 TB  | 	Up to 128 TB                        | 	Up to 128 TB | 
| Storage limit per service	         | Up to 16 TB	  | Up to 16 TB	                         | Up to 16 TB | 
| Tiered storage on S3	              |               | 	Unlimited	                          | Unlimited |
| Storage and networking             |               |                                      |
| IOPS (autoscales)                  | 	3k-5k	       | 5k-8k	                               | 5k-8k | 
| Bandwidth (autoscales)	            | Up to 250 mbps | 	Up to 500 mbps                      | 	Up to 500 mbps | 
| IO Boost	                          |               | 	Add-on: <br/>16K IOPS, 1000 Mbps BW	 | Add-on: <br/>16K IOPS, 1000 Mbps BW | 
| Availability and monitoring        |   ||
| High-availability replicas         |  ✓              |✓ |✓ |
| Read replicas		                    |               |✓ |✓ |
| Point-in-time recovery and forking | 	3 days       |14 days|14 days|
| Insights                           | 24 hours      |24 hours|24 hours|
| Metrics and log exporters	         |               |✓|✓|
| Security and compliance            ||||
| End-to-end encryption              |✓|✓|✓|
| Private Networking (VPC)           | 1 multi-attach VPC	| Unlimited multi-attach VPCs| 	Unlimited multi-attach VPCs| 
| Multi-factor authentication        |✓|✓|✓|
| Federated authentication (SAML)			 |||✓|
| SOC 2 Type 2 report		              ||✓|✓|
| Penetration testing report         |||✓|			
| Security questionnaire and review  |||✓|			
| Pay by invoice                     |	Available at minimum spend	|Available at minimum spend|
| [Commercial SLAs][commercial-sla]  |	Standard|	Standard|	Enterprise|
| Support||||
| Community support|✓|✓|✓|
| Email support|✓|✓|✓|
| Production support| 	Add-on| 	Add-on|✓|
| Named account manager|||✓|


If you want to estimate your costs ahead of the billing cycle, you can use the
[pricing calculator](http://timescale.com/pricing/calculator).
However, the pricing calculator does not include volume discounts. For a
personalized quote, [get in touch with Timescale](https://www.timescale.com/contact).

## Optimize storage and reduce data costs

<UsageBasedStorage />

You do not need to allocate extra disk space for backfilling or migrating your
data. Usage-based storage means that disk allocation is not an issue in
Timescale Cloud. For example, if your recently migrated database requires less disk
space after compression, you do not need to downscale your volume. The reduction
in your storage bill proportionally matches the reduction in your disk usage.

Disk usage is metered in 15 minute intervals over an hour to build an average
value of hourly data stored. Bills are calculated on a 730 hour month.

You are charged for only the storage you have used, using the following formula:

```txt
Storage used in GiB * (seconds stored / 3600) * price per hour
```



## Manage your Timescale account

You handle all details about your Timescale project including updates to your pricing plan, 
payment methods, and add-ons in the [billing section in Timescale Console][cloud-billing]:

<img class="main-content__illustration"
src="https://assets.timescale.com/docs/images/timescale-console-billing.png"
alt="Adding a payment method in Timescale"/>

- **Details**: an overview of your plan, usage and payment details.

  You can add up to three credit cards to your `Wallet`. If you prefer to pay by invoice, 
  [contact Timescale](https://www.timescale.com/contact/) and ask to change to corporate 
  billing.

- **Details**: the list of your downloadable Timescale invoices.
- **Emails**: the addresses Timescale uses to communicate with you,

  Payment confirmations and alerts are sent to the email address you signed up with.
  Add another address to send details to other departments in your organization. 

- **Plans**: choose the [features][plan-features] that suit your business and engineering needs.

- **Add-ons**: add top-tier support and improved database performance for mission critical workloads.  

[cloud-login]: https://console.cloud.timescale.com/
[compression]: /use-timescale/:currentVersion:/compression/
[data-tiering]: /use-timescale/:currentVersion:/data-tiering/
[cloud-billing]: https://console.cloud.timescale.com/dashboard/billing/details
[commercial-sla]: https://www.timescale.com/legal/timescale-cloud-terms-of-service
[pricing-plans]: https://www.timescale.com/pricing
[plan-features]: /about/:currentVersion:/pricing-and-account-management/#features-included-in-each-plan