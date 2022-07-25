---
title: Use the observability stack (tobs) for Kubernetes
excerpt: Using the observability suite for Kubernetes (tobs)
product: promscale
keywords: [tobs, Kubernetes]
tags: [monitor, k8s]
---

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

You can use a custom `values.yml` file with the `tobs helm install -f values.yml` command.

## TimescaleDB tobs commands
This section covers the tobs commands for managing your TimescaleDB database.

|Command|Command Description|Available Flags|Flag description|
|-|-|-|-|
|`tobs timescaledb connect`|Connects to the Timescale database with the provided user|`--dbname`, `-d`|Database name to connect to. Defaults to the name providedd in the Helm release|
|||`--master`, `-m`|Directly execute session on master node|
|`tobs timescaledb port-forward`|Port forward TimescaleDB to `localhost`|`--port,` `-p`|Port to listen on|

## TimescaleDB superuser tobs commands
This section covers the tobs commands for managing your TimescaleDB database
that are available to the superuser.

|Command|Command Description|Available Flags|Flag description|
|-|-|-|-|
|`tobs timescaledb superuser get-password`|Gets the password of the superuser in the TimescaleDB database|||
|`tobs timescaledb superuser change-password`|Changes the password of the superuser in the Timescale database|||
|`tobs timescaledb superuser connect`|Connects to the TimescaleDB database as the superuser|`--master`, `-m`|Directly execute session on master node|

## Grafana tobs commands
This section covers the tobs commands for managing Grafana.

|Command|Command Description|Available Flags|Flag description|
|-|-|-|-|
|`tobs grafana port-forward`|Port forward the Grafana server to `localhost`|`--port`, `-p`|Port to listen on|
|`tobs grafana get-password`|Get the Grafana `admin` password|||
|`tobs grafana change-password`|Change the Grafana `admin` password|||

## Prometheus tobs commands
This section covers the tobs commands for managing Prometheus.

|Command|Command Description|Available Flags|Flag description|
|-|-|-|-|
|`tobs prometheus port-forward`|Port forward the Prometheus server to `localhost`|`--port`, `-p`|Port to listen on|

## Jaeger tobs commands
This section covers the tobs commands for managing Jaeger. These command are
supported only if you enabled tracing when you installed tobs.

|Command|Command Description|Available Flags|Flag description|
|-|-|-|-|
|`tobs jaeger port-forward`|Port forward the Jaeger query to `localhost`|`--port`, `-p`|Port to listen on|

## Metrics tobs commands
This section covers the tobs commands for managing metrics.

|Command|Command Description|Available Flags|Flag description|
|-|-|-|-|
|`tobs metrics retention get`|Gets the data retention period for the specified metric|||
|`tobs metrics retention set-default`|Set the default data retention period to the specified number of days|||
|`tobs metrics retention set`|Set the data retention period for the specified metric to the specified number of days|||
|`tobs metrics retention reset`|Reset the data retention period for the specified metric to the default value|||
|`tobs metrics chunk-interval get`|Get the chunk interval for the specified metric|||
|`tobs metrics chunk-interval set-default`|Set the default chunk interval for the specified duration|||
|`tobs metrics chunk-interval set`|Set the chunk interval for the specified metric to the specified duration|||
|`tobs metrics chunk-interval reset`|Reset the chunk interval for the specified metric to the default value|||

## Volume tobs commands
This section covers the tobs commands for managing  TimescaleDB and Prometheus
persistent volume claim (PVC) volumes.

To expand PVCs in your Kubernetes cluster, you must have configured the
`storageClass` parameter to be `allowVolumeExpansion: true`.

|Command|Command Description|Available Flags|Flag description|
|-|-|-|-|
|`tobs volume get`|Displays PVC sizes|`--timescaleDB-storage`, `-s`||
|||`--timescaleDB-wal`, `-w`||
|||`--prometheus-storage`, `-p`||
|`tobs volume expand`|Expand the PVC for provided resources to the specified size, given in Ki, Mi or Gi|`--timescaleDB-storage`, `-s`||
|||`--timescaleDB-wal`, `-w`||
|||`--prometheus-storage`, `-p`||
|||`--restart-pods`, `-r`|Restart pods bound to PVC after PVC expansion.|

## Upgrade tobs commands
This section covers the tobs commands for upgrading your existing tobs
installation. You can upgrade tobs to the latest Helm chart, as long as the Helm
chart exists in the Timescale Helm repository. You can also upgrade your
existing tobs installation to use the latest `values.yaml` configuration file.
Internally, these tools use the Helm upgrade utility.

|Command|Command Description|Available Flags|Flag description|
|-|-|-|-|
|`tobs upgrade`|Upgrade the tobs deployment to use the newest available Helm chart, and upgrades tobs if a new `values.yaml` file is provided|`--filename`, `-f`|File to load configuration from|
|||`--chart-reference`, `-c`|Helm chart reference. Defaults to `timescale/tobs`|
|||`--reuse-values`|Native Helm upgrade flag to use existing values from release|
|||`--reset-values`|Native helm flag to reset values to default Helm chart values|
|||`--confirm`, `-y`|Approve upgrade action without prompting|
|||`--same-chart`|Upgrade the Helm release with latest `values.yaml`, but use the same chart|
|||`--skip-crds`|Skip creating CRDs on upgrade|

## Global tobs commands
This section covers the global tobs commands that can be used with any other
commands listed here.

|Available Flags|Flag description|
|-|-|
|--name|Helm release name|
|--namespace, -n|Kubernetes namespace|
|--config|Tobs configuration file, defaults to ``$HOME/.tobs.yaml`|

[tobs-helm]: https://github.com/timescale/tobs/tree/master/chart#tobs-helm-charts
[tobs-install]: /promscale/:currentVersion:/installation/tobs/
