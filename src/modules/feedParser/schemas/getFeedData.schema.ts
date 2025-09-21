export const  getFeedDataSchema ={
    tags: ['feed'],
        summary: 'Get feed data',
        description: 'Get feed data',
         querystring: {
    type: 'object',
    properties: {
      url: { type: 'string' },
      force: { type: 'string', enum: ['1', '0'], default: '0' }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        feed: { type: 'array', items: { type: 'object' } },
        source: { type: 'string' }
      }
    }
  }
} as const