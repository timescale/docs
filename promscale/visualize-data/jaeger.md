# Visualize Promscale traces in Jaeger
This section shows you how to integrate
[Jaeger][jaeger-ui] with Promscale.

To visualize traces in Jaeger with Promscale, you need the 
Jaeger query component running. This component queries 
and visualizes traces from Promscale.

<highlight type="note">
For Jaeger to visualize traces in Promscale. you must be running 
Jaeger Query version 1.30 or higher.
</highlight>

<procedure>

## Connecting Jaeger query with Promscale 

1.  Deploy the Jaeger Query component from the Jaeger 
    [deployments page][jaeger-deployments], if you aren't already running the Jaeger query.
    
1.  Set the Jaeger query configuration through environment variables 
    as `SPAN_STORAGE_TYPE`  to `grpc-plugin` and 
    `GRPC_STORAGE_SERVER` to Promscale gRPC endpoint `<PROMSCALE_HOST>:9202` before 
    Jaeger query startup, with this the Jaeger query configures the 
    span storage type as gRPC server and gRPC storage server endpoint as Promscale.
    ```
    SPAN_STORAGE_TYPE=grpc-plugin
    GRPC_STORAGE_SERVER=<PROMSCALE_HOST>:9202
    ```
    Here `9202` is the default gRPC server port in Promscale.
1.  Now on Jaeger query startup, it should be successfully connected with 
    Promscale to visualize the traces. 

</procedure>

This sample output shows traces from Promscale visualized in a Jaeger query, using the filters from the left search menu:

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/images/misc/jaeger-homepage-query-results.png" alt="Sample output for Jaeger query results"/>

## Use Docker to set up a Jaeger query with Promscale

You need the IP address of your Promscale container. You can
find this at the command prompt, using this command:
```bash
docker inspect <PROMSCALE_CONTAINER_NAME>
```

The IP address is listed in the `NetworkSettings → Networks → IPAddress`
section.

Alternatively, you can set the URL as `promscale:9202` (here `9202` is the gRPC endpoint of Promscale), where `promscale` is the name of the container.

<procedure>

### Connecting Promscale and Jaeger Query
1.  Install Jaeger from the [official Docker image][jaeger-docker]:
    ``` bash
    docker run -d \
      -p 16686:16686 \
      --network opentelemetry-demo_default \
      --name=jaeger \
      -e "SPAN_STORAGE_TYPE=grpc-plugin" -e "GRPC_STORAGE_SERVER=promscale:9202" \
      jaegertracing/jaeger-query:1.30
    ```
1.  Navigate to `localhost:16686` in your browser, you will able to access the Jaeger query homepage.
1.  On the left side of Jaeger query homepage you can find the filters to start querying traces from Promscale.

</procedure>

[jaeger-ui]: https://github.com/jaegertracing/jaeger-ui#jaeger-ui
[jaeger-docker]: https://www.jaegertracing.io/docs/1.32/deployment/
[jaeger-deployments]: https://www.jaegertracing.io/docs/1.32/deployment/