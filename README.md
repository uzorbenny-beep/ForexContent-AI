# ForexContent AI - SaaS Platform

> AI-powered Forex content generation platform built with Next.js, Supabase, and OpenAI

## 🚀 Features

- 🔐 **Authentication**: Supabase Auth with email/password
- 🤖 **AI Generation**: OpenAI GPT-4 powered content creation
- 📱 **Multi-Format Content**:
  - 30 Social Media Posts (Twitter-optimized)
  - 10 Educational Threads (Thread-style format)
  - 10 Telegram Messages (Signal-style format)
- 💳 **Payment**: Stripe integration for credit packages
- 📊 **Dashboard**: User analytics and content history
- 🎨 **Modern UI**: Built with Tailwind CSS and Framer Motion

## 📋 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI**: OpenAI API (GPT-4)
- **Payments**: Stripe
- **Styling**: Tailwind CSS
- **State**: Zustand
- **Icons**: React Icons

## 🛠️ Installation

### Prerequisites

- Node.js 18+
- npm/yarn
- Supabase account
- OpenAI API key
- Stripe account

### Steps

1. **Clone the repository**

```bash
git clone https://github.com/uzorbenny-beep/ForexContent-AI.git
cd ForexContent-AI
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
cp .env.example .env.local
```

Fill in your credentials:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI
OPENAI_API_KEY=your_api_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_publishable_key
STRIPE_SECRET_KEY=your_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Set up database**

Run these SQL queries in your Supabase dashboard:

```sql
-- Create generations table
CREATE TABLE generations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topic VARCHAR NOT NULL,
  social_posts JSONB,
  educational_threads JSONB,
  telegram_messages JSONB,
  status VARCHAR DEFAULT 'completed',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_generations_user_id ON generations(user_id);
```

5. **Run development server**

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 📖 Usage

### For Users

1. **Sign Up**: Create an account at `/auth/register`
2. **Login**: Login at `/auth/login`
3. **Generate Content**: 
   - Go to `/dashboard/generate`
   - Enter a forex topic (e.g., "Trading momentum in volatile markets")
   - Choose a tone (Professional, Casual, Educational, Analytical)
   - Click "Generate Content"
4. **Copy & Use**: Copy individual pieces or download as JSON

### For Developers

**API Endpoints:**

```bash
# Generate content
POST /api/generate
Content-Type: application/json
{
  "topic": "Your forex topic",
  "tone": "professional"
}

# Create checkout session
POST /api/stripe/checkout
Authorization: Bearer {token}
{
  "packageId": "starter"
}

# Stripe webhook
POST /api/stripe/webhook
```

## 🏗️ Project Structure

```
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page
│   ├── auth/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── callback/page.tsx
│   ├── dashboard/
│   │   ├── page.tsx            # Dashboard home
│   │   ├── generate/page.tsx   # Content generation
│   │   ├── history/page.tsx
│   │   └── settings/page.tsx
│   ├── pricing/page.tsx
│   ├── api/
│   │   ├── generate/route.ts
│   │   └── stripe/
│   │       ├── checkout/route.ts
│   │       └── webhook/route.ts
│   └── globals.css
├── components/
│   ├── Layout.tsx
│   ├── Navbar.tsx
│   └── ...
├── lib/
│   ├── supabase.ts
│   ├── openai.ts
│   ├── stripe.ts
│   ├── utils.ts
│   └── cn.ts
├── stores/
│   └── authStore.ts
├── types/
│   └── index.ts
└── public/
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import repository
4. Add environment variables
5. Deploy

### Docker

```bash
docker build -t forexcontent-ai .
docker run -p 3000:3000 forexcontent-ai
```

## 💰 Pricing

- **Starter**: $9.99 - 100 credits
- **Professional**: $39.99 - 500 credits
- **Enterprise**: $99.99 - 2000 credits

Each generation uses 1 credit per request.

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

MIT - feel free to use this project for commercial purposes

## 💬 Support

Need help? Open an issue or contact support@forexcontent.ai

## 🎯 Roadmap

- [ ] Bulk content generation
- [ ] Custom tone/style templates
- [ ] Content scheduling
- [ ] Analytics dashboard
- [ ] API access for developers
- [ ] Mobile app
- [ ] Multi-language support
- [ ] Discord bot integration
- [ ] Telegram bot integration

---

**Made with ❤️ for traders by Uzorbenny**
