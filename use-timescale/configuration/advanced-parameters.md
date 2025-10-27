---
title: Advanced parameters
excerpt: Configure advanced parameters for your Tiger Cloud service in Tiger Cloud Console
products: [cloud]
keywords: [services, settings]
tags: [configuration, schemas]
cloud_ui:
    path:
        - [services, :serviceId, operations, database_parameters]
---

import ConfigCloudSelf from "versionContent/_partials/_cloud_self_configuration.mdx";

# Advanced parameters

It is possible to configure a wide variety of $SERVICE_LONG database parameters by
navigating to the `Advanced parameters` tab under the `Database
configuration` heading. The advanced parameters are displayed in a scrollable and searchable list.

![Database configuration advanced parameters](https://assets.timescale.com/docs/images/database-configuration-advanced-parameters.png)

As with the basic database configuration parameters, any changes are highlighted
and the `Apply changes`, or `Apply changes and restart`, button is available,
prompting you to confirm changes before the $SERVICE_SHORT is modified.

## Multiple databases

To create more than one database, you need to create a new
$SERVICE_SHORT for each database. $CLOUD_LONG does not support multiple
databases within the same $SERVICE_SHORT. Having a separate $SERVICE_SHORT for each database
affords each database its own isolated resources.

You can also use [schemas][schemas] to organize tables into logical groups. A
single database can contain multiple schemas, which in turn contain tables. The
main difference between isolating with databases versus schemas is that a user
can access objects in any of the schemas in the database they are connected to,
so long as they have the corresponding privileges. Schemas can help isolate
smaller use cases that do not warrant their own $SERVICE_SHORT.

<ConfigCloudSelf />


[schemas]: /use-timescale/:currentVersion:/schema-management/
