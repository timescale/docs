SELECT * FROM stocks_real_time srt
WHERE symbol='TSLA'
ORDER BY time DESC
LIMIT 10;

-- Output

time                   | symbol |  price   | day_volume
-----------------------+--------+----------+------------
2025-01-30 00:51:00+00 | TSLA   |   405.32 |   NULL
2025-01-30 00:41:00+00 | TSLA   |   406.05 |   NULL
2025-01-30 00:39:00+00 | TSLA   |   406.25 |   NULL
2025-01-30 00:32:00+00 | TSLA   |   406.02 |   NULL
2025-01-30 00:32:00+00 | TSLA   |   406.10 |   NULL
2025-01-30 00:25:00+00 | TSLA   |   405.95 |   NULL
2025-01-30 00:24:00+00 | TSLA   |   406.04 |   NULL
2025-01-30 00:24:00+00 | TSLA   |   406.04 |   NULL
2025-01-30 00:22:00+00 | TSLA   |   406.38 |   NULL
2025-01-30 00:21:00+00 | TSLA   |   405.77 |   NULL
(10 rows)
