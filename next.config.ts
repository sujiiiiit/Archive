import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // lets a phone on the same Wi-Fi load the dev server's scripts by this machine's IP
  allowedDevOrigins: ["172.20.10.2"],
  images: {
    // AVIF first (about a fifth smaller than WebP at the same sharpness), WebP for the rest
    formats: ["image/avif", "image/webp"],
    // 75 is Next's default; 90 is for the hero photo, where detail matters more than bytes
    qualities: [75, 90],
  },
}

export default nextConfig
