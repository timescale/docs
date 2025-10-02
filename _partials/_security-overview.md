$COMPANY implements a variety of secure software engineering practices in $TIMESCALE_DB, including code static analysis
for security hardening, automated scanning for dependency vulnerabilities, and code security reviews.
Additionally, $COMPANY has developed the https://github.com/timescale/pgspot open-source extension that we
use to identify security issues with $PG extensions. This has helped tighten our security posture.
$COMPANY products do not have any identified weaknesses.

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

The $CLOUD_LONG [Enterprise plan][pricing-plan-features] is Health Insurance Portability and Accountability Act
(HIPAA) compliant. This allows organizations to securely manage and analyze sensitive healthcare data, ensuring they
meet regulatory requirements while building compliant applications.

## Networking security

Customer access to $SERVICE_LONGs is only provided over TLS-encrypted
connections. There is no option to use unencrypted plaintext connections.