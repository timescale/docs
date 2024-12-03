
| Version number            |PostgreSQL 17|PostgreSQL 16|PostgreSQL 15|PostgreSQL 14|PostgreSQL 13|PostgreSQL 12|PostgreSQL 11|PostgreSQL 10|
|---------------------------|-|-|-|-|-|-|-|-|
| TimescaleDB<br/> 2.17.x   |✅|✅|✅|✅|❌|❌|❌|❌|❌|
| TimescaleDB<br/> 2.16.x   |❌|✅|✅|✅|✅|❌|❌|❌|❌|❌|
| TimescaleDB<br/> 2.15.x   |❌|✅|✅|✅|✅|❌|❌|❌|❌|❌|
| TimescaleDB<br/> 2.14.x   |❌|✅|✅|✅|✅|❌|❌|❌|❌|❌|
| TimescaleDB<br/> 2.13.x   |❌|✅|✅|✅|✅|❌|❌|❌|❌|
| TimescaleDB<br/> 2.12.x   |❌|❌|✅|✅|✅|❌|❌|❌|❌|
| TimescaleDB<br/> 2.10.x   |❌|❌|✅|✅|✅|✅|❌|❌|❌|
| TimescaleDB<br/> 2.5 - 2.9 |❌|❌|❌|✅|✅|✅|❌|❌|❌|
| TimescaleDB<br/> 2.4      |❌|❌|❌|❌|✅|✅|❌|❌|❌|
| TimescaleDB<br/> 2.1 - 2.3 |❌|❌|❌|❌|✅|✅|✅|❌|❌|
| TimescaleDB<br/> 2.0      |❌|❌|❌|❌|❌|✅|✅|❌|❌
| TimescaleDB<br/> 1.7      |❌|❌|❌|❌|❌|✅|✅|✅|✅|

We recommend not using TimescaleDB with PostgreSQL 17.1, 16.5, 15.9, 14.14, 13.17, 12.21.  
These minor versions [introduced a breaking binary interface change][postgres-breaking-change] that,
once identified, was reverted in subsequent minor PostgreSQL versions 17.2, 16.6, 15.10, 14.15, 13.18, and 12.22.
When you build from source, best practice is to build with PostgreSQL 17.2, 16.6, etc and higher.
Users of [Timescale Cloud](https://console.cloud.timescale.com/) and platform packages for Linux, Windows, MacOS,
Docker, and Kubernetes are unaffected.

[postgres-breaking-change]: https://www.postgresql.org/about/news/postgresql-172-166-1510-1415-1318-and-1222-released-2965/
