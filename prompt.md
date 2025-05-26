# Prompt.md

You are building a **Trekking Planner Web App** that is UI-first and focused on a smooth, responsive, and visually appealing experience.

## 🧭 Key Goals
- Help users discover treks, view itineraries, and explore cultural and scenic significance.
- Display **photos and videos** in **real-time** with **smooth transitions** and **fast performance**.
- Design should be fully responsive for **mobile**, **tablet**, and **desktop**.
- Use **clean JavaScript (no TypeScript)** throughout the project.

## ⚙️ Technologies to Use
- **Framework**: Next.js (latest)
- **Styling**: Tailwind CSS (configured for JSDOM)
- **Animations**: react-spring
- **Global Styles**: Use `global.css` for reusable theme variables like fonts and colors.

## 🎨 UI + Styling Rules
- Use **Tailwind CSS** for all layout and utility styles.
- Implement responsiveness using Tailwind’s built-in breakpoints (`sm`, `md`, `lg`).
- Use `global.css` for:
  - Primary/secondary colors
  - Font families
  - Background/overlay themes

## 🎥 Media Display Instructions
- Render **images and videos in real-time**, optimized for all screen sizes.
- Use **lazy loading** and efficient asset delivery.
- Add **page and element transitions using react-spring**, including:
  - Image fade-ins
  - Section reveals on scroll
  - Smooth route/page changes

## 🧩 Component Expectations
When Copilot generates components:
- Use **JavaScript files** (`.js`, not `.tsx`)
- Always import and apply **Tailwind classes** for styling
- Use `react-spring` for any animations or transitions
- Use layout best practices for **mobile/tablet/desktop** views
- Avoid hardcoded styles; use Tailwind and theme classes instead

## ✅ Examples Copilot Should Help With
- Responsive trek itinerary card component
- Animated image gallery using `react-spring`
- A landing page with background video and floating text
- A reusable component that fetches and displays bus API timings
- Navigation transitions and hover effects using `react-spring`

