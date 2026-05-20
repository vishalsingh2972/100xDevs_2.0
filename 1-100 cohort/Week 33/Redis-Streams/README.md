# Redis Streams

## What are Redis Streams?

Redis Streams is a data structure that acts as an append-only log. It's designed for building message queues and event sourcing systems.

### Key Features

- **Append-only log** - Messages are appended and never modified
- **Consumer groups** - Multiple consumers can read from the same stream
- **Message acknowledgment** - Consumers can acknowledge processed messages
- **Persistence** - Messages are persisted in Redis

## Basic Operations

### Adding Messages

```bash
# Add message to stream
XADD mystream * name "John" age "30"

# Add with specific ID
XADD mystream 1234567890-0 name "John" age "30"
```

### Reading Messages

```bash
# Read all messages
XRANGE mystream - +

# Read last 10 messages
XRANGE mystream - + COUNT 10

# Read new messages (blocking)
XREAD BLOCK 0 STREAMS mystream $
```

### Consumer Groups

```bash
# Create consumer group
XGROUP CREATE mystream mygroup 0

# Read as consumer
XREADGROUP GROUP mygroup consumer1 COUNT 1 BLOCK 0 STREAMS mystream >

# Acknowledge message
XACK mystream mygroup 1234567890-0
```

## Node.js Example

```javascript
const Redis = require('ioredis');
const redis = new Redis();

// Add message
await redis.xadd('mystream', '*', 'name', 'John', 'age', '30');

// Read messages
const messages = await redis.xrange('mystream', '-', '+');

// Consumer group
await redis.xgroup('CREATE', 'mystream', 'mygroup', '0', 'MKSTREAM');
const result = await redis.xreadgroup(
  'GROUP', 'mygroup', 'consumer1',
  'COUNT', '1', 'BLOCK', '0',
  'STREAMS', 'mystream', '>'
);
```

## Use Cases

1. **Event Sourcing** - Store all events as a stream
2. **Message Queue** - Distribute work across consumers
3. **Activity Feed** - Track user actions
4. **Log Aggregation** - Collect logs from multiple sources

## Resources

- [Redis Streams Documentation](https://redis.io/topics/streams-intro)
- [Redis Streams Tutorial](https://redis.io/docs/data-types/streams-tutorial/)
