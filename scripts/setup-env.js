const fs = require("fs");
const path = require("path");

const rootDir = path.join(__dirname, "..");
const envPath = path.join(rootDir, ".env");
const envProdPath = path.join(rootDir, ".env.production");

// If .env doesn't exist, create it from .env.production or defaults
if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envProdPath)) {
    fs.copyFileSync(envProdPath, envPath);
    console.log("✅ Created .env from .env.production for cloud deployment");
  } else {
    fs.writeFileSync(
      envPath,
      'DATABASE_URL="file:./dev.db"\nJWT_SECRET="valchandson-heirloom-secret-key-2026-luxury-atelier-protection"\nNODE_ENV="production"\n'
    );
    console.log("✅ Created default .env for cloud deployment");
  }
}
