# UDST Tools

A free, open-source academic toolkit designed specifically for students at the University of Doha for Science and Technology (UDST).

## Features

- **GPA Calculator** - Project your cumulative GPA based on transcript data and current semester courses
- **Grade Calculator** - Track assignment weights and scores to estimate your final course grade
- **Attendance Tracker** - Monitor absences and stay within the 15% limit
- **Schedule Planner** - Build your weekly timetable and detect time conflicts
- **Ramadan Schedule Converter** - Convert regular class times to Ramadan hours with downloadable image
- **Academic Calendar** - View important dates, exam periods, and registration deadlines
- **Fees Manager** - Estimate tuition and semester costs by program and enrollment status
- **UDST Links** - Quick access to student portals and resources

## Technical Details

### Stack

- React 18 with TypeScript
- Tailwind CSS for styling
- Framer Motion for animations
- Vite for build tooling
- Client-side only (no backend)

### Privacy

All calculations run in your browser. No data is sent to servers. No accounts required. Your data stays on your device using localStorage.

### Bilingual Support

Full English and Arabic support with RTL layout, managed through React Context and localStorage.

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## SEO & Social Sharing

The site includes comprehensive meta tags for:
- Search engine optimization (title, description, keywords)
- Open Graph tags for Facebook/LinkedIn
- Twitter Cards for enhanced sharing
- JSON-LD structured data for rich search results
- Sitemap and robots.txt for proper crawling

## Deployment

Deploy to any static hosting platform:

```bash
npm run build
# Upload the `dist` folder to your hosting provider
```

Recommended platforms: Vercel, Netlify, GitHub Pages, Cloudflare Pages

## License

Open source project by Ahmed Khawaja (@ahmkwj)

Not affiliated with or endorsed by UDST.
