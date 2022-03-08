# Add time-series data

To help get you familiar with TimescaleDB's features, you’ll need some
sample data to play around with. For this tutorial, we provide real-time financial 
stock data provided by ['Twelve Data'][twelve-data]. The data set contains time-series 
stock prices from the last three months. For information on how to get more data 
from them, check out details on [how to use the 'Twelve data' script][script-twelve-data].

## About the dataset

The dataset contains tick level (10th of a second) stock data. There are two tables that 
you will ingest, the hypertable `stocks_real_time` and regular table `company`. 

Details on the columns are as follows:
`stocks_real_time`: tick level stock data indicating the minimum 
    * time: time zone timestamp column showing the time at which the stock was traded
    * symbol
    * price
    * day_volume

`company`: mapping for symbols to company names
    * 
    * 

For each city, we record the following metrics:
```bash
* time: Timestamp of data calculation
* timezone: Shift in seconds from UTC
* city_name: City name
* temp_c: Temperature in degrees celsius
* feels_like_c:  This temperature parameter accounts for the human perception of weather
* temp_min_c: Minimum temperature
* temp_max_c Maximum temperature
* pressure_hpa: Atmospheric pressure (at sea level) in hPa
* humidity_percent:  Humidity as a percentage of maximum water vapor
* wind_speed_ms: Wind speed in meters per second
* wind_deg: Wind direction, degrees (meteorological)
* rain_1h: Rain volume for the last hour, mm
* rain_3h: Rain volume for the last 3 hours, mm
* snow_1h: Snow volume for the last hour, in mm
* snow_3h: Snow volume for the last 3 hours, in mm
* clouds_percent: Cloudiness as a percentage
* weather_id: Weather condition id
```

## Accessing the dataset

We provide a CSV file with commands for inserting the data into your TimescaleDB instance.

Download the CSV file (in ZIP format) below and insert it into your database from psql.

Download CSV: <tag type="download">[weather_data.zip](https://s3.amazonaws.com/assets.timescale.com/docs/downloads/weather_data.zip)</tag>

After unzipping the file, use the following command (which assumes `weather_data.csv` is located in your current directory):

```sql
-- copy data from weather_data.csv into weather_metrics
\copy weather_metrics (time, timezone_shift, city_name, temp_c, feels_like_c, temp_min_c, temp_max_c, pressure_hpa, humidity_percent, wind_speed_ms, wind_deg, rain_1h_mm, rain_3h_mm, snow_1h_mm, snow_3h_mm, clouds_percent, weather_type_id) from './weather_data.csv' CSV HEADER;
```
Now that you’re up and running with historical data inside TimescaleDB and a
method to ingest the latest data into your database, let’s start querying the data.


[twelve-data]: 
[script-twelve-data]: