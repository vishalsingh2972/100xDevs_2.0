# Implementing services using grpc

create new folder and create a new file
`3.1-trpc`

```bash
npm init -y
npx tsc --init
npm i @grpc/grpc-js @grpc/proto-loader
touch a.proto index.ts
```

Run it

```bash
tsc -b
node index.js
```

Test it in postman
File ⇒ New ⇒ GRPC
Import the proto file in GRPC
make sure to switch the request type to grpc, provides based on the proto file
go to message->

```txt
{
    "name":"nalin",
    "age":20
}
```

Send a request (select URL as grpc://localhost:50051)

```bash
./node_modules/@grpc/proto-loader/build/bin/proto-loader-gen-types.js  --longs=String --enums=String --defaults --oneofs --grpcLib=@grpc/grpc-js --outDir=generated a.proto
```