When you create and use a hypertable, it automatically partitions data by time,
and optionally by space.

Each hypertable is made up of child tables called chunks. Each chunk is assigned
a range of time, and only contains data from that range. If the hypertable is
also partitioned by space, each chunk is also assigned a subset of the space
values.

Each chunk of a hypertable only holds data from a specific time range. When you
insert data from a time range that doesn't yet have a chunk, Timescale
automatically creates a chunk to store it.

By default, each chunk covers 7 days. You can change this to better suit your
needs. For example, if you set `chunk_time_interval` to 1 day, each chunk stores
data from the same day. Data from different days is stored in different chunks.

<img class="main-content__illustration"
src="https://assets.timescale.com/docs/images/getting-started/hypertables-chunks.webp"
alt="A normal table compared to a hypertable. The normal table holds data for 3 different days in one container. The hypertable contains 3 containers, called chunks, each of which holds data for a separate day."
/>
