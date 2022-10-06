A service in Timescale Cloud is a cloud instance which contains your database.
Each service contains a single database, named `tsdb`.

<procedure>

### Creating your first service

1.  Sign in to the [Timescale Clou portal][https://console.cloud.timescale.com/]
1.  Click `Create service`.
1.  Click  `Advanced configuration` and and set the `Region`, `Compute`and `Disk size`
    for the service.
    To store your observability data it is recommended that you allocate
    a minimum of 4 CPUs, 16GB of Memory and 50GB of disk that is equivalent to 840GB
    of uncompressed data. You can scale up this configuration later when your data
    ingestion and query rate increases.
1.  Click `Create service`. When you have a service up and running, you can connect
    to the service.
1.  In the `Services` tab, find the service you want to connect to, and check
    it is marked as `Running`.
1.  Click the name of the service you want to connect to see the connection
    information. Take a note of the `Service URL`.

</procedure>
