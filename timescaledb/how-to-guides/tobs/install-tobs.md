# Install the observability stack for Kunernetes (tobs)
Installing the CLI tool
To download and install tobs, run the following in your terminal, then follow the on-screen instructions.

curl --proto '=https' --tlsv1.2 -sSLf  https://tsdb.co/install-tobs-sh |sh
Alternatively, you can download the CLI directly via our releases page

Getting started with the CLI tool is a two-step process: First you install the CLI tool locally, then you use the CLI tool to install the tobs stack into your Kubernetes cluster.

Using the tobs CLI tool to deploy the stack into your Kubernetes cluster
After setting up tobs run the following to install the tobs helm charts into your Kubernetes cluster

tobs install
This will deploy all of the tobs components into your cluster and provide instructions as to next steps.

Tracing support
From 0.7.0 release tobs supports installation of tracing components. To install tracing components use

tobs install --tracing
For more details on tracing support visit Promscale tracing docs.

Using the tobs CLI tool
The CLI tool (usage guide) provides the most seamless experience for interacting with tobs.

Configuring the stack
All configuration for all components happens through the helm values.yml file. You can view the self-documenting default values.yaml in the repo. We also have additional documentation about individual configuration settings in our Helm chart docs.

To modify the settings, first create a values.yaml file:

tobs helm show-values > values.yaml
Then modify the values.yaml file using your favorite editor. Finally, deploy with the new settings using:

tobs install -f values.yaml
🛠Alternative deployment methods
Using the Helm charts without the CLI tool
Users sometimes want to use our Helm charts as sub-charts for other project or integrate them into their infrastructure without using our CLI tool. This is a supported use-case and instructions on using the Helm charts can be found here.

Compatibility matrix
Tobs vs. Kubernetes
Tobs	Kubernetes
0.7.0	v1.19 to v1.21
