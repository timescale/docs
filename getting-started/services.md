---
title: Timescale services
excerpt: Sign up for Timescale and create your first service
products: [cloud]
layout_components: [next_prev_large]
content_group: Getting started
---

import Install from "versionContent/_partials/_cloud-installation.mdx";
import CreateService from "versionContent/_partials/_cloud-create-service.mdx";
import Connect from "versionContent/_partials/_cloud-connect.mdx";
import CloudIntro from "versionContent/_partials/_cloud-intro.mdx";

# Timescale services

<CloudIntro />

In the Timescale console, you create a service to house your Timescale
database. Each service contains a single database. If you need more
databases, you can create additional services for each.

When you create a new service, a new `tsdbadmin` user is created. This is your
administration user that you can connect to your database with.

The Timescale Service Explorer shows you all the information about your service,
including the tables you have created, how much data has been ingested, and
additional information like compression, policies, and continuous aggregates.

When you have your service up and running, you can use a tool like `psql` to
connect to it from the command prompt on your local machine. You can then use
`psql` to create tables and add data directly into your database.

In this section, you sign up for a Timescale account, create a service, and
connect to it from your local machine using `psql`. Don't forget to download the
cheat sheet when you create your service, it contains important information that
you need later on.

For more information, see
[the services section][services-how-to].

<Collapsible heading="Create your Timescale account" defaultExpanded={false}>

Before you can create your first service, you need to sign up for a free
Timescale account.

### Creating your Timescale account

<Install />

</Collapsible>

<Collapsible heading="Create your first service" defaultExpanded={false}>

Create a service to use for the tasks in this guide. A service in Timescale is a
cloud instance which contains your database. You can use the default values when
you create your service, which sets up a single database, named `tsdb`.

### Creating your first service

<CreateService demoData={false} />

</Collapsible>

## Connect to your service

When you have a service up and running, you can connect to it from your local
system using the `psql` command-line utility. If you've used PostgreSQL before,
you might already have `psql` installed. If not, check out the
[installing psql][install-psql] section.

<Collapsible heading="Connecting to your service" headingLevel={3}>

<Connect />

</Collapsible>

[services-how-to]: /use-timescale/:currentVersion:/services/
[install-psql]: /use-timescale/:currentVersion:/integrations/query-admin/psql/
