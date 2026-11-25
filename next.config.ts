import type { NextConfig } from "next";

// Site statique pour GitHub Pages, servi sous /<nom-du-dépôt>.
// Avec un nom de domaine à soi, mettre BASE_PATH="" au moment du build.
const basePath = process.env.BASE_PATH ?? "/site-perruques";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
