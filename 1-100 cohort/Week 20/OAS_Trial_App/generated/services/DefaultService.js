"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultService = void 0;
const OpenAPI_1 = require("../core/OpenAPI");
const request_1 = require("../core/request");
class DefaultService {
    /**
     * @param id
     * @returns any Retrieve the user details
     * @throws ApiError
     */
    static getUser(id) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/user/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @returns any Get the users details
     * @throws ApiError
     */
    static postUser(id) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/user/{id}',
            path: {
                'id': id,
            },
        });
    }
}
exports.DefaultService = DefaultService;
