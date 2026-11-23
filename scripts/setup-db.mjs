// Run once: `npm run db:setup` (with DATABASE_URL in your environment or .env.local)
import fs from "fs";
import postgres from "postgres";

if (!process.env.DATABASE_URL && fs.existsSync(".env.local")) {
  for (const line of fs.readFileSync(".env.local", "utf8").split("\n")) {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}
const url = process.env.DATABASE_URL;
if (!url) { console.error("Set DATABASE_URL first."); process.exit(1); }
const sql = postgres(url, { ssl: url.includes("localhost") ? false : "require" });
await sql.unsafe(fs.readFileSync(new URL("../schema.sql", import.meta.url), "utf8"));
console.log("✓ Database tables ready");
await sql.end();
