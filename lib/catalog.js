// Single source of truth for services and prices (in dollars).
// Edit prices here — the site and the server both read from this file.
//   from: true  -> "starting at" price; you confirm the final price after review
//   unit: "..." -> priced per unit, customer picks a quantity
//   mo: true    -> monthly plan (first month is charged with the order)

export const CATS = [
  {
    id: "updates", name: "Pick & Choose Updates", icon: "🧩",
    blurb: "Already have a website? Pick exactly what you want done and see your total instantly.",
    items: [
      { id: "u_pics", n: "Change / replace pictures", p: 10, unit: "image", f: ["Swap banners, product or gallery photos", "Resized so they load fast"] },
      { id: "u_text", n: "Edit text on a section", p: 15, unit: "section", f: ["Rewrite or update wording", "Hours, about, policies, etc."] },
      { id: "u_price", n: "Update product price or info", p: 5, unit: "product", f: ["Prices, sizes, descriptions", "Sale or sold-out tags"] },
      { id: "u_product", n: "Add a new product listing", p: 15, unit: "item", f: ["Photos, sizes, price", "Fabric, care, or spec details"] },
      { id: "u_page", n: "Make a brand-new page", p: 100, unit: "page", hot: true, f: ["About, FAQ, lookbook, policies, contact", "Matches your current site"] },
      { id: "u_section", n: "Add a section to a page", p: 40, unit: "section", f: ["Banner, gallery, reviews, FAQ block", "Mobile-ready"] },
      { id: "u_mobile", n: "Fix a mobile layout issue", p: 35, unit: "issue", f: ["Things overlapping or cut off on phones", "Tested on iPhone + Android sizes"] },
      { id: "u_form", n: "Add or edit a form / button", p: 25, unit: "item", f: ["Contact, signup, booking, buy buttons", "Sends to your email"] },
      { id: "u_style", n: "Change colors or fonts site-wide", p: 60, f: ["New brand colors or typography", "Applied across every page"] },
      { id: "u_video", n: "Add a video or embed", p: 25, unit: "item", f: ["YouTube, TikTok, Instagram, maps", "Sized correctly on phones"] },
      { id: "u_links", n: "Update links & social icons", p: 15, f: ["Menu links, footer, socials", "Link-in-bio connections"] },
      { id: "u_fix", n: "Fix a broken link or error", p: 15, unit: "fix", f: ["Dead links, 404s, broken images"] },
      { id: "u_photo", n: "Photo editing", p: 10, unit: "image", f: ["Background cleanup", "Crop + color correction"] },
      { id: "u_seo", n: "Speed & SEO tune-up", p: 75, f: ["Faster load times", "Google titles + descriptions"] },
    ],
  },
  {
    id: "maint", name: "Maintenance Packages", icon: "🛠️",
    blurb: "Got a list of changes? A package usually costs less than picking them one by one.",
    items: [
      { id: "m_quick", n: "Quick Fix", p: 75, f: ["Up to 2 small updates", "Text, price, or image swaps", "Done in 48 hours"] },
      { id: "m_refresh", n: "The Refresh", p: 250, hot: true, f: ["Up to 6 updates", "Mobile formatting", "1 round of revisions", "Done in 3–5 days"] },
      { id: "m_glow", n: "The Glow-Up", p: 450, f: ["Up to 12 updates", "Layout + section redesigns", "5 photo edits included", "2 rounds of revisions"] },
    ],
  },
  {
    id: "build", name: "Website Builds", icon: "🖥️",
    blurb: "A brand-new site, designed, built, mobile-ready, and launched. You own everything.",
    items: [
      { id: "b_landing", n: "Landing Page", p: 300, f: ["1 high-impact page", "Great for launches and events", "Signup or order form"] },
      { id: "b_starter", n: "Starter Site", p: 500, f: ["1–3 pages", "Mobile-ready design", "Contact form + socials", "Launch help with domain"] },
      { id: "b_business", n: "Business Site", p: 1000, hot: true, f: ["Up to 6 pages", "Custom design to match your brand", "Basic SEO setup", "2 revision rounds"] },
      { id: "b_store", n: "Online Store", p: 1500, f: ["Shopify, Wix or Square", "Up to 25 products loaded", "Payments + shipping set up", "Training on managing orders"] },
      { id: "b_app", n: "Custom Web App", p: 2500, from: true, f: ["Booking, dashboards, portals", "Database + logins", "Fixed quote after discovery"] },
    ],
  },
  {
    id: "proj", name: "Engineering Projects", icon: "⚡",
    blurb: "Circuits, boards, firmware, and prototypes, from an idea on a napkin to something that works.",
    items: [
      { id: "p_consult", n: "Project Consult", p: 60, unit: "hr", f: ["Talk through your idea", "Feasibility + parts plan", "Cost and timeline estimate"] },
      { id: "p_pcb", n: "Circuit / PCB Design", p: 400, from: true, f: ["Schematic + 2-layer board", "Parts list (BOM)", "Files ready for fabrication"] },
      { id: "p_embedded", n: "Embedded Prototype", p: 600, from: true, hot: true, f: ["Arduino, ESP32, or STM32", "Sensors, motors, displays", "Working firmware + docs"] },
      { id: "p_fpga", n: "FPGA / Digital Design", p: 800, from: true, f: ["Verilog/VHDL design", "Simulation + testbench", "Tested on hardware"] },
      { id: "p_repair", n: "Repair & Troubleshoot", p: 75, from: true, f: ["Electronics diagnosis", "Soldering + rework"] },
      { id: "p_tutor", n: "Tutoring & Project Coaching", p: 40, unit: "hr", f: ["Circuits, embedded, digital logic", "Learn to debug your own project"] },
    ],
  },
  {
    id: "it", name: "Tech & IT Support", icon: "📡",
    blurb: "Wi-Fi, devices, cameras, and business setup. The tech stuff you don't have time for.",
    items: [
      { id: "t_help", n: "Tech Help Visit", p: 60, unit: "hr", f: ["Computers, phones, printers", "Remote or in-person"] },
      { id: "t_wifi", n: "Wi-Fi & Network Setup", p: 150, f: ["Router + mesh setup", "Fix dead zones", "Secure guest network"] },
      { id: "t_cam", n: "Security Camera Install", p: 120, f: ["Base install + app setup", "Phone alerts configured"] },
      { id: "t_device", n: "Extra Camera / Smart Device", p: 40, unit: "device", f: ["Camera, doorbell, lock, or plug", "Mounted + connected"] },
      { id: "t_biz", n: "Small Business IT Setup", p: 350, hot: true, f: ["Pro email on your domain", "Wi-Fi, printers, shared files", "Automatic backups"] },
      { id: "t_backup", n: "Data Backup & Recovery", p: 100, from: true, f: ["Back up your files", "Try to recover lost data"] },
    ],
  },
  {
    id: "grow", name: "Brand & Growth", icon: "🚀",
    blurb: "Look legit and get found. The small things that bring in more customers.",
    items: [
      { id: "g_logo", n: "Logo + Brand Kit", p: 200, f: ["Logo in all formats", "Colors + fonts guide", "Social profile images"] },
      { id: "g_google", n: "Google Business Profile", p: 100, hot: true, f: ["Setup + verification", "Show up on Google Maps"] },
      { id: "g_email", n: "Domain + Pro Email", p: 75, f: ["you@yourbusiness.com", "Works on your phone"] },
      { id: "g_social", n: "Social Media Kit", p: 150, f: ["10 branded post templates", "Story + highlight covers"] },
      { id: "g_qr", n: "QR Menu / Order Page", p: 125, f: ["Digital menu or catalog", "Printable QR code"] },
    ],
  },
  {
    id: "plans", name: "Monthly Plans", icon: "🔁",
    blurb: "Ongoing support for a flat monthly price. First month is paid with your order.",
    items: [
      { id: "r_care", n: "Website Care Plan", p: 125, mo: true, f: ["Up to 4 updates / month", "Backups + security updates", "Priority 24-hr response"] },
      { id: "r_it", n: "IT On-Call", p: 150, mo: true, f: ["Up to 3 hrs support / month", "Remote + on-site"] },
      { id: "r_growth", n: "Growth Bundle", p: 250, mo: true, hot: true, f: ["Website Care + IT On-Call", "Google profile updates", "Save $25 every month"] },
    ],
  },
];

export const ITEMS = Object.fromEntries(
  CATS.flatMap((c) => c.items.map((i) => [i.id, { ...i, cat: c.id }]))
);

export const STATUSES = {
  new: { label: "Received", note: "Isaiah is reviewing your order and will confirm the final price, usually within 24 hours." },
  approved: { label: "Approved", note: "Your quote is confirmed. Pay the deposit to get on the schedule." },
  in_progress: { label: "In progress", note: "Work has started. You'll get a text when it's ready to review." },
  completed: { label: "Completed", note: "Your work is done. Please review it and pay any remaining balance." },
  paid: { label: "Paid in full", note: "All set. Thank you for choosing McCray Made!" },
  cancelled: { label: "Cancelled", note: "This order was cancelled. Text Isaiah with any questions." },
};
