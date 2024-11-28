
The following table shows the support matrix for PostgreSQL and Timescale DB. For example, 
TimescaleDB 2.17.x is supported on PostgreSQL 17,	16, 15, and 14. However, PostgreSQL 17 only
supports TimescaleDB 2.17.x.

||PostgreSQL 17|PostgreSQL 16|PostgreSQL 15|PostgreSQL 14|PostgreSQL 13|PostgreSQL 12|PostgreSQL 11|PostgreSQL 10|PostgreSQL 9.6|
|-|-|-|-|-|-|-|-|-|
|TimescaleDB 2.17.x|&#9989;|&#9989;|&#9989;|&#9989;|&#10060;|&#10060;|&#10060;|&#10060;|&#10060;|
|TimescaleDB 2.16.x|&#10060;|&#9989;|&#9989;|&#9989;|&#9989;|&#10060;|&#10060;|&#10060;|&#10060;|&#10060;|
|TimescaleDB 2.15.x|&#10060;|&#9989;|&#9989;|&#9989;|&#9989;|&#10060;|&#10060;|&#10060;|&#10060;|&#10060;|
|TimescaleDB 2.14.x|&#10060;|&#9989;|&#9989;|&#9989;|&#9989;|&#10060;|&#10060;|&#10060;|&#10060;|&#10060;|
|TimescaleDB 2.13.x|&#10060;|&#9989;|&#9989;|&#9989;|&#9989;|&#10060;|&#10060;|&#10060;|&#10060;|
|TimescaleDB 2.12.x|&#10060;|&#10060;|&#9989;|&#9989;|&#9989;|&#10060;|&#10060;|&#10060;|&#10060;|
|TimescaleDB 2.10.x|&#10060;|&#10060;|&#9989;|&#9989;|&#9989;|&#9989;|&#10060;|&#10060;|&#10060;|
|TimescaleDB 2.5 to 2.9|&#10060;|&#10060;|&#10060;|&#9989;|&#9989;|&#9989;|&#10060;|&#10060;|&#10060;|
|TimescaleDB 2.4|&#10060;|&#10060;|&#10060;|&#10060;|&#9989;|&#9989;|&#10060;|&#10060;|&#10060;|
|TimescaleDB 2.1 to 2.3|&#10060;|&#10060;|&#10060;|&#10060;|&#9989;|&#9989;|&#9989;|&#10060;|&#10060;|
|TimescaleDB 2.0|&#10060;|&#10060;|&#10060;|&#10060;|&#10060;|&#9989;|&#9989;|&#10060;|&#10060;
|TimescaleDB 1.7|&#10060;|&#10060;|&#10060;|&#10060;|&#10060;|&#9989;|&#9989;|&#9989;|&#9989;|

We recommend not using TimescaleDB with PostgreSQL 17.1, 16.5, 15.9, 14.14, 13.17, 12.21.  
These minor versions [introduced a breaking binary interface change][postgres-breaking-change] that,
once identified, was reverted in subsequent minor PostgreSQL versions 17.2, 16.6, 15.10, 14.15, 13.18, and 12.22.
When you build from source, best practice is to build with PostgreSQL 17.2, 16.6, etc and higher.
Users of [Timescale Cloud](https://console.cloud.timescale.com/) and platform packages for Linux, Windows, MacOS,
Docker, and Kubernetes are unaffected.
