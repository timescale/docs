# Glossary

This glossary defines technical terms, concepts, and terminology used in $COMPANY documentation and the time-series database industry. Each entry follows the Google Developer Style Guide format.

## A

**ACL (Access Control List)**: a table that tells a computer operating system which access rights each user has to a particular system object, such as a file directory or individual file.

**ACID**: a set of properties (Atomicity, Consistency, Isolation, Durability) that guarantee database transactions are processed reliably.

**ACID Compliance**: a set of database properties — Atomicity, Consistency, Isolation, Durability — ensuring reliable and consistent transactions. Inherited from $PG.

**Adaptive Query Optimization**: dynamic query plan adjustment based on actual execution statistics and data distribution patterns, improving performance over time.

**Add_compression_policy**: a $TIMESCALE_DB API function that creates an automated policy to compress chunks after a specified time interval.

**Add_continuous_aggregate_policy**: a $TIMESCALE_DB API function that creates an automated refresh policy for continuous aggregates.

**Add_data_node**: a $TIMESCALE_DB API function used in distributed $HYPERTABLE s to add a new data node to the cluster.

**Add_dimension**: a $TIMESCALE_DB API function that adds a partitioning dimension to an existing $HYPERTABLE.

**Add_retention_policy**: a $TIMESCALE_DB API function that creates an automated policy to drop old chunks after a specified time interval.

**Aggregate (Continuous Aggregate)**: a materialized, precomputed summary of query results over time-series data, providing faster access to analytics.

**Alerting**: the process of automatically notifying administrators when predefined conditions or thresholds are met in system monitoring.

**Analytics Database**: a system optimized for large-scale analytical queries, supporting complex aggregations, time-based queries, and data exploration.

**Anomaly Detection**: the identification of abnormal patterns or outliers within time-series datasets, common in observability, IoT, and finance.

**Apache Airflow**: an open-source platform to develop, schedule, and monitor workflows programmatically.

**Apache Kafka**: a distributed event streaming platform used for building real-time data pipelines and streaming applications.

**Append-Only Storage**: a storage pattern where data is only added, never modified in place, ideal for time-series workloads and audit trails.

**Approx_count_distinct**: a hyperfunction that provides an approximate count of distinct values in a dataset using probabilistic algorithms.

**Archival**: the process of moving old or infrequently accessed data to long-term, cost-effective storage solutions.

**ASAP smooth**: a hyperfunction that provides Automatic Smoothing for Arbitrary-Precision time-series data using statistical smoothing algorithms.

**Attach_chunk**: a $TIMESCALE_DB API function that attaches a standalone table as a chunk to a $HYPERTABLE.

**Attach_data_node**: a $TIMESCALE_DB API function that attaches an existing data node to a distributed $HYPERTABLE.

**Attach_tablespace**: a $TIMESCALE_DB API function that attaches a tablespace to a $HYPERTABLE for chunk storage.

**Auto-Partitioning**: automatic division of a $HYPERTABLE into chunks based on time and space dimensions to optimize scalability and performance.

**Auto_sparse_indexes**: a $TIMESCALE_DB configuration parameter that automatically creates sparse indexes on compressed chunks.

**Availability zone**: an isolated location within a cloud region that provides redundant power, networking, and connectivity.

**AWS (Amazon Web Services)**: a comprehensive cloud computing platform provided by Amazon that includes infrastructure as a service, platform as a service, and packaged software as a service offerings.

**Azure**: Microsoft's cloud computing service for building, testing, deploying, and managing applications and services.

## B

**B-tree**: a self-balancing tree data structure that maintains sorted data and allows searches, sequential access, insertions, and deletions in logarithmic time.

**Background jobs**: automated tasks that run in the background without user intervention, typically for maintenance operations like compression or data retention.

**Background worker**: a $PG process that runs background tasks independently of client sessions.

**Batch Processing**: handling data in grouped batches rather than as individual real-time events, often used for historical data processing.

**Backfill**: the process of filling in historical data that was missing or needs to be recalculated, often used during migrations or after schema changes.

**Backup**: a copy of data stored separately from the original data to protect against data loss, corruption, or system failure.

**Bgw_log_level**: a $TIMESCALE_DB configuration parameter that controls the logging level for background workers.

**Bloom Filters**: probabilistic data structures that test set membership with possible false positives but no false negatives. $TIMESCALE_DB uses blocked bloom filters to speed up point lookups by eliminating chunks that don't contain queried values.

**Boolean**: a data type that can hold one of two values: true or false.

**Buffer Pool**: memory area where frequently accessed data pages are cached to reduce disk I/O operations.

**BRIN (Block Range Index)**: a $PG index type that stores summaries about ranges of table blocks, useful for large tables with naturally ordered data.

**Bytea**: a $PG data type for storing binary data as a sequence of bytes.

## C

**CAGG**: abbreviation for continuous aggregate, a materialized view that automatically updates with new data.

**CAGGs**: plural form of CAGG, referring to multiple continuous aggregates.

**Cache Hit Ratio**: the percentage of data requests served from memory cache rather than disk, indicating query performance efficiency.

**Candlestick_agg**: a hyperfunction that creates OHLC (Open, High, Low, Close) candlestick aggregates commonly used in financial data analysis.

**Cardinality**: the number of unique values in a dataset or database column.

**Check constraint**: a database constraint that limits the values that can be stored in a column by checking them against a specified condition.

**Chunk**: a horizontal partition of a $HYPERTABLE that contains data for a specific time interval and space partition.

**Chunk interval**: the time period covered by each chunk in a $HYPERTABLE, which affects query performance and storage efficiency.

**Chunk skipping**: an optimization technique that avoids reading chunks that don't contain relevant data for a query.

**Chunk Exclusion**: query optimization technique that skips chunks not relevant to the query's time range, dramatically improving performance.

**CIDR (Classless Inter-Domain Routing)**: a method for allocating IP addresses and routing Internet Protocol packets.

**Client credentials**: authentication tokens used by applications to access services programmatically without user interaction.

**Close**: in financial data, the closing price of a security at the end of a trading period.

**Cloud**: computing services delivered over the internet, including servers, storage, databases, networking, software, analytics, and intelligence.

**CloudFormation**: an AWS service that provides a common language for describing and provisioning cloud infrastructure resources.

**CloudWatch**: an AWS monitoring and observability service for cloud resources and applications.

**Cloud Deployments**: the use of public, private, or hybrid cloud infrastructure to host $TIMESCALE_DB, enabling elastic scalability and managed services.

**Cloud-Native**: an approach to building applications that leverage cloud infrastructure, scalability, and services like Kubernetes or managed $TIMESCALE_DB.

**Cold storage**: a tier of data storage for infrequently accessed data that offers lower costs but higher access times.

**Columnar**: a data storage format that stores data column by column rather than row by row, optimizing for analytical queries.

**Columnstore**: $TIMESCALE_DB's columnar storage engine optimized for analytical workloads and compression.

**Compact_state_agg**: a hyperfunction that aggregates state data with compression for efficient storage and analysis.

**Compression**: the process of reducing data size by encoding information using fewer bits, improving storage efficiency and query performance.

**Connection Pooling**: a technique for managing multiple database connections efficiently, reducing overhead for high-concurrency environments.

**Consensus Algorithm**: protocols ensuring distributed systems agree on data state, critical for multi-node database deployments.

**Compression policy**: an automated rule that compresses $HYPERTABLE chunks after they reach a specified age or size threshold.

**Compression ratio**: the ratio between the original data size and the compressed data size, indicating compression effectiveness.

**Compress_chunk**: a $TIMESCALE_DB API function that manually compresses a specific chunk.

**Compress_truncate_behaviour**: a $TIMESCALE_DB configuration parameter that controls how compression handles data truncation.

**Configuration**: the set of parameters and settings that control how a database system operates.

**Constraint**: a rule enforced by the database to maintain data integrity and consistency.

**Continuous aggregate**: a materialized view that incrementally updates with new data, providing fast access to pre-computed aggregations.

**Continuous aggregates**: plural form of continuous aggregate.

**Convert_to_columnstore**: a $TIMESCALE_DB API function that converts chunks to columnar storage format.

**Convert_to_rowstore**: a $TIMESCALE_DB API function that converts chunks back to row-oriented storage format.

**Corr**: a hyperfunction that calculates the correlation coefficient between two variables.

**Counter aggregation**: a hyperfunction category for aggregating monotonic counter data, handling counter resets and extrapolation.

**Counter_agg**: a hyperfunction that aggregates counter metrics, handling resets and providing rate calculations.

**Counter_zero_time**: a hyperfunction that finds when a counter value was zero.

**CPU (Central Processing Unit)**: the primary component of a computer that performs most of the processing inside a computer.

**Create_hypertable**: the primary $TIMESCALE_DB API function that converts a regular $PG table into a $HYPERTABLE.

**Create_materialized_view**: a $TIMESCALE_DB API function that creates a continuous aggregate as a materialized view.

**Cron**: a time-based job scheduler in Unix-like computer operating systems.

**Cross-region backup**: a backup stored in a different geographical region from the primary data for disaster recovery.

**CSV (Comma-Separated Values)**: a simple file format used to store tabular data where each line represents a row and commas separate the columns.

## D

**Dashboard**: a visual display of key metrics, indicators, and data points relevant to monitoring system performance.

**Data Lake**: a centralized repository storing structured and unstructured data at scale, often integrated with time-series databases for analytics.

**Data Lineage**: the tracking of data flow from source to destination, including transformations, essential for compliance and debugging.

**Data Pipeline**: automated workflows for moving, transforming, and loading data between systems, often using tools like Apache Kafka or Apache Airflow.

**Data migration**: the process of moving data from one system, storage type, or format to another.

**Data retention**: the practice of storing data for a specified period before deletion, often governed by compliance requirements or storage optimization.

**Data Rollup**: the process of summarizing detailed historical data into higher-level aggregates, balancing storage needs with query efficiency.

**Data Skew**: uneven distribution of data across partitions or nodes, potentially causing performance bottlenecks.

**Data tiering**: a storage management strategy that places data on different storage tiers based on access patterns and performance requirements.

**Data type**: a classification that specifies which type of value a variable can hold, such as integer, string, or boolean.

**Datadog**: a monitoring and analytics platform for cloud applications, infrastructure, logs, and more.

**Database**: an organized collection of structured information or data stored electronically in a computer system.

**DBeaver**: a universal database tool for developers, database administrators, and analysts with support for multiple database platforms.

**Dead_ranges**: a hyperfunction result that identifies time periods when a system was not operational.

**Debezium**: an open-source platform for change data capture that turns changes in databases into event streams.

**Decompress**: the process of restoring compressed data to its original, uncompressed state.

**Decompress_chunk**: a $TIMESCALE_DB API function that decompresses a previously compressed chunk.

**Delete_data_node**: a $TIMESCALE_DB API function that removes a data node from a distributed $HYPERTABLE cluster.

**Delta**: the difference between two values, commonly used in counter aggregations to calculate the change over time.

**Detach_chunk**: a $TIMESCALE_DB API function that removes a chunk from a $HYPERTABLE, converting it back to a regular table.

**Detach_data_node**: a $TIMESCALE_DB API function that detaches a data node from a distributed $HYPERTABLE.

**Detach_tablespace**: a $TIMESCALE_DB API function that removes a tablespace association from a $HYPERTABLE.

**DHCP (Dynamic Host Configuration Protocol)**: a network management protocol used to automatically assign IP addresses and other network configuration parameters.

**Dimension**: a partitioning key in a $HYPERTABLE that determines how data is distributed across chunks.

**Disaster recovery**: the process and procedures for recovering and protecting a business's IT infrastructure in the event of a disaster.

**Disable_chunk_skipping**: a $TIMESCALE_DB API function that turns off chunk skipping optimization for a $HYPERTABLE.

**Distinct_count**: a hyperfunction that counts the number of unique values in a dataset.

**Distributed hypertable**: a $HYPERTABLE that spans multiple $PG instances (data nodes) for horizontal scaling.

**DNS (Domain Name System)**: a hierarchical naming system for computers, services, or other resources connected to the internet or a private network.

**Docker**: a platform that uses OS-level virtualization to deliver software in packages called containers.

**Double precision**: a floating-point data type that provides more precision than the standard float type.

**Downsample**: the process of reducing the temporal resolution of time-series data by aggregating data points over longer time intervals.

**Downtime**: the period during which a system, service, or application is unavailable or not operational.

**Drop_chunks**: a $TIMESCALE_DB API function that removes chunks from a $HYPERTABLE, typically used for data retention.

**Drop_materialized_view**: a $TIMESCALE_DB API function that removes a continuous aggregate.

**Dual-write and Backfill**: a migration approach where new data is written to both the source and target databases simultaneously, followed by backfilling historical data to ensure completeness.

**Dual-write**: a migration pattern where applications write data to both the source and target systems simultaneously.

**Duration_in**: a hyperfunction that calculates the total time spent in specific states.

## E

**Edge Computing**: processing data at or near the data source such as IoT devices, rather than solely in centralized servers, reducing latency.

**Edge Gateway**: a device that aggregates data from sensors and performs preprocessing before sending data to cloud or centralized databases.

**ELT (Extract, Load, Transform)**: a data pipeline pattern where raw data is loaded first, then transformed within the target system, leveraging database processing power.

**Embedding**: a vector representation of data such as text or images, that captures semantic meaning in a high-dimensional space.

**Enable_chunk_skipping**: a $TIMESCALE_DB API function that enables the chunk skipping optimization for improved query performance.

**Error rate**: the percentage of requests or operations that result in errors over a given time period.

**Euclidean distance**: a measure of the straight-line distance between two points in multidimensional space.

**Explain**: a $PG command that shows the execution plan for a query, useful for performance analysis.

**Event Sourcing**: an architectural pattern storing all changes as a sequence of events, naturally fitting time-series database capabilities.

**Event-Driven Architecture**: a design pattern where components react to events such as sensor readings, requiring real-time data pipelines and storage.

**Extension**: a $PG add-on that extends the database's functionality beyond the core features.

**Extrapolated_delta**: a hyperfunction that estimates the change in a counter value by extrapolating from available data points.

**Extrapolated_rate**: a hyperfunction that calculates the rate of change by extrapolating counter values over time.

## F

**Fact Table**: the central table in a star schema containing quantitative measures, often time-series data with foreign keys to dimension tables.

**Failover**: the automatic switching to a backup system, server, or network upon the failure or abnormal termination of the primary system.

**Financial Time-Series**: high-volume, timestamped datasets like stock market feeds or trade logs, requiring low-latency, scalable databases like $TIMESCALE_DB.

**Fivetran**: a cloud-based data integration service that replicates data from various sources to data warehouses.

**Foreign key**: a database constraint that establishes a link between data in two tables by referencing the primary key of another table.

**Fork**: a copy of a database service that shares the same data but can diverge independently through separate writes.

**Freq_agg**: a hyperfunction that analyzes the frequency distribution of values in a dataset.

**FTP (File Transfer Protocol)**: a standard network protocol used for transferring files between a client and server on a computer network.

## G

**Gap Filling**: technique for handling missing data points in time-series by interpolation or other methods, often implemented with hyperfunctions.

**Gauge_agg**: a hyperfunction that aggregates gauge metrics, which represent instantaneous values that can increase or decrease.

**Gauge_zero_time**: a hyperfunction that identifies when a gauge metric was at zero value.

**GCP (Google Cloud Platform)**: Google's suite of cloud computing services running on the same infrastructure that Google uses internally.

**GIN (Generalized Inverted Index)**: a $PG index type designed for indexing composite values and supporting fast searches.

**GiST (Generalized Search Tree)**: a $PG index type that provides a framework for implementing custom index types.

**GP-LTTB**: an advanced downsampling algorithm that extends Largest-Triangle-Three-Buckets with Gaussian Process modeling.

**Grafana**: an open-source analytics and monitoring solution for visualizing time-series data.

**GUC (Grand Unified Configuration)**: $PG's configuration parameter system that controls various aspects of database behavior.

**GUID (Globally Unique Identifier)**: a unique identifier used in software applications, typically represented as a 128-bit value.

## H

**Hash**: an index type that provides constant-time lookups for equality comparisons but doesn't support range queries.

**High-Cardinality**: refers to datasets with a large number of unique values, which can strain storage and indexing in time-series applications.

**Histogram Buckets**: organizing metrics into predefined ranges for statistical analysis, commonly visualized in monitoring tools.

**Hot Standby**: a replication configuration where the standby server can serve read-only queries while staying synchronized with the primary.

**Heartbeat_agg**: a hyperfunction that monitors system health by analyzing patterns in heartbeat or health check timestamps.

**Helm**: a package manager for Kubernetes that helps manage Kubernetes applications through charts.

**High availability**: a system design that ensures an agreed level of operational performance, usually uptime, for a higher than normal period.

**High**: in financial data, the highest price of a security during a specific time period.

**Histogram**: a graphical representation of the distribution of numerical data, showing the frequency of data points in different ranges.

**Historical data**: previously recorded data that provides context and trends for analysis and decision-making.

**HNSW (Hierarchical Navigable Small World)**: a graph-based algorithm for approximate nearest neighbor search in high-dimensional spaces.

**Hot storage**: a tier of data storage for frequently accessed data that provides the fastest access times but at higher cost.

**HTTP (Hypertext Transfer Protocol)**: an application protocol for distributed, collaborative, hypermedia information systems.

**HTTPS (Hypertext Transfer Protocol Secure)**: an extension of HTTP that uses encryption for secure communication over networks.

**Hypercore**: $TIMESCALE_DB's hybrid storage engine that seamlessly combines row and column storage for optimal performance.

**Hypercore Storage Engine**: a hybrid row-columnar storage system within $TIMESCALE_DB, optimizing performance for compressed and analytical workloads.

**Hyperfunctions**: a collection of SQL functions in $TIMESCALE_DB designed for time-series analysis, statistics, and specialized computations.

**HyperLogLog**: a probabilistic data structure used for estimating the cardinality of large datasets with minimal memory usage.

**Hypershift**: a migration tool and strategy for moving data to $TIMESCALE_DB with minimal downtime.

**Hypertable**: $TIMESCALE_DB's core abstraction that automatically partitions time-series data across time and space dimensions for scalability.

**Hypertables**: plural form of $HYPERTABLE.

## I

**Idempotency**: the property where repeated operations produce the same result, crucial for reliable data ingestion and processing.

**Idelta**: a hyperfunction that calculates instantaneous delta values between consecutive data points.

**Ingest Rate**: the speed at which new data is written to the system, measured in rows per second; critical for IoT and observability.

**Inner product**: a mathematical operation that combines two vectors to produce a scalar, used in similarity calculations.

**Insert**: a SQL operation that adds new rows of data to a database table.

**Integer**: a data type that represents whole numbers without decimal points.

**Intercept**: a statistical measure representing the y-intercept in linear regression analysis.

**Internet Gateway**: an AWS VPC component that enables communication between instances in a VPC and the internet.

**Interpolated_delta**: a hyperfunction that calculates delta values using interpolation to estimate missing data points.

**Interpolated_duration_in**: a hyperfunction that calculates state durations using interpolation for more accurate results.

**Interpolated_rate**: a hyperfunction that calculates rates using interpolation between data points.

**Interpolated_uptime**: a hyperfunction that calculates system uptime using interpolation for missing heartbeat data.

**Interpolation**: a method of estimating unknown values that fall between known data points.

**Into_array**: a hyperfunction accessor that returns aggregated results as an array.

**Into_values**: a hyperfunction accessor that returns detailed results from aggregate functions.

**IP (Internet Protocol)**: the principal communications protocol in the internet protocol suite for relaying data across network boundaries.

**IP allow list**: a security feature that restricts access to specified IP addresses or ranges.

**Irate**: a hyperfunction that calculates instantaneous rate values between consecutive data points.

**Isolation level**: a database transaction property that defines the degree to which operations in one transaction are isolated from those in other concurrent transactions.

## J

**Job**: an automated task scheduled to run at specific intervals or triggered by certain conditions.

**Job execution**: the process of running scheduled background tasks or automated procedures.

**JIT (Just-In-Time) Compilation**: $PG feature that compiles frequently executed query parts for improved performance, available in $TIMESCALE_DB.

**Job history**: a record of past job executions, including their status, duration, and any errors encountered.

**JSON (JavaScript Object Notation)**: a lightweight data interchange format that is easy for humans to read and write.

**JWT (JSON Web Token)**: a compact, URL-safe means of representing claims to be transferred between two parties.

## K

**Kafka**: see Apache Kafka.

**Kubernetes**: an open-source container orchestration platform for automating deployment, scaling, and management of containerized applications.

## L

**LangChain**: a framework for developing applications powered by language models, particularly useful for building AI applications with vector databases.

**Last_tuned**: a $TIMESCALE_DB configuration parameter that records when the database was last tuned.

**Last_tuned_version**: a $TIMESCALE_DB configuration parameter that records the version used for the last database tuning.

**Last_val**: a hyperfunction that returns the last value in a time-series dataset.

**Latency**: the time delay between a request being made and the response being received.

**License**: legal permission granted by a copyright holder to use software under specified terms and conditions.

**Lifecycle policy**: a set of rules that automatically manage data throughout its lifecycle, including retention and deletion.

**Live_at**: a hyperfunction that determines if a system was operational at a specific time.

**Live_ranges**: a hyperfunction that identifies time periods when a system was operational.

**Live migration**: a data migration technique that moves data with minimal or zero downtime.

**Livesync**: a method for real-time synchronization of data from a source database to $CLOUD, keeping the target as a logical replica.

**Load Balancer**: a service distributing traffic across servers or database nodes to optimize resource use and avoid single points of failure.

**Log-Structured Merge (LSM) Tree**: data structure optimized for write-heavy workloads, though $TIMESCALE_DB primarily uses B-tree indexes for balanced read/write performance.

**LiveSync**: a $TIMESCALE_DB tool for real-time data synchronization and migration.

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

**Max_n**: a hyperfunction that finds the n largest values in a dataset.

**Max_n_by**: a hyperfunction that finds the n largest values based on a secondary ordering column.

**Mcv_agg**: a hyperfunction that aggregates most common values in a dataset.

**Memory-Optimized Queries**: query patterns designed to minimize disk I/O by leveraging available RAM and efficient data structures.

**Merge_chunks**: a $TIMESCALE_DB API function that combines adjacent chunks into a single chunk.

**Metrics**: quantitative measurements used to assess system performance, business outcomes, or operational efficiency.

**MFA (Multi-Factor Authentication)**: a security method that requires two or more verification factors to grant access.

**Migration**: the process of moving data, applications, or systems from one environment to another.

**Min_n**: a hyperfunction that finds the n smallest values in a dataset.

**Min_n_by**: a hyperfunction that finds the n smallest values based on a secondary ordering column.

**Monitoring**: the continuous observation and measurement of system performance and health.

**Move_chunk**: a $TIMESCALE_DB API function that moves a chunk between data nodes in a distributed setup.

**Multi-Tenancy**: architecture pattern supporting multiple customers or applications within a single database instance, with proper isolation.

**MQTT (Message Queuing Telemetry Transport)**: a lightweight messaging protocol designed for small sensors and mobile devices.

**MST (Managed Service for TimescaleDB)**: a fully managed $TIMESCALE_DB service that handles infrastructure and maintenance tasks.

## N

**NAT Gateway**: a network address translation service that enables instances in a private subnet to connect to the internet.

**Networking**: the practice of connecting computers and other devices to share resources and communicate.

**Node (Database Node)**: an individual server within a distributed system, contributing to storage, compute, or replication tasks.

**Normalization**: database design technique organizing data to reduce redundancy, though time-series data often benefits from denormalized structures.

**Not null**: a database constraint that ensures a column cannot contain empty values.

**Num_changes**: a hyperfunction that counts the number of times a value changed in a time series.

**Num_elements**: a hyperfunction that returns the count of elements processed in an aggregation.

**Num_gaps**: a hyperfunction that counts the number of gaps or missing periods in heartbeat data.

**Num_live_ranges**: a hyperfunction that counts the number of continuous operational periods.

**Num_resets**: a hyperfunction that counts how many times a counter was reset to zero.

**Numeric**: a $PG data type for storing exact numeric values with user-defined precision.

## O

**OAuth**: an open standard for access delegation commonly used for token-based authentication and authorization.

**Observability**: the ability to measure the internal states of a system by examining its outputs.

**OLAP (Online Analytical Processing)**: systems or workloads focused on large-scale, multi-dimensional, and complex analytical queries.

**OLTP (Online Transaction Processing)**: high-speed transactional systems optimized for data inserts, updates, and short queries.

**OHLC**: an acronym for Open, High, Low, Close prices, commonly used in financial data analysis.

**OHLCV**: an extension of OHLC that includes Volume data for complete candlestick analysis.

**Open**: in financial data, the opening price of a security at the beginning of a trading period.

**OpenTelemetry**: open standard for collecting, processing, and exporting telemetry data, often stored in time-series databases.

**Optimization**: the process of making systems, queries, or operations more efficient and performant.

## P

**Parallel copy**: a technique for copying large amounts of data using multiple concurrent processes to improve performance.

**Parallel Query Execution**: $PG feature that uses multiple CPU cores to execute single queries faster, inherited by $TIMESCALE_DB.

**Partitioning**: the practice of dividing large tables into smaller, more manageable pieces based on certain criteria.

**Percentile**: a statistical measure that indicates the value below which a certain percentage of observations fall.

**Performance**: a measure of how efficiently a system operates, often quantified by metrics like throughput, latency, and resource utilization.

**pg_basebackup**: a $PG utility for taking base backups of a running $PG cluster.

**pg_dump**: a $PG utility for backing up database objects and data in various formats.

**pg_restore**: a $PG utility for restoring databases from backup files created by pg_dump.

**pgAdmin**: a popular open-source administration and development platform for $PG.

**pgVector**: a $PG extension that adds vector similarity search capabilities for AI and machine learning applications.

**pgai on $CLOUD**: a cloud solution for building search, RAG, and AI agents with $PG. Enables calling AI embedding and generation models directly from the database using SQL.

**pgvectorscale**: a performance enhancement for pgvector featuring StreamingDiskANN indexing, binary quantization compression, and label-based filtering.

**pgvectorizer**: a $TIMESCALE_DB tool for automatically vectorizing and indexing data for similarity search.

**Physical backup**: a backup method that copies the actual database files at the storage level.

**PITR (Point-in-Time Recovery)**: the ability to restore a database to a specific moment in time.

**Policy**: an automated rule or procedure that performs maintenance tasks like compression, retention, or refresh operations.

**Predictive Maintenance**: the use of time-series data to forecast equipment failure, common in IoT and industrial applications.

**$PG**: an open-source object-relational database system known for its reliability, robustness, and performance.

**Postgres**: short form of $PG.

**PostGIS**: a $PG extension that adds support for geographic objects and spatial queries.

**Power BI**: Microsoft's business analytics tool that provides interactive visualizations and business intelligence capabilities.

**Primary key**: a database constraint that uniquely identifies each row in a table.

**Prometheus**: an open-source monitoring and alerting toolkit designed for reliability and scalability.

**psql**: the interactive terminal-based front-end to $PG that allows users to type queries interactively.

## Q

**QPS (Queries Per Second)**: a measure of database performance indicating how many queries a database can process per second.

**QStudio**: a database administration tool that provides a unified interface for various database systems.

**Query**: a request for data or information from a database, typically written in SQL.

**Query performance**: a measure of how efficiently database queries execute, including factors like execution time and resource usage.

**Query Planner/Optimizer**: a component determining the most efficient strategy for executing SQL queries based on database structure and indexes.

**Query planning**: the database process of determining the most efficient way to execute a query.

## R

**RBAC (Role-Based Access Control)**: a security model that assigns permissions to users based on their roles within an organization.

**RDS (Amazon Relational Database Service)**: a managed database service provided by AWS that supports multiple database engines.

**Read committed**: an isolation level where transactions can read committed changes made by other transactions.

**Read scaling**: a technique for improving database performance by distributing read queries across multiple database replicas.

**Read uncommitted**: the lowest isolation level where transactions can read uncommitted changes from other transactions.

**Read-only role**: a database role with permissions limited to reading data without modification capabilities.

**Read Replica**: a copy of the primary database that serves read-only queries, improving read scalability and geographic distribution.

**Real-Time Analytics**: the immediate analysis of incoming data streams, crucial for observability, trading platforms, and IoT monitoring.

**Real**: a $PG data type for storing single-precision floating-point numbers.

**Real-time aggregates**: continuous aggregates that include both materialized historical data and real-time calculations on recent data.

**Recompress_chunk**: a $TIMESCALE_DB API function that recompresses a chunk with updated compression settings.

**Refresh_continuous_aggregate**: a $TIMESCALE_DB API function that manually updates a continuous aggregate with new data.

**Refresh policy**: an automated rule that determines when and how continuous aggregates are updated with new data.

**Region**: a geographical area containing multiple data centers, used in cloud computing for data locality and compliance.

**Remove_columnstore_policy**: a $TIMESCALE_DB API function that removes an automated columnstore conversion policy.

**Remove_compression_policy**: a $TIMESCALE_DB API function that removes an automated compression policy from a $HYPERTABLE.

**Remove_continuous_aggregate_policy**: a $TIMESCALE_DB API function that removes an automated refresh policy from a continuous aggregate.

**Remove_retention_policy**: a $TIMESCALE_DB API function that removes an automated data retention policy.

**Reorder_chunk**: a $TIMESCALE_DB API function that reorganizes data within a chunk to improve query performance.

**Repeatable read**: an isolation level that ensures a transaction sees a consistent snapshot of data throughout its execution.

**Replica**: a copy of a database that can be used for read scaling, backup, or disaster recovery purposes.

**Replication**: the process of copying and maintaining data across multiple database instances to ensure availability and durability.

**Response time**: the time it takes for a system to respond to a request, measured from request initiation to response completion.

**REST API**: a web service architecture that uses HTTP methods to enable communication between applications.

**Restore**: the process of recovering data from backups to restore a database to a previous state.

**Restore point**: a snapshot of database state that can be used as a reference point for recovery operations.

**Retention policy**: an automated rule that determines how long data is kept before being deleted from the system.

**Rollup**: a $TIMESCALE_DB hyperfunction operation that combines or aggregates multiple results into a single result.

**Route table**: a set of rules that determine where network traffic is directed within a cloud network.

**RTO (Recovery Time Objective)**: the maximum acceptable time that systems can be down after a failure or disaster.

**RPO (Recovery Point Objective)**: the maximum acceptable amount of data loss measured in time after a failure or disaster.

**Rowstore**: traditional row-oriented data storage where data is stored row by row, optimized for transactional workloads.

## S

**S3 (Amazon Simple Storage Service)**: AWS's object storage service designed for storing and retrieving any amount of data from anywhere.

**SaaS (Software as a Service)**: cloud-hosted software platforms relying on scalable databases to manage telemetry, user data, and operational metrics.

**SAML (Security Assertion Markup Language)**: an XML-based standard for exchanging authentication and authorization data between security domains.

**Saturating_add**: a hyperfunction that performs addition with saturation, preventing arithmetic overflow.

**Saturating_add_pos**: a hyperfunction that performs positive saturating addition, ensuring results remain positive.

**Saturating_multiply**: a hyperfunction that performs multiplication with saturation to prevent overflow.

**Saturating_sub**: a hyperfunction that performs subtraction with saturation, preventing underflow.

**Saturating_sub_pos**: a hyperfunction that performs positive saturating subtraction.

**Scheduled jobs**: automated tasks that run at predetermined times or intervals.

**Schema Evolution**: the process of modifying database structure over time while maintaining compatibility with existing applications.

**Schema**: the structure of a database, including tables, columns, relationships, and constraints.

**Security group**: a virtual firewall that controls inbound and outbound traffic for cloud resources.

**Service Discovery**: mechanisms allowing applications to dynamically locate services like database endpoints, often used in distributed environments.

**Segmentwise recompression**: a $TIMESCALE_DB compression technique that recompresses data segments to improve compression ratios.

**Serializable**: the highest isolation level that ensures transactions appear to run serially even when executed concurrently.

**Sharding**: horizontal partitioning of data across multiple database instances, distributing load and enabling linear scalability.

**SFTP (SSH File Transfer Protocol)**: a secure version of FTP that encrypts both commands and data during transmission.

**Show_chunks**: a $TIMESCALE_DB API function that displays information about chunks in a $HYPERTABLE.

**Show_tablespaces**: a $TIMESCALE_DB API function that shows tablespace information for ${HYPERTABLE}s.

**SkipScan**: query optimization for DISTINCT operations that incrementally jumps between ordered values without reading intermediate rows. Uses a Custom Scan node to efficiently traverse ordered indexes, dramatically improving performance over traditional DISTINCT queries.

**Similarity search**: a technique for finding items that are similar to a given query item, often used with vector embeddings.

**SLA (Service Level Agreement)**: a contract that defines the expected level of service between a provider and customer.

**SLI (Service Level Indicator)**: a quantitative measure of some aspect of service quality.

**SLO (Service Level Objective)**: a target value or range for service quality measured by an SLI.

**Slope**: a statistical measure representing the rate of change in linear regression analysis.

**SMTP (Simple Mail Transfer Protocol)**: an internet standard for email transmission across networks.

**Snapshot**: a point-in-time copy of data that can be used for backup and recovery purposes.

**SP-GiST (Space-Partitioned Generalized Search Tree)**: a $PG index type for data structures that naturally partition search spaces.

**Split_chunk**: a $TIMESCALE_DB API function that divides a chunk into smaller chunks.

**Storage Optimization**: techniques for reducing storage costs and improving performance through compression, tiering, and efficient data organization.

**Streaming Data**: continuous flows of data generated by devices, logs, or sensors, requiring high-ingest, real-time storage solutions.

**SQL (Structured Query Language)**: a programming language designed for managing and querying relational databases.

**SSH (Secure Shell)**: a cryptographic network protocol for secure communication over an unsecured network.

**SSL (Secure Sockets Layer)**: a security protocol that establishes encrypted links between networked computers.

**State_agg**: a hyperfunction that aggregates state transition data for analysis of system states over time.

**Statistics**: quantitative data and metrics collected about database operations and performance.

**Stats_agg**: a hyperfunction that calculates statistical measures like mean, variance, and correlation.

**Stderror**: a hyperfunction that calculates the standard error of estimates in statistical aggregations.

**Streaming replication**: a $PG replication method that continuously sends write-ahead log records to standby servers.

**Subnet**: a logical subdivision of an IP network that allows for better organization and security of network resources.

**Supabase**: an open-source alternative to Firebase that provides database, authentication, and real-time functionality.

**Synthetic Monitoring**: simulated transactions or probes used to test system health, generating time-series metrics for performance analysis.

## T

**Table**: a database object that stores data in rows and columns, similar to a spreadsheet.

**Tableau**: a data visualization and business intelligence platform that helps people analyze and understand their data.

**Tablespace**: a $PG storage structure that defines where database objects are physically stored on disk.

**TCP (Transmission Control Protocol)**: a connection-oriented protocol that ensures reliable data transmission between applications.

**TDigest**: a probabilistic data structure for accurate estimation of percentiles in distributed systems.

**Telegraf**: an agent for collecting and reporting metrics and events from databases, systems, and IoT sensors.

**Telemetry**: the collection of real-time data from systems or devices for monitoring and analysis.

**Telemetry**: the automated collection and measurement of data from remote systems for monitoring and analysis.

**Telemetry_level**: a $TIMESCALE_DB configuration parameter that controls the level of usage data collected.

**Terraform**: an infrastructure as code tool that allows you to build, change, and version infrastructure safely and efficiently.

**Text**: a $PG data type for storing variable-length character strings.

**Throughput**: a measure of system performance indicating the amount of work performed or data processed per unit of time.

**Tiered storage**: a storage strategy that automatically moves data between different storage classes based on access patterns and age.

**$CLOUD**: $COMPANY's managed cloud service that provides $TIMESCALE_DB as a fully managed solution.

**$COMPANY**: a company that provides time-series database solutions built on $TIMESCALE_DB technology.

**Tigerlake**: $COMPANY's service for integrating operational databases with data lake architectures.

**Time bucket**: a $TIMESCALE_DB function that groups time-series data into regular time intervals for aggregation.

**Time series**: data points indexed and ordered by time, typically representing how values change over time.

**Time-series**: adjective form referring to data or systems that work with time-indexed data.

**Time-weighted average**: a statistical calculation that gives more weight to values based on the duration they were held.

**Time_bucket**: the SQL function in $TIMESCALE_DB for grouping data into time-based buckets.

**Time_bucket_ng**: an enhanced version of time_bucket with additional features and optimizations.

**Time Bucketing**: grouping timestamps into uniform intervals for analysis, commonly used with hyperfunctions.

**Time-Series Forecasting**: the application of statistical models to time-series data to predict future trends or events.

**Time_delta**: a hyperfunction that calculates the time difference between consecutive data points.

**Timescaledb.enable_bulk_decompression**: a GUC parameter that enables bulk decompression optimization.

**Timescaledb.enable_chunk_skipping**: a GUC parameter that enables the chunk skipping optimization.

**Timescaledb.enable_compression**: a GUC parameter that enables $TIMESCALE_DB's compression features.

**Timescaledb.enable_optimizations**: a GUC parameter that enables various $TIMESCALE_DB query optimizations.

**Timescaledb.enable_tiered_reads**: a GUC parameter that enables reading from tiered storage.

**Timescaledb.enable_transparent_decompression**: a GUC parameter that enables automatic decompression during queries.

**Timescaledb.enable_vectorized_aggregation**: a GUC parameter that enables vectorized execution for aggregations.

**Timescaledb.max_cached_chunks_per_hypertable**: a GUC parameter that limits cached chunks per $HYPERTABLE.

**Timescaledb.max_open_chunks_per_insert**: a GUC parameter that limits concurrent chunks during inserts.

**$TIMESCALE_DB**: an open-source time-series database built on $PG that provides scalability and performance optimizations.

**Timestamp**: a data type that stores date and time information without timezone data.

**Timestamptz**: a $PG data type that stores timestamp with timezone information.

**TLS (Transport Layer Security)**: a cryptographic protocol that provides security for communication over networks.

**Tombstone**: marker indicating deleted data in append-only systems, requiring periodic cleanup processes.

**Topn**: a hyperfunction that returns the top n most frequent values from a frequency aggregation.

**Transaction Isolation**: database property controlling the visibility of uncommitted changes between concurrent transactions.

**TPS (Transactions Per Second)**: a measure of database performance indicating transaction processing capacity.

**Transaction**: a unit of work performed against a database that must be completed entirely or not at all.

**Trigger**: a database procedure that automatically executes in response to certain events on a table or view.

**Trim_to**: a hyperfunction that trims heartbeat aggregate results to a specified time range.

**Troubleshooting**: the process of diagnosing and resolving problems in database systems or applications.

## U

**UDP (User Datagram Protocol)**: a connectionless communication protocol that provides fast but unreliable data transmission.

**Unique**: a database constraint that ensures all values in a column or combination of columns are distinct.

**Uptime**: the amount of time that a system has been operational and available for use.

**Usage-based storage**: a billing model where storage costs are based on actual data stored rather than provisioned capacity.

**UUID (Universally Unique Identifier)**: a 128-bit identifier used to uniquely identify information without central coordination.

## V

**Vacuum**: a $PG maintenance operation that reclaims storage and updates database statistics.

**Varchar**: a variable-length character data type that can store strings up to a specified maximum length.

**Vector Operations**: SIMD (Single Instruction, Multiple Data) optimizations for processing arrays of data, improving analytical query performance.

**Vertical Scaling (Scale Up)**: increasing system capacity by adding more power (CPU, RAM) to existing machines, as opposed to horizontal scaling.

**Visualization Tools**: platforms or dashboards such as Grafana used to display time-series data in charts, graphs, and alerts for easier monitoring and analysis.

**Vector**: a mathematical object with magnitude and direction, used in machine learning for representing data as numerical arrays.

**VPC (Virtual Private Cloud)**: a virtual network dedicated to your cloud account that provides network isolation.

**VWAP (Volume Weighted Average Price)**: a financial indicator that shows the average price weighted by volume over a specific time period.

## W

**WAL (Write-Ahead Log)**: $PG's method for ensuring data integrity by writing changes to a log before applying them to data files.

**Warm storage**: a storage tier that balances access speed and cost, suitable for data accessed occasionally.

**Watermark**: a timestamp that tracks the progress of continuous aggregate materialization.

**WebSocket**: a communication protocol that provides full-duplex communication channels over a single TCP connection.

**Window Functions**: SQL functions that perform calculations across related rows, particularly useful for time-series analytics and trend analysis.

**Workload Management**: techniques for prioritizing and scheduling different types of database operations to optimize overall system performance.

**With_bounds**: a hyperfunction modifier that applies bounds to counter aggregation calculations.

## X

**XML (eXtensible Markup Language)**: a markup language that defines rules for encoding documents in a format that is both human-readable and machine-readable.

## Y

**YAML (YAML Ain't Markup Language)**: a human-readable data serialization standard commonly used for configuration files.

## Z

**Zero downtime**: a system design goal where services remain available during maintenance, upgrades, or migrations without interruption.

**Zero-Downtime Migration**: migration strategies that maintain service availability throughout the transition process, often using techniques like dual-write and gradual cutover.