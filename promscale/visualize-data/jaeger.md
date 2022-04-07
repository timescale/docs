# Visualize Promscale traces in Jaeger

Jaeger, is an open source distributed tracing system used for monitoring and troubleshooting microservices-based distributed systems.

This section shows you how to integrate [Jaeger][jaeger-ui] with Promscale.

To visualize traces in Jaeger with Promscale, you need to have the Jaeger component `jaeger-query` running. This Jaeger component queries and visualizes traces from Promscale. 

Before you begin, deploy the component `jaeger-query` from the Jaeger [deploymentspage][jaeger-deployments]. Ensure that the version of the component is `1.30` or later. 

<procedure>

## Connecting a Jaeger query with Promscale
    
1.  Configure the following options for `jaeger-query` using the environment
    variables:
    * `SPAN_STORAGE_TYPE`  to `grpc-plugin`
    * `GRPC_STORAGE_SERVER` to Promscale gRPC endpoint `<PROMSCALE_HOST>:9202` 

    ```
    SPAN_STORAGE_TYPE=grpc-plugin
    GRPC_STORAGE_SERVER=<PROMSCALE_HOST>:9202
    ```
    The port `9202` is the default gRPC server port in Promscale.

1.  Start the `jaegar-query` component, it should be successfully connected with
    Promscale to visualize the traces. 

</procedure>

You can visualize traces from Promscale in `jaeger-query` home page. Use the
`Search` panel on the left to filter and query traces from Promscale. 

<img class="main-content__illustration"
src="https://s3.amazonaws.com/assets.timescale.com/images/misc/jaeger-homepage-query-results.png"
alt="Sample output for Jaeger query results"/>

## Using Docker for setting up Jaeger Query with Promscale

To set up `jaeger-query` with Promscale using Docker you need the IP address of the Promscale container or the URL. 

You can find the IP address of the container using:
```bash
docker inspect <PROMSCALE_CONTAINER_NAME>
```
In the output the IP address is listed under `NetworkSettings` → `Networks` → `IPAddress` section.

You can set the URL as `<PROMSCALE>:9202` where:
- `9202` is the gRPC endpoint of Promscale
- `<PROMSCALE>` is the name of the container

<procedure>

### Connecting Promscale and a Jaeger query
1.  Install Jaeger from the [official Docker image][jaeger-docker]:
    ``` bash
    docker run -d \
      -p 16686:16686 \
      --network opentelemetry-demo_default \
      --name=jaeger \
      -e "SPAN_STORAGE_TYPE=grpc-plugin" -e "GRPC_STORAGE_SERVER=promscale:9202" \
      jaegertracing/jaeger-query:1.30
    ```
1.  Navigate to `localhost:16686` in your browser, to access the `jaeger-query` homepage.

1.  Use the `Search` panel on the left to filter and start querying traces from
    Promscale.

</procedure>

[jaeger-ui]: https://github.com/jaegertracing/jaeger-ui#jaeger-ui
[jaeger-docker]: https://www.jaegertracing.io/docs/latest/deployment/
[jaeger-deployments]: https://www.jaegertracing.io/docs/latest/deployment/