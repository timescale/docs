# VPC Peering

Virtual Private Cloud (VPC) peering is a method of connecting separate AWS or 
Google Cloud private networks to each other. It makes it possible for the virtual
machines in the different VPC's to talk to each other directly without going 
through the public internet.

VPC peering setup is a per project and per region setting. This means that all 
services created and running utilize the same VPC peering connection. If needed, 
you can have multiple projects that peer with different connections.

<highlight type="tip">
Services are only accessible via your VPC's internal network, they are not 
accessible from the public internet TLS certificates for VPC peered services 
are signed by the Timescale project CA and cannot be validated against a public 
CA (Let's Encrypt) You can choose service-by-service whether you want to run on 
VPC peered network or on public internet.
</highlight>

## Setting it up
In order to set up a VPC peering for your Timescale Cloud project please submit 
a request in the Timescale Cloud VPC section.

When creating a new service, you can choose whether the service will be placed 
in a VPC or not: The list of cloud providers and regions contains options like 
"Belgium - Google Cloud: Belgium" and "Belgium - Google Cloud: Belgium - Project 
VPC". Here selecting the former would create the service to non-VPC environment 
while the latter would place the service within the VPC. The same functionality 
is available with the "Migrate" feature, allowing moving a service to / from a VPC.

The IP Range should be chosen so that it doesn't overlap with any networks you 
wish to peer. For example, if your own networks use the 10.0.0.0/8 range, 
selecting 192.168.0.0/24 for your Timescale project VPC makes it possible to 
peer the networks.

Peering connections can be requested with the VPC request, or added later. Note 
however that the VPC is not accessible until at least one connection has been created.

After the request has been submitted VPC peering will be automatically set up by 
Timescale Cloud, and the status is updated in the web console's VPC view together 
with instructions for starting peering with our network. Note that you'll need 
to accept a VPC peering connection request (AWS) or create a corresponding 
peering from your project to Timescale Cloud's (Google) before Timescale Cloud's 
backend can notice the peering is ready and traffic can be routed through it. 
After setting up your side, the VPC peering will activate shortly on the Timescale 
Cloud console.