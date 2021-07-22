# Analyze NFL play-by-play data with TimescaleDB

This tutorial is a step-by-step guide on how to ingest and analyze American football 
data with TimescaleDB.

The dataset that we're using is provided by the National Football League (NFL) 
and contains player and tracking data for all the passing plays of the 2018 NFL 
season. We're going to ingest this dataset with Python into TimescaleDB and start 
exploring it to uncover insights about players and teams. 

If you happen to be a NFL fantasy football player, using
some of this analysis on past data could be helpful in selecting the most effective
players for the upcoming year. And, as the NFL releases new data throughout the
upcoming season, you can ingest that data to help you make better decisions from 
week to week.

Even if you aren't an NFL fan, this tutorial will provide a tangible example
of how ingest time-series data into TimescaleDB (even when it doesn't _seem_ like
time-series data) and how you can use plain SQL to do powerful data analysis and 
also visualize the data with Python.


1. [Ingest and query data](/tutorials/nfl-analytics/ingest-and-query)
1. [Analyze NFL data](/tutorials/nfl-analytics/advanced-analysis/)
1. [Visualize pre-snap positions and player movement](/tutorials/nfl-analytics/play-visualization/)
   
## Prerequisites

* Python 3
* TimescaleDB (see [installation options][install-timescale]) 
* [Psql][psql-install] or any other PostgreSQL client (e.g. DBeaver)

## Download the dataset

* [The NFL dataset is available for download on Kaggle.][kaggle-download]
* [Additional stadium and scores dataset (.zip) (source: wikipedia.com).][extra-download]


## Resources

* [NFL Big Data Bowl 2021 on Kaggle](https://www.kaggle.com/c/nfl-big-data-bowl-2021)


[install-timescale]: /how-to-guides/install-timescaledb/
[psql-install]: /how-to-guides/connecting/psql
[kaggle-download]: https://www.kaggle.com/c/nfl-big-data-bowl-2021/data
[extra-download]: https://assets.timescale.com/docs/downloads/nfl_2018.zip