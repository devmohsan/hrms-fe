const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@zoom/meetingsdk"],
};

module.exports = nextConfig;
