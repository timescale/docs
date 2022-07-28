---
title: Install the observability stack (tobs) for Kubernetes
excerpt: Install tobs
product: promscale
keywords: [analytics, Kubernetes]
tags: [install, k8s]
related_pages:
  - /promscale/:currentVersion:/installation/resource-recomm
  - /promscale/:currentVersion:/send-data/
---

import PromscaleConfigurationRecommendations from 'versionContent/_partials/_promscale-configuration-recommendations.mdx';

# Install the observability stack (tobs) for Kubernetes
The Observability Stack, is a pre-packaged distribution of observability tools
and dashboard interfaces which can be installed on any existing Kubernetes
cluster. It includes many of the most popular open-source observability tools
such as Prometheus, Grafana, Jaeager, Promlens, TimescaleDB, and others.
Together, these provide a maintainable solution to analyze the traffic on the
server and identify any potential problems with a deployment. You can use Helm
charts to configure and update [tobs][tobs] deployments. 

## Before you begin
1.  Understand the [resource requirements][resource-requirements] for your cluster.
1.  [Deploy a Kubernetes Cluster][kubernetes-cluster]. 
1.  Install [Helm 3][helm] in your local machine.
1.  Install [kubectl][kubectl] in your local environment and [connect to your
    cluster][connect-to-cluster].
1.  Create the `observability` namespace on your cluster:
    ```bash
    kubectl create namespace observability
    ```
1.  Add the stable Helm charts repository to your Helm repositories:
    ```bash
    helm repo add stable https://charts.helm.sh/stable
    ```
1.  Update your Helm repositories:
    ```bash
    helm repo update
    ```


## Installing Promscale with tobs 
You can deploy tobs on your cluster and access it locally with `kubectl`
[Port-Forward][port-forward].

<procedure>

1. Install a certificate manager for your cluster:
   ```bash
   kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.8.0/cert-manager.yaml
   ```
1.  Using Helm, deploy the TOBS release labeled `tobs` in the `observability`
    namespace on your cluster:
    ```bash
    helm repo add timescale https://charts.timescale.com/
    helm repo update
    helm install --wait tobs timescale/tobs --namespace observability
    ```
1.  Verify that the Prometheus Operator has been deployed to your cluster and
    its components are running and ready by checking the pods in the
    `observability` namespace:
    ```bash
    kubectl -n observability get pods
    ```
    
</procedure>

### Accessing the interfaces with port-forward

<procedure>

1.  List the services running in the `observability` namespace and review their
    respective ports:
    ```bash
    kubectl -n observability get svc
    ```
    You can use `kubectl` [port-forward][port-forward] to open a connection to a service, then access the interface of the service by entering the corresponding ports in your web browser.

1. To access the **Prometheus** interface at the address `127.0.0.1:9090` in
   your web browser, use:
   ```bash
   kubectl -n monitoring \
   port-forward \
   svc/tobs-kube-prometheus-prometheus \
   9090
   ```
1. To access the **Alertmanager** interface at the address `127.0.0.1:9093` in
   your web browser, use:
   ```bash
      kubectl -n monitoring \
      port-forward \
      svc/tobs-kube-prometheus-alertmanager  \
      9093
   ```   
1. To access the **Grafana** interface at the address `127.0.0.1:8081` in your
   web browser, use:
   ```bash
   kubectl -n monitoring \
   port-forward \
   svc/tobs-grafana  \
   8081:80
   ```
   When accessing the Grafana interface, log in as `admin`. You can get the
  `password` using:
   ```bash
   kubectl get secret --namespace monitoring tobs-grafana -o jsonpath="{.data.admin-password}" | base64 --decode ; echo
   ```
   The Grafana dashboards are accessible at `Dashboards > Manage` from the left navigation bar.

</procedure>

## Database configurations
<PromscaleConfigurationRecommendations />

 The Observability Stack, eliminates the need to maintain configuration details for each of 
 the applications, while providing observability for the applications running on your cluster.

[kubernetes-cluster]: https://kubernetes.io/docs/setup/production-environment/
[helm]: https://helm.sh/docs/intro/install/
[kubectl]: https://kubernetes.io/docs/tasks/tools/#kubectl
[connect-to-cluster]: https://kubernetes.io/docs/tasks/tools/install-kubectl-macos/#verify-kubectl-configuration
[port-forward]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#port-forward).
[tobs]: https://github.com/timescale/tobs
[resource-requirements]: /promscale/:currentVersion:/installation/resource-recomm/ 