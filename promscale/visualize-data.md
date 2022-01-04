# Visualize data in Promscale
Promscale can be used as a Prometheus data source for visualization tools like
[Grafana][grafana-homepage] and [PromLens][promlens-homepage].

## Connect Promscale and Grafana
This section shows you how to connect Promscale as a Prometheus data source in
[Grafana][grafana-homepage].

Before you begin, you need the IP address of your Promscale instance. You can
find this at the command prompt, using this command:
```bash
docker inspect <PROMSCALE_CONTAINER_NAME>
```

The IP address is listed in the `NetworkSettings → Networks → IPAddress`
section.

Alternatively, you can set the URL as `http://promscale:9201`, where `promscale` is the name of the container.

<procedure>

### Connecting Promscale and Grafana
1.  Install Grafana from the [official Docker image][grafana-docker]:
    ``` bash
    docker run -d \
      -p 3000:3000 \
      --network promscale-timescaledb \
      --name=grafana \
      -e "GF_INSTALL_PLUGINS=grafana-clock-panel,grafana-simple-json-datasource" \
      grafana/grafana
    ```
1.  Navigate to `localhost:3000` in your browser and log in to Grafana with
    username `admin`, and password `admin`. You are prompted set a new password.
1.  Navigate to `Configuration → Data Sources → Add data source → Prometheus`.
1.  Configure the data source settings:
    *   In the `Name` field, type `Promscale`.
    *   In the `URL` field, type `http://<PROMSCALE-IP-ADDR>:9201`, using the IP
        address of your Promscale instance.
    *   Use the default values for all other settings.

</procedure>

When you configured Promscale as a data source in Grafana, you can create a
Grafana panel using `Promscale` as the data source. The query powering the panel
is written in PromQL.

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/images/misc/getting-started-with-promscale-grafana-dashboard.png" alt="Sample output for PromQl query"/>

[grafana-homepage]:https://grafana.com
[promlens-homepage]: https://promlens.com
[grafana-docker]: https://grafana.com/docs/grafana/latest/installation/docker/#install-official-and-community-grafana-plugins
