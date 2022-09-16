---
title: Service settings - Advanced parameters
excerpt: Configure advanced parameters for your Timescale Cloud service
product: cloud
keywords: [services, settings]
tags: [configuration, schemas]
---

# Service settings - advanced parameters

It is possible to configure a wide variety of service database parameters
by toggling `Show advanced parameters` in the upper-right corner of the
`Settings` tab.

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tsc-settings-advanced.png" alt="View Timescale Cloud advanced configuration parameters"/>

The advanced parameters are displayed in a scrollable and searchable list:

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tsc-settings-search.png" alt="Search Timescale Cloud configuration parameters"/>

As with the basic database configuration parameters, any changes are highlighted
and the `Apply changes`, or `Restart and apply changes`, button is available,
prompting you to confirm changes before the service is modified.

## Multiple databases

To create more than one Timescale Cloud database, you need to create a new
service for each database. Timescale Cloud does not support multiple
databases within the same service. Having a separate service for each database
affords each database its own isolated resources.

Another option is to use
[schemas](https://www.postgresql.org/docs/current/ddl-schemas.html).
Schemas provide a way to organize tables into logical groups. A single
database can contain multiple schemas, which in turn contain tables.
The main difference between isolating with databases versus schemas
is that a user can access objects in any of the schemas in the database
they are connected to, so long as they have the corresponding privileges.
Schemas can help isolate smaller use cases that do not warrant their
own service.
