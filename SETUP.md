# Setup Guide

## Quick Start (5 minutes)

### Option 1: Demo Mode (No Backend)

The fastest way to see the platform in action:

```bash
git clone https://github.com/asophila/moodboard.git
cd moodboard
npm install
npm run dev
```

Visit `http://localhost:3000` and login with any email/password. This runs with demo data only.

### Option 2: Full Setup with Supabase (15 minutes)

#### Step 1: Clone and Install

```bash
git clone https://github.com/asophila/moodboard.git
cd moodboard
npm install
```

#### Step 2: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create an account
2. Click "New Project"
3. Name it "moodboard" (or anything you like)
4. Choose a region close to you
5. Set a database password (save it!)
6. Wait for project to be ready (~2 minutes)

#### Step 3: Set Up Database

1. In Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy the entire contents of `supabase/migrations/001_initial_schema.sql`
4. Paste into the SQL Editor
5. Click **Run** (bottom right)
6. You should see "Success. No rows returned"

#### Step 4: Create Storage Bucket

1. In Supabase dashboard, go to **Storage**
2. Click **New Bucket**
3. Name it `documents`
4. Set it to **Private**
5. Click **Create Bucket**

#### Step 5: Get API Keys

1. In Supabase dashboard, go to **Settings** > **API**
2. Find these two values:
   - **Project URL** (starts with `https://`)
   - **anon public** key (long string)
3. Copy both

#### Step 6: Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_long_anon_key_here
VITE_OPENROUTER_API_KEY=your_openrouter_key  # Optional, for AI features
```

#### Step 7: Run Application

```bash
npm run dev
```

Visit `http://localhost:3000`

#### Step 8: Create First User

1. Click **Sign Up** (or modify login component to enable signup)
2. Or, in Supabase dashboard:
   - Go to **Authentication** > **Users**
   - Click **Add User**
   - Enter email and password
   - Click **Create User**

3. Login with that email/password

Done! You now have a fully functional investigation platform.

## OpenRouter Setup (For AI Features)

To enable AI-powered entity extraction:

1. Go to [openrouter.ai](https://openrouter.ai)
2. Create an account
3. Add credits (AI processing costs ~$0.01-0.10 per document)
4. Go to **Keys** and create a new API key
5. Add it to your `.env` file:
   ```env
   VITE_OPENROUTER_API_KEY=sk-or-v1-...
   ```

**Note**: AI features require a Supabase Edge Function (coming in v0.2).

## Docker Setup

For production deployment:

```bash
# Build the image
docker build -t moodboard .

# Run the container
docker run -p 3000:80 moodboard
```

Or use docker-compose:

```bash
docker-compose up -d
```

## Common Issues

### "Failed to connect to Supabase"

- Check your `.env` file has correct values
- Ensure `VITE_SUPABASE_URL` starts with `https://`
- Verify the project is active in Supabase dashboard

### "Authentication failed"

- Ensure you created a user in Supabase Auth
- Check email/password are correct
- Enable Email provider in Supabase **Authentication** > **Providers**

### "Nodes not saving"

- Check RLS policies are enabled
- Ensure user is authenticated
- Check browser console for errors

### Build errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
```

## Development Tips

### Hot Reload

Changes to React components hot reload automatically. If you see a blank page:

1. Check browser console for errors
2. Restart dev server: `npm run dev`

### Adding Demo Data

Edit `src/components/BoardView.jsx` to modify demo nodes/edges.

### Testing Without Backend

The app works in demo mode without Supabase. Authentication is mocked in `src/components/Auth/Login.jsx`.

### Database Reset

To start fresh:

1. In Supabase SQL Editor, run:
   ```sql
   DROP TABLE IF EXISTS ai_suggestions CASCADE;
   DROP TABLE IF EXISTS documents CASCADE;
   DROP TABLE IF EXISTS edges CASCADE;
   DROP TABLE IF EXISTS nodes CASCADE;
   DROP TABLE IF EXISTS node_sets CASCADE;
   DROP TABLE IF EXISTS boards CASCADE;
   DROP TABLE IF EXISTS semantic_categories CASCADE;
   ```

2. Re-run the migration file

## Next Steps

Once setup is complete:

1. **Explore the demo board** - Click nodes, drag them around
2. **Create your first node** - Click "Add Node" in sidebar
3. **Upload a document** - Click "Upload Documents"
4. **Try AI suggestions** - See the demo suggestions in right panel

## Getting Help

- **GitHub Issues**: [Report bugs](https://github.com/asophila/moodboard/issues)
- **Discussions**: [Ask questions](https://github.com/asophila/moodboard/discussions)
- **Discord**: Coming soon

## Production Checklist

Before deploying to production:

- [ ] Change demo auth to real Supabase Auth
- [ ] Set up proper environment variables
- [ ] Enable HTTPS (handled by hosting providers)
- [ ] Configure CORS in Supabase
- [ ] Set up error monitoring (Sentry, etc.)
- [ ] Configure rate limiting
- [ ] Review RLS policies
- [ ] Set up backups
- [ ] Test on multiple devices
- [ ] Load test with >100 nodes

## Advanced: Supabase Edge Function

To enable AI document processing, deploy the Edge Function:

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Deploy function
supabase functions deploy process-document
```

The function code is in `supabase/functions/process-document/index.ts`.
