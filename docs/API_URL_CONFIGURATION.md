# API URL Configuration

## Overview
This project supports different API URLs depending on the environment (development/production).

## Environment Variables

### Development (.env-local)
```env
API_BASE_URL=http://localhost:3000
```

### Production (.env.production)
```env
API_BASE_URL=https://api.yourdomain.com
```

## How It Works

### Backend (SSR)
In `ssrRoute.ts` the API URL is obtained from configuration:
```typescript
const apiBaseUrl = fastify.config.API_BASE_URL || 'http://localhost:3000';
```

### Frontend (JavaScript in HTML)
```javascript
const API_BASE_URL = '${apiBaseUrl}';
const response = await fetch(API_BASE_URL + '/ssr/upload', {
    method: 'POST',
    headers: headers,
    body: formData,
    credentials: "include"
});
```

### Frontend (Vite Client)
For client-side code use:
```javascript
const API_URL = import.meta.env.VITE_API_URL;
const API_PORT = import.meta.env.VITE_API_PORT;

const response = await fetch(`${API_URL}:${API_PORT}/api/endpoint`, {
    method: 'GET',
    headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
    },
});
```

## Production Deployment

### CORS Configuration
In production you need to configure CORS for frontend domain:
```typescript
// cors.plugin.ts
origin: [
    'https://yourfrontend.com',
    'https://www.yourfrontend.com'
]
```

## Examples

### Development
- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- API_BASE_URL: http://localhost:3000

### Production
- Frontend: https://app.yourdomain.com
- Backend: https://api.yourdomain.com
- API_BASE_URL: https://api.yourdomain.com