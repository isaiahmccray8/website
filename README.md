# McCray Made: Booking, Orders & Payments

Your business site. Customers can:
- **Book a free call** (Cal.com) → `/book`
- **Pick services** (à la carte website updates like "make a page" or "change pictures", packages, builds, engineering, IT, branding, monthly plans) and see a live total
- **Place an order** → they get a private tracking page (`/order/...`)
- **Pay** the 50% deposit and the balance with **card, Apple Pay, or Cash App Pay** (through Stripe)

You get a **dashboard** at `/admin`, where you can:
- see new orders, active jobs, money owed, and money paid this month
- approve orders, change the final price, and update status (Received → Approved → In progress → Completed → Paid)
- leave a note the customer sees
- record payments made outside the site (cash, Zelle)
- send a pre-written text to the customer in one tap

Change prices anytime in **`lib/catalog.js`**.

---

## Setup (about 30 minutes, all free to start)

### 1. Put the code on GitHub
```bash
cd mccray-made
git init && git add . && git commit -m "McCray Made site"
gh repo create mccray-made --private --source=. --push
```

### 2. Deploy on Vercel
1. vercel.com → **Add New → Project** → import `mccray-made`.
2. Deploy. It's fine if the first deploy can't save orders yet; you'll add settings next.

### 3. Database (Neon, free)
1. In your Vercel project: **Storage → Create Database → Neon (Postgres)** → connect it to the project. This adds `DATABASE_URL` for you.
2. Create the tables once from your computer:
   ```bash
   npm install
   vercel env pull .env.local     # downloads DATABASE_URL
   npm run db:setup               # prints ✓ Database tables ready
   ```

### 4. Stripe (card + Apple Pay + Cash App Pay)
1. Sign up at stripe.com and add your bank account for payouts.
2. **Settings → Payment methods**: turn on **Cards**, **Apple Pay**, and **Cash App Pay**.
3. **Developers → API keys**: copy the **Secret key** → `STRIPE_SECRET_KEY`.
4. **Developers → Webhooks → Add endpoint**
   - URL: `https://YOUR-SITE.vercel.app/api/stripe/webhook`
   - Events: `checkout.session.completed` and `checkout.session.async_payment_succeeded`
   - Copy the **Signing secret** → `STRIPE_WEBHOOK_SECRET`
5. Test with **test mode** keys first (card `4242 4242 4242 4242`, any future date, any CVC). Switch to live keys when ready.

Stripe fees: about 2.9% + 30¢ per card or Apple Pay payment. Cash App Pay is similar. Paid out to your bank in about 2 days.

### 5. Cal.com (booking)
1. Sign up at cal.com and connect your Google Calendar.
2. Create a **15-min "Free consultation"** event.
3. Your link looks like `cal.com/isaiahmccray/15min`. Put `isaiahmccray/15min` in `NEXT_PUBLIC_CAL_LINK`.

### 6. Add your settings in Vercel
**Project → Settings → Environment Variables**: add everything from `.env.example`:

| Name | What to put |
|---|---|
| `ADMIN_PASSWORD` | Your dashboard password (make it long) |
| `SESSION_SECRET` | Any long random string (40+ characters) |
| `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` | From step 4 |
| `SITE_URL` | `https://your-site.vercel.app` (no trailing slash) |
| `NEXT_PUBLIC_CAL_LINK` | From step 5 |
| `NEXT_PUBLIC_PHONE` | `7042949434` |
| `NEXT_PUBLIC_EMAIL` | `isaiahmccray8@gmail.com` |
| `PROMO_CODES` | `FAM10:10` (add more like `FAM10:10,VIP15:15`) |
| `RESEND_API_KEY` *(optional)* | From resend.com, to get an email for every new order |
| `OWNER_EMAIL` | Where new-order emails go |

Then **Deployments → Redeploy**.

### 7. Try it yourself
1. Place a test order on your site.
2. Go to `/admin`, log in, open the order → set **Approved** → **Save** → **Open in Messages** to text the customer.
3. Open the order link and pay the deposit with Stripe's test card. It shows as paid in the dashboard within seconds.

---

## How a job flows
1. Customer orders → status **Received** (no payment yet). You get an email if Resend is set up.
2. You review it, adjust the **Final total** if needed (for example, "starting at" items), set **Approved**, and text them.
3. They pay the **50% deposit** → status automatically moves to **In progress**.
4. You finish → set **Completed** → text them → they pay the balance → status automatically moves to **Paid**.

Paid with Cash App directly or in cash? Enter it under **Record a payment**.

## Notes
- **Monthly plans:** the first month is charged with the order. For ongoing monthly billing, create a Stripe subscription or payment link for that customer (Stripe → Payment Links → recurring).
- **Your photo:** replace the "IM" box in `app/page.js` with `<img src="/isaiah.jpg" alt="Isaiah McCray" />` and add the photo to `/public`.
- **Custom domain** (like mccraymade.com, about $12/yr): Vercel → Settings → Domains. Update `SITE_URL` and the Stripe webhook URL afterward.
- Local development: `cp .env.example .env.local`, fill it in, `npm run dev`.
