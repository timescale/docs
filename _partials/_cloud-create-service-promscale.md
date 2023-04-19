A service in Timescale is a cloud instance that contains your database.
Each service contains a single database, named `tsdb`.

<Procedure>

### Creating your first service

1.  Sign in to the [Timescale portal][timescale-cloud]
1.  Click `Create service`.
1.  Click `Advanced configuration` and set the `Region`, `Compute`, and `Disk size`
    for the service. With 1&nbsp;CPU, 4&nbsp;GB and 250&nbsp;GB you can ingest and
    store up to 10,000&nbsp;metric samples per second with the default 3-month retention.
    Check the [resource recommendation guide][promscale-resource-recomm] for configuring the compute and
    disk size based on your ingestion rate and retention.

    <Highlight type="note">
    Make sure the Promscale Connector and the service in Timescale are
    in the same region. Ideally, the latency between the Promscale
    Connector and database should be less than 100&nbsp;ms.
    </Highlight>

1.  Click `Create service`.
1.  In the `Services` tab, find the service you want to connect to, and check
    it is marked as `Running`.
1.  Click the name of the service you want to connect to see the connection
    information. Take a note of the `Service URL`.

</Procedure>

[timescale-cloud]: https://console.cloud.timescale.com/
[promscale-resource-recomm]: /promscale/latest/recommendations/resource-recomm/
