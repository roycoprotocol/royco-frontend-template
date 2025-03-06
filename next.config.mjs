/** @type {import('next').NextConfig} */
const nextConfig = {
  /**
   * @description Web3Modal requirement for SSR
   * @see {@link https://docs.walletconnect.com/web3modal/nextjs/about#extra-configuration}
   */
  // webpack: (config) => {
  //   config.externals.push("pino-pretty", "lokijs", "encoding");
  //   return config;
  // },
  webpack: (config, context) => {
    if (config.plugins) {
      config.plugins.push(
        new context.webpack.IgnorePlugin({
          resourceRegExp: /^(lokijs|pino-pretty|encoding)$/,
        })
      );
    }
    return config;
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  // Enables logging out caching info
  logging: {
    fetches: {
      fullUrl: true,
    },
    rewrites: true,
  },

  rewrites: async () => {
    // Helper function to randomly select an RPC endpoint
    const getRandomRPC = (keys) => {
      const endpoints = keys.filter((key) => key); // Filter out any undefined/empty keys
      if (endpoints.length === 0) return null;
      return endpoints[Math.floor(Math.random() * endpoints.length)];
    };

    return [
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*", // Proxy to Posthog
      },
      {
        source: "/api/event/:path*",
        destination: "https://royco-analytics.vercel.app/:path*", // Proxy to Royco Analytics
      },
      {
        source: "/api/rpc/1/:path*",
        // destination: process.env.RPC_API_KEY_1,
        destination: getRandomRPC([
          process.env.RPC_API_KEY_1_1,
          process.env.RPC_API_KEY_1_2,
          process.env.RPC_API_KEY_1_3,
          process.env.RPC_API_KEY_1_4,
          process.env.RPC_API_KEY_1_5,
        ]),
      },
      {
        source: "/api/rpc/11155111/:path*",
        // destination: process.env.RPC_API_KEY_11155111,
        destination: getRandomRPC([
          process.env.RPC_API_KEY_11155111_1,
          process.env.RPC_API_KEY_11155111_2,
          process.env.RPC_API_KEY_11155111_3,
          process.env.RPC_API_KEY_11155111_4,
          process.env.RPC_API_KEY_11155111_5,
        ]),
      },
      {
        source: "/api/rpc/42161/:path*",
        // destination: process.env.RPC_API_KEY_42161,
        destination: getRandomRPC([
          process.env.RPC_API_KEY_42161_1,
          process.env.RPC_API_KEY_42161_2,
          process.env.RPC_API_KEY_42161_3,
          process.env.RPC_API_KEY_42161_4,
          process.env.RPC_API_KEY_42161_5,
        ]),
      },
      {
        source: "/api/rpc/8453/:path*",
        // destination: process.env.RPC_API_KEY_8453,
        destination: getRandomRPC([
          process.env.RPC_API_KEY_8453_1,
          process.env.RPC_API_KEY_8453_2,
          process.env.RPC_API_KEY_8453_3,
          process.env.RPC_API_KEY_8453_4,
          process.env.RPC_API_KEY_8453_5,
        ]),
      },
      {
        source: "/api/rpc/21000000/:path*",
        destination: process.env.RPC_API_KEY_21000000,
      },
      {
        source: "/api/rpc/98865/:path*",
        destination: process.env.RPC_API_KEY_98865,
      },
      {
        source: "/api/rpc/146/:path*",
        // destination: process.env.RPC_API_KEY_146,
        destination: getRandomRPC([
          process.env.RPC_API_KEY_146_1,
          process.env.RPC_API_KEY_146_2,
          process.env.RPC_API_KEY_146_3,
          process.env.RPC_API_KEY_146_4,
          process.env.RPC_API_KEY_146_5,
        ]),
      },
      {
        source: "/api/rpc/80094/:path*",
        destination: getRandomRPC([process.env.RPC_API_KEY_80094_1]),
      },
      {
        source: "/api/rpc/80069/:path*",
        destination: getRandomRPC([process.env.RPC_API_KEY_80069_1]),
      },
    ];
  },
  // CORS for API routes
  async headers() {
    return [
      {
        // matching all API routes
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, x-api-key, auth-token",
          },
        ],
      },
      // Prevent iframe embedding
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },

          { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
        ],
      },
    ];
  },
};

export default nextConfig;
