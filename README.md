=======================================================
                   NAAM JAP APP COMPONENTS
=======================================================

This project contains React components for "Naam Jap", 
a minimalist mantra chanting tracker. It supports offline
tracking of mantras, statistics, app settings, and 
informational screens.

-------------------------------------------------------
1. AboutView
-------------------------------------------------------
Purpose:
- Displays app info, privacy policy, feedback form, sharing options, and external links.

Features:
- App header with name, tagline, and version.
- Navigation menu:
  • About Application
  • Privacy Policy
  • Report a Problem
  • Share App
  • Chant Website
  • Exit App
- Feedback sent via mailto link.
- Share functionality with clipboard fallback.
- Exit confirmation popup (browser version limited).
- Responsive and clean UI using Tailwind CSS.

Usage:
import AboutView from './components/AboutView';
const App = () => <AboutView />;

-------------------------------------------------------
2. StatsScreen
-------------------------------------------------------
Purpose:
- Displays user mantra statistics with an interactive chart.

Features:
- Shows total mantras and malas.
- Tracks historical data from localStorage.
- Time range selection: Today, 7 days, 30 days, 90 days, Year.
- Responsive line chart using chart.js and react-chartjs-2.
- Average mantras/day calculation.
- Styled with Tailwind CSS (dark gradient background).

Props:
- mantra: string       → Mantra text to display.
- target: number       → Number of chants per mala (default: 108).

Usage:
import StatsScreen from './components/StatsScreen';
<StatsScreen mantra="ॐ नमः शिवाय" target={108} />;

-------------------------------------------------------
3. SettingsView
-------------------------------------------------------
Purpose:
- Manage mantras, select active mantra, reset app data.

Features:
- View and select existing mantras.
- Add custom mantras.
- Delete custom mantras (auto-update selection).
- Full app data reset with confirmation and visual feedback.
- Smooth animations and transitions with Tailwind CSS.

Props:
- settings: UserSettings
- setSettings: React.Dispatch<React.SetStateAction<UserSettings>>
- mantras: Mantra[]
- setMantras: React.Dispatch<React.SetStateAction<Mantra[]>>
- onResetAllData: () => void

Usage:
import SettingsView from './components/SettingsView';
<SettingsView
  settings={settings}
  setSettings={setSettings}
  mantras={mantras}
  setMantras={setMantras}
  onResetAllData={handleResetAll}
/>;

-------------------------------------------------------
Data Storage
-------------------------------------------------------
localStorage keys used:

- mantraSession  → Tracks today’s chants, malas, and total malas.
- mantraHistory  → Stores daily chant history (up to 730 days).

-------------------------------------------------------
Dependencies
-------------------------------------------------------
- React 18+
- TypeScript (optional)
- Tailwind CSS
- Lucide React (icons)
- Chart.js / react-chartjs-2 (StatsScreen)

-------------------------------------------------------
Styling & Animations
-------------------------------------------------------
- Gradient backgrounds, neumorphic card design.
- Floating animations and fade-in effects.
- Smooth transitions for selection, buttons, and modals.
- Fully responsive layout.

-------------------------------------------------------
Usage Permissions
-------------------------------------------------------
- This app **requires permission from the author** before use or redistribution.
- Contact the author to request usage rights.

-------------------------------------------------------
License
-------------------------------------------------------
All rights reserved. Unauthorized use, modification, or 
distribution is prohibited without explicit permission.