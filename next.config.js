module.exports = module.exports = {
  images: {
    formats: ["image/webp", "image/avif"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.notion.so",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "indy-systems.imgix.net",
        port: "",
        pathname: "/**",
      },
    ],
  },
};
