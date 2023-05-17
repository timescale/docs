---
title: Advanced analysis using continuous aggregates and hyperfunctions
excerpt: Use continuous aggregates and hyperfunctions to perform advanced analysis of NFL player activity
products: [cloud, mst, self_hosted]
keywords: [continuous aggregates, hyperfunctions, analytics]
---

# Advanced analysis using continuous aggregates and hyperfunctions

So far in this tutorial, you have ingested the data and run an aggregate query.
Then you improved the performance of your analysis with continuous aggregates.

Now, let's go over some ideas on analyzing the data using PostgreSQL and
TimescaleDB, to help you understand more about player activity during the NFL
season.

<Highlight type="tip">
Some of this analysis includes visualizations to help you see the potential uses
of this data. These are created using the [Matplotlib](https://matplotlib.org/)
Python module, which is one of many great visualization tools.
</Highlight>

### Average yards run for a player over a game

This query uses a percentile approximation [hyperfunction][api-hyperfunctions]
to find the mean yards run per game by a single player.

```sql
WITH sum_yards AS (
  SELECT a.player_id, displayname, SUM(yards) AS yards, gameid
  FROM player_yards_by_game a
  LEFT JOIN player p ON a.player_id = p.player_id
  GROUP BY a.player_id, displayname, gameid
)
SELECT player_id, displayname, mean(percentile_agg(yards)) as yards
FROM sum_yards
GROUP BY player_id, displayname
ORDER BY yards DESC
```

Your data should look like this:

|player_id|displayname|yards|
|-|-|-|
|NULL|NULL|2872.5647430830086|
|2508061|Antonio Brown|1125.1706666666641|
|2556214|Tyreek Hill|1007.1073333333323|
|2543495|Davante Adams|971.6339999999967|
|2543498|Brandin Cooks|969.3762499999964|

When you run this query you might notice that the `player_id` and `displayname`
are null for the first row. This row represents the average yard data for the
football.

### Average and median yards run per game by type of player

For this query, you use another one of the TimescaleDB percentile functions
called `percentile_agg`. You can use the `percentile_agg` function to find the
fiftieth percentile, which is the approximate median.

```sql
WITH sum_yards AS (
--Add position to the table to allow for grouping by it later
  SELECT a.player_id, displayname, SUM(yards) AS yards, p.position, gameid
  FROM player_yards_by_game a
  LEFT JOIN player p ON a.player_id = p.player_id
  GROUP BY a.player_id, displayname, p.position, gameid
)
--Find the mean and median for each position type
SELECT position, mean(percentile_agg(yards)) AS mean_yards, approx_percentile(0.5, percentile_agg(yards)) AS median_yards
FROM sum_yards
GROUP BY position
ORDER BY mean_yards DESC
```

If you scroll to the bottom of your results you should see this:

|position|mean_yards|median_yards|
|-|-|-|
|HB|275.04279069767404|250.88667462709043|
|DE|185.76162011173133|33.750683636185684|
|FB|100.37912844036691|67.0876116670915|
|DT|19.692499999999992|17.796475991050432|

Notice how the Defensive End (DE) position has a large discrepancy between its
mean and median values. The median data implies that most DE players do not run
very much during passing plays. However, the mean data implies that some of the
DE players must be running a significant amount.

### Number of snap plays by player where they were on the offense

In this query, you are counting the number of passing events a player was
involved in while playing offense. You might notice how much slower this
query runs than the ones above which use continuous aggregates. The speed you
see here is comparable to what you would get in the other queries without using
continuous aggregates.

```sql
WITH snap_events AS (
-- Create a table that filters the play events to show only snap plays
-- and display the players team information
 SELECT DISTINCT player_id, t.event, t.gameid, t.playid,
  CASE
   WHEN t.team = 'away' THEN g.visitor_team
   WHEN t.team = 'home' THEN g.home_team
   ELSE NULL
   END AS team_name
 FROM tracking t
 LEFT JOIN game g ON t.gameid = g.game_id
 WHERE t.event LIKE '%snap%'
)
-- Count these events and filter results to only display data when the player was
-- on the offensive
SELECT a.player_id, pl.displayname, COUNT(a.event) AS play_count, a.team_name
FROM snap_events a
LEFT JOIN play p ON a.gameid = p.gameid AND a.playid = p.playid
LEFT JOIN player pl ON a.player_id = pl.player_id
WHERE a.team_name = p.possessionteam
GROUP BY a.player_id, pl.displayname, a.team_name
ORDER BY play_count DESC
```

Notice that the two highest passing plays are for Ben Roethlisberger and JuJu
Smith-Schuster, a Quarterback and Wide Receiver, respectively, for the
Pittsburgh Steelers.

|player_id|displayname|play_count|team|
|-|-|-|-|
|2506109|Ben Roethlisberger|725|PIT|
|2558149|JuJu Smith-Schuster|691|PIT|
|2533031|Andrew Luck|683|IND|

### Number of plays vs points scored

Use this query to get data on the number of plays and final score for each game
during the 2018 season. This data is separated by team so that we can compare
the number of plays with a team's win or loss.

```sql
WITH play_count AS (
-- Count distinct plays, join on the stadium and game tables for team names and game date
    SELECT gameid, COUNT(playdescription) AS plays, p.possessionteam as team_name, g.game_date
    FROM play p
    LEFT JOIN game g ON p.gameid = g.game_id
    GROUP BY gameid, team_name, game_date
), visiting_games AS (
-- Join on scores to grab only the visting team's data
    SELECT gameid, plays, s.visitor_team as team_name, s.visitor_score AS team_score FROM play_count p
    INNER JOIN scores s ON p.team_name = s.visitor_team_abb
    AND p.game_date = s."date"
), home_games AS (
-- Join on scores to grab only the home team's data
    SELECT gameid, plays, s.home_team AS team_name , s.home_score AS team_score FROM play_count p
    INNER JOIN scores s ON p.team_name = s.home_team_abb
    AND p.game_date = s."date"
)
-- union the two resulting tables together
SELECT * FROM visiting_games
UNION ALL
SELECT * FROM home_games
ORDER BY gameid ASC, team_score DESC
```

This image is an example of a visualization that you could create with the
results from this query. The scatter plot is grouped, showing the winning team's
plays and scores as gold, and the losing team's plays and scores as brown.

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tutorials/nfl_tutorial/wins_vs_plays.png" alt="Wins vs Plays"/>

The y-axis, or the number of plays for one team during a single game, shows that
more _passing_ plays do not always imply a guaranteed win. In fact, the top
three teams with the highest number of plays for a single game all appeared to
have lost. In football, this makes logical sense, as teams that are behind late
in the game tend to pass more. There are many interesting facts which you could
glean from this type of query, this scatter plot is just one possibility.

### Average yards per game for top three players of each position

You can use this PostgreSQL query to extract the average yards run by an individual
player over one game. This query only includes the top three highest players'
average yard values per position type. The data is ordered by the average yards
run across all players for each position. This becomes important later on.

<Highlight type="note">
This query excludes some position types from the list due to such low average
yard values, the excluded positions are Kicker, Punter, Nose Tackle, Long Snapper,
and Defensive Tackle
</Highlight>

```sql
WITH total_yards AS (
-- This table sums the yards a player runs over each game
 SELECT t.player_id, SUM(yards) AS yards, t.gameid
 FROM player_yards_by_game t
 GROUP BY t.player_id, t.gameid
), avg_yards AS (
-- This table takes the average of the yards run by each player and calls out thier position
 SELECT p.player_id, p.displayname, AVG(yards) AS avg_yards, p."position"
 FROM total_yards t
 LEFT JOIN player p ON t.player_id = p.player_id
 GROUP BY p.player_id, p.displayname, p."position"
), ranked_vals AS (
    -- This table ranks each player by the average yards they run per game
    SELECT a.*, RANK() OVER (PARTITION BY a."position" ORDER BY avg_yards DESC)
    FROM avg_yards AS a
), ranked_positions AS (
-- This table takes the average of the average yards run for each player so that we can order
-- the positions by this average of averages
    SELECT v."position", AVG(v.avg_yards) AS avg_yards_positions
    FROM ranked_vals v
    GROUP BY v."position"
)
SELECT v.*, p.avg_yards_positions FROM ranked_vals v
LEFT JOIN ranked_positions p ON v.position = p.position
WHERE v.rank <= 3 AND v.position != 'null' AND v.position NOT IN ('K', 'P', 'NT', 'LS', 'DT')
ORDER BY p.avg_yards_positions DESC, v.rank ASC
```

This is one possible visualization that you could create with this data:

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tutorials/nfl_tutorial/top_3_players.png" alt="Top Three Players by Position"/>

Notice that the average yards overall for Free Safety players is higher than that
of Wide Receivers (this is because of how we ordered the data, noted above).
However, individual Wide Receivers run more yards on average per game. Also, notice
that Kyle Juszczyk runs far more on average than other Fullback players.

## It's only halftime!

These example queries are just the beginning examples of the analysis you can
perform on any time-series data with regular SQL and helpful features like continuous
aggregates. Consider joining in stadium data that we provided to see if teams
tend to score or run less at Mile High Stadium. Does natural or artificial turf
affect any teams consistently?

[api-hyperfunctions]: /api/:currentVersion:/hyperfunctions/percentile-approximation/uddsketch/
