---
title: PopSQL
excerpt: Use PopSQL to run SQL queries, create charts and dashboards, and collaborate with teammates.
keywords: [popsql, sql editor, chart, dashboard]
---

# PopSQL

Outline:

- What is PopSQL and what are the benefits
- How to use it

  - Open the Timescale Console, choose a project, click PopSQL
  - You may be prompted to re-authenticate with Timescale
  - You'll be asked to confirm that you want to create a PopSQL account
    - This will create a new PopSQL user account for you. If you already have a PopSQL user account with the same Timescale email address, we'll use that existing PopSQL account.
    - If it's your first time going through this flow, this will create a new PopSQL org associated to your Timescale project
    - If another user does this in the future, they'll simply join the existing org
  - You'll be asked to choose a service, and enter its credentials
  - At this point, you're connected! Run a sample query like `select 1`

- Links to the PopSQL website and docs

## FAQ

### How do I access PopSQL?

- Header: After dismissing the banner, there will still be a PopSQL button within the header to take you through the flow.
- You can go to “Project settings” and click the button under “PopSQL Integration”.
  - Doing this will resync your Timescale project with your PopSQL organization, adding any new services that might have been created. You will skip the screens shown in steps (3) and (4) as well.

### What if my service is within a VPC?

If you run your service within a VPC, you will need to either:

- Use PopSQL's [bridge connector](https://docs.popsql.com/docs/bridge-connector)
- Use an SSH tunnel
  - When configuring the connection in PopSQL, under Advanced, you'll see SSH options
- Add PopSQL's static IPs (`23.20.131.72, 54.211.234.135`) to your allowlist

### What happens if another member of my Timescale project opens PopSQL?

They will have a PopSQL user account created for them and be automatically added to the PopSQL organization you created. They will need to input their own credentials for each service/connection, unless you [share the connection within PopSQL](https://docs.popsql.com/docs/shared-connections).

### Will using PopSQL affect the performance of my Timescale service?

There are a few factors to consider:

1. What instance size is your database?
1. How many users are running queries?
1. How computationally intensive are the queries?

If you have a small number of users running performant SQL queries against a service with sufficient resources, then there should be no degradation to performance.

However, if you have a large number of users running queries, or if the queries are computationally expensive, then you'll likely want to create a replica and send analytical queries there instead.

If you'd like to prevent write operations (e.g. insert, update, etc), instead of using the `tsdbadmin` superuser, create a read-only user for your service and use that within PopSQL.

### How does pricing work?

Timescale Cloud customers get PopSQL's Business plan for free for up to 10 users. Please refer to [PopSQL's Pricing page](https://popsql.com/pricing) for full details.
