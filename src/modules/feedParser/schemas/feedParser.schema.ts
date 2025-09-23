export const feedParserSchema = {
  tags: ['feed'],
  summary: 'Parse RSS feed and save news links',
  body: {
    type: 'object',
    properties: {
      url: { type: 'string', format: 'uri' }
    },
    required: ['url']
  },
  response: {
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
              title: { type: 'string' }
            },
            required: ['id', 'site', 'url', 'title']
          }
        }
      }
    },
    400: {
      type: 'object',
      properties: {
        message: { type: 'string' }
      }
    }
  }
} as const;