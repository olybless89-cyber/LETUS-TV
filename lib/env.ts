/** Environment variable loader with validation. */
export const env = {
  databaseUrl: process.env.DATABASE_URL!,
  adminEmail: process.env.ADMIN_EMAIL ?? "admin@letustv.com",
  adminPassword: process.env.ADMIN_PASSWORD ?? "Changeme123!",
  adminName: process.env.ADMIN_NAME ?? "Letus TV Admin",
  jwtSecret: process.env.JWT_SECRET ?? "letus-tv-development-secret",
  nextPublicSiteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"),
  storageProvider: process.env.STORAGE_PROVIDER ?? "local",
  s3Endpoint: process.env.S3_ENDPOINT,
  s3Bucket: process.env.S3_BUCKET,
  s3AccessKey: process.env.S3_ACCESS_KEY,
  s3SecretKey: process.env.S3_SECRET_KEY,
};