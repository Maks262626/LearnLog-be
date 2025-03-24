require('dotenv').config();

const config = {
  app: {
    port: process.env.APP_PORT || 1234,
  },
  db: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
  },
  auth: {
    domain: process.env.AUTH0_DOMAIN,
    issuer: process.env.AUTH0_ISSUER_URL,
    audience: process.env.AUTH0_AUDIENCE,
    clientId: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
  },
};
export default config;
