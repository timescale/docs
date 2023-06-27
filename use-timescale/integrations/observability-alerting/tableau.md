---
title: Using Tableau to visualize data in TimescaleDB
excerpt: Use Tableau to plot and visualize your data
products: [cloud, mst, self_hosted]
keywords: [visualizations, analytics, Tableau]
---

# Using Tableau to visualize data in TimescaleDB

[Tableau][get-tableau] is a popular analytics platform that helps you gain
greater intelligence about your business. It is an ideal tool for visualizing
data stored in Timescale.

## Prerequisites

Before you begin, make sure you have:

*   Created a [Timescale][cloud-login] service.
*   Signed up for [Tableau][get-tableau].
*   Found the connection details for the database you want to use as a data
    source. The details are contained in the cheatsheet you downloaded when you
    created the service.

## Add Timescale as a virtual connection in Tableau

<Highlight type="cloud" header="Run all tutorials free" button="Try for free">
Your Timescale trial is completely free for you to use for the first
thirty days. This gives you enough time to complete all the tutorials and run
a few test projects of your own.
</Highlight>

<Procedure>

### Adding Timescale as a virtual connection in Tableau

1.  In your web browser, open your Tableau Cloud dashboard using the username
    and password you set when you signed up.
1.  In the Tableau dashboard, click the `New` dropdown, and select
    `Virtual Connection`.
1.  In the `New Virtual Connection` page, search for PostgreSQL, and select it.
1.  Configure the virtual connection using your connection details:
    *   In the `Server` field, type the hostname of your database.
    *   In the `Port` field, type the port number for your connection.
    *   In the `Database` field, type `tsdb`.
    *   In the `Username` field, type `tsdbadmin`, or another privileged user.
    *   In the `Password` field, type the password.
    *   Check the `Require SSL` checkbox.
1.  Click `Sign in` to connect your database.

</Procedure>

[get-tableau]: https://www.tableau.com/products/trial/
[cloud-login]: https://console.cloud.timescale.com/
