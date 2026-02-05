# Redis Streams

## What are Redis Streams?

Redis Streams is a data structure that acts as an append-only log. It's designed for building event-driven architectures, message queues, and real-time data processing pipelines.

### Key Concepts

- **Stream** - Append-only log of messages
- **Entry** - A message in the stream (ID + field-value pairs)
- **Consumer Group** - Group of consumers that cooperatively process messages
- **Consumer** - Individual processor within a group
- **Pending Entry List (PEL)** - Tracks unacknowledged messages

## Basic Operations

### Adding Messages (XADD)
```bash
# Add message with auto-generated ID
XADD mystream * name "John" action "login"

# Add with specific ID (timestamp-sequence)
XADD mystream 1234567890123-0 name "Jane" action "logout"
```

### Reading Messages (XREAD)
```bash
# Read from beginning
XREAD STREAMS mystream 0

# Read new messages (blocking)
XREAD BLOCK 5000 STREAMS mystream $

# Read from specific ID
XREAD STREAMS mystream 1234567890123-0
```

### Range Queries (XRANGE)
```bash
# All messages
XRANGE mystream - +

# Last 10 messages
XREVRANGE mystream + - COUNT 10

# Messages between timestamps
XRANGE mystream 1234567890000 1234567899999
```

## Consumer Groups

### Create Consumer Group
```bash
# Start from beginning
XGROUP CREATE mystream mygroup 0 MKSTREAM

# Start from new messages only
XGROUP CREATE mystream mygroup $ MKSTREAM
```

### Read as Consumer (XREADGROUP)
```bash
# Read pending or new messages
XREADGROUP GROUP mygroup consumer1 COUNT 10 STREAMS mystream >

# Read only pending messages
XREADGROUP GROUP mygroup consumer1 STREAMS mystream 0
```

### Acknowledge Messages (XACK)
```bash
XACK mystream mygroup 1234567890123-0
```

## Node.js Implementation

### Setup
```bash
npm install ioredis
```

### Producer
```javascript
const Redis = require('ioredis');
const redis = new Redis();

async function publishEvent(stream, data) {
  const id = await redis.xadd(stream, '*', ...Object.entries(data).flat());
  console.log(`Published: ${id}`);
  return id;
}

// Usage
publishEvent('orders', {
  orderId: '12345',
  product: 'laptop',
  quantity: '1',
  timestamp: Date.now().toString()
});
```

### Consumer with Consumer Groups
```javascript
const Redis = require('ioredis');
const redis = new Redis();

const STREAM = 'orders';
const GROUP = 'order-processors';
const CONSUMER = `consumer-${process.pid}`;

async function setupConsumerGroup() {
  try {
    await redis.xgroup('CREATE', STREAM, GROUP, '0', 'MKSTREAM');
    console.log('Consumer group created');
  } catch (err) {
    if (!err.message.includes('BUSYGROUP')) throw err;
    console.log('Consumer group already exists');
  }
}

async function processMessages() {
  while (true) {
    try {
      // Read new messages
      const results = await redis.xreadgroup(
        'GROUP', GROUP, CONSUMER,
        'BLOCK', 5000,
        'COUNT', 10,
        'STREAMS', STREAM, '>'
      );

      if (results) {
        for (const [stream, messages] of results) {
          for (const [id, fields] of messages) {
            const data = {};
            for (let i = 0; i < fields.length; i += 2) {
              data[fields[i]] = fields[i + 1];
            }
            
            console.log(`Processing: ${id}`, data);
            
            // Process the message here
            await handleOrder(data);
            
            // Acknowledge
            await redis.xack(STREAM, GROUP, id);
          }
        }
      }
    } catch (err) {
      console.error('Error:', err);
      await new Promise(r => setTimeout(r, 1000));
    }
  }
}

async function handleOrder(order) {
  // Your business logic here
  console.log(`Order ${order.orderId} processed!`);
}

setupConsumerGroup().then(processMessages);
```

### Handling Failed Messages (Pending Entries)
```javascript
async function claimPendingMessages() {
  // Get pending messages older than 60 seconds
  const pending = await redis.xpending(STREAM, GROUP, '-', '+', 10);
  
  for (const entry of pending) {
    const [messageId, consumer, idleTime] = entry;
    
    if (idleTime > 60000) { // 60 seconds
      // Claim the message
      const claimed = await redis.xclaim(
        STREAM, GROUP, CONSUMER,
        60000, // min idle time
        messageId
      );
      
      console.log(`Claimed: ${messageId}`);
      // Process claimed messages
    }
  }
}

// Run periodically
setInterval(claimPendingMessages, 30000);
```

## Python Implementation

```python
import redis
import time
from typing import Dict, Any

r = redis.Redis(host='localhost', port=6379, decode_responses=True)

STREAM = 'events'
GROUP = 'processors'
CONSUMER = f'consumer-{time.time()}'

def setup_consumer_group():
    try:
        r.xgroup_create(STREAM, GROUP, id='0', mkstream=True)
    except redis.exceptions.ResponseError as e:
        if 'BUSYGROUP' not in str(e):
            raise

def publish(data: Dict[str, Any]):
    return r.xadd(STREAM, data)

def consume():
    setup_consumer_group()
    
    while True:
        messages = r.xreadgroup(
            GROUP, CONSUMER,
            {STREAM: '>'},
            count=10,
            block=5000
        )
        
        if messages:
            for stream, entries in messages:
                for msg_id, data in entries:
                    print(f'Processing: {msg_id} -> {data}')
                    
                    # Process here
                    process_message(data)
                    
                    # Acknowledge
                    r.xack(STREAM, GROUP, msg_id)

def process_message(data: Dict):
    print(f"Handled: {data}")

if __name__ == '__main__':
    consume()
```

## Stream Management

### Get Stream Info
```bash
# Stream length
XLEN mystream

# Stream info
XINFO STREAM mystream

# Consumer groups info
XINFO GROUPS mystream

# Consumers in group
XINFO CONSUMERS mystream mygroup
```

### Trimming Streams
```bash
# Keep only last 1000 entries
XTRIM mystream MAXLEN 1000

# Approximate trim (faster)
XTRIM mystream MAXLEN ~ 1000

# Trim by ID/time
XTRIM mystream MINID 1234567890000-0
```

## Use Cases

1. **Event Sourcing** - Store all events as immutable log
2. **Activity Feeds** - Timeline of user activities
3. **IoT Data Ingestion** - Sensor readings with timestamps
4. **Task Queues** - Distributed job processing
5. **Chat Applications** - Message history with ordering
6. **Audit Logs** - Compliance and tracking

## Best Practices

1. **Set MAXLEN** - Prevent unbounded growth
2. **Use Consumer Groups** - For parallel processing
3. **Implement ACK** - Don't lose messages
4. **Handle Pending** - Reclaim stuck messages
5. **Monitor PEL Size** - Detect processing issues

## Resources

- [Redis Streams Documentation](https://redis.io/docs/data-types/streams/)
- [Redis Streams Tutorial](https://redis.io/docs/data-types/streams-tutorial/)
