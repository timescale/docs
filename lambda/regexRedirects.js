module.exports = [
  {
    from: /^\/v[0-1]\.[0-9]\/api/,
    to: "https://docs.tigerdata.com/api/latest/"
  },
  {
    from: /^\/v[0-1]\.[0-9]\/getting-started/,
    to: "https://docs.tigerdata.com/getting-started/latest/"
  },
  {
    from: /^\/use-timescale\/latest\/integrations(\/.*)?$/,
    to: (match) =>
      `https://docs.tigerdata.com/integrations/latest${match[1] || ""}`
  },
  {
    from: /^\/quick-start\/latest\/(\/.*)?$/,
    to: `https://docs.tigerdata.com/getting-started/latest/start-coding-with-timescale/`
  },
  {
    from: /^\/v[0-1]\.[0-9]\/tutorials/,
    to: "https://docs.tigerdata.com/tutorials/latest/"
  }
];
