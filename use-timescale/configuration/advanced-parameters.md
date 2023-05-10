---
title: Advanced parameters
excerpt: Configure advanced parameters for your Timescale service
products: [cloud]
keywords: [services, settings]
tags: [configuration, schemas]
cloud_ui:
    path:
        - [services, :serviceID, operations, database_parameters]
---

# Advanced parameters

It is possible to configure a wide variety of service database parameters by
navigating to the `Advanced parameters` tab under the `Database
configuration` heading.

<img class="main-content__illustration"
src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tsc-settings-advanced.png"
alt="View Timescale advanced configuration parameters"/>

The advanced parameters are displayed in a scrollable and searchable list:

<img class="main-content__illustration"
src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tsc-settings-search.png"
alt="Search Timescale configuration parameters"/>

As with the basic database configuration parameters, any changes are highlighted
and the `Apply changes`, or `Apply changes and restart`, button is available,
prompting you to confirm changes before the service is modified.

## Multiple databases

To create more than one Timescale database, you need to create a new
service for each database. Timescale does not support multiple
databases within the same service. Having a separate service for each database
affords each database its own isolated resources.

You can also use [schemas][schemas] to organize tables into logical groups. A
single database can contain multiple schemas, which in turn contain tables. The
main difference between isolating with databases versus schemas is that a user
can access objects in any of the schemas in the database they are connected to,
so long as they have the corresponding privileges. Schemas can help isolate
smaller use cases that do not warrant their own service.

[schemas]: /use-timescale/:currentVersion:/schema-management/
