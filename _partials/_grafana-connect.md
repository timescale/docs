
## Add Timescale as a data source in Grafana

You can use Grafana to visualize queries directly from your Timescale database.

Before you begin, make sure you have:

*   Created a [Timescale Cloud][cloud-login] service.
*   Installed a self-managed Grafana account, or signed up for
    [Grafana Cloud][install-grafana].
*   Found the connection details for the database you want to use as a data source.
    For Timescale Cloud, the details are contained in the cheatsheet you
    downloaded when you created the service.

<Highlight type="cloud" header="Run all tutorials free" button="Try for free">
Your Timescale Cloud trial is completely free for you to use for the first
thirty days. This gives you enough time to complete all the tutorials and run
a few test projects of your own.
</Highlight>

<Tabs label="Add Timescale as a data source in Grafana">

<Tab title="Self-hosted Grafana">

<Procedure>

### Adding Timescale as a data source in self-hosted Grafana

1.  In your web browser, log in to the Grafana dashboard at
    `http://localhost:3000/`. The default username is `admin` with a default
    password of `admin`.
1.  In the Grafana dashboard, navigate to `Configuration` → `Data sources`.
    Click `Add data source`.
1.  In the `Add data source` page, search for PostgreSQL, and select it.
1.  Configure the data source using your connection details:
    *   In the `Name` field, type a name to use for the dataset.
    *   In the `Host` field, type the host and port for your connection, in this
        format: `<HOST>:<PORT>`. For example,
        `example.tsdb.cloud.timescale.com:35177`.
    *   In the `Database` field, type `tsdb`.
    *   In the `User` field, type `tsdbadmin`, or another privileged user.
    *   In the `Password` field, type the password.
    *   In the `TLS/SSL Mode` field, select `require`
    *   In the `PostgreSQL details` section, toggle `TimescaleDB` on.
    *   All other fields can be left as default values.
1.  Click `Save & test` to check your details have been set correctly.

</Procedure>

</Tab>

<Tab title="Grafana Cloud">

<Procedure>

### Adding Timescale as a data source in Grafana Cloud

1.  In your web browser, log in to the Grafana dashboard with the URL and
    credentials you set when you created your account.
1.  In the Grafana dashboard, navigate to `Configuration` → `Data sources`.
    Click `Add new data source`.
1.  In the `Add data source` page, search for PostgreSQL, and select it.
1.  Configure the data source using your connection details:
    *   In the `Name` field, type a name to use for the dataset.
    *   In the `Host` field, type the host and port for your connection, in this
        format: `<HOST>:<PORT>`. For example,
        `example.tsdb.cloud.timescale.com:35177`.
    *   In the `Database` field, type `tsdb`.
    *   In the `User` field, type `tsdbadmin`, or another privileged user.
    *   In the `Password` field, type the password.
    *   In the `TLS/SSL Mode` field, select `require`
    *   In the `PostgreSQL details` section, toggle `TimescaleDB` on.
    *   All other fields can be left as default values.
1.  Click `Save & test` to check your details have been set correctly.

</Procedure>

</Tab>

</Tabs>

[install-grafana]: https://grafana.com/get/
[cloud-login]: https://console.cloud.timescale.com/
