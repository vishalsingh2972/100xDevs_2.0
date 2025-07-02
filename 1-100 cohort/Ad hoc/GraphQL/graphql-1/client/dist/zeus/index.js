"use strict";
/* eslint-disable */
Object.defineProperty(exports, "__esModule", { value: true });
exports.$ = exports.GRAPHQL_TYPE_SEPARATOR = exports.START_VAR_NAME = exports.resolverFor = exports.InternalArgsBuilt = exports.ResolveFromPath = exports.purifyGraphQLKey = exports.PrepareScalarPaths = exports.GraphQLError = exports.SEPARATOR = exports.traverseResponse = exports.decodeScalarsInResponse = exports.ZeusScalars = exports.Gql = exports.TypeFromSelector = exports.Selector = exports.ZeusSelect = exports.Zeus = exports.Subscription = exports.SubscriptionThunder = exports.Chain = exports.Thunder = exports.InternalsBuildQuery = exports.apiFetch = exports.apiSubscription = exports.HEADERS = exports.HOST = void 0;
const const_1 = require("./const");
exports.HOST = "http://localhost:4000/graphql";
exports.HEADERS = {};
const apiSubscription = (options) => (query) => {
    var _a, _b, _c;
    try {
        const queryString = options[0] + "?query=" + encodeURIComponent(query);
        const wsString = queryString.replace("http", "ws");
        const host = (options.length > 1 && ((_b = (_a = options[1]) === null || _a === void 0 ? void 0 : _a.websocket) === null || _b === void 0 ? void 0 : _b[0])) || wsString;
        const webSocketOptions = ((_c = options[1]) === null || _c === void 0 ? void 0 : _c.websocket) || [host];
        const ws = new WebSocket(...webSocketOptions);
        return {
            ws,
            on: (e) => {
                ws.onmessage = (event) => {
                    if (event.data) {
                        const parsed = JSON.parse(event.data);
                        const data = parsed.data;
                        return e(data);
                    }
                };
            },
            off: (e) => {
                ws.onclose = e;
            },
            error: (e) => {
                ws.onerror = e;
            },
            open: (e) => {
                ws.onopen = e;
            },
        };
    }
    catch (_d) {
        throw new Error("No websockets implemented");
    }
};
exports.apiSubscription = apiSubscription;
const handleFetchResponse = (response) => {
    if (!response.ok) {
        return new Promise((_, reject) => {
            response
                .text()
                .then((text) => {
                try {
                    reject(JSON.parse(text));
                }
                catch (err) {
                    reject(text);
                }
            })
                .catch(reject);
        });
    }
    return response.json();
};
const apiFetch = (options) => (query, variables = {}) => {
    const fetchOptions = options[1] || {};
    if (fetchOptions.method && fetchOptions.method === "GET") {
        return fetch(`${options[0]}?query=${encodeURIComponent(query)}`, fetchOptions)
            .then(handleFetchResponse)
            .then((response) => {
            if (response.errors) {
                throw new GraphQLError(response);
            }
            return response.data;
        });
    }
    return fetch(`${options[0]}`, Object.assign({ body: JSON.stringify({ query, variables }), method: "POST", headers: {
            "Content-Type": "application/json",
        } }, fetchOptions))
        .then(handleFetchResponse)
        .then((response) => {
        if (response.errors) {
            throw new GraphQLError(response);
        }
        return response.data;
    });
};
exports.apiFetch = apiFetch;
const InternalsBuildQuery = ({ ops, props, returns, options, scalars, }) => {
    const ibb = (k, o, p = "", root = true, vars = []) => {
        var _a;
        const keyForPath = (0, exports.purifyGraphQLKey)(k);
        const newPath = [p, keyForPath].join(exports.SEPARATOR);
        if (!o) {
            return "";
        }
        if (typeof o === "boolean" || typeof o === "number") {
            return k;
        }
        if (typeof o === "string") {
            return `${k} ${o}`;
        }
        if (Array.isArray(o)) {
            const args = (0, exports.InternalArgsBuilt)({
                props,
                returns,
                ops,
                scalars,
                vars,
            })(o[0], newPath);
            return `${ibb(args ? `${k}(${args})` : k, o[1], p, false, vars)}`;
        }
        if (k === "__alias") {
            return Object.entries(o)
                .map(([alias, objectUnderAlias]) => {
                if (typeof objectUnderAlias !== "object" ||
                    Array.isArray(objectUnderAlias)) {
                    throw new Error("Invalid alias it should be __alias:{ YOUR_ALIAS_NAME: { OPERATION_NAME: { ...selectors }}}");
                }
                const operationName = Object.keys(objectUnderAlias)[0];
                const operation = objectUnderAlias[operationName];
                return ibb(`${alias}:${operationName}`, operation, p, false, vars);
            })
                .join("\n");
        }
        const hasOperationName = root && (options === null || options === void 0 ? void 0 : options.operationName) ? " " + options.operationName : "";
        const keyForDirectives = (_a = o.__directives) !== null && _a !== void 0 ? _a : "";
        const query = `{${Object.entries(o)
            .filter(([k]) => k !== "__directives")
            .map((e) => ibb(...e, [p, `field<>${keyForPath}`].join(exports.SEPARATOR), false, vars))
            .join("\n")}}`;
        if (!root) {
            return `${k} ${keyForDirectives}${hasOperationName} ${query}`;
        }
        const varsString = vars
            .map((v) => `${v.name}: ${v.graphQLType}`)
            .join(", ");
        return `${k} ${keyForDirectives}${hasOperationName}${varsString ? `(${varsString})` : ""} ${query}`;
    };
    return ibb;
};
exports.InternalsBuildQuery = InternalsBuildQuery;
const Thunder = (fn) => (operation, graphqlOptions) => (o, ops) => fn((0, exports.Zeus)(operation, o, {
    operationOptions: ops,
    scalars: graphqlOptions === null || graphqlOptions === void 0 ? void 0 : graphqlOptions.scalars,
}), ops === null || ops === void 0 ? void 0 : ops.variables).then((data) => {
    if (graphqlOptions === null || graphqlOptions === void 0 ? void 0 : graphqlOptions.scalars) {
        return (0, exports.decodeScalarsInResponse)({
            response: data,
            initialOp: operation,
            initialZeusQuery: o,
            returns: const_1.ReturnTypes,
            scalars: graphqlOptions.scalars,
            ops: const_1.Ops,
        });
    }
    return data;
});
exports.Thunder = Thunder;
const Chain = (...options) => (0, exports.Thunder)((0, exports.apiFetch)(options));
exports.Chain = Chain;
const SubscriptionThunder = (fn) => (operation, graphqlOptions) => (o, ops) => {
    const returnedFunction = fn((0, exports.Zeus)(operation, o, {
        operationOptions: ops,
        scalars: graphqlOptions === null || graphqlOptions === void 0 ? void 0 : graphqlOptions.scalars,
    }));
    if ((returnedFunction === null || returnedFunction === void 0 ? void 0 : returnedFunction.on) && (graphqlOptions === null || graphqlOptions === void 0 ? void 0 : graphqlOptions.scalars)) {
        const wrapped = returnedFunction.on;
        returnedFunction.on = (fnToCall) => wrapped((data) => {
            if (graphqlOptions === null || graphqlOptions === void 0 ? void 0 : graphqlOptions.scalars) {
                return fnToCall((0, exports.decodeScalarsInResponse)({
                    response: data,
                    initialOp: operation,
                    initialZeusQuery: o,
                    returns: const_1.ReturnTypes,
                    scalars: graphqlOptions.scalars,
                    ops: const_1.Ops,
                }));
            }
            return fnToCall(data);
        });
    }
    return returnedFunction;
};
exports.SubscriptionThunder = SubscriptionThunder;
const Subscription = (...options) => (0, exports.SubscriptionThunder)((0, exports.apiSubscription)(options));
exports.Subscription = Subscription;
const Zeus = (operation, o, ops) => (0, exports.InternalsBuildQuery)({
    props: const_1.AllTypesProps,
    returns: const_1.ReturnTypes,
    ops: const_1.Ops,
    options: ops === null || ops === void 0 ? void 0 : ops.operationOptions,
    scalars: ops === null || ops === void 0 ? void 0 : ops.scalars,
})(operation, o);
exports.Zeus = Zeus;
const ZeusSelect = () => ((t) => t);
exports.ZeusSelect = ZeusSelect;
const Selector = (key) => key && (0, exports.ZeusSelect)();
exports.Selector = Selector;
const TypeFromSelector = (key) => key && (0, exports.ZeusSelect)();
exports.TypeFromSelector = TypeFromSelector;
exports.Gql = (0, exports.Chain)(exports.HOST, {
    headers: Object.assign({ "Content-Type": "application/json" }, exports.HEADERS),
});
exports.ZeusScalars = (0, exports.ZeusSelect)();
const decodeScalarsInResponse = ({ response, scalars, returns, ops, initialZeusQuery, initialOp, }) => {
    if (!scalars) {
        return response;
    }
    const builder = (0, exports.PrepareScalarPaths)({
        ops,
        returns,
    });
    const scalarPaths = builder(initialOp, ops[initialOp], initialZeusQuery);
    if (scalarPaths) {
        const r = (0, exports.traverseResponse)({ scalarPaths, resolvers: scalars })(initialOp, response, [ops[initialOp]]);
        return r;
    }
    return response;
};
exports.decodeScalarsInResponse = decodeScalarsInResponse;
const traverseResponse = ({ resolvers, scalarPaths, }) => {
    const ibb = (k, o, p = []) => {
        var _a;
        if (Array.isArray(o)) {
            return o.map((eachO) => ibb(k, eachO, p));
        }
        if (o == null) {
            return o;
        }
        const scalarPathString = p.join(exports.SEPARATOR);
        const currentScalarString = scalarPaths[scalarPathString];
        if (currentScalarString) {
            const currentDecoder = (_a = resolvers[currentScalarString.split(".")[1]]) === null || _a === void 0 ? void 0 : _a.decode;
            if (currentDecoder) {
                return currentDecoder(o);
            }
        }
        if (typeof o === "boolean" ||
            typeof o === "number" ||
            typeof o === "string" ||
            !o) {
            return o;
        }
        const entries = Object.entries(o).map(([k, v]) => [k, ibb(k, v, [...p, (0, exports.purifyGraphQLKey)(k)])]);
        const objectFromEntries = entries.reduce((a, [k, v]) => {
            a[k] = v;
            return a;
        }, {});
        return objectFromEntries;
    };
    return ibb;
};
exports.traverseResponse = traverseResponse;
exports.SEPARATOR = "|";
class GraphQLError extends Error {
    constructor(response) {
        super("");
        this.response = response;
        console.error(response);
    }
    toString() {
        return "GraphQL Response Error";
    }
}
exports.GraphQLError = GraphQLError;
const ExtractScalar = (mappedParts, returns) => {
    if (mappedParts.length === 0) {
        return;
    }
    const oKey = mappedParts[0];
    const returnP1 = returns[oKey];
    if (typeof returnP1 === "object") {
        const returnP2 = returnP1[mappedParts[1]];
        if (returnP2) {
            return ExtractScalar([returnP2, ...mappedParts.slice(2)], returns);
        }
        return undefined;
    }
    return returnP1;
};
const PrepareScalarPaths = ({ ops, returns, }) => {
    const ibb = (k, originalKey, o, p = [], pOriginals = [], root = true) => {
        if (!o) {
            return;
        }
        if (typeof o === "boolean" ||
            typeof o === "number" ||
            typeof o === "string") {
            const extractionArray = [...pOriginals, originalKey];
            const isScalar = ExtractScalar(extractionArray, returns);
            if (isScalar === null || isScalar === void 0 ? void 0 : isScalar.startsWith("scalar")) {
                const partOfTree = {
                    [[...p, k].join(exports.SEPARATOR)]: isScalar,
                };
                return partOfTree;
            }
            return {};
        }
        if (Array.isArray(o)) {
            return ibb(k, k, o[1], p, pOriginals, false);
        }
        if (k === "__alias") {
            return Object.entries(o)
                .map(([alias, objectUnderAlias]) => {
                if (typeof objectUnderAlias !== "object" ||
                    Array.isArray(objectUnderAlias)) {
                    throw new Error("Invalid alias it should be __alias:{ YOUR_ALIAS_NAME: { OPERATION_NAME: { ...selectors }}}");
                }
                const operationName = Object.keys(objectUnderAlias)[0];
                const operation = objectUnderAlias[operationName];
                return ibb(alias, operationName, operation, p, pOriginals, false);
            })
                .reduce((a, b) => (Object.assign(Object.assign({}, a), b)));
        }
        const keyName = root ? ops[k] : k;
        return Object.entries(o)
            .filter(([k]) => k !== "__directives")
            .map(([k, v]) => {
            // Inline fragments shouldn't be added to the path as they aren't a field
            const isInlineFragment = originalKey.match(/^...\s*on/) != null;
            return ibb(k, k, v, isInlineFragment ? p : [...p, (0, exports.purifyGraphQLKey)(keyName || k)], isInlineFragment
                ? pOriginals
                : [...pOriginals, (0, exports.purifyGraphQLKey)(originalKey)], false);
        })
            .reduce((a, b) => (Object.assign(Object.assign({}, a), b)));
    };
    return ibb;
};
exports.PrepareScalarPaths = PrepareScalarPaths;
const purifyGraphQLKey = (k) => k.replace(/\([^)]*\)/g, "").replace(/^[^:]*\:/g, "");
exports.purifyGraphQLKey = purifyGraphQLKey;
const mapPart = (p) => {
    const [isArg, isField] = p.split("<>");
    if (isField) {
        return {
            v: isField,
            __type: "field",
        };
    }
    return {
        v: isArg,
        __type: "arg",
    };
};
const ResolveFromPath = (props, returns, ops) => {
    const ResolvePropsType = (mappedParts) => {
        const oKey = ops[mappedParts[0].v];
        const propsP1 = oKey ? props[oKey] : props[mappedParts[0].v];
        if (propsP1 === "enum" && mappedParts.length === 1) {
            return "enum";
        }
        if (typeof propsP1 === "string" &&
            propsP1.startsWith("scalar.") &&
            mappedParts.length === 1) {
            return propsP1;
        }
        if (typeof propsP1 === "object") {
            if (mappedParts.length < 2) {
                return "not";
            }
            const propsP2 = propsP1[mappedParts[1].v];
            if (typeof propsP2 === "string") {
                return rpp(`${propsP2}${exports.SEPARATOR}${mappedParts
                    .slice(2)
                    .map((mp) => mp.v)
                    .join(exports.SEPARATOR)}`);
            }
            if (typeof propsP2 === "object") {
                if (mappedParts.length < 3) {
                    return "not";
                }
                const propsP3 = propsP2[mappedParts[2].v];
                if (propsP3 && mappedParts[2].__type === "arg") {
                    return rpp(`${propsP3}${exports.SEPARATOR}${mappedParts
                        .slice(3)
                        .map((mp) => mp.v)
                        .join(exports.SEPARATOR)}`);
                }
            }
        }
    };
    const ResolveReturnType = (mappedParts) => {
        if (mappedParts.length === 0) {
            return "not";
        }
        const oKey = ops[mappedParts[0].v];
        const returnP1 = oKey ? returns[oKey] : returns[mappedParts[0].v];
        if (typeof returnP1 === "object") {
            if (mappedParts.length < 2)
                return "not";
            const returnP2 = returnP1[mappedParts[1].v];
            if (returnP2) {
                return rpp(`${returnP2}${exports.SEPARATOR}${mappedParts
                    .slice(2)
                    .map((mp) => mp.v)
                    .join(exports.SEPARATOR)}`);
            }
        }
    };
    const rpp = (path) => {
        const parts = path.split(exports.SEPARATOR).filter((l) => l.length > 0);
        const mappedParts = parts.map(mapPart);
        const propsP1 = ResolvePropsType(mappedParts);
        if (propsP1) {
            return propsP1;
        }
        const returnP1 = ResolveReturnType(mappedParts);
        if (returnP1) {
            return returnP1;
        }
        return "not";
    };
    return rpp;
};
exports.ResolveFromPath = ResolveFromPath;
const InternalArgsBuilt = ({ props, ops, returns, scalars, vars, }) => {
    const arb = (a, p = "", root = true) => {
        var _a, _b;
        if (typeof a === "string") {
            if (a.startsWith(exports.START_VAR_NAME)) {
                const [varName, graphQLType] = a
                    .replace(exports.START_VAR_NAME, "$")
                    .split(exports.GRAPHQL_TYPE_SEPARATOR);
                const v = vars.find((v) => v.name === varName);
                if (!v) {
                    vars.push({
                        name: varName,
                        graphQLType,
                    });
                }
                else {
                    if (v.graphQLType !== graphQLType) {
                        throw new Error(`Invalid variable exists with two different GraphQL Types, "${v.graphQLType}" and ${graphQLType}`);
                    }
                }
                return varName;
            }
        }
        const checkType = (0, exports.ResolveFromPath)(props, returns, ops)(p);
        if (checkType.startsWith("scalar.")) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const [_, ...splittedScalar] = checkType.split(".");
            const scalarKey = splittedScalar.join(".");
            return ((_b = (_a = scalars === null || scalars === void 0 ? void 0 : scalars[scalarKey]) === null || _a === void 0 ? void 0 : _a.encode) === null || _b === void 0 ? void 0 : _b.call(_a, a)) || JSON.stringify(a);
        }
        if (Array.isArray(a)) {
            return `[${a.map((arr) => arb(arr, p, false)).join(", ")}]`;
        }
        if (typeof a === "string") {
            if (checkType === "enum") {
                return a;
            }
            return `${JSON.stringify(a)}`;
        }
        if (typeof a === "object") {
            if (a === null) {
                return `null`;
            }
            const returnedObjectString = Object.entries(a)
                .filter(([, v]) => typeof v !== "undefined")
                .map(([k, v]) => `${k}: ${arb(v, [p, k].join(exports.SEPARATOR), false)}`)
                .join(",\n");
            if (!root) {
                return `{${returnedObjectString}}`;
            }
            return returnedObjectString;
        }
        return `${a}`;
    };
    return arb;
};
exports.InternalArgsBuilt = InternalArgsBuilt;
const resolverFor = (type, field, fn) => fn;
exports.resolverFor = resolverFor;
exports.START_VAR_NAME = `$ZEUS_VAR`;
exports.GRAPHQL_TYPE_SEPARATOR = `__$GRAPHQL__`;
const $ = (name, graphqlType) => {
    return (exports.START_VAR_NAME +
        name +
        exports.GRAPHQL_TYPE_SEPARATOR +
        graphqlType);
};
exports.$ = $;
