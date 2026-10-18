# Bugi birthday surprise

A static React + Vite app (no backend, no API keys).

## Run locally
    npm install
    npm run dev

## Deploy on Render (Static Site)
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`
- Environment: `NODE_VERSION=22`
(or just use "New > Blueprint" with the included `render.yaml`)

## Links
- Sender setup page: `https://YOUR-SITE.onrender.com/?setup=1` → open "تنظیمات", fill names, copy the link.
- Send the copied link (it contains `?to=...&from=...`) to the recipient.

## Auto-send the chosen plan by email
By default the plan is emailed to `aminha3tam@gmail.com` through FormSubmit.co (no key needed).
- First time only: after the first submission FormSubmit emails an activation link to that address; click **Activate**.
- To change the recipient, set `VITE_NOTIFY_EMAIL` on Render and redeploy.
- Optional: set `VITE_W3F_KEY` (from https://web3forms.com) to use Web3Forms instead.
If sending fails, the app falls back to the manual copy/WhatsApp buttons.
