//✨gRPC with types: makes use of both a.proto file and generated folder, P.S: generated folder is auto-generated.

// ✅ Type-safe version:
// Here we added type safety by importing `ProtoGrpcType` from the generated types (in ./generated/a).
// While loading the proto file, we cast it using: `as unknown as ProtoGrpcType`.
// This gives TypeScript knowledge of the structure from the proto file, so we don’t need to use `as ServiceClientConstructor` later.
// Now we can directly do: `server.addService(personProto.AddressBookService.service, ...)` with full type support.
//so basically when we are extracting data from a.proto file at that time itself we are defining the types using 'as unknown) as ProtoGrpcType' and hence no need to define types again later on using 'as ServiceClientConstructor).service' and hence just server.addService(personProto.AddressBookService.service, { addPerson: addPerson, GetPersonByName: GetPersonByName }); is fine and works

//additionally we added types for all parameters of both the functions using handler types

import path from 'path';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { ProtoGrpcType } from './generated/a';
import { AddressBookServiceHandlers } from './generated/AddressBookService';

const packageDefinition = protoLoader.loadSync(path.join(__dirname, '../src/a.proto'));

const personProto = (grpc.loadPackageDefinition(packageDefinition) as unknown) as ProtoGrpcType;

const PERSONS = [
  {
    name: "shahrukh",
    age: 45
  },
  {
    name: "vishal",
    age: 25
  },
];

//added type handlers for both the functions ~ CHECK all parameters of both the functions have types now
const handler: AddressBookServiceHandlers = {
  AddPerson: (call, callback) => {
    const person = {
      name: call.request.name,
      age: call.request.age,
    };
    PERSONS.push(person);
    callback(null, person);
  },

  GetPersonByName: (call, callback) => {
    const name = call.request.name;
    const person = PERSONS.find(p => p.name === name);
    if (person) {
      callback(null, person);
    } else {
      callback({
        code: grpc.status.NOT_FOUND,
        message: "Person not found",
      });
    }
  }
}

const server = new grpc.Server();
server.addService(personProto.AddressBookService.service, handler);

server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
  server.start();
});