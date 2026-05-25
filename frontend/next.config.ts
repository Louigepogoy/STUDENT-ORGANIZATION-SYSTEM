import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const frontendDir = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  // Fix wrong root when parent folder has package-lock.json
  outputFileTracingRoot: frontendDir,
};

export default nextConfig;
