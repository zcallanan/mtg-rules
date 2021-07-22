module.exports = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/rules/2021/2020210419#100/",
        permanent: true,
      },
    ]
  },
}
