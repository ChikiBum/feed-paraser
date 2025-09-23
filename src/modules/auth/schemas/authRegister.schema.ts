export const registerSchema = {
    tags: ['auth'],
    summary: 'Register a new user',
    body: {
        type: 'object',
        properties: {
            userName: { type: 'string', minLength: 3 },
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 6 },
        },
        required: ['email', 'password']
    },
    response: {
        201: {
            type: 'object',
            properties: {
                id: { type: 'string' },
                email: { type: 'string' },
                userName: { type: 'string' }
            }
        }
    }
} as const;