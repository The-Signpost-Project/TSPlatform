import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	experimental: {
		reactCompiler: true,
	},
	images: {
		remotePatterns: [
			{
				protocol: "http",
				hostname: "localhost",
			},
			// for the time being
			{
				hostname: "143.198.80.178",
			},
		],
	},
	/*
  watchOptions: {
    pollIntervalMs: 1000,
  }, 
  */
};

module.exports = nextConfig;
