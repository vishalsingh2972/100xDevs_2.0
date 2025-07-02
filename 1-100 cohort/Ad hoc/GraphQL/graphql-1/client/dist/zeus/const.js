"use strict";
/* eslint-disable */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ops = exports.ReturnTypes = exports.AllTypesProps = void 0;
exports.AllTypesProps = {
    Query: {
        getUser: {},
    },
    CreateUserInput: {},
    Mutation: {
        createUser: {
            input: "CreateUserInput",
        },
    },
};
exports.ReturnTypes = {
    User: {
        id: "ID",
        email: "String",
        firstname: "String",
        lastname: "String",
    },
    Query: {
        getUser: "User",
    },
    Mutation: {
        createUser: "User",
    },
};
exports.Ops = {
    query: "Query",
    mutation: "Mutation",
};
