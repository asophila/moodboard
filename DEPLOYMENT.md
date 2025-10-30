# Deployment Options for Moodboard Platform

This document provides ethical and reliable deployment alternatives.

## Recommended Hosting Providers

### 1. **Netlify** (Recommended)
- **Why**: Excellent free tier, strong privacy commitment, open-source friendly
- **Setup**:
  ```bash
  npm install -g netlify-cli
  npm run build
  netlify deploy --prod
  ```
- **Environment Variables**: Set in Netlify Dashboard > Site Settings > Build & Deploy > Environment
- **Cost**: Free tier available, $19/month for Pro

### 2. **Cloudflare Pages**
- **Why**: Fast CDN, generous free tier, strong privacy policies
- **Setup**:
  ```bash
  npm run build
  npx wrangler pages publish dist
  ```
- **Environment Variables**: Set via Cloudflare Dashboard or wrangler CLI
- **Cost**: Free tier very generous

### 3. **Railway**
- **Why**: Developer-friendly, fair pricing, supports full-stack apps
- **Setup**: Connect GitHub repo, Railway auto-detects Vite
- **Cost**: $5/month minimum, pay for what you use
- **Great for**: Full-stack deployment with backend

### 4. **Render**
- **Why**: Free tier available, ethical company, easy setup
- **Setup**:
  - Connect GitHub
  - Build command: `npm run build`
  - Publish directory: `dist`
- **Cost**: Free for static sites, $7/month for web services

### 5. **Digital Ocean App Platform**
- **Why**: Transparent pricing, reliable infrastructure
- **Setup**: Connect GitHub, configure build settings
- **Cost**: $5/month for static sites, scales with usage

### 6. **Self-Hosted (Docker)**
- **Why**: Full control, no vendor lock-in
- **Setup**:
  ```bash
  # Create Dockerfile
  docker build -t moodboard .
  docker run -p 3000:80 moodboard
  ```
- **Cost**: Only server costs (VPS from $5-10/month)
- **Recommended VPS**: Hetzner, Linode, DigitalOcean

## For Supabase Backend

Supabase itself can be self-hosted if you prefer full control:

```bash
git clone https://github.com/supabase/supabase
cd supabase/docker
cp .env.example .env
docker-compose up
```

## Database Alternatives to Supabase

If you prefer not to use Supabase:

1. **PostgreSQL + PostgREST** (self-hosted)
2. **PocketBase** (single binary, easy to deploy)
3. **Appwrite** (open-source Firebase alternative)
4. **Directus** (open-source headless CMS with database)

## CI/CD Setup (GitHub Actions)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - name: Deploy to Netlify
        run: netlify deploy --prod --dir=dist
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## Docker Deployment

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Create `nginx.conf`:

```nginx
server {
    listen 80;
    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
}
```

## Environment Variables Setup

For all platforms, set these variables:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_OPENROUTER_API_KEY`

## Security Considerations

1. **Always use HTTPS** - Most providers enable this by default
2. **Set proper CORS headers** - Configure in Supabase/backend
3. **Use environment variables** - Never commit secrets
4. **Enable rate limiting** - Protect AI endpoints from abuse
5. **Regular updates** - Keep dependencies updated

## Cost Comparison (Monthly)

| Provider | Free Tier | Paid Plan | Best For |
|----------|-----------|-----------|----------|
| Netlify | 100GB bandwidth | $19/month | Simple deployment |
| Cloudflare Pages | Unlimited | $0-20/month | High traffic |
| Railway | $5 credit | Pay-as-you-go | Full-stack |
| Render | Static sites free | $7/month | Balanced option |
| DigitalOcean | - | $5-10/month | Self-hosted |

## Recommended Setup for MVP

**Best ethical + affordable option**:
- **Frontend**: Netlify (free tier)
- **Backend**: Supabase (free tier, or self-hosted)
- **AI**: OpenRouter API (pay-per-use)

Total cost: $0-10/month for MVP, scales with usage.
