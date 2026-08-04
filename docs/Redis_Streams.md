# Redis Streams

Append-only log data structure (Redis 5.0+).

```bash
XADD mystream * field value
XREAD COUNT 2 STREAMS mystream 0
XGROUP CREATE mystream mygroup $ MKSTREAM
XREADGROUP GROUP mygroup consumer COUNT 1 STREAMS mystream >
XACK mystream mygroup ID
```

Use cases: event sourcing, message queues, IoT data
