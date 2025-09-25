export const getNewsByIdSchema = {
  tags: ['news'],
  summary: 'Get news by id',
  params: {
    type: 'object',
    properties: {
      id: { type: 'string' }
    },
    required: ['id']
  },
  response: {
    200: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        site: { type: 'string' },
        url: { type: 'string' },
        parsed: { type: 'boolean' },
        forced: { type: 'boolean' },
        userId: { type: 'string', nullable: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        parsedH1: { type: 'string', nullable: true },
        parsedImg: { type: 'string', nullable: true },
        parsedText: { type: 'string', nullable: true }
      }
    },
    404: {
      type: 'object',
      properties: {
        message: { type: 'string' }
      }
    }
  }
} as const;