# Promscale
Promscale is an open source long-term store for Prometheus data designed for
analytics. It is built on top of TimescaleDB, and is a horizontally scalable and
operationally mature platform for Prometheus data that uses PromQL and SQL to
allow you to ask any question, create any dashboard, and achieve greater
visibility into your systems.

For more information about Promscale, see our [blog post][promscale-blog].

## Install Promscale
There are several different methods for installing Promscale. This section
describes installing from a pre-built Docker image. For alternative installation
methods, see the [Promscale GitHub repository][promscale-github].

If you have a Kubernetes cluster with Helm installed, you can use
the observability suite for Kubernetes (tobs) to install a full metric
collection and visualization solution including Prometheus, Grafana, Promscale,
and a preview version of PromLens. To learn how to do this, watch
our [demo video][tobs demo video].

If you want to migrate data from Prometheus into Promscale, you can use
[Prom-migrator][prom-migrator-blog], an open-source, universal Prometheus data
migration tool that can move data from one remote-storage system to another.

### Procedure: Installing Promscale from a Docker image
1.  Download the Docker image for the Promscale Connector
from [Docker Hub][promscale-docker-hub]. For more information about this image,
see the [Promscale Releases on GitHub][promscale-releases-github].
1.  Create a network specific to Promscale-TimescaleDB:
    ```bash
    docker network create --driver bridge promscale-timescaledb
    ```
1.  Install and run TimescaleDB with the Promscale extension:
    ```bash
    docker run --name timescaledb -e \
    POSTGRES_PASSWORD=<password> -d -p 5432:5432 \
    --network promscale-timescaledb \
    timescaledev/promscale-extension:latest-pg12 \
    postgres -csynchronous_commit=off
    ```
1.  Run Promscale:
    ```bash
    docker run --name promscale -d -p 9201:9201 \
    --network promscale-timescaledb timescale/promscale:<version-tag> \
    -db-password=<password> -db-port=5432 -db-name=postgres \
    -db-host=timescaledb -db-ssl-mode=allow
    ```
    In this example, we use `db-ssl-mode=allow`, which is suitable for testing
    purposes. For production environments, use `db-ssl-mode=require` instead.


<!---
Lana, you're up to here!
--->

This should make Promscale running along with TimescaleDB.

Example using docker-compose:

You can also run Promscale also by using docker-compose. The docker-compose.yaml is available in the docker-compose directory of our repository. You can start Promscale and related services simply via docker-compose up.

For updating Promscale in this method, you need to stop the Promscale that is currently running using docker-compose stop and then pull the image with the tag you want to upgrade to with docker pull timescale/promscale:<version-tag>. This will pull the respective image to your local docker registry. You can then run the updated image with docker-compose up.

🕞 Setting up cron jobs
Docker installations also need to make sure the execute_maintenance() procedure on a regular basis (e.g. via cron). We recommend executing it every 30 minutes. This is necessary to execute maintenance tasks such as enforcing data retention policies according to the configured policy.

Example:

docker exec \
   --user postgres \
   timescaledb \
      psql \
        -c "CALL execute_maintenance();"
🔥 Configuring Prometheus to use this remote storage connector
You must tell prometheus to use this remote storage connector by adding the following lines to prometheus.yml:

remote_write:
  - url: "http://<connector-address>:9201/write"
remote_read:
  - url: "http://<connector-address>:9201/read"
    read_recent: true
Note: Setting read_recent to true will make Prometheus query data from Promscale for all PromQL queries. This is highly recommended.

You can configure Prometheus remote-write with our recommended configurations from here.

⚙️ Configuration
The Promscale Connector binary is configured through either CLI flags, environment variables, or a YAML configuration file. Precedence goes like this: CLI flag value, if not set, environment variable value, if not set, configuration file value, if not set, default value.

All environment variables are prefixed with PROMSCALE.

Configuration file is a YAML file where the keys are CLI flag names and values are their respective flag values.

The list of available cli flags is available in here in our docs or by running with the -h flag (e.g. promscale -h).

🛠 Building from source
You can build the Docker container using the Dockerfile.


Install Promscale today via Helm Charts, Docker, and others. More information on GitHub. (And, if you like what we are building, please give us a ⭐️ on GitHub 🤗.)

If you have a Kubernetes cluster with Helm installed, we suggest using tobs to install a full metric collection and visualization solution including Prometheus, Grafana, Promscale, and a preview version of PromLens within 5 minutes (video).

How to get involved with the Promscale community:

For help with any technical questions, please join Timescale Slack (#prometheus) and/or the promscale-users Google Group.
To participate in roadmap and product discussions and to meet the engineering team, please join the monthly User & Community Meeting.
For infrequent product updates, subscribe to our Promscale Product Updates mailing list.
To learn more about the origin, status, and roadmap for this project, please read on.

Prometheus has emerged as the monitoring solution for modern software systems
Over the past few years, Prometheus, an open-source systems monitoring and alerting toolkit that can be used to easily and cost-effectively monitor infrastructure has emerged as the monitoring solution for modern software systems.

Reference architecture diagram depicting Prometheus' setup and integrations
Source: Prometheus docs
The key to Prometheus’ success is that it is built for modern, dynamic systems in which services start up and shut down frequently. The simple way that Prometheus collects data works extremely well with the ephemeral, churning nature of modern software architectures, and microservices in particular, because the services themselves don’t need to know anything about the monitoring system. Any service that wants to be monitored simply exposes its metrics over an HTTP endpoint. Prometheus scrapes these endpoints periodically and records the values it sees into a local time-series database.

Prometheus’ decoupled architecture makes the system as a whole much more resilient. Services don’t need the monitoring stack to be up to get work done, and the monitoring software only needs to know about individual services while it’s actually scraping them. This makes it easy for the monitoring system to adjust seamlessly as services fail and new ones are brought up.

This architecture also responds gracefully to overloading. While push-based architectures often drown in traffic when under high load. Prometheus simply slows down its scrape loop. Thus, while your metric resolution may suffer, your monitoring system will remain up and functional.

Keeping with the theme of resilience and simplicity, Prometheus doesn’t try to store data for the long term, but rather exposes an interface allowing a dedicated database to do so instead. Prometheus continually pushes data to this  remote-write interface, ensuring that metric data is durably stored. That is where external long-term storage systems come in.

Analytical options for Prometheus data are lacking
As developers use Prometheus to collect data from more and more of their infrastructure, the benefits from mining this data also increase. Analytics becomes critical, for things like auditing, reporting, capacity planning, prediction, root-cause analysis, and more.

Prometheus itself was developed with a clear sense of what it is, and is not, designed to do. Prometheus is designed to be a monitoring and alerting system; but it is not a durable, highly-available long-term store of data, nor a store for other datasets, nor a sophisticated analytics engine. However, though these capabilities are not provided by Prometheus itself, they are critical for the longer-duration and more intensive usages of metric data, including auditing, reporting, capacity planning, predictive analytics, root-cause analysis, and many others. As such, Prometheus provides hooks to forward its data to an external data store more suited for these tasks.

Existing options for storing Prometheus data externally, while useful, all focus on long-term storage, and in some cases, limited forms of aggregation. Such systems can only store floats, and perform PromQL queries, making them too limited, both in data-stored and in query-model, to perform sophisticated analytics.

In addition, as great as the Prometheus architecture is for recording data in highly dynamic environments, its method of collecting data at unaligned intervals creates challenges when analyzing data, since timestamps from multiple “simultaneous” scapes on different endpoints can differ by a significant amount.

Prometheus devised a language called PromQL that addresses these difficulties by regularizing data at query time: aligning the data at user-specified intervals and discarding excess data points. While this method of analysis works extremely well for simple, fast analyses, found in dashboarding, alerting, and monitoring, it can be lacking for more-sophisticated analysis.

For example, PromQL can’t aggregate across both series and time, making it quite difficult (if not impossible) to get accurate statistics over time for a particular label key, which is necessary for things such as determining when a memory leak was introduced by looking at 90th percentile memory usage grouped by app version across a long time-span. This kind of drill-down and reaggregation is important for many kinds of analytics, because even when the data contains the information needed for the problem at hand, it often wasn’t gathered with that kind of analysis in mind. Other PromQL features, such as joins, filters, and statistics, are similarly restricted, limiting its usage in discovering trends and developing insights.

Others have also written about these issues: The CNCF SIG-Observability working group has put together a list of use-cases in the observability space that need better tools for metrics analytics. Dan Luu, a popular tech blogger, also had a widely distributed blog post about getting more value out of your metric data.

This is where Promscale comes in.

Why we built Promscale
We say the market lacks a system for deep analytics of Prometheus data because we’ve felt that need while monitoring our own infrastructure. We built Promscale to conquer a challenge that we, and other developers, know all too well: how do we easily find answers to complex questions in our monitoring data?

We are big fans of Prometheus as software developers and operators – in particular, we became involved in the Prometheus ecosystem 3.5 years ago when we initially published our previous Prometheus adapter, one of the first read-write adapters.

But after multiple years of use and study we realized we needed capabilities beyond what Prometheus - and its associated tools - currently offer.

In our stack, this includes things like:

Support for distributed storage of data using TimescaleDB multi-node deployment.
Auxiliary data about the system being monitored to augment metrics with additional information that helps us understand what they mean, such as node hardware properties, user/owner information, geographic location, or what the workload is running.
Joins combining metrics with this additional auxiliary data and metadata to create a complete view of the system.
Efficient long-term storage for historical analysis, such as reporting of past incidents, capacity planning, auditing, and more.
Flexible data management to handle the large volume of data monitoring generated, with tiering support such as multi-tenancy, automated data retention, and downsampling.
Isolation between the various metrics. Since different metrics can be sent by completely different systems, we want both the performance and data management of different metrics to be independent (e.g., so that downsampling one metric won’t affect others).
Logs and traces alongside metrics, to provide a better all-around view of the system. If all three modalities are in the same database, then JOINs between this data can lead to interesting insight. (To be clear, Promscale does not support logs and traces today, but this is an area of future work.)
SQL as a versatile query language for those general analytics that PromQL isn’t suited for, as well as the lingua franca spoken by a variety of data analysis and machine learning tools.
Fast and easy migration of existing data storage using Prom-migrator, an open-source, universal Prometheus data migration tool.
What our infrastructure team really wanted was an analytical platform on top of Prometheus to achieve more-insightful and cost-effective observability into our own infrastructure.

That is what we built with Promscale.

How Promscale works
ArchitectureThis architecture uses the standard remote_write / remote_read Prometheus API, cleanly slotting into that space in the Prometheus stack.

Prometheus writes data to the Promscale connector using the remote_write API, storing the data in TimescaleDB. Promscale understands PromQL queries natively and fetches data from TimescaleDB to execute them, while SQL queries go to TimescaleDB directly.

Reference architecture diagram depicting various components of monitoring and observability stack
Promscale architecture and how it fits into the observability stack
Promscale can be deployed in any environment running Prometheus, alongside any Prometheus instance. We provide Helm charts for easier deployments to Kubernetes environments.

SQL interfaceThe data stored in Promscale can be queried both in PromQL and SQL. Though the data layout we use is internally quite sophisticated (more details in this design doc), you don’t need to understand any of it to analyze metrics through our easy-to-use SQL views.

Each metric is exposed through a view named after the metric, so a measurement called cpu_usage is queried like:

SELECT
	time,
	value,
	jsonb(labels) as labels
FROM "cpu_usage";


time                    value   labels  
2020-01-01 02:03:04	0.90   	{"namespace": "prod", "pod”: "xyz"}
2020-01-01 02:03:05	0.98   	{"namespace": "dev",  "pod”: "abc"}
2020-01-01 02:03:06	0.70   	{"namespace": "prod", "pod": "xyz"}


The most important fields are time, value, and labels.

labels represents the full set of labels associated with the measurement and is represented as an array of identifiers. In the query above we view the labels in their JSON representation using the jsonb() function.

Each row has a series_id uniquely identifying the measurement’s label set. This enables efficient aggregation by series. You can easily retrieve the labels array from a series_id using the labels(series_id) function. As in this query that shows how many data points we have in each series:

SELECT
	jsonb(labels(series_id_)) as labels,
	count(*)
FROM "cpu_usage"
GROUP BY series_id;


labels               				count
{"namespace": "prod", "pod”: "xyz"}		1
{"namespace": "dev",  "pod”: "abc"}		7
{"namespace": "prod", "pod": "xyz"}		3


Each label key (in our example namespace and pod) is expanded out into its own column storing foreign key identifiers to their value, which allows us to JOIN, aggregate and filter by label keys and values. You get back the text represented by a label id using the val(id) function. This opens up nifty possibilities such as aggregating across all series with a particular label key. For example, to determine the median CPU usage reported over the past year grouped by namespace, you could run:

SELECT
	val(namespace_id) as namespace,
	percentile_cont(0.5) within group (order by value)
AS median
FROM “cpu_usage”
WHERE time > '2019-01-01'
GROUP BY namespace_id;


namespace       median
prod            0.8
dev             0.7


The complete view looks something like this:

SELECT * FROM "cpu_usage";


time			value	labels  series_id 	namespace_id	pod_id
2020-01-01 02:03:04	0.90    {1,2} 	1		1		2
2020-01-01 02:03:05	0.98    {4,5}	2		4		5
2020-01-01 03:03:06	0.70    {1,2)	1		1		1


To simplify filtering by labels, we created operators corresponding to the selectors in PromQL. Those operators are used in a WHERE clause of the form labels ? (<label_key> <operator> <pattern>). The four operators are:

== matches tag values that are equal to the pattern
!== matches tag value that are not equal to the pattern
==~ matches tag values that match the pattern regex
!=~ matches tag values that are not equal to the pattern regex
These four matchers correspond to each of the four selectors in PromQL, though they have slightly different spellings to avoid clashing with other PostgreSQL operators. They can be combined together using any boolean logic with any arbitrary WHERE clauses.

For example, if you want only those metrics from the production namespace namespace or those whose pod starts with the letters "ab" you simply OR the corresponding label matchers together:

SELECT avg(value)
FROM "cpu_usage"
WHERE labels ? ('namespace' == 'production')
       OR labels ? ('pod' ==~ 'ab*')



Combined, these features open up all kinds of possibilities for analytics. For example, you could get easily get the 99th percentile of memory usage per container in the default namespace with:

SELECT
  val(used.container_id) container,
  percentile_cont(0.99) within group(order by used.value) percent_used_p99  
FROM container_memory_working_set_bytes used
WHERE labels ? ('namespace' == 'default')  
GROUP BY container
ORDER BY percent_used_p99 ASC
LIMIT 100;


container             		       percent_used_p99
promscale-drop-chunk                            1433600
prometheus-server-configmap-reload              6631424
kube-state-metrics                             11501568


Or, to take a more complex example from Dan Luu’s post, you can discover Kubernetes containers that are over-provisioned by finding those containers whose 99th percentile memory utilization is low:

WITH memory_allowed as (
  SELECT
    labels(series_id) as labels,
    value,
    min(time) start_time,
    max(time) as end_time
  FROM container_spec_memory_limit_bytes total
  WHERE value != 0 and value != 'NaN'
  GROUP BY series_id, value
)
SELECT
  val(memory_used.container_id) container,
  percentile_cont(0.99)
    within group(order by memory_used.value/memory_allowed.value)
    AS percent_used_p99,
  max(memory_allowed.value) max_memory_allowed
FROM container_memory_working_set_bytes AS memory_used
INNER JOIN memory_allowed
      ON (memory_used.time >= memory_allowed.start_time AND
          memory_used.time <= memory_allowed.end_time AND
          eq(memory_used.labels,memory_allowed.labels))
WHERE memory_used.value != 'NaN'   
GROUP BY container
ORDER BY percent_used_p99 ASC
LIMIT 100;


container			       percent_used_p99        total
cluster-overprovisioner-system    6.961822509765625e-05   4294967296
sealed-secrets-controller           0.00790748596191406   1073741824
dumpster                             0.0135690307617187    268435456


Demo!
In this 15 minute demo video, Avthar shows you how Promscale handles SQL and PromQL queries, via the terminal and Grafana.


Getting Started
Install Promscale today via Helm Charts, Docker, and others. More information on GitHub. (And if you like what we are building, please give us a ⭐️ on Github 🤗.)

If you have a Kubernetes cluster with Helm installed, we suggest using tobs to install a full metric collection and visualization solution including Prometheus, Grafana, Promscale, and a preview version of PromLens in under 5 minutes:


Promscale can be deployed in any environment running Prometheus, alongside any Prometheus instance. If you already have Prometheus installed and/or aren’t using Kubernetes, see our README for various installation options. Customers who have data in Prometheus already can migrate that data into Promscale using Prom-migrator, an open-source, universal Prometheus data migration tool that can move data from one remote-storage system to another.

How to get involved in the Promscale community:

For help with any technical questions, please join Timescale Slack (#prometheus) and/or the promscale-users Google Group.
To participate in roadmap and product discussions and to meet the engineering team, please join the monthly User & Community Meeting.
For infrequent product updates, subscribe to our Promscale Product Updates mailing list.


[tobs demo video]: https://youtu.be/MSvBsXOI1ks
[promscale-blog]: https://blog.timescale.com/blog/promscale-analytical-platform-long-term-store-for-prometheus-combined-sql-promql-postgresql/
[prom-migrator-blog]: https://blog.timescale.com/blog/introducing-prom-migrator-a-universal-open-source-prometheus-data-migration-tool/
[promscale-github]: https://github.com/timescale/promscale
[promscale-docker-hub]: https://hub.docker.com/r/timescale/promscale/
[promscale-releases-github]: https://github.com/timescale/promscale/releases
