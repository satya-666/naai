# Salon Booking App

A full-stack salon / haircut appointment booking platform.

## Features
- Users can browse salons  
- Images fetched from salon image API  
- Users can book haircut slots  
- Barbers can add salons & manage time slots  
- Admin can manage everything  
- No double booking system  
- JWT authentication (no third-party login)  
- Responsive UI using Tailwind v4 + GSAP animations  
- Clean + simple code design  

## Technologies
### Frontend:
- React (Vite, JSX)
- Tailwind v4 (installed via @tailwindcss/vite plugin)
- GSAP (light animations)

### Backend:
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs for password hashing

## Install Frontend
```bash
cd frontend
npm install
npm install tailwindcss @tailwindcss/vite
npm run dev
```

## Tailwind Setup Details
Used the following setup as requested:
**vite.config.js**
```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

**CSS**
```css
@import "tailwindcss";

@theme {
  --color-primary: #2563eb;
  --color-secondary: #1e293b;
  --font-sans: "Inter", sans-serif;
}
```
# naai
