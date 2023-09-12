SELECT
  time_bucket('1 day', time) AS bucket,
  symbol,
  avg(price)
FROM stocks_real_time srt
WHERE time > now() - INTERVAL '1 week'
GROUP BY bucket, symbol
ORDER BY bucket, symbol
LIMIT 10;

-- Output

bucket                 | symbol |        avg
-----------------------+--------+--------------------
2023-06-01 00:00:00+00 | AAPL   |  179.3242530284364
2023-06-01 00:00:00+00 | ABNB   | 112.05498586371293
2023-06-01 00:00:00+00 | AMAT   | 134.41263567849518
2023-06-01 00:00:00+00 | AMD    | 119.43332772033834
2023-06-01 00:00:00+00 | AMZN   |  122.3446364966392
...
