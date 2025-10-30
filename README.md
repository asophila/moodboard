# Moodboard Investigation Platform

Una plataforma web para visualizar y analizar redes complejas en casos de corrupción e investigaciones. Mapa relaciones entre personas, organizaciones, eventos y documentos con asistencia de IA.

_A web-based investigation board tool for mapping complex networks of people, organizations, events, and documents with AI-assisted evidence connection._

![Version](https://img.shields.io/badge/version-0.1.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

- **Visual Investigation Board**: Interactive force-directed graph with pan & zoom
- **Multi-Entity Support**: People, organizations, events, locations, documents
- **AI-Powered Analysis**: Automatic entity extraction and relationship detection from documents
- **Evidence Citations**: Every AI suggestion includes source excerpts with page/line numbers
- **Beautiful Dark UI**: Professional, clutter-free interface designed for focus
- **Real-time Collaboration**: (Coming soon)
- **Document Upload**: PDF, Excel, and text file support

## 🎯 Use Cases

- **Legal Investigations**: Map corruption networks, financial fraud
- **Journalism**: Investigate complex stories with multiple actors
- **Research**: Academic research on social networks
- **OSINT**: Open-source intelligence gathering
- **Business Intelligence**: Understand corporate relationships

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier works)
- OpenRouter API key (for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/asophila/moodboard.git
   cd moodboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_OPENROUTER_API_KEY=your_openrouter_api_key
   ```

4. **Set up Supabase database**
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Copy and run the schema from `supabase/migrations/001_initial_schema.sql`
   - Enable RLS (Row Level Security) policies

5. **Run development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

6. **Login**
   - For MVP demo, use any email/password combination
   - Production setup requires Supabase Auth configuration

## 📁 Project Structure

```
moodboard-platform/
├── src/
│   ├── components/
│   │   ├── Canvas/          # D3.js visualization
│   │   ├── Sidebar/         # Node palette
│   │   ├── RightPanel/      # AI suggestions, details
│   │   ├── Modals/          # Forms
│   │   ├── Layout/          # Header, layout
│   │   └── Auth/            # Login
│   ├── stores/              # Zustand state management
│   │   ├── authStore.js
│   │   ├── boardStore.js
│   │   └── uiStore.js
│   ├── services/            # API services
│   ├── hooks/               # Custom React hooks
│   └── utils/               # Helper functions
├── supabase/
│   └── migrations/          # Database schema
├── prototype/               # Original HTML prototype
└── public/
```

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, D3.js, TailwindCSS
- **State Management**: Zustand
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **AI**: OpenRouter API (Claude 3.5 Sonnet)
- **Icons**: Lucide React
- **Routing**: React Router v6

## 🎨 Design Philosophy

- **Professional**: Think Palantir, not Miro
- **Focused**: No clutter, every pixel has purpose
- **Powerful**: Easy things are easy, complex things are possible
- **Tactile**: Interactions feel satisfying and responsive

## 📊 Database Schema

The platform uses PostgreSQL with the following main tables:

- `boards`: Investigation boards
- `nodes`: Entities (people, organizations, etc.)
- `edges`: Relationships between nodes
- `semantic_categories`: Entity types and subtypes
- `documents`: Uploaded files
- `ai_suggestions`: AI-generated insights

See `supabase/migrations/001_initial_schema.sql` for full schema.

## 🤖 AI Features

The platform uses Claude 3.5 Sonnet via OpenRouter to:

1. **Extract Entities**: Identify people, organizations, locations from documents
2. **Detect Relationships**: Find connections between entities
3. **Provide Evidence**: Every suggestion includes exact citations
4. **Cross-Document Analysis**: Connect information across multiple sources

### How AI Processing Works

1. User uploads document (PDF, Excel, TXT)
2. Text is extracted and sent to Supabase Edge Function
3. Claude analyzes the document with specialized prompts
4. Entities and relationships are stored as suggestions
5. User reviews and accepts/rejects suggestions
6. Accepted items are added to the board with evidence links

## 🚢 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for comprehensive deployment options.

**Recommended ethical hosting providers**:
- **Netlify** (static frontend)
- **Cloudflare Pages** (static frontend)
- **Railway** (full-stack)
- **Self-hosted** (Docker)

**NOT recommended**: Vercel (due to ethical concerns)

Quick deploy to Netlify:
```bash
npm run build
npx netlify deploy --prod
```

## 🔐 Security

- Row Level Security (RLS) enabled on all tables
- Environment variables for sensitive data
- HTTPS enforced in production
- Rate limiting on AI endpoints
- Input validation and sanitization

## 🗺️ Roadmap

### v0.1 (Current - MVP)
- [x] Visual canvas with force-directed layout
- [x] Node creation and editing
- [x] Edge creation
- [x] Document upload UI
- [x] AI suggestions panel
- [x] Demo data
- [ ] Supabase integration
- [ ] AI processing backend

### v0.2 (Next)
- [ ] Full Supabase authentication
- [ ] Document processing with OpenRouter
- [ ] Save/load boards
- [ ] Export as PNG/PDF
- [ ] Search functionality

### v0.3
- [ ] Real-time collaboration
- [ ] Temporal filtering (timeline)
- [ ] Public boards + gallery
- [ ] Custom node types

### v0.4
- [ ] Mobile app (React Native)
- [ ] Advanced AI: summarization, anomaly detection
- [ ] Integration with external data sources
- [ ] Path-finding algorithms

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the Luis Hermosilla case in Chile
- Built with Claude Code (Anthropic)
- D3.js force-directed graph examples
- Open-source community

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/asophila/moodboard/issues)
- **Discussions**: [GitHub Discussions](https://github.com/asophila/moodboard/discussions)

## 🌟 Star History

If this project helps your investigation work, please consider giving it a star!

---

**Built with ❤️ for transparency and justice**
