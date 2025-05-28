// Original file: src/a.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { GetPersonByNameRequest as _GetPersonByNameRequest, GetPersonByNameRequest__Output as _GetPersonByNameRequest__Output } from './GetPersonByNameRequest';
import type { Person as _Person, Person__Output as _Person__Output } from './Person';

export interface AddressBookServiceClient extends grpc.Client {
  AddPerson(argument: _Person, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_Person__Output>): grpc.ClientUnaryCall;
  AddPerson(argument: _Person, metadata: grpc.Metadata, callback: grpc.requestCallback<_Person__Output>): grpc.ClientUnaryCall;
  AddPerson(argument: _Person, options: grpc.CallOptions, callback: grpc.requestCallback<_Person__Output>): grpc.ClientUnaryCall;
  AddPerson(argument: _Person, callback: grpc.requestCallback<_Person__Output>): grpc.ClientUnaryCall;
  addPerson(argument: _Person, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_Person__Output>): grpc.ClientUnaryCall;
  addPerson(argument: _Person, metadata: grpc.Metadata, callback: grpc.requestCallback<_Person__Output>): grpc.ClientUnaryCall;
  addPerson(argument: _Person, options: grpc.CallOptions, callback: grpc.requestCallback<_Person__Output>): grpc.ClientUnaryCall;
  addPerson(argument: _Person, callback: grpc.requestCallback<_Person__Output>): grpc.ClientUnaryCall;
  
  GetPersonByName(argument: _GetPersonByNameRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_Person__Output>): grpc.ClientUnaryCall;
  GetPersonByName(argument: _GetPersonByNameRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_Person__Output>): grpc.ClientUnaryCall;
  GetPersonByName(argument: _GetPersonByNameRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_Person__Output>): grpc.ClientUnaryCall;
  GetPersonByName(argument: _GetPersonByNameRequest, callback: grpc.requestCallback<_Person__Output>): grpc.ClientUnaryCall;
  getPersonByName(argument: _GetPersonByNameRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_Person__Output>): grpc.ClientUnaryCall;
  getPersonByName(argument: _GetPersonByNameRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_Person__Output>): grpc.ClientUnaryCall;
  getPersonByName(argument: _GetPersonByNameRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_Person__Output>): grpc.ClientUnaryCall;
  getPersonByName(argument: _GetPersonByNameRequest, callback: grpc.requestCallback<_Person__Output>): grpc.ClientUnaryCall;
  
}

export interface AddressBookServiceHandlers extends grpc.UntypedServiceImplementation {
  AddPerson: grpc.handleUnaryCall<_Person__Output, _Person>;
  
  GetPersonByName: grpc.handleUnaryCall<_GetPersonByNameRequest__Output, _Person>;
  
}

export interface AddressBookServiceDefinition extends grpc.ServiceDefinition {
  AddPerson: MethodDefinition<_Person, _Person, _Person__Output, _Person__Output>
  GetPersonByName: MethodDefinition<_GetPersonByNameRequest, _Person, _GetPersonByNameRequest__Output, _Person__Output>
}
