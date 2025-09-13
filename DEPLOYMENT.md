# ProConnect RH - Deployment Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or pnpm

### Installation
```bash
# Install dependencies
npm install
# or
pnpm install

# Build the project
npm run build --no-lint
# or  
pnpm run build --no-lint

# Start production server
npm start
# or
pnpm start
```

### Development
```bash
# Start development server
npm run dev
# or
pnpm run dev
```

## 📁 Project Structure

```
proconnect-rh/
├── src/
│   ├── app/
│   │   ├── layout.tsx       # Main layout
│   │   ├── page.tsx         # Homepage
│   │   └── globals.css      # Global styles
│   ├── components/ui/       # Shadcn/ui components
│   ├── hooks/              # Custom hooks
│   └── lib/                # Utilities
├── public/                 # Static assets
├── package.json           # Dependencies
├── next.config.ts        # Next.js config
├── tailwind.config.js    # Tailwind config
├── tsconfig.json         # TypeScript config
└── TODO.md              # Project status
```

## 🎨 Customization

### Update Company Information
Edit `src/app/page.tsx`:
- Phone: `+33 1 XX XX XX XX`
- Email: `contact@proconnectrh.fr`  
- Address: `Paris, France`

### Styling
- Colors: Modify Tailwind classes in components
- Fonts: Update in `src/app/layout.tsx`
- Custom CSS: Add to `src/app/globals.css`

## 🌐 Deployment Options

### Vercel (Recommended)
1. Push to GitHub repository
2. Connect to Vercel
3. Deploy automatically

### Netlify
1. Build project locally: `npm run build`
2. Upload `out/` folder to Netlify
3. Configure redirects if needed

### Custom Server
1. Build: `npm run build`
2. Start: `npm start`
3. Configure reverse proxy (nginx/Apache)

## 📝 Features

- ✅ Responsive design
- ✅ Modern UI with Tailwind CSS
- ✅ Interactive contact form
- ✅ SEO optimized
- ✅ Performance optimized
- ✅ Accessibility features

## 🛠 Tech Stack

- **Framework**: Next.js 15
- **Styling**: Tailwind CSS + Shadcn/ui
- **Language**: TypeScript
- **Forms**: HTML5 with validation
- **Animations**: CSS transitions