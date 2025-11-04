# Real-Time Spam Detection using Perceptron — Frontend

A modern React + Vite frontend for real-time email spam detection.

## Tech Stack
- **React + Vite**
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Axios** for API calls

## Development
1. Install dependencies
```bash
npm install
```
2. Start dev server
```bash
npm run dev
```
3. Ensure the backend Flask API is running at `http://127.0.0.1:5000/predict` and accepts `{ "email": "..." }` returning `{ "prediction": "Spam" | "Ham" }`.

## Build
```bash
npm run build
npm run preview
```

## Project Structure
- `src/components/SpamAnalyzer.jsx` — Input, debounce, API request, result badge
- `src/components/InfoCard.jsx` — Perceptron explanation and techs used
- `src/components/Footer.jsx` — Footer with social icons
- `src/lib/api.js` — Axios instance and `predictSpam()` helper

## UI
- Font: Poppins
- Primary gradient: `#6a11cb → #2575fc`
- Secondary: `#d8b4fe`
- Background: `#f9fafb`

- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
