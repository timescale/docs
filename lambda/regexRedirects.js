module.exports = [
  {
    from: /^\/v[0-1]\.[0-9]\/api/,
    to: "https://www.tigerdata.com/docs/api/latest/"
  },
  {
    from: /^\/v[0-1]\.[0-9]\/getting-started/,
    to: "https://www.tigerdata.com/docs/getting-started/latest/"
  },
  {
    from: /^\/use-timescale\/latest\/integrations(\/.*)?$/,
    to: (match) =>
      `https://www.tigerdata.com/docs/integrations/latest${match[1] || ""}`
  },
  {
    from: /^\/quick-start\/latest\/(\/.*)?$/,
    to: `https://www.tigerdata.com/docs/getting-started/latest/start-coding-with-timescale/`
  },
  {
    from: /^\/v[0-1]\.[0-9]\/tutorials/,
    to: "https://www.tigerdata.com/docs/tutorials/latest/"
  }
];
