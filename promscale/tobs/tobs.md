---
title: Install the observability stack (tobs) for Kubernetes
excerpt: Install tobs
product: promscale
keywords: [analytics, Kubernetes]
tags: [install, k8s]
related_pages:
  - /promscale/:currentVersion:/recommendations/resource-recomm
  - /promscale/:currentVersion:/send-data/
---

# Install the observability stack (tobs) for Kubernetes
The observability stack (tobs), is a pre-packaged distribution of observability
tools and components which can be installed on any existing Kubernetes
cluster. It includes many of the most popular open-source observability tools
including Prometheus, Grafana, TimescaleDB, and [other components][stack-components].
Together, these provide a unified solution to observe deployments in Kubernetes
cluster and identify any potential problems using both metrics and traces. You can use Helm
charts to configure and update [tobs][tobs] deployments. 

 
## Before you begin
*  Understand the [resource requirements][resource-requirements] for your cluster.
*  Ensure that you have a [Kubernetes Cluster][kubernetes-cluster]. 
*  Install [kubectl][kubectl] in your local environment and [connect to your cluster][connect-to-cluster].
*  Install [Helm 3][helm] in your local machine.
* Install a certificate manager for your cluster.
   <highlight type="note">
   For the latest and updated instructions to install, see the
   [certificate manager][cert-manager-docs] documentation. If you plan to use 
   tobs without OpenTelemetry support, you do not need to install certificate 
   manager.
   </highlight> 

## Installing Promscale with tobs 
The observability stack (tobs), eliminates the need to maintain configuration
details for each of the applications, while providing observability for the
applications running on your cluster. You can deploy tobs on your cluster and
access it locally with `kubectl` [Port-Forward][port-forward].

<procedure>

1.  Create the `observability` namespace on your cluster:
    ```bash
    kubectl create namespace observability
    ```   
1.  Using Helm, deploy the tobs release labeled `tobs` in the `observability`
    namespace on your cluster:
    ```bash
    helm repo add timescale https://charts.timescale.com/
    helm repo update
    helm install --wait tobs timescale/tobs --namespace observability
    ```
1.  Verify that all the components have been deployed to your cluster and are
    running by checking the pods in the `observability` namespace:
    ```bash
    kubectl -n observability get pods
    ```
    
</procedure>

### Accessing the components with port-forward

<procedure>

You can use `kubectl` [port-forward][port-forward] to open a connection to a
service, then access the service by entering the corresponding ports in your web browser.

1.  List the services running in the `observability` namespace and review their
    respective ports:
    ```bash
    kubectl -n observability get svc
    ```
1. To access **Prometheus** at the address `127.0.0.1:9090` in
   your web browser, use:
   ```bash
   kubectl -n observability \
   port-forward \
   svc/tobs-kube-prometheus-prometheus \
   9090
   ```
1. To access **Alertmanager** at the address `127.0.0.1:9093` in
   your web browser, use:
   ```bash
      kubectl -n observability \
      port-forward \
      svc/tobs-kube-prometheus-alertmanager  \
      9093
   ```   
1. To access **Grafana** at the address `127.0.0.1:3000` in your
   web browser, use:
   ```bash
   kubectl -n observability \
   port-forward \
   svc/tobs-grafana  \
   3000:80
   ```

</procedure>

When accessing Grafana, log in as `admin`. You can get the
`password` using:
   ```bash
   kubectl get secret --namespace observability tobs-grafana -o jsonpath="{.data.admin-password}" | base64 --decode ; echo
   ```
   The Grafana dashboards are accessible at `Dashboards > Browse` from the left navigation bar.

[kubernetes-cluster]: https://kubernetes.io/docs/setup/production-environment/
[helm]: https://helm.sh/docs/intro/install/
[kubectl]: https://kubernetes.io/docs/tasks/tools/#kubectl
[connect-to-cluster]: https://kubernetes.io/docs/tasks/tools/install-kubectl-macos/#verify-kubectl-configuration
[port-forward]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#port-forward).
[tobs]: https://github.com/timescale/tobs#tobs---the-observability-stack-for-kubernetes
[resource-requirements]: /promscale/:currentVersion:/recommendations/resource-recomm/ 
[stack-components]: /promscale/:currentVersion:/tobs/about/
[cert-manager-docs]: https://cert-manager.io/docs/installation/
