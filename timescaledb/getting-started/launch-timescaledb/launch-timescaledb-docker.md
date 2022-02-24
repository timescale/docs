# Launch your first instance of TimescaleDB using Docker

### Step 1: Download and install Docker

To install and launch TimescaleDB using Docker, you first need to install Docker on your machine. 
You will find information on downloading and installing Docker on their [getting started page][docker-install]. 

Once you have Docker installed, you can create a TimescaleDB container instance. 

### Create TimescaleDB instance within a Docker container

This tutorial will show you how to create a docker container instance using the [official TimescaleDB docker image][timescale-docker]. While you can use `docker pull timescale/timescaledb` to add the TimescaleDB image to your Docker library, you do not have to. Docker will automatically pull the image if it is not already in your Docker library when running the `docker run` command below. 

To create a Docker container using this image, you need to run the following code. Once you run this command, you will have a TimescaleDB instance on Docker ready to connect to. 

```
docker run -d --name timescaledb -p 127.0.0.1:5432:5432 \
-e POSTGRES_PASSWORD=password timescale/timescaledb:latest-pg14
```

A lot is happening in this code, so let’s break it down:

- `docker run` is the command that triggers the creation of a new container. 
- The `-d` specifies that you want the container to start detached, which will set your container to run in the background.
- The `--name timescaledb` is a flag that allows you to specify the container’s name, which is “timescaledb” in this case.
- The `-p 127.0.0.1:5432:5432` lets Docker know you want to connect your local machines (host 127.0.0.1) 5432 port to the containers 5432 port (the default PostgreSQL port). By doing this, you can connect to the PostgreSQL 5432 port within the container from our local machine's 5432 port.  
- The `-e POSTGRES_PASSWORD=password` is a flag that sets the PostgreSQL database's password
-  And finally, the `timescale/timescaledb:lastest-pg14` lets Docker know the image it should use when creating the container

The last portion, `latest-pg14`, of the command `timescale/timescaledb:lastest-pg14` specifies that the TimescaleDB version should be the latest, and the PostgreSQL version should be 14. You can select different versions of TimescaleDB and PostgreSQL. However, we recommend using the latest version of TimescaleDB and PostgreSQL that we support. 


[docker-install]: https://www.docker.com/get-started
[timescale-docker]: https://hub.docker.com/r/timescale/timescaledb
