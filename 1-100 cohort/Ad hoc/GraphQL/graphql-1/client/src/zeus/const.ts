/* eslint-disable */

export const AllTypesProps: Record<string, any> = {
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

export const ReturnTypes: Record<string, any> = {
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

export const Ops = {
  query: "Query" as const,
  mutation: "Mutation" as const,
};
