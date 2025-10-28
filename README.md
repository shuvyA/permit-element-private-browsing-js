# Permit.io Element Integration

HTML + TypeScript project for integrating Permit.io Elements with iframe communication.

## 🚀 Quick Start

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment variables:**

Copy `.env.example` to `.env` and update with your values:
```bash
cp .env.example .env
```

Then edit `.env`:
```bash
PERMIT_ENV_ID=your_environment_id_here
PERMIT_LOGIN_URL=http://localhost:8080/login_header
PERMIT_TENANT=default
PERMIT_DARK_MODE=false
PERMIT_ELEMENTS_TOKEN=true
```

3. **Build and run:**
```bash
npm run build
npm run serve
```

4. **Open your browser:**
```
http://localhost:3001
```

## 📁 Project Structure

```
├── index.html          # Main HTML with Permit.io iframe
├── main.ts             # TypeScript App class with Permit login logic
├── bundle.js           # Compiled bundle (auto-generated)
├── serve.js            # Development server (port 3001, serves config from .env)
├── .env                # Environment variables (DO NOT COMMIT)
├── .env.example        # Environment variables template
├── .gitignore          # Git ignore file (.env is excluded)
├── package.json        # Dependencies and scripts
└── tsconfig.json       # TypeScript configuration
```

## ⚙️ Configuration

Your Permit.io configuration is stored in the `.env` file:

```bash
# .env
PERMIT_ENV_ID=191e41444eb94f02a629d838a1a672d6
PERMIT_LOGIN_URL=http://localhost:8080/login_header
PERMIT_TENANT=default
PERMIT_DARK_MODE=false
PERMIT_ELEMENTS_TOKEN=true
```

**Important:** 
- ✅ `.env` is in `.gitignore` and won't be committed to git
- ✅ Configuration is loaded by the server and injected at runtime
- ✅ Use `.env.example` as a template for new environments
- ✅ Never commit sensitive values to git

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PERMIT_ENV_ID` | Your Permit.io environment ID | `191e41444eb94f02a629d838a1a672d6` |
| `PERMIT_LOGIN_URL` | Backend login endpoint | `http://localhost:8080/login_header` |
| `PERMIT_TENANT` | Tenant ID for multi-tenancy | `default` |
| `PERMIT_DARK_MODE` | Enable dark mode (true/false) | `false` |
| `PERMIT_ELEMENTS_TOKEN` | Enable elements token (true/false) | `true` |

**Note:** After changing `.env` values, restart the server:
```bash
# Stop the server (Ctrl+C) and restart
npm run serve
```

## 🔧 Development

### Available Commands

```bash
# Build TypeScript to JavaScript bundle
npm run build

# Serve on port 3001
npm run serve

# Build and serve (in one command)
npm run dev

# Watch mode (auto-rebuild on changes)
npm run watch
```

### Development Workflow

1. Make changes to `main.ts` or `index.html`
2. Run `npm run build` to rebuild
3. Refresh browser to see changes

Or use watch mode:
```bash
# Terminal 1: Watch for changes
npm run watch

# Terminal 2: Serve the app
npm run serve
```

## 🔐 Backend Requirements

Your backend must implement a `/login_header` endpoint that:

1. Accepts POST requests
2. Authenticates the user
3. Generates a Permit.io elements token
4. Returns the token as JSON

**Response format:**
```json
{
  "success": true,
  "token": "permit_elements_token_here"
}
```

**Example with Permit SDK (Node.js):**
```javascript
const { Permit } = require('permitio');
const express = require("express");
const cors = require('cors');

// server/index.js
const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '../.env')});
const app = express();
const port = 8080;

// Configure CORS
const corsOptions = {
    origin: 'http://localhost:3001', // Replace with your frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
    accessControlAllowOrigin: '*'
};

app.use(cors(corsOptions));
const permit = new Permit({ token: 'YOUR_PERMIT_API_KEY' });

app.post("/login_header", async (req, res) => {
    const ticket = await permit.elements.loginAs({userId: USER_KEY, tenantId: TENANT_ID});
    res.status(200).json({url: ticket.element_bearer_token});
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
```

## 🎯 Features

- ✅ Permit.io SDK integration (`@permitio/permit-js`)
- ✅ Iframe-based element loading
- ✅ PostMessage communication monitoring
- ✅ Login button with loading states
- ✅ Message bar notifications
- ✅ Error handling and status display
- ✅ TypeScript with strict mode
- ✅ ES6 module bundling with esbuild

## 🧪 Testing

1. **Start the development server:**
```bash
npm run serve
```

2. **Open browser at http://localhost:3001**

3. **Open DevTools (F12)** to see console logs

4. **Click "Login to Permit"** button

5. **Watch console for:**
   - 🚀 App initialization
   - 🔐 Login button clicked
   - 📬 Messages from iframe
   - ✅ Login success/failure

### Browser Console Commands

```javascript
// Check app instance
window.app

// View configuration
window.permitConfig

// Check if initialized
window.app.isInitialized()

// Show test message
window.app.showMessageBar('Test!', 'success')

// Get Permit instance
window.app.getPermit()
```

## 📦 Dependencies

### Runtime
- `@permitio/permit-js` - Permit.io JavaScript SDK

### Development
- `esbuild` - Fast JavaScript bundler
- `typescript` - TypeScript compiler

## 🏗️ Build System

This project uses **esbuild** to bundle TypeScript and dependencies into a single JavaScript file:

- **Input:** `main.ts` + `node_modules`
- **Output:** `bundle.js` (IIFE format)
- **Target:** ES2020
- **Bundle size:** ~154kb

## ⚠️ Important Notes

### CORS Configuration

Your backend must enable CORS for the frontend to communicate:

```javascript
res.header('Access-Control-Allow-Origin', '*');
res.header('Access-Control-Allow-Headers', 'Content-Type');
```

### Security

- ⚠️ Never expose Permit API keys in frontend code
- ✅ Always generate tokens on the backend
- ✅ Validate user authentication before generating tokens
- ✅ Use HTTPS in production

## 🚀 Production Deployment

1. **Build the bundle:**
```bash
npm run build
```

2. **Deploy these files:**
   - `index.html`
   - `bundle.js`
   - `config.js` (optional)

3. **Update the backend URL** in `index.html` to your production backend

4. **Ensure backend is running** with CORS enabled

5. **Deploy to your hosting** (Netlify, Vercel, AWS, etc.)

## 🐛 Troubleshooting

### Button doesn't work
- Check if `bundle.js` is loaded in Network tab
- Verify `window.app` exists in console
- Look for JavaScript errors in console

### CORS errors
- Add CORS headers to your backend
- Check backend URL is correct
- Verify backend is running

### Login fails
- Check backend is running and accessible
- Verify `/login_header` endpoint exists
- Check backend returns correct JSON format
- Look at Network tab for response details

### Iframe doesn't load
- Verify environment ID is correct
- Check iframe URL in DevTools → Elements
- Look for CSP (Content Security Policy) errors

## 📖 Resources

- [Permit.io Documentation](https://docs.permit.io)
- [Permit.io Elements Docs](https://docs.permit.io/elements)
- [Community Slack](https://io.permit.io/slack)

## 📄 License

ISC

---

**Made with Permit.io Elements** 🚀
