SELECT time_bucket('1 hour', time) AS bucket,
    first(price,time),
    last(price, time)
FROM stocks_real_time srt
WHERE time > now() - INTERVAL '4 days'
GROUP BY bucket;

-- Output

         bucket         | first  |  last
------------------------+--------+--------
 2023-08-07 08:00:00+00 |  88.75 | 182.87
 2023-08-07 09:00:00+00 | 140.85 |  35.16
 2023-08-07 10:00:00+00 | 182.89 |  52.58
 2023-08-07 11:00:00+00 |  86.69 | 255.15
