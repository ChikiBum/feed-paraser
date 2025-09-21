export const getNewsSchema = {
  tags: ['news'],
  summary: 'Get all news for user',
  querystring: {
    type: 'object',
    properties: {
      userId: { type: 'string' }
    },
    required: ['userId'] 
  },
  response: {
    200: {
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
} as const;