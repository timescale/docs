
# Integrate Managed Service for TimescaleDB and Google Data Studio

You can create reports or perform some analysis on data you have in Managed
Service for TimescaleDB using Google data studio. You can use Data studio to
integrate other data sources such as, YouTube Analytics, MySQL, BigQuery,
AdWords, and others.

## Before you begin

*   You should also have a Google account.
*   In the service overview page of the Managed Service for TimescaleDB service:
    *   Download he CA certificate anmed `ca.pem` for your Managed Service for
        TimescaleDB service.
    *   Make a note of the `Host`, `Port`, `Database name`, `User`, and `Password`
        fields for the Managed Service for TimescaleDB service.

<Procedure>

### Connecting to Managed Service for TimescaleDB datasource from Data Studio

1.  Login to Google and open [Google Data Studio][google-data-studio].
1.  Click the `Create` + button and choose `Data source`.
1.  Select the `PostgreSQL` as Google Connector.
1.  In the `Database Authentication` tab, type details for the `Host Name`,
    `Port`, `Database`, `Username`, and `Password` fields.
1.  Select `Enable SSL` and upload your server certificate file, `ca.pem`.
1.  Click `AUTHENTICATE`.
1.  Choose the table to be queried, or select `CUSTOM QUERY` to create an SQL query.
1.  Click `CONNECT`.

</Procedure>

[google-data-studio]: https://datastudio.google.com/
