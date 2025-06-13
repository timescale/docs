---
title: Integrate Managed Service for TimescaleDB and Google Data Studio
excerpt: Integrate Google Data Studio with Managed Service for TimescaleDB
products: [mst]
keyword: [integration]
---

# Integrate $MST_LONG and Google Data Studio

You can create reports or perform some analysis on data you have in $MST_LONG using Google Data Studio. You can use Data Studio to
integrate other data sources, such as YouTube Analytics, MySQL, BigQuery,
AdWords, and others.

## Before you begin

*   You should also have a Google account.
*   In the overview page of your $MST_SERVICE_LONG:
    *   Download the CA certificate named `ca.pem` for your $MST_SERVICE_SHORT.
    *   Make a note of the `Host`, `Port`, `Database name`, `User`, and `Password`
        fields for the $MST_SERVICE_SHORT.

<Procedure>

### Connecting to $MST_LONG data source from Data Studio

1.  Log in to Google and open [Google Data Studio][google-data-studio].
1.  Click the `Create +` button and choose `Data source`.
1.  Select `PostgreSQL` as the Google Connector.
1.  In the `Database Authentication` tab, type details for the `Host Name`,
    `Port`, `Database`, `Username`, and `Password` fields.
1.  Select `Enable SSL` and upload your server certificate file, `ca.pem`.
1.  Click `AUTHENTICATE`.
1.  Choose the table to be queried, or select `CUSTOM QUERY` to create an SQL query.
1.  Click `CONNECT`.

</Procedure>

[google-data-studio]: https://datastudio.google.com/
