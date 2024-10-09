---
section: hyperfunction
subsection: hyperloglog()
---

### Roll up two hyperloglogs

Roll up two hyperloglogs. The first hyperloglog buckets the integers from 1 to
100,000, and the second hyperloglog buckets the integers from 50,000 to
150,000. Accounting for overlap, the exact number of distinct values in the
combined set is 150,000.

Calling `distinct_count` on the rolled-up hyperloglog yields a final value of
150,552, so the approximation is off by only 0.368%:

```sql
SELECT distinct_count(rollup(logs))
FROM (
    (SELECT hyperloglog(4096, v::text) logs FROM generate_series(1, 100000) v)
    UNION ALL
    (SELECT hyperloglog(4096, v::text) FROM generate_series(50000, 150000) v)
) hll;
```

Output:

```sql
 distinct_count 
----------------
         150552
```

## Approximate relative errors

These are the approximate errors for each bucket size:

| precision | registers (bucket size) |  error |  column size (in bytes) |
|-----------|-------------------------|--------|-------------------------|
| 4         | 16                      | 0.2600 | 12                      |
| 5         | 32                      | 0.1838 | 24                      |
| 6         | 64                      | 0.1300 | 48                      |
| 7         | 128                     | 0.0919 | 96                      |
| 8         | 256                     | 0.0650 | 192                     |
| 9         | 512                     | 0.0460 | 384                     |
| 10        | 1024                    | 0.0325 | 768                     |
| 11        | 2048                    | 0.0230 | 1536                    |
| 12        | 4096                    | 0.0163 | 3072                    |
| 13        | 8192                    | 0.0115 | 6144                    |
| 14        | 16384                   | 0.0081 | 12288                   |
| 15        | 32768                   | 0.0057 | 24576                   |
| 16        | 65536                   | 0.0041 | 49152                   |
| 17        | 131072                  | 0.0029 | 98304                   |
| 18        | 262144                  | 0.0020 | 196608                  |
