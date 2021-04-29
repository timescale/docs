# 4. Add time-series data

To showcase TimescaleDB and get you familiar with its features, we’ll need some sample data to play around with. We’ll use the real-world scenario of climate change data. Data about the climate in a certain region is time-series data, as it describes how the climate in that area changes over time.

## About the dataset

Our dataset comes from [OpenWeatherMap](https://openweathermap.org) and contains measurements for 10 cities in which Timescalers reside: New York City, San Francisco, Princeton, Austin, Stockholm, Lisbon, Pietermaritzburg, Nairobi, Toronto and Vienna.

For each city, we record the following metrics:

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

## Accessing the Dataset

To get you started quickly, we provide a database dump with historical data for you to use as a basis. This database dump contains data from 1 January 1979 to 13 April 2021. This data will be used for historical analysis later in the tutorial.

We also provide a csv file with commands for inserting the data into your TimescaleDB instance.

We also provide a SQL query to generate synthetic climate data in order to simulate real time ingestion into TimescaleDB. Thisdata will be useful for real-time monitoring and analysis later in the tutorial.

[Instructions to restore from database dump]

[Instructions to download and insert from CSV file] 

[Instructions to generate and insert synthetic data]

Query to generate synthetic data every 30 minutes since 13 April 2021.

Now that you’re up and running with historical data inside TimescaleDB and a method to ingest the latest data into your database, let’s start querying the data. (LINK TO NEXT SECTION)


