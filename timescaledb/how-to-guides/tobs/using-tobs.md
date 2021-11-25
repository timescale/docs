# Use the observability stack (tobs) for Kubernetes
This section covers the main commands you can use with tobs, including how to
use it to view metrics in Grafana. For more information about Helm charts, see
the [tobs Helm charts page][tobs-helm].

Before you begin, you should already have installed and set up your Kubernetes
cluster and the tobs package. For more information on installing tobs, see the
[tobs installation page][tobs-install] .

## Primary tobs commands
This section covers the primary tobs commands.

|Command|Command Description|Available Flags|Flag description|
|-|-|-|-|
|`tobs install`|Alias for tobs helm install|`--filename`, `-f`|File to load configuration from|
|||`--chart-reference`, `-c`|Helm chart reference. Defaults to `timescale/tobs`|
|||`--external-timescaledb-uri`, `-e`|External database URI. Skips TimescaleDB installation and Promscale connects to the provided database URI.|
|||`--enable-prometheus-ha`|Option to enable Prometheus and Promscale HA. Defaults to 3 replicas|
|||`--enable-timescaledb-backup`, `-b`|Enable TimescaleDB S3 backup|
|||`--only-secrets`|Create only the TimescaleDB secrets, do no other install tasks|
|||`--skip-wait`|Do not wait for pods to be running. Provides faster tobs installation.|
|||`--timescaledb-tls-cert`|Provide your own TLS certificate for TimescaleDB|
|||`--timescaledb-tls-key`|Provide your own TLS key for TimescaleDB|
|||`--version`|Provide tobs Helm chart version, if not provided, installs the most recent available tobs Helm chart|
|||`--tracing`|Enable tracing components|
|`tobs uninstall`|Alias for `tobs Helm uninstall`|`--delete-data`|Delete persistent volume claims|
|`tobs port-forward`|Port forward TimescaleDB, Grafana, and Prometheus to `localhost`|`--timescaledb`, `-t`|Port for TimescaleDB|
|||`--grafana`, `-g`|Port for Grafana|
|||`--prometheus`, `-p`|Port for Prometheus|
|||`--promscale`, `-c`|Port for Promscale|
|||`--promlens`, `-l`|Port for Promlens|
|`tobs version`|Shows the installed version of tobs and the latest Helm chart|`--deployed-chart`, `-d`|Show the deployed Helm chart version with the tobs CLI version|

## Helm tobs commands
This section covers the tobs commands for managing Helm charts. For more
information about Helm charts, see the [tobs Helm charts page][tobs-helm].

|Command|Command Description|Available Flags|Flag description|
|-|-|-|-|
|`tobs helm show-values`|Prints the YAML configuration of the Helm chart|`--filename`, `-f`|File to load configuration from|
|||`--chart-reference`, `-c`|Helm chart reference. Defaults to `timescale/tobs`|

## TimescaleDB tobs commands
This section covers the tobs commands for managing your TimescaleDB database.

|Command|Command Description|Available Flags|Flag description|
|-|-|-|-|
|`tobs timescaledb connect`|Connects to the Timescale database with the provided user|`--dbname`, `-d`|Database name to connect to. Defaults to the name providedd in the Helm release|
|||`--master`, `-m`|Directly execute session on master node|
|`tobs timescaledb port-forward`|Port forward TimescaleDB to `localhost`|`--port,` `-p`|Port to listen on|

## TimescaleDB superuser tobs commands
This section covers the tobs commands for managing your TimescaleDB database that are available to the superuser.

|Command|Command Description|Available Flags|Flag description|
|-|-|-|-|
|`tobs timescaledb superuser get-password`|Gets the password of the superuser in the TimescaleDB database|||
|`tobs timescaledb superuser change-password`|Changes the password of the superuser in the Timescale database|||
|`tobs timescaledb superuser connect`|Connects to the TimescaleDB database as the superuser|`--master`, `-m`|Directly execute session on master node|


Grafana Commands
Command	Description	Flags
tobs grafana port-forward	Port-forwards the Grafana server to localhost.	--port, -p : port to listen from
tobs grafana get-password	Gets the admin password for Grafana.	None
tobs grafana change-password	Changes the admin password for Grafana.	None
Prometheus Commands
Command	Description	Flags
tobs prometheus port-forward	Port-forwards the Prometheus server to localhost.	--port, -p : port to listen from
Jaeger Commands
Jaeger cmds are only supported if tracing is enabled in tobs installation

Command	Description	Flags
tobs jaeger port-forward	Port-forwards the jaeger query to localhost.	--port, -p : port to listen from
Metrics Commands
Command	Description	Flags
tobs metrics retention get	Gets the data retention period of a specific metric.	None
tobs metrics retention set-default	Sets the default data retention period to the specified number of days.	None
tobs metrics retention set	Sets the data retention period of a specific metric to the specified number of days.	None
tobs metrics retention reset	Resets the data retention period of a specific metric to the default value.	None
tobs metrics chunk-interval get	Gets the chunk interval of a specific metric.	None
tobs metrics chunk-interval set-default	Sets the default chunk interval to the specified duration.	None
tobs metrics chunk-interval set	Sets the chunk interval of a specific metric to the specified duration.	None
tobs metrics chunk-interval reset	Resets chunk interval of a specific metric to the default value.	None
Volume Commands
The volume operation is available for TimescaleDB & Prometheus PVC's.

Note: To expand PVC's in Kubernetes cluster make sure you have configured storageClass with allowVolumeExpansion: true to allow PVC expansion.

Command	Description	Flags
tobs volume get	Displays Persistent Volume Claims sizes.	--timescaleDB-storage, s, --timescaleDB-wal, w, prometheus-storage, -p
tobs volume expand	Expands the Persistent Volume Claims for provided resources to specified sizes. The expansion size is allowed in Ki, Mi & Gi units. example: 150Gi.	--timescaleDB-storage, s, --timescaleDB-wal, w, prometheus-storage, -p, --restart-pods, -r to restart pods bound to PVC after PVC expansion.
Upgrade Command
The upgrade cmd helps to upgrade the existing tobs deployment. You can upgrade the tobs to latest helm chart provided the helm chart is released to timescale helm repository. You can also upgrade your existing tobs deployment to latest values.yaml configuration. This internally uses the helm upgrade utility.

Command	Description	Flags
tobs upgrade	Upgrades the tobs deployment if new helm chart is available. Also, upgrades tobs if updated values.yaml is provided.	--filename, -f : file to load configuration from
--chart-reference, -c : helm chart reference (default "timescale/tobs")
--reuse-values : native helm upgrade flag to use existing values from release
--reset-values : native helm flag to reset values to default helm chart values
--confirm, -y : approve upgrade action
--same-chart : option to upgrade the helm release with latest values.yaml but the chart remains the same.
--skip-crds : option to skip creating CRDs on upgrade
Global Flags
The following are global flags that can be used with any of the above commands:

Flag	Description
--name	Helm release name
--namespace, -n	Kubernetes namespace
--config	Tobs config file (default is $HOME/.tobs.yaml)
Advanced configuration
Documentation about Helm configuration can be found in the Helm chart directory. Custom values.yml files can be used with the tobs helm install -f values.yml command.


## Use tobs to test your cluster
Testing
Dependencies: kubectl, kind

A testing suite is included in the tests folder. The testing suite can be run by ./e2e-tests.sh this script will create a kind cluster, execute the test suite, and delete the kind cluster.


## Use tobs with Grafana
Getting started by viewing your metrics in Grafana
To see your Grafana dashboards after installation run

tobs grafana get-password
tobs grafana port-forward
Then, point your browser to http://127.0.0.1:8080/ and login with the admin username.


[tobs-install]: /how-to-guides/tobs/install-tobs/
[tobs-helm]: /how-to-guides/tobs/helm-charts-tobs/
