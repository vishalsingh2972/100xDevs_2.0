"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_graphql_1 = require("express-graphql");
const graphql_1 = require("graphql");
const path = __importStar(require("path"));
const fs = require("fs");
const schemaString = fs.readFileSync(path.join(__dirname, "./schema.gql"), "utf8");
const schema = (0, graphql_1.buildSchema)(schemaString);
//@ts-ignore
const authMiddleware = (req, res, next) => {
    req.authHeader = req.headers.authorization;
    next();
};
const root = {
    //@ts-ignore
    getUser: ({ id }, req) => {
        console.log(req.authHeader);
        // mongoose/prisma logic to get the user
        if (id === "1") {
            return {
                id: "1",
                email: "john.doe@example.com",
                firstname: "John",
                lastname: "Doe",
            };
        }
        return null;
    },
    //@ts-ignore
    createUser: ({ input }, req) => {
        console.log(req.authHeader);
        // mongoose/prisma logic to store the user
        return Object.assign({ id: "2" }, input);
    },
};
const app = (0, express_1.default)();
app.get("/healthcheck", (req, res) => {
    res.json({ msg: "hi" });
});
app.use("/graphql", (0, express_graphql_1.graphqlHTTP)({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));
const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Running a GraphQL API server at http://localhost:${PORT}/graphql`);
});
