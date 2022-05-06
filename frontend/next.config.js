const withMDX = require('@next/mdx')({
  extension: /\.page\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
    providerImportSource: '@mdx-js/react',
  },
})

/** @type {import('next').NextConfig} */
module.exports = withMDX({
  reactStrictMode: true,
  pageExtensions: ['page.tsx', 'page.ts', 'page.jsx', 'page.js', 'api.js', 'api.ts', 'page.mdx', 'page.md'],
  future: {
    webpack5: true,
  },
  swcMinify: false
});
