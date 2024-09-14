/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
    "/shorten": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Shorten a URL
         * @description Shorten a long URL
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        url: components["schemas"]["Url"];
                    };
                };
            };
            responses: {
                /** @description URL shortened successfully */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            shortUrl: components["schemas"]["ShortUrl"];
                        };
                    };
                };
                /** @description Bad request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /**
                             * @description Error message
                             * @example Valid URL is required
                             */
                            message?: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/{shortUrl}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Redirect to the original URLs
         * @description Redirect to the original URL based on the short URL
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description Encoded short URL */
                    shortUrl: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Redirect to the original URL */
                302: {
                    headers: {
                        Location?: string;
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description Short URL not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /**
                             * @description Error message
                             * @example Short URL not found
                             */
                            message?: string;
                        };
                    };
                };
                /** @description Internal server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /**
                             * @description Error message
                             * @example Internal server error
                             */
                            message?: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        Url: {
            /**
             * Format: uri
             * @description The URL to shorten
             * @example https://www.example.com
             */
            url?: string;
        };
        ShortUrl: {
            /**
             * Format: uri
             * @description The shortened URL
             * @example https://shortify.com/abc123
             */
            shortUrl?: string;
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export type operations = Record<string, never>;
