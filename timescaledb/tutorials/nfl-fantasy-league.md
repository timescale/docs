# Win your NFL fantasy league with TimescaleDB

This tutorial is a step-by-step guide on how to ingest and analyze american football data with TimescaleDB.

The dataset that we're using is provided by the National Football League (NFL) and contains data about 
all the passing plays of the 2018 NFL season. We're going to ingest this dataset with Python into TimescaleDB 
and start exploring it to discover interesting things about players that could help you win your next fantasy season. 
If you aren't an NFL fan, don't worry, you will still find this tutorial helpful as it's showcasing how to 
get started with TimescaleDB and explore a real world dataset with SQL and Python.


1. [Create tables][]
2. [Ingest data from CSV files][] 
3. [Analyze NFL data][]
   
## Prerequisites

* Python 3
* TimescaleDB (see [installation options][install-timescale]) 
* [Psql][psql-install] or any other PostgreSQL client (e.g. DBeaver)
* Pandas and Matplotlib (`pip install pandas matplotlib`)

## Download the dataset

Download dataset here!

## Create tables

You will need to create four tables:

* game
  
  Information about each game.
* player
  
  Player information.
* play
  
  Play information
* tracking
  
  Tracking information from each play.

```sql
CREATE TABLE game (
    gameId INT PRIMARY KEY,
    gameDate DATE,
    gameTimeEastern TIME,
    homeTeamAbbr VARCHAR(3),
    visitorTeamAbbr VARCHAR(3),
    week INT
);

CREATE TABLE player (
    nflId INT,
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
    nflId INT,
    displayName TEXT,
    jerseyNumber INT,
    position TEXT,
    frameId INT,
    team TEXT,
    gameId INT,
    playId INT,
    playDirection VARCHAR(5),
    route TEXT
);
```

## Ingest data from CSV files

We have three separate CSV files for game, player, and play tables. For the tracking table, you will need to
import data from 17 CSV files (1 file for each week in the season).

Let's use a Python script that utilizes psycopg2's `copy_expert` function to ingest the data:

```python
import config
import psycopg2

# Connect to the database
conn = psycopg2.connect(database=config.DB_NAME, 
                        host=config.HOST, 
                        user=config.USER, 
                        password=config.PASS, 
                        port=config.PORT)

# Insert CSV file into given table
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

# iterate over each week's CSV file and insert
for i in range(1, 18): 
    print("Inserting week{i}".format(str(i)))
    insert("data/week{i}.csv".format(i=i), "tracking")

conn.close()
```

## Analyze NFL data

Now that you have all the data ingested, let's go over some ideas on how you can analyze the data to help you perfect
your fantasy drafting strategy and win your fantasy season.

To analyze the dataset you will need to install two libraries, if you haven't already: Pandas and Matplotlib.

### Install pandas and matplotlib
```bash
pip install pandas matplotlib
```

1. Number of yards run in game for passing plays, by player and game 
1. Avg yards run for a player over a game
1. Average and median yards run per game by type of player (not taking avg of individual)
1. Num of snap plays by player where they were on the offense
1. Number of plays vs points scored
1. Average yards per game for top 3 players of each position

(todo include queries and viz)


## Resources

* Github project repository
* NFL Big Data Bowl on Kaggle
* 