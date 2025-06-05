# 📝 Guestbook
A simple full-stack guestbook built with Next.js, TypeScript, Prisma, and Tailwind CSS.

## 🚀 How to Run
```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

Visit http://localhost:3000/guestbook

## ⚖️ Trade-offs

Styling is kept inline and minimal, there is no abstract design system.

zod validation is defined directly in the API route instead of a shared DAO layer.

No reusable guest model/types across client/server.

## 🛠️ What I’d Add Next

A guest DAO: encapsulate validation (zod), database access (prisma), and types (TypeScript) in one place.

Move form schema/types to shared files for better reusability.

Create a basic styling abstraction, with a playground page with most reused components and variations for each one.