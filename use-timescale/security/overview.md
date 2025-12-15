---
title: About security in Tiger Cloud
excerpt: Learn how Tiger Cloud protects your data with secure development practices, as well as configurable features that restrict access to your services
products: [cloud]
keywords: [security]
tags: [encryption, VPC, privacy]
---

# About security in $CLOUD_LONG

Protecting data starts with secure software engineering. At $COMPANY, we embed security into every stage of 
development, from static code analysis and automated dependency scanning to rigorous code security reviews. 
To go even further, we developed [pgspot](https://github.com/timescale/pgspot), an open-source extension to identify security 
issues with $PG extensions, which strengthens the broader ecosystem as well as our own platform. $COMPANY products do not have any identified weaknesses.

![Image alt](https://assets.timescale.com/docs/images/tiger-cloud-console/tiger-platform-security-overview.svg)

This page lists the additional things we do to ensure operational security and to lock down $SERVICE_LONGs. 
To see our security features at a glance, see [$COMPANY Security][security-at-timescale].

## Role-based access 

$CLOUD_LONG provides role-based access for you to:

* Administer your $PROJECT_LONG
   In $CONSOLE_LONG, users with the Owner, Admin, and Viewer roles have different permissions to manage users and $SERVICE_SHORTs in the $PROJECT_SHORT. 
* Manage data in each $SERVICE_SHORT
    To restrict access to your data on the database level, you can create other roles on top of the default tsdbadmin role. 

## Data encryption

Your data on $CLOUD_LONG is encrypted both in transit and at rest. Both active
databases and backups are encrypted.

$CLOUD_LONG uses AWS as its cloud provider, with all the security that AWS
provides. Data encryption uses the industry-standard AES-256 algorithm.
Cryptographic keys are managed by
[AWS Key Management Service (AWS KMS)][aws-kms]. Keys are never stored in plaintext.

For more information about AWS security, see the AWS documentation on security
in [Amazon Elastic Compute Cloud][ec2-security] and
[Elastic Block Storage][ebs-security].

## Networking security

Customer access to $SERVICE_LONGs is only provided over TLS-encrypted
connections. There is no option to use unencrypted plaintext connections.

## Networking with Virtual Private Cloud (VPC) peering

When using VPC peering, **no public Internet-based access** is provided to the
$SERVICE_SHORT. $SERVICE_SHORT_CAP addresses are published in public DNS, but they can only be
connected to from the customer's peered VPC using private network addresses.

VPC peering only enables communication to be initiated from your Customer VPC to
$SERVICE_LONGs running in the $CLOUD_LONG VPC. $CLOUD_LONG cannot initiate 
communication with your VPC. To learn how to set up VPC Peering, see 
[Secure your $SERVICE_LONGs with VPC Peering and AWS PrivateLink][vpc-peering].

## IP address allow lists

You can allow only trusted IP addresses to access your $SERVICE_LONGs. You do this by 
creating [IP address allow lists][ip-allowlist] and attaching them to your $SERVICE_SHORTs. 

## Operator access

Normally all the resources required for providing $SERVICE_LONGs are
automatically created, maintained and terminated by the $CLOUD_LONG
infrastructure. No manual operator intervention is required.

However, the $COMPANY operations team has the capability to securely
log in to the $SERVICE_SHORT virtual machines for troubleshooting purposes. These
accesses are audit logged.

No customer access to the virtual machine level is provided.

## GDPR compliance

$COMPANY complies with the European Union's General Data Protection Regulation
(GDPR), and all practices are covered by our
[Privacy Policy][timescale-privacy-policy]
and the [Terms of Service][commercial-sla]. All customer data is
processed in accordance with $COMPANY's GDPR-compliant
[Data Processor Addendum][tsc-data-processor-addendum],
which applies to all $COMPANY customers.

$COMPANY operators never access customer data, unless explicitly requested by
the customer to troubleshoot a technical issue. The $COMPANY operations team
has mandatory recurring training regarding the applicable policies.

## HIPAA compliance

The $CLOUD_LONG [$ENTERPRISE plan][pricing-plan-features] is Health Insurance Portability and Accountability Act 
(HIPAA) compliant. This allows organizations to securely manage and analyze sensitive healthcare data, ensuring they 
meet regulatory requirements while building compliant applications.

## SOC 2 compliance

$CLOUD_LONG is SOC 2 Type 2 compliant. This ensures that organizations can securely manage customer data in alignment with industry standards for security, availability, processing integrity, confidentiality, and privacy. It helps businesses meet trust requirements while confidently building applications that handle sensitive information. The annual SOC 2 report is available to customers on the $SCALE or $ENTERPRISE $PRICING_PLANs. Open a [support ticket][open-support-ticket] to get access to it.

[aws-kms]: https://aws.amazon.com/kms/
[commercial-sla]: https://www.tigerdata.com/legal/terms-of-service
[ebs-security]: https://docs.aws.amazon.com/ebs/latest/userguide/ebs-encryption.html
[ec2-security]: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/data-protection.html
[ip-allowlist]: /use-timescale/:currentVersion:/security/ip-allow-list/
[open-support-ticket]: https://console.cloud.timescale.com/dashboard/support
[pricing-plan-features]: /about/:currentVersion:/pricing-and-account-management/#features-included-in-each-pricing-plan
[security-at-timescale]: https://www.tigerdata.com/security
[timescale-privacy-policy]: https://www.tigerdata.com/legal/privacy
[tsc-data-processor-addendum]: https://www.tigerdata.com/legal/timescale-cloud-data-processing-addendum
[vpc-peering]: /use-timescale/:currentVersion:/security/vpc
