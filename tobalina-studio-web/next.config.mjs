/** @type {import('next').NextConfig} */
const repoBase = "/Services";

const nextConfig = {
  output: "export",
  basePath: repoBase,
  assetPrefix: repoBase,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
