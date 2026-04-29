/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! ATENÇÃO !!
    // Isso permite que o build termine mesmo que haja erros de TypeScript.
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig