# Exploring Managed Service for TimescaleDB

Welcome to managed service for TimescaleDB. Managed service for TimescaleDB is a managed TimescaleDB service hosted
in 75+ regions in AWS, Azure, or GCP. You can [try managed service for TimescaleDB for free][sign-up],
no credit card required.

Powered by [TimescaleDB][timescale-features], you can create database instances in the
cloud and automate many of your most common operational tasks. This allows you
to spend more time focusing on your time-series workloads and less time worrying
about database management.

Before we start, let's review a few core concepts and phrases:

- **Account**: Your managed service for TimescaleDB account. You can register for a managed service for TimescaleDB account on the [managed service for TimescaleDB signup][sign-up] page.
- **Project**: An empty Project is created for you automatically when you sign-up. Projects organize groups of Services, and have different billing settings. You can use Projects as a way to organize Services in your account and provide access to those Services with other users.
- **Service**: A Service is an instance that corresponds to a cloud service provider tier (for example, AWS Timescale-Pro-512-IO-Optimized). You can access all your Services from the 'Services' tab for a given Project.
- **Database**: Databases are created within a Service. You can view and create a Database within a Service by selecting one of your Services, and then selecting the 'Databases' tab.
- **Service Plans**: A Service Plan defines the configuration and level of database management that are performed for a given TimescaleDB deployment.

### Step 1: Sign up for managed service for TimescaleDB

Visit the [managed service for TimescaleDB signup page][sign-up] and supply your name, email address, and password.

Once you've submitted the information, verify your account by clicking on the link in the
email you receive. If you don't receive this email shortly after submitting the form,
check your spam folder.

### Step 2: Create your first service

After you complete account verification, you can visit the [managed service for TimescaleDB portal][mst-portal]
and login with your credentials.

You can create a new service by clicking on the `Create a new service` button.

In the resulting screen, you'll see several options that enable you to choose:

- **Service type**. Today, we support TimescaleDB and Grafana services.
- **Cloud provider**. We support Amazon Web Services, Google Cloud, or Microsoft Azure.
- **Cloud region**. We support most cloud regions offered by each cloud provider.
- **Service plan**. We support many common configurations of CPU, memory, storage, backup, and nodes. *If you're still a managed service for TimescaleDB trial user*, we recommend using the `Dev` plan as it is most cost effective during your evaluation period.

<highlight type="tip">
During your managed service for TimescaleDB trial, you have up to $300 USD in credits to use.
This is sufficient to complete all our tutorials and run a few test projects.
</highlight>

If you're interested in learning more about pricing of managed service for TimescaleDB, visit the
[managed service for TimescaleDB pricing calculator][timescale-pricing]. Or, [contact us][contact]
and we are happy to walk you through the best managed service for TimescaleDB configuration
for your use cases.

Once you've selected your service options, click `Create Service`.

It takes a few minutes for your service to provision in your cloud. Now is
a good time to familiarize yourself with some of the [features of TimescaleDB][using-timescale]
and our [getting started tutorial][getting-started].

### Step 3: Install psql

Nearly all of our tutorials require some working knowledge of `psql`, the command-line
utility for configuring and maintaining PostgreSQL. We recommend
[installing psql][install-psql].

### Step 4: Connect to your database using psql

You can see a green `Running` label and a green dot under the "Nodes" column when
your instance is ready for use.

Once your instance is ready, navigate to the 'Overview Tab' of your Timescale
Cloud dashboard and locate your `host`, `port`, and `password`, as highlighted below.

<img class="main-content__illustration" src="https://s3.amazonaws.com/docs.timescale.com/hello-timescale/NYC_figure1_1.png" alt="NYC Taxis"/>

Afterward, connect to your managed service for TimescaleDB database from `psql`
by typing the command below into your terminal,
ensuring that you replace the {curly brackets} with your real
password, hostname, and port number found in the overview tab.

```bash
psql -x "postgres://tsdbadmin:{YOUR_PASSWORD_HERE}@{YOUR_HOSTNAME_HERE}:{YOUR_PORT_HERE}/defaultdb?sslmode=require"
```

You should see the following connection message:

```bash
psql (12.2, server 11.6)
SSL connection (protocol: TLSv1.3, cipher: TLS_AES_256_GCM_SHA384, bits: 256, compression: off)
Type "help" for help.
tsdbadmin@defaultdb=>
```

### Step 5: Verify that TimescaleDB is installed

To verify that TimescaleDB is installed, run the `\dx` command
to list all installed extensions to your PostgreSQL database.
You should see something similar to the following output:

```sql
                  List of installed extensions
| Name        | Version | Schema     | Description                                  |
|-------------|---------|------------|----------------------------------------------|
| plpgsql     | 1.0     | pg_catalog | PL/pgSQL procedural language                 |
| timescaledb | 1.6.0   | public     | Enables scalable inserts and complex queries |
```

### Step 6: Hello, Timescale!

Congratulations! You are now up and running with managed service for TimescaleDB. In order to
familiarize yourself with the features and capabilities of the product, we
recommend that you complete the [Getting Started][getting-started] tutorial.

---

## Advanced managed service for TimescaleDB Configuration

### Securing network access to managed service for TimescaleDB

One very critical piece of securing your database within managed service for TimescaleDB is network protection.

TimescaleDB provides the ability to configure, in a fine-grained manner, the
set of source IP addresses and ranges, as well as connection ports, that can
access your managed service for TimescaleDB services.

This tutorial walks you through how to configure this capability.

#### Before you start

Be sure to follow the instructions to [setup managed service for TimescaleDB][mst-install] in order to
get signed up and create your first database instance.

#### Step 1 - Navigate to your TimescaleDB instance

Once you have a database instance setup in the [managed service for TimescaleDB portal][mst-portal],
browse to this service and click on the 'Overview' tab. In the 'Connection Information'
section, you can see the port number that is used for database connections. This is
the port we are protecting by managing inbound access.

<img class="main-content__illustration" src="https://assets.iobeam.com/images/docs/screenshots-for-securing-timescale-cloud/overview-tab.png" alt="Timescale Cloud Overview tab"/>

#### Step 2 - Find the allowed IP addresses section

Scroll down to find the 'Allowed IP Addresses' section. By default, this value is set to
`0.0.0.0/0` which is actually wide-open.

<highlight type="warning">
 This wide-open setting simplifies getting started since it accepts incoming
 traffic from all sources, but you absolutely want to narrow this range.
</highlight>

If you are curious about how to interpret this [Classless Inter-Domain Routing][cidr-wiki] (CIDR) syntax,
check out [this great online tool][cidr-tool] to help decipher CIDR.

<img class="main-content__illustration" src="https://assets.iobeam.com/images/docs/screenshots-for-securing-timescale-cloud/allowed-ip.png" alt="Allowed IP addresses"/>

#### Step 3 - Change the allowed IP addresses section

Click 'Change' and adjust the CIDR value based on where your source traffic comes from.
For example, entering a value of `192.168.1.15/32` ONLY allows incoming traffic from a
source IP of `192.168.1.15` and denies all other traffic.

#### Step 4 - Save your changes
Click 'Save Changes' and see this take effect immediately.

#### Conclusion
Limiting IP address inbound access is just one option to improve the security of your Timescale
Cloud database instance. There are many other types of security measures you should take into
account when securing your data. To learn more about security options within managed service for TimescaleDB,
visit the [managed service for TimescaleDB Knowledge Base][mst-kb].


[mst-install]: /install/latest/installation-mst/
[cidr-wiki]: https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing
[cidr-tool]: http://www.subnet-calculator.com/cidr.php
[mst-kb]: https://kb.timescale.cloud/en/collections/1600092-security
[mst-portal]: https://portal.managed.timescale.com
[sign-up]: https://www.timescale.com/cloud-signup
[timescale-features]: https://www.timescale.com/products
[timescale-pricing]: https://www.timescale.com/products#cloud-pricing
[contact]: https://www.timescale.com/contact
[using-timescale]: /overview/core-concepts/
[hello-timescale]: /tutorials/tutorial-hello-timescale
[install-psql]: /timescaledb/:currentVersion:/how-to-guides/connecting/psql/
