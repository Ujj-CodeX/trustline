import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Temporary workaround for the Next.js metadata prerender workStore error.
    // Revisit after testing; inlineCss is experimental and can increase HTML payload size.
    inlineCss: true,
  },
};

export default nextConfig;
