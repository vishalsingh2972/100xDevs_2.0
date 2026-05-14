# Redis Streams

## What are Redis Streams?

Redis Streams is a **log-based data structure** introduced in Redis 5.0. It allows you to append, read, and consume messages in order — similar to Apache Kafka but much simpler and built into Redis.

### Key Concepts

- **Stream** - An append-only log of entries, each with a unique ID
- **Entry** - A key-value pair with a timestamp-based ID (e.g., `1672531200000-0`)
- **Consumer Group** - A group of consumers that share the processing of messages
- **Consumer** - A member of a consumer group that reads messages

## Basic Commands

### Adding Entries

```bash
# Add an entry to a stream
XADD mystream * name "Alice" age 30
# Returns ID like: "1672531200000-0"

# Add with max length (keeps last 1000 entries)
XADD mystream MAXLEN 1000 * event "click" page "/home"
```

### Reading Entries

```bash
# Read all entries from the beginning
XRANGE mystream - +

# Read entries between timestamps
XRANGE mystream 1672531200000 1672531300000

# Read last 10 entries
XREVRANGE mystream + - COUNT 10

# Read new entries (blocking)
XREAD COUNT 10 BLOCK 5000 STREAMS mystream $
```

### Consumer Groups

```bash
# Create a consumer group
XGROUP CREATE mystream mygroup $ MKSTREAM

# Read as a consumer group member
XREADGROUP GROUP mygroup consumer1 COUNT 1 STREAMS mystream >

# Acknowledge processed message
XACK mystream mygroup 1672531200000-0

# View pending messages (unacknowledged)
XPENDING mystream mygroup

# Claim pending messages from a failed consumer
XCLAIM mystream mygroup consumer2 3600000 1672531200000-0
```

## Real-World Use Cases

### 1. Task Queue

```
Producer → XADD tasks * type "email" to "user@example.com"
Worker   → XREADGROUP GROUP workers worker1 STREAMS tasks >
Worker   → Process → XACK tasks workers <id>
```

### 2. Event Sourcing

```bash
# Append events
XADD orders * event "created" orderId "123" amount 99.99
XADD orders * event "paid" orderId "123" method "card"
XADD orders * event "shipped" orderId "123" tracking "ABC123"

# Replay all events to rebuild state
XRANGE orders - +
```

### 3. Real-time Notifications

```bash
# Publish notification
XADD notifications * userId "u1" message "New comment on your post"

# User reads their notifications
XREAD COUNT 20 STREAMS notifications $
```

## Node.js Example

```javascript
import { createClient } from 'redis';

const client = createClient();
await client.connect();

// Producer - add tasks
await client.xAdd('task-queue', '*', {
  type: 'process-image',
  fileId: 'abc123',
  size: '1920x1080'
});

// Consumer group
try {
  await client.xGroupCreate('task-queue', 'workers', '0', true);
} catch (e) {
  // Group might already exist
}

// Consumer - read and process
async function processTasks() {
  while (true) {
    const results = await client.xReadGroup(
      'GROUP', 'workers', 'worker-1',
      'COUNT', 1,
      'BLOCK', 5000,
      'STREAMS', 'task-queue', '>'
    );

    if (results) {
      for (const stream of results) {
        for (const message of stream.messages) {
          console.log('Processing:', message);
          // Do work here...
          await client.xAck('task-queue', 'workers', message.id);
        }
      }
    }
  }
}

processTasks();
```

## Redis Streams vs Other Message Queues

| Feature | Redis Streams | Kafka | RabbitMQ |
|---------|--------------|-------|----------|
| Persistence | Optional (AOF/RDB) | Always (disk) | Optional |
| Ordering | Per-stream | Per-partition | Per-queue |
| Consumer Groups | Built-in | Built-in | Plugin |
| Throughput | Very high | Very high | High |
| Complexity | Low | High | Medium |
| Replay | XRANGE | Offset-based | Limited |
| Max message size | 512 MB | Configurable | No limit |

## Best Practices

1. **Use `MAXLEN`** to prevent unbounded memory growth
2. **Use consumer groups** for distributed processing
3. **Always ACK messages** after successful processing
4. **Monitor pending entries** to detect stuck consumers
5. **Use `XTRIM`** or `XADD MAXLEN` to manage stream size
6. **Set `BLOCK` timeout** for efficient consumer polling
7. **Use `XINFO`** to inspect stream and consumer group health
