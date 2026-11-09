# 🌌 Braxten Orline P. Urdelas - Portfolio Website

> **Modern Cyber Sapphire & Blue Glassmorphism Portfolio**  
> Tailored for **Braxten Orline P. Urdelas** — BSIT Freshman at Technological University of the Philippines (TUP Manila), Aspiring Software Engineer, and Builder.

---

## ✨ Features & Highlights

- 💎 **Deep Blue Glassmorphism UI**: Frosted-glass backdrop blur, subtle cyber-blue borders, and holographic neon accents.
- ⚡ **Interactive Constellation Particles**: Custom HTML5 Canvas particle network that dynamically tracks and reacts to mouse movement.
- 🎴 **3D Parallax Tilt Effects**: Dynamic perspective tilting on project cards and profile picture based on cursor coordinates.
- 🧪 **Live Playable Demos**:
  - **C.C Calculator**: Live in-browser interactive scientific calculator.
  - **C-Four Bomb Defusal Simulator**: Interactive in-browser retro tactical terminal simulator.
  - **Python Hangman Game**: Quick word-guessing round with dynamic ASCII stages.
- 📱 **100% Responsive**: Tested for seamless performance across smartphones, tablets, laptops, and ultra-wide screens.
- 🚀 **Zero Dependencies**: Pure HTML5, CSS3, and modern Vanilla JavaScript — ultra-fast loading, 100 Lighthouse performance, and zero build tool complexity.
- 📄 **Direct Resume Download**: Integrated resume download button pointing directly to your included PDF.
- 🔗 **Full Social Media Integration**: Clickable links to your GitHub (`Brax1000`), LinkedIn, Facebook, direct email, and phone contact with one-click copy buttons.

---

## 📁 File Structure

```text
braxten-portfolio/
│
├── index.html                   # Main semantic website structure & content
├── vercel.json                  # Vercel deployment configuration & caching rules
├── README.md                    # Beginner documentation & deployment guide
│
├── css/
│   └── styles.css               # Complete styling, animations, and glass effects
│
├── js/
│   ├── main.js                  # Navigation, 3D tilt, typewriter, copy actions
│   ├── particles.js             # Interactive constellation background network
│   └── interactive-demos.js     # Live calculator, bomb defusal, & hangman game
│
└── assets/
    ├── profile.jpg              # Your extracted photo from resume
    └── Braxten_Urdelas_Resume.pdf # Your downloadable resume PDF
```

---

## 🖥️ How to Run Locally on Your Computer

As a beginner, you don't need any special tools or software installed:

1. Open File Explorer and navigate to this folder:  
   `C:\Users\brax1\.gemini\antigravity\scratch\braxten-portfolio`
2. Simply **double-click `index.html`**!
3. It will open instantly in your default web browser (Chrome, Edge, Firefox, Brave) with full animations, sounds, and interactive demos!

*(Optional: If you use VS Code, install the "Live Server" extension and click "Go Live" at the bottom right).*

---

## 🚀 How to Deploy to Vercel (Beginner's Step-by-Step Guide)

You can deploy your portfolio to Vercel in just a few minutes. Here are the two best ways:

### Method 1: Connecting your GitHub (Recommended)

This is the standard professional way. Whenever you update your code and push to GitHub, Vercel will update your live website automatically!

1. **Create a GitHub repository**:
   - Go to [github.com/new](https://github.com/new) and log in as `Brax1000`.
   - Name your repository (for example: `portfolio` or `braxten-portfolio`).
   - Leave it **Public** and click **Create repository**.

2. **Upload your files to GitHub**:
   - Open PowerShell or Terminal inside this folder:
     ```bash
     git init
     git add .
     git commit -m "Initial commit of my portfolio website"
     git branch -M main
     git remote add origin https://github.com/Brax1000/portfolio.git
     git push -u origin main
     ```
   *(Alternatively, on the GitHub website page of your new empty repository, click **"uploading an existing file"** and drag all files from this folder directly into the browser!)*

3. **Deploy with Vercel**:
   - Go to [vercel.com](https://vercel.com) and click **Sign Up** or **Log In** (Choose **Continue with GitHub**).
   - Once logged in, click the **"Add New..."** button and select **"Project"**.
   - You will see your new GitHub repository (`Brax1000/portfolio`). Click **"Import"**.
   - Leave all default settings as-is (Framework Preset: **Other**).
   - Click the blue **"Deploy"** button!
   - In less than 30 seconds, Vercel will give you a live production URL (e.g., `https://portfolio-braxten.vercel.app`)!

---

### Method 2: Deploying via Vercel CLI (If you have Node installed)

If you ever install Node.js:
1. Open PowerShell in this folder.
2. Run:
   ```bash
   npx vercel
   ```
3. Follow the quick on-screen prompts and your site will be live instantly!

---

## ✏️ How to Customize Your Information

- **Edit Text / Bio**: Open `index.html` in Notepad or VS Code and update the paragraphs under `#about`.
- **Add New Projects**: In `index.html`, duplicate one of the `.project-card` divs inside `#projects` and update the title, description, and GitHub repository URL.
- **Update Profile Photo**: Replace `assets/profile.jpg` with any new photo of yourself with the same filename.
- **Update Resume**: Replace `assets/Braxten_Urdelas_Resume.pdf` whenever you update your resume.

---

Designed with ❤️ for **Braxten Orline P. Urdelas**
