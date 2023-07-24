---
title: Cloud regions
excerpt: Manage clouds and regions for your Managed Service for TimescaleDB project
products: [mst]
keywords: [manage, regions]
tags: [admin, regions, aws, azure, gcp]
---

# Clouds and regions

Managed Service for TimescaleDB is available in these clouds and regions:

Amazon Web Services:

|Region|Zone|Location|
|-|-|-|
|`timescale-aws-af-south-1`|Africa|Cape Town|
|`timescale-aws-ap-east-1`|Asia|Hong Kong|
|`timescale-aws-ap-northeast-1`|Asia|Tokyo|
|`timescale-aws-ap-northeast-2`|Asia|Seoul|
|`timescale-aws-ap-south-1`|Asia|Mumbai|
|`timescale-aws-ap-southeast-1`|Asia|Singapore|
|`timescale-aws-ap-southeast-3`|Asia|Jakarta|
|`timescale-aws-me-south-1`|Asia|Bahrain|
|`timescale-aws-ap-southeast-2`|Australia|Sydney|
|`timescale-aws-ca-central-1`|Canada|Quebec|
|`timescale-aws-eu-central-1`|Europe|Frankfurt|
|`timescale-aws-eu-north-1`|Europe|Stockholm|
|`timescale-aws-eu-south-1`|Europe|Milan|
|`timescale-aws-eu-west-1`|Europe|Ireland|
|`timescale-aws-eu-west-2`|Europe|London|
|`timescale-aws-eu-west-3`|Europe|Paris|
|`timescale-aws-sa-east-1`|South America|Brazil|
|`timescale-aws-us-east-1`|United States|North Virginia|
|`timescale-aws-us-east-2`|United States|Ohio|
|`timescale-aws-us-west-1`|United States|North California|
|`timescale-aws-us-west-2`|United States|Oregon|

Google Cloud:

|Region|Zone|Location|
|-|-|-|
|`timescale-google-asia-east1`|Asia|Taiwan|
|`timescale-google-asia-east2`|Asia|Hong Kong|
|`timescale-google-asia-northeast1`|Asia|Tokyo|
|`timescale-google-asia-northeast2`|Asia|Osaka|
|`timescale-google-asia-northeast3`|Asia|Seoul|
|`timescale-google-asia-south1`|Asia|Mumbai|
|`timescale-google-asia-southeast1`|Asia|Singapore|
|`timescale-google-australia-southeast1`|Australia|Sydney|
|`timescale-google-northamerica-northeast1`|Canada|Quebec|
|`timescale-google-europe-north1`|Europe|Finland|
|`timescale-google-europe-west1`|Europe|Belgium|
|`timescale-google-europe-west2`|Europe|London|
|`timescale-google-europe-west3`|Europe|Frankfurt|
|`timescale-google-europe-west4`|Europe|Netherlands|
|`timescale-google-europe-west6`|Europe|Zurich|
|`timescale-google-southamerica-east1`|South America|Sao Paulo|
|`timescale-google-us-central1`|United States|Iowa|
|`timescale-google-us-east1`|United States|South Carolina|
|`timescale-google-us-east4`|United States|Northern Virginia|
|`timescale-google-us-west1`|United States|Oregon|
|`timescale-google-us-west2`|United States|Los Angeles|
|`timescale-google-us-west3`|United States|Salt Lake City|
|`timescale-google-us-west4`|United States|Las Vegas|

Microsoft Azure:

|Region|Zone|Location|
|-|-|-|
|`timescale-azure-south-africa-north`|Africa|South Africa North|
|`timescale-azure-india-central`|Asia|Central India|
|`timescale-azure-india-south`|Asia|South India|
|`timescale-azure-india-west`|Asia|West India|
|`timescale-azure-japaneast`|Asia|Japan East|
|`timescale-azure-japanwest`|Asia|Japan West|
|`timescale-azure-korea-central`|Asia|Korea Central|
|`timescale-azure-korea-south`|Asia|Korea South|
|`timescale-azure-southeastasia`|Asia|Singapore|
|`timescale-azure-australiaeast`|Australia|New South Wales|
|`timescale-azure-australiasoutheast`|Australia|Victoria|
|`timescale-azure-canadacentral`|Canada|Ontario|
|`timescale-azure-canadaeast`|Canada|Quebec|
|`timescale-azure-france-central`|Europe|France Central|
|`timescale-azure-germany-westcentral`|Europe|Germany West Central|
|`timescale-azure-northeurope`|Europe|Ireland|
|`timescale-azure-switzerland-north`|Europe|Switzerland|
|`timescale-azure-uksouth`|Europe|England|
|`timescale-azure-ukwest`|Europe|Wales|
|`timescale-azure-westeurope`|Europe|Netherlands|
|`timescale-azure-uae-north`|Middle East|United Arab Emirates|
|`timescale-azure-brazilsouth`|South America|Brazil|
|`timescale-azure-centralus`|United States|Iowa|
|`timescale-azure-eastus`|United States|Virginia|
|`timescale-azure-eastus2`|United States|Virginia|
|`timescale-azure-northcentralus`|United States|Illinois|
|`timescale-azure-southcentralus`|United States|Texas|
|`timescale-azure-westcentralus`|United States|Wyoming|
|`timescale-azure-westus`|United States|California|
|`timescale-azure-westus2`|United States|Washington|

## Migrate to a different cloud or region

You can move your service to a different cloud or region at any time. The
service is rebuilt in the new region in the background. When the service has
been rebuilt in the new region, the DNS records are updated. This could cause a
short interruption to your service while the DNS changes are propagated.

<Procedure>

### Migrating to a different cloud or region

1.  Sign in to the Managed Service for TimescaleDB portal.
1.  In the `Services` tab, find the service you want to configure, and check
    it is marked as `Running`.
1.  In the services `Overview` page, navigate to the `Cloud and VPC` section.
    This lists the current cloud and region in use by the service. Click
    `Migrate cloud`.
1.  In the `Migrate service to another cloud` dialog, select the new cloud
    provider and region. Click `Migrate`.

<Highlight type="important">
The service is rebuilt in the new region in the background. When the service has
been rebuilt in the new region, the DNS records are updated. This could cause a
short interruption to your service while the DNS changes are propagated.
</Highlight>

</Procedure>
