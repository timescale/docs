# Configuration with Docker
If you are running TimescaleDB in a [Docker container][docker], there are two
different ways to modify your PostgreSQL configuration. You can edit the
PostgreSQL configuration file inside the Docker container, or you can set
parameters at the command prompt.

## Edit the PostgreSQL configuration file inside Docker
You can start the Dockert container, and then use a text editor to edit the
PostgreSQL configuration file directly. The configuration file requires one
parameter per line. Blank lines are ignored, and you can use a `#` symbol at the
beginning of a line to denote a comment.

<procedure>

### Editing the PostgreSQL configuration file inside Docker
1.  Start your Docker instance:
```bash
docker start timescaledb
```
1.  Open a shell:
```bash
docker exec -i -t timescaledb /bin/bash
```
1.  Open the configuration file in your opreferred text editor. In this example, we are using ther `Vi` editor:
```bash
vi /var/lib/postgresql/data/postgresql.conf
```
1.  Restart the container to reload the configuration:
```bash
docker restart timescaledb
```

</procedure>

## Setting parameters at the command prompt
If you don't want to open the configuration file to make changes, you can also
set parameters directly from the command prompt inside your Docker container,
using the `-c` option. For example:

```
docker run -i -t timescale/timescaledb:latest-pg10 postgres -c max_wal_size=2GB
```


[docker]: /install/latest/installation-docker/
