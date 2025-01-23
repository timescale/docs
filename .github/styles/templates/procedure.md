---
title: Verb \<what the user will do>
excerpt: SEO friendly explanation of why the user will do it
keywords: [noun, verb, ]
tags: [noun, noun]
---
<!-- Add any imports here -->
import Skip from "versionContent/_partials/_selfhosted_cta.mdx";
import SelfHostedDebianBased from "versionContent/_partials/_install-self-hosted-debian-based.mdx";

# Verb \<what the user will do>

One or two sentences explaining how something works and why you would follow the procedure 
in this page

Either and architecture diagram showing how the infrastructure works: 

<img class="main-content__illustration"
src="https://assets.timescale.com/docs/images/tsc-vpc-architecture.svg"
alt="The AWS Security Groups dashboard"/>

Or a [workflow diagram][workflow-diagram] explaining the choices to be made or the user interaction 
implemented in the page. 

If necessary, a paragraph or two explaining more about how things work. 

This section shows you how to:

* [Verb \<what the user will do>](#verb-what-the-user-will-do) 
* [Verb \<what the user will do if the procedure is cut into logical sections>](#verb-what-the-user-will-do-if-the-procedure-is-cut-into-logical-sections) 

## Prerequisites

In order to \<a couple of words that sound like the title> you need the following:

*  A [Timescale Cloud service][create-a-service]
*  If you are using this template to write a new document, see some good doc examples:
   * [Create your first Timescale service][create-a-service]
   * [Secure your Timescale Service with VPC Peering and AWS PrivateLink][secure-vpc-aws]
   * [Install TimescaleDB on Linux][install-linux]
* Read the [Google Developer Style Guide][gdsg] 
* ...

Notice the list items start with a capital letter, but do not end with a full stop. 

## Verb \<what the user will do in this section>

Intro sentence. The title should explain what the user will do in this section.
Use this sentence to either give a small explanation of the architecture or 
workflow, or just an intro sentence.

<Procedure>

1. **Do this**

   Take care for spacing and indentation: 
   ```java
   // Maybe a code example
   ```
1. **Then that**
   1. Could be. 
   1. Substeps.
   1. Using autonumbering.  
1. **Until the doing is done** 

   You may need to add a sentence to explain what the user does in more detail:

      ```java
   // Maybe a code example
   ```
   
You have \<what the user will do in this section>.

## Verb \<what the user will do if the procedure is cut into logical sections>

Intro sentence. This section shows how to use tabs to show multiple implementations
of the same thing:

<Tabs label="Install TimescaleDB">

<Tab title="Platform, product or reason ">

1. **Do this**

    Code example or procedure 
2. **Then that**

   Code example or procedure
</Tab>

<Tab title="Platform, product or reason">

<SelfHostedDebianBased />

</Tab>

</Tabs>

You have \<what the user will do in this section>.

<!-- Add links here as variables -->
[workflow-diagram]: https://plantuml.com/activity-diagram-beta
[create-a-service]: /getting-started/:currentVersion:/services
[secure-vpc-aws]: /use-timescale/:currentVersion:/vpc/
[install-linux]: /self-hosted/:currentVersion:/install/installation-linux/
[gdsg]: https://developers.google.com/style/highlights