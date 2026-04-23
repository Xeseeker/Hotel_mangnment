import dotenv from "dotenv";

// Development uses .env.local so you can keep machine-specific values there.
// Production/Docker uses .env or injected container environment variables.
const envFile = process.env.NODE_ENV === "development" ? ".env.local" : ".env";

dotenv.config({ path: envFile });

export const env = process.env;
