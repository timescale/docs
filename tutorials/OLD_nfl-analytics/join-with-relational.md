---
title: Join time-series data with relational data for deeper analysis
excerpt: Join tables in TimescaleDB for richer anlysis
products: [cloud, mst, self_hosted]
keywords: [continuous aggregates, hyperfunctions, analytics]
---

# Join time-series data with relational data for deeper analysis

TimescaleDB is packaged as a PostgreSQL extension. As such, TimescaleDB is
PostgreSQL with super-powers. You can do anything in TimescaleDB that you can
in PostgreSQL, including joining tables and combining data for further analysis.

### The Mile-High advantage

In professional football, it's a well-understood phenomenon that teams that
visit Denver's Mile-High stadium are at a disadvantage because unlike the home team
(the Denver Broncos), they are not accustomed to playing in high altitude.

Earlier we ingested stadium data. Now we can run a query to see the performance of
players when they are playing at Mile High Stadium.

Like many of the queries in our analysis section, for this example you use the
relational nature of this data. You join the `tracking`, `player`, and `game`
tables to compare the average acceleration and yards run of individual players
when they are performing in stadiums outside of Denver versus when they are
playing within Denver. The columns `avg_acc_den` and `avg_yards_den` represent
the acceleration and yard statistics while in Denver.  

```sql
WITH stat_vals AS (
-- This table collects the summed yard and avg acceleration data of a player during one game
  SELECT a.player_id, displayname, SUM(yards) AS yards, AVG(acc) AS acc, team, gameid
  FROM player_yards_by_game a
  LEFT JOIN player p ON a.player_id = p.player_id
  GROUP BY a.player_id, displayname, gameid, team
), team_data AS (
-- This table gets us the team information so that we can filter on teams
 SELECT a.player_id, acc, yards, a.gameid,
  CASE
   WHEN a.team = 'away' THEN g.visitor_team
   WHEN a.team = 'home' THEN g.home_team
   ELSE NULL
   END AS team_name,
  g.home_team
 FROM stat_vals a
 LEFT JOIN game g ON a.gameid = g.game_id
), avg_stats AS (
-- This table takes the avg acceleration and yards run for players when they are not in denver
-- and then when they are in denver
SELECT p.player_id, p.displayname,
 AVG(acc) FILTER (WHERE team_name != 'DEN' AND home_team !='DEN') AS avg_acc,
 AVG(acc) FILTER (WHERE team_name != 'DEN' AND home_team = 'DEN') AS avg_acc_den,
 AVG(yards) FILTER (WHERE team_name != 'DEN' AND home_team !='DEN') AS avg_yards,
 AVG(yards) FILTER (WHERE team_name != 'DEN' AND home_team = 'DEN') AS avg_yards_den,
 COUNT(gameid) FILTER (WHERE team_name != 'DEN' AND home_team !='DEN') AS games,
 COUNT(gameid) FILTER (WHERE team_name != 'DEN' AND home_team ='DEN') AS games_den
FROM team_data t
LEFT JOIN player p ON t.player_id = p.player_id
GROUP BY p.player_id, p.displayname
)
SELECT * FROM avg_stats
WHERE avg_acc IS NOT NULL AND avg_acc_den IS NOT NULL
ORDER BY avg_acc DESC, avg_acc_den DESC
```

You should see this:

|player_id|displayname|avg_acc|avg_acc_den|avg_yards|avg_yards_den|games|games_den|
|-------|----------------|-----|-----------|----------|----------|--------|--------|
|2552597|Breshad Perriman|2.32|2.06|408.79|461.08|9|1|
|2560988|Antonio Callaway| 2.27| 2.30 |778.91|741.06|15|1|
|2556214|Tyreek Hill |2.27 |2.19| 1007.31|1004.26 |14|1|
|2558194|Josh Reynolds| 2.26] |2.40] |527.80]|529.16 |15|1|
|2543498|Brandin Cooks| 2.26 |2.26 |975.61| 875.90 |15|1|

You can see that generally, it appears many players may have worse acceleration and average number of yards run per game while playing in Denver. However, it is good to note that you only have one sample point showing Denver averages which effects statistical significance.

### Grass vs. turf, the eternal (football) question

Players often say they "feel" faster on artificial turf. How much faster are they
in reality?

Using this query you join the `tracking`, `stadium_info`, `game`, and `player`
tables, to extract the average acceleration that a player has while using turf
verses grass. The column `avg_acc_turf` represents the players average
acceleration while using artificial turf, and `avg_acc_grass` represents their
average acceleration while on grass.

```sql
WITH acceleration AS (
-- This table gets the average acceleration for a player over each game
 SELECT a.player_id, avg(acc) AS acc, a.gameid, a.team
 FROM player_yards_by_game a
 GROUP BY a.player_id, a.gameid, a.team
), team_data AS (
-- This table gets us the surface information so that we can filter on turf type
 SELECT a.player_id, acc, g.game_id, si."location", si.surface
 FROM acceleration a
 LEFT JOIN game g ON a.gameid = g.game_id
 LEFT JOIN stadium_info si on g.home_team = si.team_abbreviation
), avg_stats AS (
-- This table takes the avg acceleration and yards run for players when they are not in denver
-- and then when they are in denver
SELECT p.player_id, p.displayname,
 AVG(acc) FILTER (WHERE surface LIKE '%Turf%') AS avg_acc_turf,
 AVG(acc) FILTER (WHERE surface NOT LIKE '%Turf%') AS avg_acc_grass
FROM team_data t
LEFT JOIN player p ON t.player_id = p.player_id
GROUP BY p.player_id, p.displayname
)
SELECT * FROM avg_stats
WHERE avg_acc_turf IS NOT NULL AND avg_acc_grass IS NOT NULL AND player_id IS NOT NULL
ORDER BY avg_acc_turf DESC, avg_acc_grass DESC
```

You should see this:

|player_id|displayname|avg_acc_turf|avg_acc_grass|
|--------|-----------|-------------|---------------|
|2559066 |Gehrig Dieter |3.25 |2.29|
|2507948 |Frank Zombo |2.93 |2.30|
|2555173 |Eric Murray |2.78 |1.86|
|2552374 |Ameer Abdullah |2.76 |2.48|
|2552408 |Darren Waller |2.69 |2.83|

For many players, it appears that they are indeed faster on artificial turf. This 'feeling' of increased speed may in fact be grounded in reality.

### We're going to overtime!

Sometimes it's helpful to visualize time-series data in order to fully understand
how a system is performing. The NFL dataset includes play-by-play data. It is possible to visualize this information so that you can see how a play unfolds.
