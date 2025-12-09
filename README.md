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

Frontend Hosted Link:-
    https://naai-kohl.vercel.app/
Backend Hosted Link:-
    https://dashboard.render.com/web/srv-d4rjjks9c44c7391ja80/deploys/dep-d4rjjlc9c44c7391jaig?r=2025-12-08%4020%3A48%3A27%7E2025-12-08%4020%3A51%3A40
Database Hosted Link:-
    https://cloud.mongodb.com/v2/69370f549fd0c206d0a387b3#/explorer/693710cca4599b25a2db50d5/salon_booking/users/find


