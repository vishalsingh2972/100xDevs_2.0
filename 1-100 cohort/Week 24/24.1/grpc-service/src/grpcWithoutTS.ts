//✨makes use of just a.proto file

// This is backend B code and we use Postman as backend A (client) to make a call to the gRPC server running here.
// Backend B hosts the gRPC server that implements the AddPerson RPC defined in the .proto file.
// Postman acts as a gRPC client that sends requests to this server on port 50051.

//here we have implemented both AddPerson and GetPersonByName RPC methods in Backend B

import path from 'path';
import * as grpc from '@grpc/grpc-js';
import { ServiceClientConstructor } from "@grpc/grpc-js"
import * as protoLoader from '@grpc/proto-loader';

const packageDefinition = protoLoader.loadSync(path.join(__dirname, '../src/a.proto'));

const personProto = grpc.loadPackageDefinition(packageDefinition);

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

//@ts-ignore
//call => req
//callback => res
//right 'addPerson' is this
function addPerson(call, callback) {
  let person = {
    name: call.request.name,
    age: call.request.age
  }
  PERSONS.push(person); //add new person to existing array
  callback(null, person); //this will send the response back to the Postman client (backend A)
}

//@ts-ignore
function GetPersonByName(call, callback) {
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

const server = new grpc.Server();
server.addService((personProto.AddressBookService as ServiceClientConstructor).service, { addPerson: addPerson, GetPersonByName: GetPersonByName });

server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
  server.start();
});