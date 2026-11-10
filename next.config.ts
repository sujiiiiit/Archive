import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // lets a phone on the same Wi-Fi load the dev server's scripts by this machine's IP
  allowedDevOrigins: ["172.20.10.2"],
}

export default nextConfig
