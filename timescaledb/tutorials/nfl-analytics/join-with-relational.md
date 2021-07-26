## Join time-series data with relational data for deeper analysis

TimescaleDB is packaged as a PostgreSQL extension. As such, TimescaleDB is
PostgreSQL with super-powers. You can do anything in TimescaleDB that you can 
in PostgreSQL, including joining tables and combining data for further analysis.

### The Mile-High advantage

In professional football, it's a well-understood phenomenon that teams that
visit Denver's Mile-High stadium are at a disadvantage because unlike the home team
(the Denver Broncos), they are not accustomed to playing in high altitude.

Earlier we ingested stadium data. Now we can run a query to see the performance of
players at each position when they are playing at Mile High Stadium.

### Grass vs. turf, the eternal (football) question

Players often say they "feel" faster on artifical turf. How much faster are they
in reality?

### We're going to overtime!

Sometimes it's helpful to visualize time-series data in order to fully understand
how a system is performing. The NFL dataset includes play-by-play data. It is possible 
to visualize this information so that you can see how a play unfolds.