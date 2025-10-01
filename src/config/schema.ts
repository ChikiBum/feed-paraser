import type  {FromSchema} from "json-schema-to-ts";

export const EnvSchema = {
    type: 'object',
    properties: {
        PORT: {type: 'number'},
        HOST: {type: 'string'},
        API_BASE_URL: {
            type: 'string',
            default: 'http://localhost:3000'
        },
    },
    required: ['PORT', 'HOST'],
    additionalProperties: false,
} as const;

export type Config = FromSchema<typeof EnvSchema>;