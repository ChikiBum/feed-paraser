export const  getFeedDataSchema ={
    tags: ['feed'],
        summary: 'Get feed data',
        description: 'Get feed data',
         querystring: {
    type: 'object',
    properties: {
      url: { type: 'string' },
      force: { type: 'boolean', default: false }
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