/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DefaultService {
    /**
     * @param id
     * @returns any Retrieve the user details
     * @throws ApiError
     */
    public static getUser(
        id: string,
    ): CancelablePromise<{
        name: string;
        age: number;
        id: string;
    }> {
        return __request(OpenAPI, {
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
    public static postUser(
        id: string,
    ): CancelablePromise<{
        name: string;
        age: number;
        id: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/user/{id}',
            path: {
                'id': id,
            },
        });
    }
}
