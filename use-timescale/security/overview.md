---
title: About security in Tiger Cloud
excerpt: Learn how Tiger Cloud protects your data with secure development practices, as well as configurable features that restrict access to your services
products: [cloud]
keywords: [security]
tags: [encryption, VPC, privacy]
---

# About security in $CLOUD_LONG

$COMPANY implements a variety of secure software engineering practices in $TIMESCALE_DB, including code static analysis 
for security hardening, automated scanning for dependency vulnerabilities, and code security reviews. 
Additionally, $COMPANY has developed the https://github.com/timescale/pgspot open-source extension that we 
use to identify security issues with PostgreSQL extensions. This has helped tighten our security posture.
$COMPANY products do not have any identified weaknesses.

This page lists the additional things we do to ensure operational security and to lock down $SERVICE_LONGs. 
To see our security features at a glance, see [$COMPANY Security][security-at-timescale].

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

## Customer data privacy

Customer data privacy is of utmost importance at $COMPANY. By default, your data is encrypted both in transit and at rest. To do this,
$COMPANY uses various technical mechanisms, processes, and software development
lifecycle practices, to help ensure the security and privacy of your data.

$COMPANY complies with the European Union's General Data Protection Regulation
(GDPR), and all practices are covered by our
[Privacy Policy][timescale-privacy-policy]
and the [Terms of Service][tsc-tos]. All customer data is
processed in accordance with $COMPANY's GDPR-compliant
[Data Processor Addendum][tsc-data-processor-addendum],
which applies to all $COMPANY customers.

$COMPANY operators never access customer data, unless explicitly requested by
the customer to troubleshoot a technical issue. The $COMPANY operations team
has mandatory recurring training regarding the applicable policies.

## HIPAA compliance

$CLOUD_LONG [Enterprise plan][pricing-plan-features] is Health Insurance Portability and Accountability Act 
(HIPAA) compliant. This allows organizations to securely manage and analyze sensitive healthcare data, ensuring they 
meet regulatory requirements while building compliant applications.

[timescale-privacy-policy]: https://www.timescale.com/legal/privacy
[tsc-tos]: https://www.timescale.com/legal/timescale-cloud-terms-of-service
[tsc-data-processor-addendum]: https://www.timescale.com/legal/timescale-cloud-data-processing-addendum
[aws-kms]: https://aws.amazon.com/kms/
[ec2-security]: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/data-protection.html
[ebs-security]: https://docs.aws.amazon.com/ebs/latest/userguide/ebs-encryption.html
[vpc-peering]: /use-timescale/:currentVersion:/security/vpc
[security-at-timescale]: https://www.timescale.com/security
[ip-allowlist]: /use-timescale/:currentVersion:/security/ip-allow-list/
[pricing-plan-features]: /about/:currentVersion:/pricing-and-account-management/#features-included-in-each-plan
