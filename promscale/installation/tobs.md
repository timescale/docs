# Install the observability stack (tobs) for Kubernetes
The observability stack (tobs) is a command-line tool for managing the
observability stack components in a Kubernetes cluster.

Before you begin, you should already have installed and set up your Kubernetes
cluster.

## Install the packages
You can install tobs at the command prompt, using the `curl` command:
```bash
curl --proto '=https' -A 'tobs' --tlsv1.2 -sSLf  https://tsdb.co/install-tobs-sh |sh
```

Alternatively, you can download directly from our [repository][download-tobs] to
install from source. Make sure you have the `go` programing language installed
before you begin. When you have downloaded the source, unzip it and change into
the `cli` directory, and run this command to install:
```bash
make build -o tobs
```

Make sure you move the `tobs` binary from its current directory to your `/bin`
directory, or add it to your PATH.

## Configure tobs for your Kubernetes cluster
When you have the tobs package downloaded and installed on your local system,
you can use the `tobs` command  to deploy the stack into your Kubernetes
cluster:
```bash
tobs install
```

This command deploys all of the tobs component into your
cluster. Follow the prompts to complete set up.

## Install tracing support

In tobs version 0.7.0 and later, tracing components are included in the stack.
To install the tracing components, use this command:
```bash
tobs install --tracing
```

For more information about Promscale tracing, see the
[distributed tracing section][promscale-tracing].

## Compatibility
If you are having trouble with tobs, check that you are using a compatible
version of tobs and Kubernetes:

|Tobs version|Kubernetes version|
|-|-|
|0.8.x|1.21 to 1.23|
|0.7.x|1.19 to 1.21|


[download-tobs]: https://github.com/timescale/tobs/releases/latest
[promscale-tracing]: promscale/:currentVersion:/distributed-tracing/
