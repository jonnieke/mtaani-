# Ball Mtaani Design Guidelines

## Design Approach
**Reference-Based Approach** drawing from sports and social platforms:
- **Twitter/X**: Real-time content feed patterns and engagement mechanics
- **ESPN/TheScore**: Sports data presentation and live match displays
- **Instagram**: Visual content carousel and story-like meme displays
- **Kenyan Street Culture**: Bold typography, vibrant energy, community-first design

**Key Principles:**
- High-energy, community-driven aesthetic reflecting "mtaani" (street) culture
- Mobile-first with thumb-friendly interaction zones
- Real-time data prominence with live score emphasis
- Playful yet functional - balancing memes with serious match data

## Color Palette

**Primary Colors:**
- **Brand Green**: 142 75% 45% (energetic football pitch green, primary actions)
- **Deep Charcoal**: 220 15% 12% (backgrounds, containers)
- **Pure White**: 0 0% 100% (text, cards on dark)

**Accent Colors:**
- **Electric Orange**: 25 95% 55% (trending indicators, live badges, CTAs)
- **Sky Blue**: 205 85% 60% (links, secondary actions)

**Semantic Colors:**
- **Success Green**: 145 65% 50% (win indicators)
- **Warning Yellow**: 45 90% 60% (draw, caution)
- **Danger Red**: 0 80% 60% (loss, live alerts)

**Dark Mode** (Primary):
- Background: 220 15% 8%
- Surface: 220 15% 12%
- Elevated: 220 12% 18%
- Text primary: 0 0% 95%
- Text secondary: 0 0% 70%

## Typography

**Font Families:**
- **Primary**: Inter (via Google Fonts) - clean, legible for data and UI
- **Display**: Outfit (via Google Fonts) - bold, energetic for headlines and branding
- **Monospace**: 'Courier New' - for live scores and odds

**Type Scale:**
- Hero/Display: text-5xl to text-7xl font-black (Outfit)
- Section Headers: text-3xl to text-4xl font-bold (Outfit)
- Card Titles: text-xl font-semibold (Inter)
- Body: text-base font-normal (Inter)
- Captions/Meta: text-sm font-medium (Inter)
- Micro/Badges: text-xs font-semibold (Inter)

## Layout System

**Spacing Primitives**: Tailwind units of 2, 4, 6, 8, 12, 16
- Micro spacing: p-2, gap-2
- Standard spacing: p-4, gap-4, mb-6
- Section spacing: py-8, py-12, py-16

**Container Strategy:**
- Max width: max-w-7xl mx-auto
- Horizontal padding: px-4 md:px-6 lg:px-8
- Grid layouts: grid-cols-1 md:grid-cols-2 lg:grid-cols-3

## Component Library

### Navigation
- **Sticky header** with logo, main nav, and user actions
- Green gradient background (from brand green to darker variant)
- Mobile: Hamburger menu with slide-out drawer
- Active states: Underline with electric orange

### Hero Section
- **No traditional hero** - Start directly with live content feed
- First section: "🔥 Trending Now" banner with scrolling topics
- Immediate value: Match scores and trending topics above fold

### Cards & Content Blocks

**Match Cards:**
- Dark surface (elevated bg) with rounded-xl
- Team names in bold, scores in monospace extra large
- Live indicator: Pulsing orange dot with "LIVE" badge
- Odds display: Subtle blue chips below score
- Hover: Slight scale (scale-105) and shadow-lg

**Meme Carousel:**
- Full-width horizontal scroll (snap-x)
- Cards with aspect-square images
- Upload button as first card with dashed border
- Like/share icons overlay on hover

**Trending Topics Feed:**
- List with fire emoji indicators
- Topic name + search volume in smaller text
- Click to filter content
- Gradient border-l-4 in orange for top trend

### Chat & AI Assistant

**Side Chat:**
- Fixed right sidebar on desktop (w-80)
- Bottom sheet on mobile (swipe up to expand)
- Message bubbles: Dark for others, green for user
- Typing indicators with animated dots

**Mchambuzi Halisi (AI Bot):**
- Distinct avatar with football/microphone icon
- Messages in lighter surface color with accent border
- Sheng/English mix in italic style for personality
- Quick reply chips below messages

### Interactive Elements

**Buttons:**
- Primary: bg-green with white text, hover:brightness-110
- Secondary: border-green text-green, hover:bg-green/10
- Ghost: text-sky-blue hover:bg-sky-blue/10
- On images: backdrop-blur-md bg-white/10 border-white/20

**Badges:**
- Live: bg-orange text-white with pulse animation
- Trending: bg-orange/20 text-orange border-orange/30
- Time: bg-charcoal text-white/70

**Forms (Meme Upload):**
- Drag-and-drop zone with dashed border-2
- Preview with remove button
- Submit button full-width on mobile

## Animations

**Minimal & Purposeful:**
- Live score updates: Number flip animation
- New messages: Slide-in from bottom
- Loading states: Skeleton screens (not spinners)
- Meme carousel: Smooth snap scrolling
- Trending topics: Gentle fade-in when refreshed

## Images

**Meme Section:**
- User-uploaded memes displayed in carousel
- AI-generated cartoon memes from Gemini (2D style)
- Placeholder: Football-themed illustrations for empty states

**Match Graphics:**
- Team logos/badges (fetch from API or use placeholders)
- Background patterns: Subtle football pitch texture on hero cards

**Icons:**
- Use Heroicons for UI elements (fire, chart, chat, etc.)
- Football-specific: Custom SVG for ball, whistle, trophy as accent graphics

## Special Features

**Real-time Indicators:**
- Pulsing orange dot for live matches
- Green "just now" timestamp for fresh content
- Score change highlights with brief flash animation

**Moderation UI:**
- Flag icon on memes/messages for reporting
- Admin view: Red border for flagged content
- Auto-hide with "Content hidden" placeholder

**Disclaimers:**
- Odds disclaimer: Sticky footer banner on match pages
- Text: "Gambling can be addictive. Play responsibly. 18+"
- Dismiss button with localStorage persistence

**SEO Elements:**
- Breadcrumb navigation with schema markup
- Meta tags dynamically updated per section
- Social share cards with match scores/memes

## Responsive Breakpoints

- Mobile: < 768px (single column, bottom sheets)
- Tablet: 768px - 1024px (2-column grid, side drawer)
- Desktop: > 1024px (3-column, fixed sidebars)