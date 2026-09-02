import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";

mkdirSync(path.join(process.cwd(), "apps", "api", "data"), { recursive: true });

const api = spawn("pnpm", ["--filter", "@quiver/api", "start"], {
  stdio: "inherit",
  shell: true,
  env: {
    ...process.env,
    API_PORT: process.env.API_PORT ?? "4001",
    PORT: process.env.API_PORT ?? "4001",
    DATABASE_URL: process.env.DATABASE_URL ?? "file:../data/quiver.db",
    WEB_ORIGIN: process.env.WEB_ORIGIN
      ?? (process.env.RAILWAY_PUBLIC_DOMAIN
        ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`
        : "http://localhost:3000"),
  },
});

const web = spawn("pnpm", ["--filter", "@quiver/web", "start"], {
  stdio: "inherit",
  shell: true,
  env: {
    ...process.env,
    API_UPSTREAM: process.env.API_UPSTREAM ?? "http://127.0.0.1:4001",
  },
});

const stop = (code) => {
  api.kill();
  web.kill();
  process.exit(code ?? 0);
};

api.on("exit", (code) => stop(code ?? 1));
web.on("exit", (code) => stop(code ?? 1));
process.on("SIGTERM", () => stop(0));
process.on("SIGINT", () => stop(0));
