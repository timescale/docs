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
cheatsheet when you create your service, it contains important information that
you need later on.

For more information, see
[the services section][services-how-to].

## Create your Timescale account

<Collapsible heading="Creating your Timescale account" defaultExpanded={false}>

<Install />

</Collapsible>

## Create your first service

Create a service to use for the tasks in this guide. You can use the default values.

<Collapsible heading="Creating your first service" defaultExpanded={false}>

<CreateService demoData={false} />

</Collapsible>

## Connect to your service

<Collapsible heading="Connecting to your service">

<Connect />

</Collapsible>

[services-how-to]: /use-timescale/:currentVersion:/services/
