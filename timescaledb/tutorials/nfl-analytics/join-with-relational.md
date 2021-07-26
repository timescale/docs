## Join time-series data with relational data for deeper analysis

TimescaleDB is packaged as a PostgreSQL extension. As such, TimescaleDB is
PostgreSQL with super-powers. You can do anything in TimescaleDB that you can 
in PostgreSQL, including joining tables and combining data for further analysis.

First you will need to create the following continuous aggregate. 

### The Mile-High advantage

In professional football, it's a well-understood phenomenon that teams that
visit Denver's Mile-High stadium are at a disadvantage because unlike the home team
(the Denver Broncos), they are not accustomed to playing in high altitude.

Earlier we ingested stadium data. Now we can run a query to see the performance of
players at each position when they are playing at Mile High Stadium.

Use this query to compare the average acceleration and yards run of individual players when they are performing in stadiums outside of Denver versus when they are playing in Denver. The columns `avg_acc_den` and `avg_yards_den` represent the acceleration and yard statistics while in Denver.  



You can see that generally, many players have worse acceleration and average number of yards run per game while playing in Denver. 

### Grass vs. turf, the eternal (football) question

Players often say they "feel" faster on artifical turf. How much faster are they
in reality?

Using this query you will extract the average acceleration that a player has while using turf verses grass. The column `avg_acc_turf` represents the players average acceleration while using artificial turf, and `avg_acc_grass` represents their average acceleration while on grass. 



For many players, it appears that they are indeed faster on artificial turf. This 'feeling' of increased speed may in fact be grounded in reality. 
### We're going to overtime!

Sometimes it's helpful to visualize time-series data in order to fully understand
how a system is performing. The NFL dataset includes play-by-play data. It is possible 
to visualize this information so that you can see how a play unfolds.
