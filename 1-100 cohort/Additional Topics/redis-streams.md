# Redis Streams

## What are Redis Streams?

Redis Streams is a data structure that acts as an **append-only log** with consumer group support. It's ideal for event sourcing, message queues, and real-time data pipelines.

### Key Concepts

- **Stream** — An append-only log of entries
- **Entry** — A message with a unique ID and field-value pairs
- **Consumer Group** — A group of consumers that split stream processing
- **Consumer** — A process reading from a stream within a consumer group
- **ACK** — Acknowledgment that a message has been processed

### Streams vs Pub/Sub

| Feature | Pub/Sub | Streams |
|---------|---------|---------|
| Message Persistence | No | Yes |
| Consumer Groups | No | Yes |
| Message Replay | No | Yes |
| Delivery Guarantee | At-most-once | At-least-once |
| Use Case | Real-time notifications | Event sourcing, queues |

---

## Basic Operations

### Adding Messages

```bash
# XADD — Add entry to stream
# Auto-generated ID (timestamp-sequence)
XADD mystream * name "John" action "login"
# Returns: "1686123456789-0"

# Specific ID
XADD mystream 1686123456789-1 name "Jane" action "signup"

# With MAXLEN trimming (keep last 1000 entries)
XADD mystream MAXLEN 1000 * name "Bob" action "purchase"
```

### Reading Messages

```bash
# Read all entries
XRANGE mystream - +

# Read last 10 entries
XREVRANGE mystream + - COUNT 10

# Read entries after a specific ID
XREAD COUNT 10 STREAMS mystream 1686123456789-0

# Block and wait for new entries (5 seconds timeout)
XREAD COUNT 10 BLOCK 5000 STREAMS mystream $

# Read entries from the last hour
XRANGE mystream 1686120000000 + 
```

### Stream Info

```bash
# Get stream length
XLEN mystream

# Get stream info
XINFO STREAM mystream

# Get consumer group info
XINFO GROUPS mystream

# Get consumers in a group
XINFO CONSUMERS mystream mygroup
```

---

## Consumer Groups

Consumer groups allow multiple consumers to process messages from a stream without duplication.

### Creating and Using Consumer Groups

```bash
# Create consumer group
XGROUP CREATE mystream mygroup 0

# Create consumer group starting from latest entry
XGROUP CREATE mystream mygroup $ MKSTREAM

# Read as consumer in group
XREADGROUP GROUP mygroup consumer1 COUNT 10 BLOCK 5000 STREAMS mystream >

# Acknowledge message processing
XACK mystream mygroup 1686123456789-0

# View pending messages
XPENDING mystream mygroup

# Detailed pending info
XPENDING mystream mygroup - + 10 consumer1
```

### Consumer Group Flow

```
Producer → XADD → Stream → XREADGROUP → Consumer
                                    ↓
                               Process message
                                    ↓
                               XACK → Mark as processed
```

### Claiming Stale Messages

```bash
# Claim messages idle for more than 1 hour
XCLAIM mystream mygroup consumer2 3600000 1686123456789-0

# Auto-claim (Redis 6.2+)
XAUTOCLAIM mystream mygroup consumer2 3600000 0-0 COUNT 10
```

---

## Node.js Implementation

### Using ioredis

```typescript
import Redis from 'ioredis';

const redis = new Redis();

// Producer
async function publishEvent(stream: string, data: Record<string, string>) {
  const args: string[] = [];
  for (const [key, value] of Object.entries(data)) {
    args.push(key, value);
  }
  const id = await redis.xadd(stream, '*', ...args);
  console.log(`Published event ${id}`);
  return id;
}

// Consumer with consumer group
async function consumeEvents(
  stream: string,
  group: string,
  consumer: string,
  handler: (id: string, data: Record<string, string>) => Promise<void>
) {
  // Create consumer group if it doesn't exist
  try {
    await redis.xgroup('CREATE', stream, group, '0', 'MKSTREAM');
  } catch (e) {
    // Group already exists
  }

  while (true) {
    const results = await redis.xreadgroup(
      'GROUP', group, consumer,
      'COUNT', 10,
      'BLOCK', 5000,
      'STREAMS', stream, '>'
    );

    if (!results) continue;

    for (const [, messages] of results) {
      for (const [id, fields] of messages) {
        const data: Record<string, string> = {};
        for (let i = 0; i < fields.length; i += 2) {
          data[fields[i]] = fields[i + 1];
        }

        try {
          await handler(id, data);
          await redis.xack(stream, group, id);
        } catch (err) {
          console.error(`Failed to process ${id}:`, err);
        }
      }
    }
  }
}

// Usage
await publishEvent('orders', {
  userId: '123',
  product: 'laptop',
  quantity: '1',
  action: 'purchase'
});

await consumeEvents('orders', 'order-processor', 'worker-1', async (id, data) => {
  console.log(`Processing order ${id}:`, data);
  // Process order...
});
```

---

## Real-World Patterns

### Event Sourcing

```typescript
// Event store using Redis Streams
class EventStore {
  constructor(private redis: Redis, private stream: string) {}

  async append(event: DomainEvent): Promise<string> {
    return this.redis.xadd(this.stream, '*',
      'type', event.type,
      'aggregateId', event.aggregateId,
      'data', JSON.stringify(event.data),
      'timestamp', new Date().toISOString()
    );
  }

  async getEvents(aggregateId: string): Promise<DomainEvent[]> {
    const events = [];
    let lastId = '0-0';
    
    while (true) {
      const result = await this.redis.xrange(
        this.stream, lastId, '+', 'COUNT', 100
      );
      
      if (result.length === 0) break;
      
      for (const [id, fields] of result) {
        const data = this.parseFields(fields);
        if (data.aggregateId === aggregateId) {
          events.push(data as DomainEvent);
        }
        lastId = id;
      }
    }
    
    return events;
  }
}
```

### Task Queue with Retry

```typescript
class TaskQueue {
  private stream: string;
  private group: string;

  constructor(private redis: Redis, name: string) {
    this.stream = `queue:${name}`;
    this.group = `${name}-workers`;
  }

  async enqueue(task: string, payload: object): Promise<string> {
    return this.redis.xadd(this.stream, 'MAXLEN', '~', '10000', '*',
      'task', task,
      'payload', JSON.stringify(payload),
      'attempts', '0',
      'maxAttempts', '3'
    );
  }

  async process(consumer: string, handler: Function): Promise<void> {
    // Setup group
    try {
      await this.redis.xgroup('CREATE', this.stream, this.group, '0', 'MKSTREAM');
    } catch (e) {}

    // Process messages
    while (true) {
      const results = await this.redis.xreadgroup(
        'GROUP', this.group, consumer,
        'COUNT', 1,
        'BLOCK', 5000,
        'STREAMS', this.stream, '>'
      );

      if (!results) continue;

      for (const [, messages] of results) {
        for (const [id, fields] of messages) {
          const data = this.parseFields(fields);
          
          try {
            await handler(data.task, JSON.parse(data.payload));
            await this.redis.xack(this.stream, this.group, id);
          } catch (err) {
            const attempts = parseInt(data.attempts) + 1;
            if (attempts >= parseInt(data.maxAttempts)) {
              // Move to dead letter queue
              await this.redis.xadd(`queue:dead-letter`, '*',
                'task', data.task,
                'payload', data.payload,
                'error', String(err)
              );
              await this.redis.xack(this.stream, this.group, id);
            } else {
              // Update attempts and retry
              await this.redis.xadd(this.stream, '*',
                'task', data.task,
                'payload', data.payload,
                'attempts', String(attempts),
                'maxAttempts', data.maxAttempts
              );
              await this.redis.xack(this.stream, this.group, id);
            }
          }
        }
      }
    }
  }
}
```

---

## Monitoring

```bash
# Stream stats
XINFO STREAM mystream

# Consumer group lag
XINFO GROUPS mystream

# Check pending messages
XPENDING mystream mygroup
XPENDING mystream mygroup - + 100

# Memory usage
MEMORY USAGE mystream
```

## Resources

- [Redis Streams Documentation](https://redis.io/docs/data-types/streams/)
- [Redis Streams with Node.js](https://redis.io/docs/clients/nodejs/)
- [Stream Processing Patterns](https://redis.io/docs/data-types/streams-tutorial/)
