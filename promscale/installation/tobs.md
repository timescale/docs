# Install Promscale using tobs
You can install Promscale using the observability stack (tobs) for Kubernetes.

Before you begin, you must have an installed and working Kubernetes cluster, and
have installed tobs. For more information about tobs, including installation
instructions, see the [tobs section][howto-tobs].

## Configure tobs
When you have installed tobs, and deployed the stack into your Kubernetes
cluster, you can configure the tobs helm chart with custom values.

Configuration values are set in the `values.yml` configuration file. For a
default configuration file that you can use as a starting point, see the
[developer documentation][gh-values-yaml]. For more information about individual
configuration settings see our [Helm developer documentation][gh-helm].

<procedure>

1.  Create the `values.yml` configuration file, if you don't already have one:
    ```bash
    tobs helm show-values > values.yaml
    ```
1.  Modify the `values.yaml` file in your preferred text editor.
1.  Deploy the new settings:
    ```bash
    tobs install -f values.yaml
    ```

</procedure>


[gh-helm]: https://github.com/timescale/tobs/blob/master/chart/README.md#configuring-helm-chart
[howto-tobs]: timescaledb/how-to-guides/tobs/about-tobs/
