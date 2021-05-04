# 4. Add time-series data

To showcase TimescaleDB and get you familiar with its features, we’ll need some 
sample data to play around with. We’ll use the real-world scenario of climate 
change. Data about the climate in a certain region is time-series data, as it 
describes how the climate in that area changes over time.

## About the dataset

Our dataset comes from [OpenWeatherMap](https://openweathermap.org) and contains 
measurements for 10 cities in which Timescalers reside: New York City, San Francisco, 
Princeton, Austin, Stockholm, Lisbon, Pietermaritzburg, Nairobi, Toronto and Vienna.

The dataset contains weather metrics for each city from 1 January 1979 to 27 April 2021.

For each city, we record the following metrics:
```bash
* time: timestamp of data calculation
* timezone: Shift in seconds from UTC
* city_name: City name
* temp_c: Temperature in degrees celsius
* feels_like_c:  This temperature parameter accounts for the human perception of weather 
* temp_min_c: Minimum temperature
* temp_max_c Maximum temperature
* pressure_hpa: Atmospheric pressure (on the sea level) in hPa
* humidity_percent:  humidity as a percentage of
* wind_speed_ms: Wind speed in meters per second
* wind_deg: Wind direction, degrees (meteorological)
* rain_1h: Rain volume for the last hour, mm
* rain_3h: Rain volume for the last 3 hours, mm
* snow_1h: Snow volume for the last hour, in mm 
* snow_3h: Snow volume for the last 3 hours, in mm
* clouds_percent: Cloudiness as a percentage of
* weather_id: Weather condition id
```

## Accessing the Dataset

We provide a csv file with commands for inserting the data into your TimescaleDB instance.

Download the CSV file (in ZIP format) below and insert it into your database from psql.

Download CSV: <tag type="download">[weather_data.zip](https://s3.amazonaws.com/assets.timescale.com/docs/downloads/weather_data.zip)</tag>

After unzipping the file, use the following command (which assumes `weather_data.csv` is located in your current directory):

```sql
-- copy data from weather_data.csv into weather_metrics
\copy weather_metrics (time, timezone_shift, city_name, temp_c, feels_like_c, temp_min_c, temp_max_c, pressure_hpa, humidity_percent, wind_speed_ms, wind_deg, rain_1h_mm, rain_3h_mm, snow_1h_mm, snow_3h_mm, clouds_percent, weather_type_id) from './weather_data.csv' CSV HEADER;</td>
```
Now that you’re up and running with historical data inside TimescaleDB and a 
method to ingest the latest data into your database, let’s start querying the data.
