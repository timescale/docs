module.exports = [
  {
    from: /^\/v[0-1]\.[0-9]\/api/,
    to: "https://docs.timescale.com/api/latest/"
  },
  {
    from: /^\/v[0-1]\.[0-9]\/getting-started/,
    to: "https://docs.timescale.com/getting-started/latest/"
  },
  {
    from: /^\/use-timescale\/latest\/integrations(\/.*)?$/,
    to: (match) =>
      `https://docs.timescale.com/integrations/latest${match[1] || ""}`
  },
  {
    from: /^\/quick-start\/latest\/(\/.*)?$/,
    to: `https://docs.timescale.com/getting-started/latest/start-coding-with-timescale/`
  },
  {
    from: /^\/v[0-1]\.[0-9]\/tutorials/,
    to: "https://docs.timescale.com/tutorials/latest/"
  }
];
