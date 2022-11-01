---
title: Timescale Cloud security
excerpt: Get an overview of security on Timescale Cloud
product: cloud
keywords: [security]
tags: [encryption, VPC, privacy]
---

# Timescale Cloud security

## Data encryption

Your Timescale Cloud data is encrypted both in transit and at rest. Both active
databases and backups are encrypted.

Timescale Cloud uses AWS as its cloud provider, with all the security that AWS
provides. Data encryption uses the industry-standard AES-256 algorithm.
Cryptographic keys are managed by [AWS Key Management Service (AWS
KMS)][aws-kms]. Keys are never stored in plaintext.

For more information about AWS security, see the AWS documentation on security
in [Amazon Elastic Compute Cloud][ec2-security] and [Elastic Block
Storage][ebs-security].

## Networking security

Customer access to Timescale Cloud services is only provided over TLS-encrypted
connections. There is no option for using unencrypted plaintext connections.

## Networking with Virtual Private Cloud (VPC) peering

When using VPC peering, **no public Internet-based access** is provided to the
services. Service addresses are published in public DNS, but they can only be
connected to from the customer's peered VPC using private network addresses.

## Operator access

Normally all the resources required for providing Timescale Cloud services are
automatically created, maintained and terminated by the Timescale Cloud
infrastructure. No manual operator intervention is required.

However, the Timescale Cloud Operations Team has the capability to securely
log in to the service Virtual Machines for troubleshooting purposes. These
accesses are audit logged.

No customer access to the virtual machine level is provided.

## Customer data privacy

Customer data privacy is of utmost importance at Timescale. By default, your
Timescale Cloud data is encrypted both in transit and at rest. To do this,
Timescale uses various technical mechanisms, processes, and software development
lifecycle practices, to help ensure the security and privacy of your data.

Timescale complies with the European Union's General Data Protection Regulation
(GDPR), and all practices are covered the
[Timescale Privacy Policy][timescale-privacy-policy]
and the [Timescale Cloud terms of service][tsc-tos]. All customer data is
processed in accordance with Timescale's GDPR-compliance
[Data Processor Addendum][tsc-data-processor-addendum],
which applies to all Timescale Cloud customers.

Timescale operators never access customer data, unless explicitly requested by
the customer to troubleshoot a technical issue. The Timescale operations team
has mandatory recurring training regarding the applicable policies.

[timescale-privacy-policy]: https://www.timescale.com/legal/privacy
[tsc-tos]: https://www.timescale.com/legal/timescale-cloud-terms-of-service
[tsc-data-processor-addendum]: https://www.timescale.com/legal/timescale-cloud-data-processing-addendum
[aws-kms]: https://aws.amazon.com/kms/
[ec2-security]: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/data-protection.html
[ebs-security]: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSEncryption.html
