---
title: Security overview
excerpt: Learn how your Managed Service for TimescaleDB instance is secured
products: [mst]
keywords: [security]
---

# Security in Managed Service for TimescaleDB

This section covers how Timescale handles security of your data while it is
stored.

## Cloud provider accounts

Managed Service for TimescaleDB services are hosted by cloud provider
accounts controlled by Timescale. These accounts are managed only by Timescale
and Aiven operations personnel. Members of the public cannot directly access the
cloud provider account resources.

## Virtual machines

Your Managed Service for TimescaleDB services are located on one or more virtual
machines. Each virtual machine is dedicated to a single customer, and are never
multi-tenanted. Customer data never leaves the virtual machine, except when
uploaded to an offsite backup location.

When you create a new service, you need to select a cloud region. When the
virtual machine is launched, it does so in the cloud region you have chosen.
Your data never leaves the chosen cloud region.

If a cloud region has multiple Availability Zones, or a similar
high-availability mechanism, the virtual machines are distributed evenly across
the zones. This provides the best possible service if an Availability Zone
becomes unavailable.

Access to the virtual machine providing your service is restricted. Software
that is accessing your database needs to run on a different virtual machine. To
reduce latency, it is best for it to be using a virtual machine provided by the
same cloud provider, and in the same region, if possible.

Virtual machines are not reused. They are terminated and wiped when you upgrade
or delete your service.

## Project security

Every Managed Service for TimescaleDB project has its own certificate authority.
This certificate authority is used to sign certificates used internally by your
services to communicate between different cluster nodes and to management
systems.

You can download your project certificate authority in the
[Managed Service for TimescaleDB portal][mst-portal]. In the `Services` tab,
click the service you want to find the certificate for. In the service
`Overview` tab, under `Connection information`, locate the
`CA Certificate` section, and click `Show` to see the certificate. It is
recommended that you set up your browser or client to trust that certificate.

All server certificates are signed by the Managed Service for TimescaleDB
project certificate authority.

## Data encryption

Managed Service for TimescaleDB at-rest data encryption covers both active
service instances as well as service backups in cloud object storage.

Service instances and the underlying virtual machines use full volume
encryption. The encryption method uses LUKS, with a randomly generated ephemeral
key per each instance, and per volume. The keys are never re-used, and are
disposed of when the instance is destroyed. This means that a natural key
rotation occurs with roll-forward upgrades. By default, the LUKS mode is
`aes-xts-plain64:sha256`, with a 512-bit key.

Backups are encrypted with a randomly generated key per file. These keys are in
turn encrypted with an RSA key-encryption key-pair, and stored in the header
section of each backup segment. The file encryption is performed with AES-256 in
CTR mode, with HMAC-SHA256 for integrity protection. The RSA key-pair is
randomly generated for each service. The key lengths are 256-bit for block
encryption, 512-bit for the integrity protection, and 3072-bits for the RSA key.

Encrypted backup files are stored in the object storage in the same region that
the virtual machines are located for the service.

## Networking security

Access to provided services is only provided over TLS encrypted connections. TLS
ensures that third-parties can't eavesdrop or modify the data while it's in
transit between your service and the clients accessing your service. You cannot
use unencrypted plain text connections.

Communication between virtual machines within Managed Service for TimescaleDB is
secured with either TLS or IPsec. You cannot use unencrypted plaintext
connections.

Virtual machines network interfaces are protected by a dynamically configured
firewall based on iptables, which only allows connections from specific
addresses. This is used for network traffic from the internal network to other
VMs in the same service, and for external public network, to client connections.

By default, new services accept incoming traffic from all sources, which is
used to simplify initial set up of your service. It is highly recommended that
you restrict the IP addresses that are allowed to establish connections to your
services.

<Procedure>

### Configure allowed incoming IP addresses for your service

1.  Sign in to your Managed Service for TimescaleDB portal.
1.  In the `Services` tab, find the service you want to configure, and check
    it is marked as `Running`.
1.  In the service `Overview` tab, under `Connection information`, locate the
    port number. This is the port that you are managing inbound access for.
1.  Scroll down and locate the `Allowed IP addresses` section. By default, this
    is set to `0.0.0.0/0`, which accepts incoming access from all sources.
1.  Click `Change`, and type the CIDR value for your incoming source traffic.
    For example, if you enter a value of `192.168.1.15/32` only traffic from
    this IP address is allowed, and all other traffic is blocked. Alternatively,
    you could enter an address block to allow all traffic from within the block.
    Click `+` to add the address to the allowed list. Click `Save changes`.
1.  Check that the new allowed addresses are shown correctly in the
    `Allowed IP addresses` section.

   <img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/mst-allowed-incomingip.png" alt="Add a new allowed incoming IP address for Managed Service for TimescaleDB services"/>

</Procedure>

## Networking with VPC peering

When you set up VPC peering, you cannot access your services using public
internet-based access. Service addresses are published in the public DNS record,
but they can only be connected to from your peered VPC network using private
network addresses.

The virtual machines providing your service are hosted by cloud provider
accounts controlled by Timescale.

## Customer data privacy

Customer data privacy is of utmost importance at Timescale. Timescale works with
Aiven to provide Managed Service for TimescaleDB.

In most cases, all the resources required for providing your services are
automatically created, maintained, and terminated by the Managed Service for
TimescaleDB infrastructure, with no manual operator intervention required.

The Timescale Operations Team are able to securely log in to your service
Virtual Machines, for the purposes of troubleshooting, as required. Timescale
operators never access customer data unless you explicitly request them to do
so, to troubleshoot a technical issue. This access is logged and audited.

There is no ability for any customer or member of the public to access any
virtual machines used in Managed Service for TimescaleDB.

Managed Service for TimescaleDB services are periodically assessed and penetration
tested for any security issues by an independent professional cyber-security vendor.

<!---
The most
recent evaluation report
[is available for download][cloud-security-eval].
This link is currently timing out.
-->

Aiven is fully GDPR-compliant, and has executed data processing agreements
(DPAs) with relevant cloud infrastructure providers. If you require a DPA, or if
you want more information about information security policies,
[contact Timescale][timescale-support].

<!---
[cloud-security-eval]: https://www.elfgroup.fi/ecc/1708-S6-71acd0046.pdf
-->

[timescale-support]: https://www.timescale.com/contact/
