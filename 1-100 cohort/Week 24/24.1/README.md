# RPC, GRPC and more

## What is RPC?

- stands for **Remote Procedure Call**.
- In normal scenario of multiple servers, they usually communicate using HTTP.
- But at scale, there are some issues:

  1. There are no automatic type of data being sent which can be inferred.
  2. Language agnostic communication is not possible.

- This is where RPC comes in.
- RPC is a protocol that one program can use to request a service from a program located in another computer (server) in a network without having to understand the network's details.

- **Example**:

  ```javascript
  function add(a, b) {
    return a + b;
  }
  ```

  - This is a simple function that adds two numbers.
  - In RPC, we can call this function from another server.
  - This is done by sending a request to the server with the **function name** and the **parameters**.
  - The server then executes the function and sends the response back.

  **Benefits**:

- Better Types - The data returned is associated with type.
- Language Agnostic - Can be used with any language.
- Faster - Data transfer is compressed and fast.
- Don't need to use axios anymore for API calls. We can directly call the function.

## ProtoBuffs

- Developed by Google.
- **Protocol Buffers** is a method of serializing structured data.
- Its a format to store data in a structured and compressed way (binary format instead of text-based formats like JSON).

  <br>

- Consists of two parts:

    <br>

  - **.proto** file - This is where we define the structure of the data. Here we define different types like below:

    - **message** - This is like a class in JavaScript. It defines the structure of the data. Eg:

      ```protobuf
      message AddRequest {
      int32 a = 1; // 1 is the key
      int32 b = 2; // 2 is the key
      }
      ```

    - **service** - This is like a class with functions in JavaScript. It defines the functions that can be called.

      ```protobuf
      service AddService {
      rpc add(AddRequest) returns (AddResponse) {} //'rpc' is the keyword for defining a function
      }
      ```

    <br>

  - **.js** file - This is where we define the functions to interact with the data.

## Some Common RPC Frameworks

### JSON-RPC

- It is a simple protocol that uses JSON for data transfer.
- Stateless, light-weight remote procedure call (RPC) protocol.
- Designed to be simple and easy to implement.
- Language agnostic.

### GRPC

- Stands for **Google Remote Procedure Call**.
- It is a high performance, open-source and universal RPC framework.
- It is based on HTTP/2 and **Protocol Buffers**.
- Data transfer layer gets extremely compressed and fast. Makes cloud cost goes down.

### TRPC

- Stands for **TypeScript RPC**.
- Modern RPC framework for TypeScript and Node.js with Type-safety.
- It is built on top of Next.js and inspired by gRPC.
- Only works with TypeScript.

## Implementing a dump RPC

- Try going to the `localhost:3000/rpc` with following body:

  ```json
  {
    "jsonrpc": "2.0",
    "id": 1,
    "method": "add",
    "params": [1, 2]
  }
  ```

- Get seperate response for the `**add**` method and for any other methods.

- This is how we can implement a simple RPC.

### How is RPC different from GraphQL?

| RPC                         | GraphQL                  |
| --------------------------- | ------------------------ |
| Remote Procedure Call       | Query Language           |
| Function Call               | Query                    |
| Single Function Call        | Multiple Queries         |
| No Automatic Type Inference | Automatic Type Inference |

---

## gRPC

- **gRPC** is a high performance, open-source and universal RPC framework.
- Real Life Use Cases: In Big Companies with multiple teams, they use RPC to communicate between different services.

## Implementing gRPC

- To generate automatic types, run the following command:

  ```bash
  ./node_modules/@grpc/proto-loader/build/bin/proto-loader-gen-types.js  --longs=String --enums=String --defaults --oneofs --grpcLib=@grpc/grpc-js --outDir=proto ./src/a.proto
  ```

- The above command will generate types for the proto file in a folder named `/proto`. Shift this folder inside the `src` folder.

so the most general use case of grpc is to be a mediator between different services (language-agnostic) in a company. if so, how does it connect functions from different services together?

for http requests, openapi spec has more preference than grpc. as there are multiple libraries available to convert these specs to generate ts codes (specically for querying functions like kubb-gen, openapi-generated for react-query). can we do this for grpc and is this recommended?

Slides [here](https://projects.100xdevs.com/tracks/grpc/grpc-4).

- gRPC is highy language agnostic, which is amazing.

![image](https://github.com/user-attachments/assets/faa1bb12-bbde-4cb4-a93a-f3e3ab75758e)

## What exactly did we do in grpc-service folder here?
Here’s the flow you created in grpc-service folder:

- Lets's assume we have 2 backends A and B talking to each other via gRPC.
  
- You are in the A backend trying to talk to the B backend.

- You defined your data structures and service interface in a .proto file (the contract).

- In backend A, you wrote an index.ts that:

      Loads the .proto file (using proto-loader).

      Creates a gRPC client stub dynamically based on the .proto definitions.

      Uses that client to call the functions implemented in backend B.

- In backend B, you have the actual implementation of these functions (the server).

- When you call the backend B functions from backend A (via Postman or any gRPC client):

      The request and response messages are serialized and deserialized using Protocol Buffers, which is very fast and efficient.

      This results in quick data transfer between the two services.
