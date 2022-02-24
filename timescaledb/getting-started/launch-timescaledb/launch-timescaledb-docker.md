# Launch your first instance of TimescaleDB using Docker
You can create a Docker container to launch your first instance of TimescaleDB.
Timescale provides an [official Docker image][timescale-docker].

Before you begin, make sure you have installed Docker. For installation
instructions, see [Docker's getting started guide][docker-install]. 

## Create a TimescaleDB instance within a Docker container
Create a TimescaleDB instance in a Docker container using the [official
TimescaleDB Docker image][timescale-docker]:
```
docker run -d --name timescaledb -p 127.0.0.1:5432:5432 \
-e POSTGRES_PASSWORD=password timescale/timescaledb:latest-pg14
```

This command does several things:

|Command, argument, or flag|Description|
|-|-|
|`docker run`|Creates a new container|
|`-d`|Runs the container in detached mode, which means it runs in the background|
|`--name timescaledb`|Specifies the container's name as `timescaledb`. You can choose another name if you want.|
|`--p 127.0.0.1:5432:5432`|Allows you to connect to the container's 5432 port from your local machine's 5432 port. 5432 is the default PostgreSQL port. 127.0.0.01 is the IP address for localhost.|
|`-e POSTGRES_PASSWORD=password`|Sets the PostgreSQL database's password|
|`timescale/timescaledb`|Tells Docker to use the TimescaleDB image to create the container|
|`:lastest-pg14`|Specifies the latest version of TimescaleDB and PostgreSQL version 14. You can select different versions of either, but the latest versions give you all the latest features and fixes.|

<highlight type="note">
You can also use `docker pull timescale/timescaledb` to add the TimescaleDB
image to your Docker library, but you don't have to. When you use the `docker
run` command provided, Docker automatically pulls the image if it isn't already
in your Docker library.
</highlight>

<!-- 
Now that you've created your database service... 
TODO: add suggestions for next content
-->

[docker-install]: https://www.docker.com/get-started
[timescale-docker]: https://hub.docker.com/r/timescale/timescaledb
