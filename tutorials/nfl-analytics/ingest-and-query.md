---
title: Ingest data and run your first query
excerpt: Ingest some data from CSV files into your database
products: [cloud, mst, self_hosted]
keywords: [continuous aggregates, hyperfunctions, analytics]
---

# Ingest data and run your first query

The main dataset is provided by [Kaggle as multiple CSV files][kaggle-download].
Additionally, we have gathered
[other information about stadiums and the outcome of each game][extra-download]
to provide you with additional data to analyze.

The data is provided in multiple CSV files, each corresponding to a table in the database
that contains the following information:

*   **game**
    *   Information about each game (home team, visitor team, week of play, and more)
    *   `game_id` is a primary key

*   **player**
    *   Player information (display_name, college, position, and more)
    *   `player_id` is a primary key.

*   **play**
    *   Play information (game, play, quarter, down, pass result). Lots of good
  overall play information to analyze.
    *   To query a specific play, you need to use `gameid` and `playid` together, as some
  `playid`'s are reused from game-to-game.

*   **tracking**
    *   Player tracking information from each play sampled multiple times a second.
    *   Fields include acceleration, X/Y coordinates on the field, and others.
    *   `x` and `y` indicate the physical positions of the players on the field using
  the coordinates outlined in the data description on the Kaggle website.
    *   This is the largest table (18M+ row) in the database.

*   **scores**
    *   Final result of each game.
    *   This table can be joined with the tracking table using the `home_team_abb` and
  `visitor_team_abb` fields.

*   **stadium_info**
    *   Home stadium of each team and additional information like `surface`, `roof_type`, `location`.

Create the tables with this SQL:

```sql
CREATE TABLE game (
    game_id INT PRIMARY KEY,
    game_date DATE,
    gametime_et TIME,
    home_team TEXT,
    visitor_team TEXT,
    week INT
);

CREATE TABLE player (
    player_id INT PRIMARY KEY,
    height TEXT,
    weight INT,
    birthDate DATE,
    collegeName TEXT,
    position TEXT,
    displayName TEXT
);

CREATE TABLE play (
    gameId INT,
    playId INT,
    playDescription TEXT,
    quarter INT,
    down INT,
    yardsToGo INT,
    possessionTeam TEXT,
    playType TEXT,
    yardlineSide TEXT,
    yardlineNumber INT,
    offenseFormation TEXT,
    personnelO TEXT,
    defendersInTheBox INT,
    numberOfPassRushers INT,
    personnelD TEXT,
    typeDropback TEXT,
    preSnapVisitorScore INT,
    preSnapHomeScore INT,
    gameClock TIME,
    absoluteYardlineNumber INT,
    penaltyCodes TEXT,
    penaltyJerseyNumber TEXT,
    passResult TEXT,
    offensePlayResult INT,
    playResult INT,
    epa DOUBLE PRECISION,
    isDefensivePI BOOLEAN
);

CREATE TABLE tracking (
    time TIMESTAMP,
    x DOUBLE PRECISION,
    y DOUBLE PRECISION,
    s DOUBLE PRECISION,
    a DOUBLE PRECISION,
    dis DOUBLE PRECISION,
    o DOUBLE PRECISION,
    dir DOUBLE PRECISION,
    event TEXT,
    player_id INT,
    displayName TEXT,
    jerseyNumber INT,
    position TEXT,
    frameId INT,
    team TEXT,
    gameid INT,
    playid INT,
    playDirection TEXT,
    route TEXT
);

CREATE TABLE scores (
    scoreid INT PRIMARY KEY,
    date DATE,
    visitor_team TEXT,
    visitor_team_abb TEXT,
    visitor_score INT,
    home_team TEXT,
    home_team_abb TEXT,
    home_score INT
);

CREATE TABLE stadium_info (
    stadiumid INT PRIMARY KEY,
    stadium_name TEXT,
    location TEXT,
    surface TEXT,
    roof_type TEXT,
    team_name TEXT,
    team_abbreviation TEXT,
    time_zone TEXT
);

```

Add indexes to the `tracking` table to improve query performance:

```sql
CREATE INDEX idx_gameid ON tracking (gameid);
CREATE INDEX idx_playerid ON tracking (player_id);
CREATE INDEX idx_playid ON tracking (playid);
```

**Create hypertable from `tracking` table**

```sql
/*
tracking: name of the table
time: name of the timestamp column
*/
SELECT create_hypertable('tracking', 'time');
```

## Ingest data from CSV files

There are three separate CSV files for game, player, and play tables. For the tracking table, you need to
import data from 17 CSV files (one file for each week of the season).

You can use a Python script that uses psycopg2's `copy_expert` function to ingest the data:

```python
import config
import psycopg2

# connect to the database
conn = psycopg2.connect(database=config.DB_NAME,
                        host=config.HOST,
                        user=config.USER,
                        password=config.PASS,
                        port=config.PORT)

# insert CSV file into given table
def insert(csv_file, table_name):
    cur = conn.cursor()
    copy_sql = """
            COPY {table} FROM stdin WITH CSV HEADER
            DELIMITER as ','
            """.format(table=table_name)
    with open(csv_file, 'r') as f:
        cur.copy_expert(sql=copy_sql, file=f)
        conn.commit()
        cur.close()

print("Inserting games.csv")
insert("data/games.csv", "game")

print("Inserting plays.csv")
insert("data/plays.csv", "play")

print("Inserting players.csv")
insert("data/players.csv", "player")

print("Inserting stadium_info.csv")
insert("data/stadium_info.csv", "stadium_info")

print("Inserting scores.csv")
insert("data/scores.csv", "scores")

# iterate over each week's CSV file and insert them
for i in range(1, 18):
    print(f'Inserting week{i}'.format(i = str(i)))
    insert(f'data/week{i}.csv'.format(i=i), "tracking")

conn.close()
```

## Run your first query

Now that you have all the data ingested, you can run the first aggregation query
and examine the results. For most of the example queries in this tutorial,
you'll need to aggregate data from the `tracking` table, which
contains multiple rows per player for each play (because the data is sampled
multiple times per second during each play)

<Highlight type="important">
These queries are examples of hyperfunctions. To access hyperfunctions, you need to have installed the  [Timescale toolkit](https://docs.timescale.com/use-timescale/latest/install-timescaledb-toolkit/) before you begin.
</Highlight>

### Number of yards run in game for passing plays, by player and game

This query sums all yards for each player in every game. You can then
join that on the `player` table to get player details:

```sql
SELECT t.player_id, p.displayname, SUM(dis) AS yards, t.gameid
FROM tracking t
LEFT JOIN player p ON t.player_id = p.player_id
GROUP BY t.player_id, p.displayname, t.gameid
ORDER BY t.gameid ASC, yards DESC;
```

Your data should look like this:

|player_id |        displayname         |       yards        |   gameid   |
|-----------|-----------------------------|--------------------|------------|
|   2495454 | Julio Jones                 | 1030.6399999999971 | 2018090600|
|   2507763 | Mike Wallace                |  940.0099999999989 | 2018090600|
|   2552600 | Nelson Agholor              |  908.0299999999983 | 2018090600|
|   2540158 | Zach Ertz                   |  882.0899999999953 | 2018090600|
|   2539653 | Robert Alford               |  881.7599999999983 | 2018090600|
|   2555383 | Jalen Mills                 |  856.1199999999916 | 2018090600|

You might have noticed, however, that this data takes a long time to query because
we have to aggregate every row in the `tracking` table to get the total
yards of each player, in each game. That's a lot of work for PostgreSQL to do
when it needs to scan 20 million rows. On our small test machine this query
often takes 25-30 seconds to run.

## Faster queries with continuous aggregates

Most of the data we were interested in are based on this aggregation of the
`tracking` data. We wanted to know how far a player traveled on each play
or throughout each game. Rather than asking TimescaleDB to query and aggregate
that raw data every time, we created a [continuous aggregate][cagg] out of this base query
to significantly improve the speed of queries and analysis.

### Create continuous aggregate of player yards per game

```sql
CREATE MATERIALIZED VIEW player_yards_by_game
WITH (timescaledb.continuous) AS
SELECT t.player_id, t.gameid, t.position, t.team,
 time_bucket(INTERVAL '1 day', t."time") AS bucket,
 SUM(t.dis) AS yards,
  AVG(t.a) AS acc
FROM tracking t
GROUP BY t.player_id, t.gameid, t.position, t.team, bucket;
```

When you have created the continuous aggregate, modify the query to use the
materialized data and notice the response time is now significantly faster, under
one second on our test machine.

```sql
SELECT pyg.player_id, p.displayname, SUM(yards) AS yards, pyg.gameid
FROM player_yards_by_game pyg
LEFT JOIN player p ON pyg.player_id = p.player_id
GROUP BY pyg.player_id, p.displayname, pyg.gameid
ORDER BY pyg.gameid ASC, yards DESC;
```

We'll use this continuous aggregate in most of the queries in the
next section. Feel free to play with other variations of this materialized data
as you try to answer even more questions with TimescaleDB.

[cagg]: /use-timescale/:currentVersion:/continuous-aggregates/
[extra-download]: https://assets.timescale.com/docs/downloads/nfl_2018.zip
[kaggle-download]: https://www.kaggle.com/c/nfl-big-data-bowl-2021/data
