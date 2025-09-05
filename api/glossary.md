# Glossary

This glossary defines technical terms, concepts, and terminology used in $COMPANY documentation, database industry, and real-time analytics.

## A

**ACL (Access Control List)**: a table that tells a computer operating system which access rights each user has to a particular system object, such as a file directory or individual file.

**ACID**: a set of properties (atomicity, consistency, isolation, durability) that guarantee database transactions are processed reliably.

**ACID compliance**: a set of database properties—Atomicity, Consistency, Isolation, Durability—ensuring reliable and consistent transactions. Inherited from $PG.

**Adaptive query optimization**: dynamic query plan adjustment based on actual execution statistics and data distribution patterns, improving performance over time.

**Aggregate (Continuous Aggregate)**: a materialized, precomputed summary of query results over time-series data, providing faster access to analytics.

**Alerting**: the process of automatically notifying administrators when predefined conditions or thresholds are met in system monitoring.

**Analytics database**: a system optimized for large-scale analytical queries, supporting complex aggregations, time-based queries, and data exploration.

**Anomaly detection**: the identification of abnormal patterns or outliers within time-series datasets, common in observability, IoT, and finance.

**Append-only storage**: a storage pattern where data is only added, never modified in place. Ideal for time-series workloads and audit trails.

**Archival**: the process of moving old or infrequently accessed data to long-term, cost-effective storage solutions.

**Auto-partitioning**: automatic division of a $HYPERTABLE into chunks based on partitioning dimensions to optimize scalability and performance.

**Availability zone**: an isolated location within a cloud region that provides redundant power, networking, and connectivity.

## B

**B-tree**: a self-balancing tree data structure that maintains sorted data and allows searches, sequential access, insertions, and deletions in logarithmic time.

**Background job**: an automated task that runs in the background without user intervention, typically for maintenance operations like compression or data retention.

**Background worker**: a $PG process that runs background tasks independently of client sessions.

**Batch processing**: handling data in grouped batches rather than as individual real-time events, often used for historical data processing.

**Backfill**: the process of filling in historical data that was missing or needs to be recalculated, often used during migrations or after schema changes.

**Backup**: a copy of data stored separately from the original data to protect against data loss, corruption, or system failure.

**Bloom filter**: a probabilistic data structure that tests set membership with possible false positives but no false negatives. $TIMESCALE_DB uses blocked bloom filters to speed up point lookups by eliminating chunks that don't contain queried values.

**Buffer pool**: memory area where frequently accessed data pages are cached to reduce disk I/O operations.

**BRIN (Block Range Index)**: a $PG index type that stores summaries about ranges of table blocks, useful for large tables with naturally ordered data.

**Bytea**: a $PG data type for storing binary data as a sequence of bytes.

## C

**Cache hit ratio**: the percentage of data requests served from memory cache rather than disk, indicating query performance efficiency.

**Cardinality**: the number of unique values in a dataset or database column.

**Check constraint**: a database constraint that limits the values that can be stored in a column by checking them against a specified condition.

**Chunk**: a horizontal partition of a $HYPERTABLE that contains data for a specific time interval and space partition. See [chunks][use-hypertables-chunks].

**Chunk interval**: the time period covered by each chunk in a $HYPERTABLE, which affects query performance and storage efficiency.

**Chunk skipping**: a query optimization technique that skips chunks not relevant to the query's time range, dramatically improving performance.

**CIDR (Classless Inter-Domain Routing)**: a method for allocating IP addresses and routing IP packets.

**Client credentials**: authentication tokens used by applications to access services programmatically without user interaction.

**Close**: in financial data, the closing price of a security at the end of a trading period.

**Cloud**: computing services delivered over the internet, including servers, storage, databases, networking, software, analytics, and intelligence.

**Cloud deployment**: the use of public, private, or hybrid cloud infrastructure to host $TIMESCALE_DB, enabling elastic scalability and managed services.

**Cloud-native**: an approach to building applications that leverage cloud infrastructure, scalability, and services like Kubernetes.

**Cold storage**: a tier of data storage for infrequently accessed data that offers lower costs but higher access times.

**Columnar**: a data storage format that stores data column by column rather than row by row, optimizing for analytical queries.

**Columnstore**: $TIMESCALE_DB's columnar storage engine optimized for analytical workloads and compression.

**Compression**: the process of reducing data size by encoding information using fewer bits, improving storage efficiency and query performance. See [compression][use-compression].

**Connection pooling**: a technique for managing multiple database connections efficiently, reducing overhead for high-concurrency environments.

**Consensus algorithm**: protocols ensuring distributed systems agree on data state, critical for multi-node database deployments.

**Compression policy**: an automated rule that compresses $HYPERTABLE chunks after they reach a specified age or size threshold.

**Compression ratio**: the ratio between the original data size and the compressed data size, indicating compression effectiveness.

**Constraint**: a rule enforced by the database to maintain data integrity and consistency.

**Continuous aggregate**: a materialized view that incrementally updates with new data, providing fast access to pre-computed aggregations. See [continuous aggregates][use-continuous-aggregates].

**Counter aggregation**: aggregating monotonic counter data, handling counter resets and extrapolation.

**Cron**: a time-based job scheduler in Unix-like computer operating systems.

**Cross-region backup**: a backup stored in a different geographical region from the primary data for disaster recovery.

## D

**Data lake**: a centralized repository storing structured and unstructured data at scale, often integrated with time-series databases for analytics.

**Data lineage**: the tracking of data flow from source to destination, including transformations, essential for compliance and debugging.

**Data pipeline**: automated workflows for moving, transforming, and loading data between systems, often using tools like Apache Kafka or Apache Airflow.

**Data migration**: the process of moving data from one system, storage type, or format to another. See the [migration guides][migrate].

**Data retention**: the practice of storing data for a specified period before deletion, often governed by compliance requirements or storage optimization. See [data retention][use-data-retention].

**Data rollup**: the process of summarizing detailed historical data into higher-level aggregates, balancing storage needs with query efficiency.

**Data skew**: uneven distribution of data across partitions or nodes, potentially causing performance bottlenecks.

**Data tiering**: a storage management strategy that places data on different storage tiers based on access patterns and performance requirements.

**Data type**: a classification that specifies which type of value a variable can hold, such as integer, string, or boolean.

**Decompress**: the process of restoring compressed data to its original, uncompressed state.

**Delta**: the difference between two values, commonly used in counter aggregations to calculate the change over time.

**DHCP (Dynamic Host Configuration Protocol)**: a network management protocol used to automatically assign IP addresses and other network configuration parameters.

**Dimension**: a partitioning key in a $HYPERTABLE that determines how data is distributed across chunks.

**Disaster recovery**: the process and procedures for recovering and protecting a business's IT infrastructure in the event of a disaster.

**Double precision**: a floating-point data type that provides more precision than the standard float type.

**Downsample**: the process of reducing the temporal resolution of time-series data by aggregating data points over longer time intervals.

**Downtime**: the period during which a system, service, or application is unavailable or not operational.

**Dual-write and backfill**: a migration approach where new data is written to both the source and target databases simultaneously, followed by backfilling historical data to ensure completeness.

**Dual-write**: a migration pattern where applications write data to both the source and target systems simultaneously.

## E

**Edge computing**: processing data at or near the data source such as IoT devices, rather than solely in centralized servers, reducing latency.

**Edge gateway**: a device that aggregates data from sensors and performs preprocessing before sending data to cloud or centralized databases.

**ELT (Extract, Load, Transform)**: a data pipeline pattern where raw data is loaded first, then transformed within the target system, leveraging database processing power.

**Embedding**: a vector representation of data such as text or images, that captures semantic meaning in a high-dimensional space.

**Error rate**: the percentage of requests or operations that result in errors over a given time period.

**Euclidean distance**: a measure of the straight-line distance between two points in multidimensional space.

**Explain**: a $PG command that shows the execution plan for a query, useful for performance analysis.

**Event sourcing**: an architectural pattern storing all changes as a sequence of events, naturally fitting time-series database capabilities.

**Event-driven architecture**: a design pattern where components react to events such as sensor readings, requiring real-time data pipelines and storage.

**Extension**: a $PG add-on that extends the database's functionality beyond the core features.

## F

**Fact table**: the central table in a star schema containing quantitative measures, often time-series data with foreign keys to dimension tables.

**Failover**: the automatic switching to a backup system, server, or network upon the failure or abnormal termination of the primary system.

**Financial time-series**: high-volume, timestamped datasets like stock market feeds or trade logs, requiring low-latency, scalable databases like $TIMESCALE_DB.

**Foreign key**: a database constraint that establishes a link between data in two tables by referencing the primary key of another table.

**Fork**: a copy of a database service that shares the same data but can diverge independently through separate writes.

**FTP (File Transfer Protocol)**: a standard network protocol used for transferring files between a client and server on a computer network.

## G

**Gap filling**: a technique for handling missing data points in time-series by interpolation or other methods, often implemented with hyperfunctions.

**GIN (Generalized Inverted Index)**: a $PG index type designed for indexing composite values and supporting fast searches.

**GiST (Generalized Search Tree)**: a $PG index type that provides a framework for implementing custom index types.

**GP-LTTB**: an advanced downsampling algorithm that extends Largest-Triangle-Three-Buckets with Gaussian Process modeling.

**GUC (Grand Unified Configuration)**: $PG's configuration parameter system that controls various aspects of database behavior.

**GUID (Globally Unique Identifier)**: a unique identifier used in software applications, typically represented as a 128-bit value.

## H

**Hash**: an index type that provides constant-time lookups for equality comparisons but doesn't support range queries.

**High-cardinality**: refers to datasets with a large number of unique values, which can strain storage and indexing in time-series applications.

**Histogram bucket**: a predefined range of metrics organized for statistical analysis, commonly visualized in monitoring tools.

**Hot standby**: a replication configuration where the standby server can serve read-only queries while staying synchronized with the primary.

**High availability**: a system design that ensures an agreed level of operational performance, usually uptime, for a higher than normal period.

**High**: in financial data, the highest price of a security during a specific time period.

**Histogram**: a graphical representation of the distribution of numerical data, showing the frequency of data points in different ranges.

**Historical data**: previously recorded data that provides context and trends for analysis and decision-making.

**HNSW (Hierarchical Navigable Small World)**: a graph-based algorithm for approximate nearest neighbor search in high-dimensional spaces.

**Hot storage**: a tier of data storage for frequently accessed data that provides the fastest access times but at higher cost.

**Hypercore**: $TIMESCALE_DB's hybrid storage engine that seamlessly combines row and column storage for optimal performance. See [Hypercore][use-hypercore].

**Hyperfunction**: an SQL function in $TIMESCALE_DB designed for time-series analysis, statistics, and specialized computations. See [Hyperfunctions][use-hyperfunctions].

**HyperLogLog**: a probabilistic data structure used for estimating the cardinality of large datasets with minimal memory usage.

**Hypershift**: a migration tool and strategy for moving data to $TIMESCALE_DB with minimal downtime.

**Hypertable**: $TIMESCALE_DB's core abstraction that automatically partitions time-series data for scalability. See [Hypertables][use-hypertables].

## I

**Idempotency**: the property where repeated operations produce the same result, crucial for reliable data ingestion and processing.

**Ingest rate**: the speed at which new data is written to the system, measured in rows per second. Critical for IoT and observability.

**Inner product**: a mathematical operation that combines two vectors to produce a scalar, used in similarity calculations.

**Insert**: an SQL operation that adds new rows of data to a database table.

**Integer**: a data type that represents whole numbers without decimal points.

**Intercept**: a statistical measure representing the y-intercept in linear regression analysis.

**Internet gateway**: an AWS VPC component that enables communication between instances in a VPC and the internet.

**Interpolation**: a method of estimating unknown values that fall between known data points.

**IP allow list**: a security feature that restricts access to specified IP addresses or ranges.

**Isolation level**: a database transaction property that defines the degree to which operations in one transaction are isolated from those in other concurrent transactions.

## J

**Job**: an automated task scheduled to run at specific intervals or triggered by certain conditions.

**Job execution**: the process of running scheduled background tasks or automated procedures.

**JIT (Just-In-Time) compilation**: $PG feature that compiles frequently executed query parts for improved performance, available in $TIMESCALE_DB.

**Job history**: a record of past job executions, including their status, duration, and any errors encountered.

**JSON (JavaScript Object Notation)**: a lightweight data interchange format that is easy for humans to read and write.

**JWT (JSON Web Token)**: a compact, URL-safe means of representing claims to be transferred between two parties.

## L

**Latency**: the time delay between a request being made and the response being received.

**Lifecycle policy**: a set of rules that automatically manage data throughout its lifecycle, including retention and deletion.

**Live migration**: a data migration technique that moves data with minimal or zero downtime.

**Load balancer**: a service distributing traffic across servers or database nodes to optimize resource use and avoid single points of failure.

**Log-Structured Merge (LSM) Tree**: a data structure optimized for write-heavy workloads, though $TIMESCALE_DB primarily uses B-tree indexes for balanced read/write performance.

**LlamaIndex**: a framework for building applications with large language models, providing tools for data ingestion and querying.

**LOCF (Last Observation Carried Forward)**: a method for handling missing data by using the most recent known value.

**Logical backup**: a backup method that exports data in a human-readable format, allowing for selective restoration.

**Logical replication**: a $PG feature that replicates data changes at the logical level rather than the physical level.

**Logging**: the process of recording events, errors, and system activities for monitoring and troubleshooting purposes.

**Low**: in financial data, the lowest price of a security during a specific time period.

**LTTB (Largest-Triangle-Three-Buckets)**: a downsampling algorithm that preserves the visual characteristics of time-series data.

## M

**Manhattan distance**: a distance metric calculated as the sum of the absolute differences of their coordinates.

**Manual compression**: the process of compressing chunks manually rather than through automated policies.

**Materialization**: the process of computing and storing the results of a query or view for faster access.

**Materialized view**: a database object that stores the result of a query and can be refreshed periodically.

**Memory-optimized query**: a query pattern designed to minimize disk I/O by leveraging available RAM and efficient data structures.

**Metric**: a quantitative measurement used to assess system performance, business outcomes, or operational efficiency.

**MFA (Multi-Factor Authentication)**: a security method that requires two or more verification factors to grant access.

**Migration**: the process of moving data, applications, or systems from one environment to another. See [migration guides][migrate].

**Monitoring**: the continuous observation and measurement of system performance and health.

**Multi-tenancy**: an architecture pattern supporting multiple customers or applications within a single database instance, with proper isolation.

**MQTT (Message Queuing Telemetry Transport)**: a lightweight messaging protocol designed for small sensors and mobile devices.

**MST (Managed Service for TimescaleDB)**: a fully managed $TIMESCALE_DB service that handles infrastructure and maintenance tasks.

## N

**NAT Gateway**: a network address translation service that enables instances in a private subnet to connect to the internet.

**Node (database node)**: an individual server within a distributed system, contributing to storage, compute, or replication tasks.

**Normalization**: database design technique organizing data to reduce redundancy, though time-series data often benefits from denormalized structures.

**Not null**: a database constraint that ensures a column cannot contain empty values.

**Numeric**: a $PG data type for storing exact numeric values with user-defined precision.

## O

**OAuth**: an open standard for access delegation commonly used for token-based authentication and authorization.

**Observability**: the ability to measure the internal states of a system by examining its outputs.

**OLAP (Online Analytical Processing)**: systems or workloads focused on large-scale, multidimensional, and complex analytical queries.

**OLTP (Online Transaction Processing)**: high-speed transactional systems optimized for data inserts, updates, and short queries.

**OHLC**: an acronym for Open, High, Low, Close prices, commonly used in financial data analysis.

**OHLCV**: an extension of OHLC that includes Volume data for complete candlestick analysis.

**Open**: in financial data, the opening price of a security at the beginning of a trading period.

**OpenTelemetry**: open standard for collecting, processing, and exporting telemetry data, often stored in time-series databases.

**Optimization**: the process of making systems, queries, or operations more efficient and performant.

## P

**Parallel copy**: a technique for copying large amounts of data using multiple concurrent processes to improve performance.

**Parallel Query Execution**: a $PG feature that uses multiple CPU cores to execute single queries faster, inherited by $TIMESCALE_DB.

**Partitioning**: the practice of dividing large tables into smaller, more manageable pieces based on certain criteria.

**Percentile**: a statistical measure that indicates the value below which a certain percentage of observations fall.

**Performance**: a measure of how efficiently a system operates, often quantified by metrics like throughput, latency, and resource utilization.

**pg_basebackup**: a $PG utility for taking base backups of a running $PG cluster.

**pg_dump**: a $PG utility for backing up database objects and data in various formats.

**pg_restore**: a $PG utility for restoring databases from backup files created by `pg_dump`.

**pgVector**: a $PG extension that adds vector similarity search capabilities for AI and machine learning applications. See [pgvector][ai-pgvector].

**pgai on Tiger Cloud**: a cloud solution for building search, RAG, and AI agents with $PG. Enables calling AI embedding and generation models directly from the database using SQL. See [pgai][ai-pgai].

**pgvectorscale**: a performance enhancement for pgvector featuring StreamingDiskANN indexing, binary quantization compression, and label-based filtering. See [pgvectorscale][ai-pgvectorscale].

**pgvectorizer**: a $TIMESCALE_DB tool for automatically vectorizing and indexing data for similarity search.

**Physical backup**: a backup method that copies the actual database files at the storage level.

**PITR (Point-in-Time Recovery)**: the ability to restore a database to a specific moment in time.

**Policy**: an automated rule or procedure that performs maintenance tasks like compression, retention, or refresh operations.

**Predictive maintenance**: the use of time-series data to forecast equipment failure, common in IoT and industrial applications.

**$PG**: an open-source object-relational database system known for its reliability, robustness, and performance.

**PostGIS**: a $PG extension that adds support for geographic objects and spatial queries.

**Primary key**: a database constraint that uniquely identifies each row in a table.

**psql**: an interactive terminal-based front-end to $PG that allows users to type queries interactively.

## Q

**QPS (Queries Per Second)**: a measure of database performance indicating how many queries a database can process per second.

**Query**: a request for data or information from a database, typically written in SQL.

**Query performance**: a measure of how efficiently database queries execute, including factors like execution time and resource usage.

**Query planner/optimizer**: a component determining the most efficient strategy for executing SQL queries based on database structure and indexes.

**Query planning**: the database process of determining the most efficient way to execute a query.

## R

**RBAC (Role-Based Access Control)**: a security model that assigns permissions to users based on their roles within an organization.

**Read committed**: an isolation level where transactions can read committed changes made by other transactions.

**Read scaling**: a technique for improving database performance by distributing read queries across multiple database replicas.

**Read uncommitted**: the lowest isolation level where transactions can read uncommitted changes from other transactions.

**Read-only role**: a database role with permissions limited to reading data without modification capabilities.

**Read replica**: a copy of the primary database that serves read-only queries, improving read scalability and geographic distribution.

**Real-time analytics**: the immediate analysis of incoming data streams, crucial for observability, trading platforms, and IoT monitoring.

**Real**: a $PG data type for storing single-precision floating-point numbers.

**Real-time aggregate**: a continuous aggregate that includes both materialized historical data and real-time calculations on recent data.

**Refresh policy**: an automated rule that determines when and how continuous aggregates are updated with new data.

**Region**: a geographical area containing multiple data centers, used in cloud computing for data locality and compliance.

**Repeatable read**: an isolation level that ensures a transaction sees a consistent snapshot of data throughout its execution.

**Replica**: a copy of a database that can be used for read scaling, backup, or disaster recovery purposes.

**Replication**: the process of copying and maintaining data across multiple database instances to ensure availability and durability.

**Response time**: the time it takes for a system to respond to a request, measured from request initiation to response completion.

**REST API**: a web service architecture that uses HTTP methods to enable communication between applications.

**Restore**: the process of recovering data from backups to restore a database to a previous state.

**Restore point**: a snapshot of database state that can be used as a reference point for recovery operations.

**Retention policy**: an automated rule that determines how long data is kept before being deleted from the system.

**Route table**: a set of rules that determine where network traffic is directed within a cloud network.

**RTO (Recovery Time Objective)**: the maximum acceptable time that systems can be down after a failure or disaster.

**RPO (Recovery Point Objective)**: the maximum acceptable amount of data loss measured in time after a failure or disaster.

**Rowstore**: traditional row-oriented data storage where data is stored row by row, optimized for transactional workloads.

## S

**SAML (Security Assertion Markup Language)**: an XML-based standard for exchanging authentication and authorization data between security domains.

**Scheduled job**: an automated task that runs at predetermined times or intervals.

**Schema evolution**: the process of modifying database structure over time while maintaining compatibility with existing applications.

**Schema**: the structure of a database, including tables, columns, relationships, and constraints.

**Security group**: a virtual firewall that controls inbound and outbound traffic for cloud resources.

**Service discovery**: mechanisms allowing applications to dynamically locate services like database endpoints, often used in distributed environments.

**Segmentwise recompression**: a $TIMESCALE_DB compression technique that recompresses data segments to improve compression ratios.

**Serializable**: the highest isolation level that ensures transactions appear to run serially even when executed concurrently.

**Sharding**: horizontal partitioning of data across multiple database instances, distributing load and enabling linear scalability.

**SFTP (SSH File Transfer Protocol)**: a secure version of FTP that encrypts both commands and data during transmission.

**SkipScan**: query optimization for DISTINCT operations that incrementally jumps between ordered values without reading intermediate rows. Uses a Custom Scan node to efficiently traverse ordered indexes, dramatically improving performance over traditional DISTINCT queries.

**Similarity search**: a technique for finding items that are similar to a given query item, often used with vector embeddings.

**SLA (Service Level Agreement)**: a contract that defines the expected level of service between a provider and customer.

**SLI (Service Level Indicator)**: a quantitative measure of some aspect of service quality.

**SLO (Service Level Objective)**: a target value or range for service quality measured by an SLI.

**Slope**: a statistical measure representing the rate of change in linear regression analysis.

**SMTP (Simple Mail Transfer Protocol)**: an internet standard for email transmission across networks.

**Snapshot**: a point-in-time copy of data that can be used for backup and recovery purposes.

**SP-GiST (Space-Partitioned Generalized Search Tree)**: a $PG index type for data structures that naturally partition search spaces.

**Storage optimization**: techniques for reducing storage costs and improving performance through compression, tiering, and efficient data organization.

**Streaming data**: continuous flows of data generated by devices, logs, or sensors, requiring high-ingest, real-time storage solutions.

**SQL (Structured Query Language)**: a programming language designed for managing and querying relational databases.

**SSH (Secure Shell)**: a cryptographic network protocol for secure communication over an unsecured network.

**SSL (Secure Sockets Layer)**: a security protocol that establishes encrypted links between networked computers.

**Streaming replication**: a $PG replication method that continuously sends write-ahead log records to standby servers.

**Synthetic monitoring**: simulated transactions or probes used to test system health, generating time-series metrics for performance analysis.

## T

**Table**: a database object that stores data in rows and columns, similar to a spreadsheet.

**Tablespace**: a $PG storage structure that defines where database objects are physically stored on disk.

**TCP (Transmission Control Protocol)**: a connection-oriented protocol that ensures reliable data transmission between applications.

**TDigest**: a probabilistic data structure for accurate estimation of percentiles in distributed systems.

**Telemetry**: the collection of real-time data from systems or devices for monitoring and analysis.

**Text**: a $PG data type for storing variable-length character strings.

**Throughput**: a measure of system performance indicating the amount of work performed or data processed per unit of time.

**Tiered storage**: a storage strategy that automatically moves data between different storage classes based on access patterns and age.

**$CLOUD**: $COMPANY's managed cloud service that provides $TIMESCALE_DB as a fully managed solution with additional features.

**Tiger Lake**: $COMPANY's service for integrating operational databases with data lake architectures.

**Time series**: data points indexed and ordered by time, typically representing how values change over time.

**Time-weighted average**: a statistical calculation that gives more weight to values based on the duration they were held.

**Time bucketing**: grouping timestamps into uniform intervals for analysis, commonly used with hyperfunctions.

**Time-series forecasting**: the application of statistical models to time-series data to predict future trends or events.

**$TIMESCALE_DB**: an open-source $PG extension for real-time analytics that provides scalability and performance optimizations.

**Timestamp**: a data type that stores date and time information without timezone data.

**Timestamptz**: a $PG data type that stores timestamp with timezone information.

**TLS (Transport Layer Security)**: a cryptographic protocol that provides security for communication over networks.

**Tombstone**: marker indicating deleted data in append-only systems, requiring periodic cleanup processes.

**Transaction isolation**: the database property controlling the visibility of uncommitted changes between concurrent transactions.

**TPS (Transactions Per Second)**: a measure of database performance indicating transaction processing capacity.

**Transaction**: a unit of work performed against a database that must be completed entirely or not at all.

**Trigger**: a database procedure that automatically executes in response to certain events on a table or view.

## U

**UDP (User Datagram Protocol)**: a connectionless communication protocol that provides fast but unreliable data transmission.

**Unique**: a database constraint that ensures all values in a column or combination of columns are distinct.

**Uptime**: the amount of time that a system has been operational and available for use.

**Usage-based storage**: a billing model where storage costs are based on actual data stored rather than provisioned capacity.

**UUID (Universally Unique Identifier)**: a 128-bit identifier used to uniquely identify information without central coordination.

## V

**Vacuum**: a $PG maintenance operation that reclaims storage and updates database statistics.

**Varchar**: a variable-length character data type that can store strings up to a specified maximum length.

**Vector operations**: SIMD (Single Instruction, Multiple Data) optimizations for processing arrays of data, improving analytical query performance.

**Vertical scaling (scale up)**: increasing system capacity by adding more power (CPU, RAM) to existing machines, as opposed to horizontal scaling.

**Visualization tool**: a platform or dashboard used to display time-series data in charts, graphs, and alerts for easier monitoring and analysis.

**Vector**: a mathematical object with magnitude and direction, used in machine learning for representing data as numerical arrays.

**VPC (Virtual Private Cloud)**: a virtual network dedicated to your cloud account that provides network isolation.

**VWAP (Volume Weighted Average Price)**: a financial indicator that shows the average price weighted by volume over a specific time period.

## W

**WAL (Write-Ahead Log)**: $PG's method for ensuring data integrity by writing changes to a log before applying them to data files.

**Warm storage**: a storage tier that balances access speed and cost, suitable for data accessed occasionally.

**Watermark**: a timestamp that tracks the progress of continuous aggregate materialization.

**WebSocket**: a communication protocol that provides full-duplex communication channels over a single TCP connection.

**Window function**: an SQL function that performs calculations across related rows, particularly useful for time-series analytics and trend analysis.

**Workload management**: techniques for prioritizing and scheduling different types of database operations to optimize overall system performance.

## X

**XML (eXtensible Markup Language)**: a markup language that defines rules for encoding documents in a format that is both human-readable and machine-readable.

## Y

**YAML (YAML Ain't Markup Language)**: a human-readable data serialization standard commonly used for configuration files.

## Z

**Zero downtime**: a system design goal where services remain available during maintenance, upgrades, or migrations without interruption.

**Zero-downtime migration**: migration strategies that maintain service availability throughout the transition process, often using techniques like dual-write and gradual cutover.

<!-- Link references -->
[use-hypertables]: /use-timescale/:currentVersion:/hypertables/
[use-hypertables-chunks]: /use-timescale/:currentVersion:/hypertables/hypertable-crud/
[use-compression]: /use-timescale/:currentVersion:/compression/
[use-hypercore]: /use-timescale/:currentVersion:/hypercore/
[use-continuous-aggregates]: /use-timescale/:currentVersion:/continuous-aggregates/
[use-hyperfunctions]: /use-timescale/:currentVersion:/hyperfunctions/
[use-data-retention]: /use-timescale/:currentVersion:/data-retention/
[integrations-kafka]: /integrations/:currentVersion:/apache-kafka/
[integrations-grafana]: /integrations/:currentVersion:/grafana/
[integrations-prometheus]: /integrations/:currentVersion:/prometheus/
[migrate]: /migrate/:currentVersion:/
[ai-pgvector]: /ai/:currentVersion:/key-vector-database-concepts-for-understanding-pgvector/
[ai-pgai]: https://github.com/timescale/pgai
[ai-pgvectorscale]: https://github.com/timescale/pgvectorscale
[hyperfunctions-approx-count-distinct]: /use-timescale/:currentVersion:/hyperfunctions/approx-count-distincts/
[hyperfunctions-asap-smooth]: /use-timescale/:currentVersion:/hyperfunctions/gapfilling-interpolation/
[hyperfunctions-candlestick-agg]: /use-timescale/:currentVersion:/hyperfunctions/stats-aggs/
[hyperfunctions-stats-agg]: /use-timescale/:currentVersion:/hyperfunctions/stats-aggs/
