# TaskFlow | High-Performance Team Workspace

Welcome to **TaskFlow**. We believe that managing work shouldn't feel like work. That's why we built a task manager that doesn't just track your progress—it elevates your entire productivity ecosystem with a high-end, "chic" aesthetic.

Inspired by the most sophisticated designs on Dribbble and the clean efficiency of tools like Linear, TaskFlow is a full-stack Next.js application designed for teams who care about craft, speed, and beautiful interfaces.

---

## ✨ Why TaskFlow?

Most task managers are boring. We decided to be different.

- **Chic "ORDI" Aesthetic:** A warm, high-fashion light-mode design with massive typography and a rotating plush lightning bolt background that brings your workspace to life.
- **Bento Grid Intelligence:** Your dashboard and projects are organized into an organic "Bento" layout, making information easy to digest and beautiful to look at.
- **Real-Time Ecosystem Sync:** Stats for "To Do", "In Progress", and "Completed" update across your entire system, giving you a bird's-eye view of your team's output.
- **Secure & Private:** Built with industry-standard `bcrypt` hashing and `NextAuth.js` to ensure your data stays yours.

---

## 🛠️ The Engine Under the Hood

- **Frontend:** Next.js 15+ (App Router), React 19, Vanilla CSS (Pure craft, no Tailwind).
- **Backend:** Next.js Server Actions & API Routes.
- **Database:** Prisma ORM with SQLite (Local) / PostgreSQL (Production).
- **Security:** Bcryptjs for password protection & NextAuth.js for session management.

---

## 🚀 Getting Started

If you're running this locally:

1. **Install the dependencies:**
   ```bash
   npm install
   ```

2. **Prepare the Database:**
   ```bash
   npx prisma generate
   ```

3. **Ignite the Engine:**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000` and experience the difference.

---

## 🌐 Going Live (Railway)

TaskFlow is optimized for [Railway.app](https://railway.app). 

1. **Push to GitHub.**
2. **Deploy on Railway** by selecting your repo.
3. **Set your variables:**
   - `NEXTAUTH_SECRET`: (Generate one with `openssl rand -base64 32`)
   - `NEXTAUTH_URL`: Your live domain.
   - `DATABASE_URL`: Your database link.

---

## 📝 A Note from the Creator

This project was built with a focus on "Design-First" engineering. Every shadow, every font-weight, and every transition was chosen to make the user feel like they are working in a premium environment. We hope you enjoy using it as much as we enjoyed building it.

**Live URL:** [Insert Link Here]
**Demo Video:** [Insert Link Here]
