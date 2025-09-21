export const getNewsSchema = {
    tags: ['news'],
    summary: 'Get all news',
    response: {
        200: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    title: { type: 'string' },
                    content: { type: 'string' },
                    date: { type: 'string', format: 'date-time' }
                }
            }
        }
    }
} as const;