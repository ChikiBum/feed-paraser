export const getNewsSchema = {
  tags: ['news'],
  summary: 'Get all news for user',
  querystring: {
    type: 'object',
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string' }
    }
  },
 response: {
    401: { type: 'object', properties: { message: { type: 'string' } } },
    200: {
      type: 'object',
      properties: {
        news: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              site: { type: 'string' },
              url: { type: 'string' },
              parsed: { type: 'boolean' },
              forced: { type: 'boolean' },
              userId: { type: 'string', nullable: true },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' }
            }
          }
        }
      }
    }
  }
} as const;