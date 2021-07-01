module.exports = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/rules/:year/:version',
        destination: 'https://media.wizards.com/:year/downloads/MagicCompRules%version=:version*',
      }
    ]
  }
}
