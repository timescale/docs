# Migrating a service between networks

Timescale Cloud services may be migrated between VPCs within a Cloud project, and may also
be migrated to and from the public network. Typically, once you have attached your service
to a VPC, it should remain attached to ensure that your applications running in your AWS
VPC have continued connectivity to your service.

<highlight type="warning">
Timescale Cloud uses a different DNS name for a Timescale service once it has been attached
to a VPC. This means that you need to update your connection string if migrating a service
from the public internet into a VPC, or vice-versa.
</highlight>

To migrate a Timescale Cloud service between VPCs, or to migrate to/from the public network,
navigate to the [Services Dashboard](https://console.cloud.timescale.com/dashboard/services),
select the service you wish to migrate, click the `Operations` tab in the service details view,
and click the `VPC` tab within the `Operations` view. From this view, you have a few options
depending on the state of your service.

<highlight type="warning">
After migrating your Timescale Cloud service, please allow a few minutes for DNS
propagation. If you receive DNS errors indicating that the DNS name could not be resolved,
this indicates that more time is needed for DNS propagation.
</highlight>

## Migrate from public network to VPC
When your service is attached to the public network, you have the option to select a VPC
to migrate your service into.

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/timescale-forge/migrate-public-to-vpc.png" alt="Migrate from public network to VPC"/>

Once you have selected the VPC to migrate your service into, click `Attach VPC`.
You are then prompted to confirm the migration.

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/timescale-forge/migrate-public-to-vpc-confirm.png" alt="Confirm migration into VPC"/>

After confirming the migration, your service is attached to the VPC you selected.
**These operations are not immediate, and also involve DNS changes which may take a few
minutes to propagate.**

As mentioned on the confirmation modal, you need to update your connection string
in order to connect to your service after migration. The `Service URL` back on the
service details page is already updated to include the new DNS info, and should be used
for connecting to your service.

<highlight type="tip">
When migrating your service into a VPC, ensure that your AWS VPC's security groups
allow network access from your AWS VPC to the Cloud VPC which your service has
migrated into. Security group configuration was previously covered as part of
peering connection setup. Double-check to be sure, otherwise you can't
connect to your Timescale Cloud service.
</highlight>

## Migrate between VPCs
When your service is already attached to a VPC, you have the option to migrate
it to another VPC within the same project.

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/timescale-forge/migrate-between-vpcs.png" alt="Migrate between VPCs"/>

To migrate between VPCs, expand the `Migrate into another VPC` menu and select the VPC
to migrate your service to. Then click `Migrate`. You are prompted to confirm
the migration.

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/timescale-forge/migrate-between-vpcs-confirm.png" alt="Migrate between VPCs confirmation"/>

After confirming the migration, your service is detached from its previous VPC
and attached to the new VPC you selected.

In the case of VPC to VPC migration, the `Service URL` connection string is not
updated, only the IP address which the DNS name is associated with is updated.
**Please allow a few minutes for the DNS record changes to propagate.**

<highlight type="tip">
When migrating your service between VPCs, ensure that your AWS VPC's security groups
allow network access from your AWS VPC to the Cloud VPC which your service has
migrated into. Security group configuration was previously covered as part of
peering connection setup. Double-check to be sure, otherwise you can't
connect to your Timescale Cloud service.
</highlight>

### Migrate back to public network
When your service is already attached to a VPC, you have the option to migrate
it back to the public network.

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/timescale-forge/migrate-back-to-public.png" alt="Migrate back to public network"/>

To migrate your service back to the public network, click `Migrate back to public network`.
You are prompted to confirm the migration.

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/timescale-forge/migrate-back-to-public-confirm.png" alt="Migrate back to public network confirm"/>

After confirming the migration, your service is detached from its previous VPC
and made accessible over the public internet.

As mentioned on the confirmation modal, you need to update your connection string
in order to connect to your service after migration. The `Service URL` back on the
service details page is already updated to include the new DNS info, and should be used
for connecting to your service.
