# Security overview

## Cloud provider accounts
The regular managed TimescaleDB services are hosted under cloud provider
accounts controlled by Managed Service for TimescaleDB. These accounts are
managed only by Timescale and Aiven operations personnel. Customers cannot
directly access the cloud provider account resources.

## Virtual machines
Each Managed Service for TimescaleDB service consists of one or more virtual
machines, which are automatically launched to the target cloud region chosen by
the customer. In cloud regions that have multiple Availability Zones (or a
similar mechanism), the virtual machines are distributed evenly across the zones
in order to provide best possible service in cases when an entire Availability
Zone (may include one or more data centers) goes unavailable.

Service-providing virtual machines are dedicated for a single customer, that is,
there is no multi-tenancy on a VM basis, and the customer data never leaves the
machine, except when uploaded to the offsite backup location.

Virtual machines are not reused and are terminated and wiped upon service
upgrade or termination.

## Data encryption
Managed Service for TimescaleDB at-rest data encryption covers both active
service instances as well as service backups in cloud object storage.

Service instances and the underlying VMs use full volume encryption using LUKS
with a randomly generated ephemeral key per each instance and each volume. The
key is never re-used and are trashed at the destruction of the instance, so
there's a natural key rotation with roll-forward upgrades. We use the LUKS default
mode aes-xts-plain64:sha256 with a 512-bit key.

Backups are encrypted with a randomly generated key per file. These keys are in
turn encrypted with RSA key-encryption key-pair and stored in the header section
of each backup segment. The file encryption is performed with AES-256 in CTR
mode with HMAC-SHA256 for integrity protection. The RSA key-pair is randomly
generated for each service. The key lengths are 256-bit for block encryption,
512-bit for the integrity protection and 3072-bits for the RSA key.

Timescale Cloud-encrypted backup files are stored in the object storage in the
same region where the service virtual machines are located.

## Networking security
Customer access to provided services is only provided over TLS encrypted connections.
There is no option for using unencrypted plaintext connections.

Communication between virtual machines within Managed Service for TimescaleDB is
secured with either TLS or IPsec. There are no unencrypted plaintext
connections.

Virtual machines network interfaces are protected by a dynamically configured
iptables-based firewall that only allows connections from specific addresses both
from the internal network (other VMs in the same service) or external public
network (customer client connections).  The allowed source IP addresses for
establishing connections is user controlled on per-service basis.

## Networking with VPC peering
When using VPC peering, **no public internet based access** is provided to the
services. Service addresses are published in public DNS, but they can only be
connected to from the customer's peered VPC using private network addresses.

The service providing virtual machines are still contained under Timescale Cloud
provider accounts.

## Operator access
Normally all the resources required for providing an Managed Service for
TimescaleDB service are automatically created, maintained and terminated by the
Timescale Cloud infrastructure and there is no manual operator intervention
required.

However, the Managed Service for TimescaleDB Operations Team has the capability
to securely login to the service Virtual Machines for troubleshooting purposes.
These accesses are audit logged.

No customer access to the virtual machine level is provided.

## Customer data privacy
Customer data privacy is of utmost importance at Timescale and is covered
by internal Security and Customer Privacy policies as well as the strict EU regulations.
Timescale operators never access customer data, unless explicitly
requested by the customer in order to troubleshoot a technical issue.

The Timescale operations team has mandatory recurring training regarding the
applicable policies.

TimescaleDB services are periodically assessed and penetration tested for any
security issues by an independent professional cyber security vendor.

The latest evaluation report can be found [here][cloud-security-eval].

## Advanced Managed Service for TimescaleDB configuration

### Securing network access to Timescale Cloud

One very critical piece of securing your database within Managed Service for TimescaleDB is network protection.

TimescaleDB provides the ability to configure, in a fine-grained manner, the
set of source IP addresses and ranges, as well as connection ports, that can
access your Managed Service for TimescaleDB services.

This tutorial walks you through how to configure this capability.

#### Before you start

Be sure to follow the instructions above in order to
get signed up and create your first database instance.

#### Step 1 - Navigate to your TimescaleDB instance

Once you have a database instance setup in the
[Managed Service for TimescaleDB portal][timescale-mst-portal], browse to this
service and click on the 'Overview' tab. In the 'Connection Information'
section, you can see the port number that is used for database connections.
This is the port you need to protect by managing inbound access.

<img class="main-content__illustration" src="https://assets.iobeam.com/images/docs/screenshots-for-securing-timescale-cloud/overview-tab.png" alt="Timescale Cloud Overview tab"/>

#### Step 2 - Find the allowed IP addresses section

Scroll down to find the 'Allowed IP Addresses' section. By default, this value is set to
`0.0.0.0/0` which is actually wide-open.

<highlight type="warning">
This wide-open setting simplifies getting started since it accepts incoming traffic from all sources, but you absolutely want to narrow this range.
</highlight>

<img class="main-content__illustration" src="https://assets.iobeam.com/images/docs/screenshots-for-securing-timescale-cloud/allowed-ip.png" alt="Allowed IP addresses"/>

#### Step 3 - Change the allowed IP addresses section

Click 'Change' and adjust the [Classless Inter-Domain Routing][cidr-wiki] (CIDR) value based on where your source traffic is coming from.
For example, entering a value of `192.168.1.15/32` ONLY allows incoming traffic from a
source IP of `192.168.1.15` and denies all other traffic.

#### Step 4 - Save your changes
Click 'Save Changes' and see this take effect immediately.

#### Conclusion
Limiting IP address inbound access is just one option to improve the security of your Timescale
Cloud database instance. There are many other types of security measures you should take into
account when securing your data. To learn more about security options within Timescale Cloud,
visit the [Managed TimescaleDB Knowledge Base][timescale-mst-kb].

[cloud-security-eval]: https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=1&cad=rja&uact=8&ved=0ahUKEwjtm4bbn4rbAhUBDZoKHdBRDgkQFggpMAA&url=https%3A%2F%2Fwww.elfgroup.fi%2Fecc%2F1708-S6-71acd0046.pdf&usg=AOvVaw2wcBEPGeys6PL21W3G6wGW
[timescale-mst-portal]: https://portal.managed.timescale.com/
[cidr-wiki]: https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing
[timescale-mst-kb]: https://kb-managed.timescale.com/en/
