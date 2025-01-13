module.exports = {
  setPolicies(headers) {
    headers['content-security-policy'] = [
      {
        key: 'Content-Security-Policy',
        value:
          "frame-ancestors 'none';style-src 'self' 'unsafe-inline' https://maxcdn.bootstrapcdn.com https://pro.fontawesome.com https://use.typekit.net https://p.typekit.net https://fonts.googleapis.com consent.api.osano.com tattle.api.osano.com cmp.osano.com disclosure.api.osano.com *.visualwebsiteoptimizer.com app.vwo.com;script-src 'self' 'unsafe-eval' 'unsafe-inline' blob: https://use.typekit.net https://www.googletagmanager.com https://js.hubspot.com https://s3-us-west-2.amazonaws.com/b2bjsstore/b/1VN080HQ276J/ https://www.google-analytics.com https://ajax.googleapis.com https://maxcdn.bootstrapcdn.com https://cdnjs.cloudflare.com https://js.hs-scripts.com https://js.hs-analytics.net https://js.hscollectedforms.net https://cdn.heapanalytics.com https://heapanalytics.com https://static.ads-twitter.com/ https://connect.facebook.net/ https://snap.licdn.com/ https://px.ads.linkedin.com https://googleads.g.doubleclick.net consent.api.osano.com tattle.api.osano.com cmp.osano.com disclosure.api.osano.com https://js.hsadspixel.net https://js.hs-banner.com https://*.clarity.ms https://tag.clearbitscripts.com https://www.clickcease.com https://reveal.clearbit.com https://x.clearbitjs.com *.visualwebsiteoptimizer.com app.vwo.com;img-src 'self' data: https://assets.iobeam.com https://*.hsforms.com https://assets.timescale.com https://docs.google.com https://www.google-analytics.com https://*.googleusercontent.com https://stats.g.doubleclick.net https://s3.amazonaws.com/ https://timescale.ghost.io https://www.timescale.com https://heapanalytics.com/ https://t.co https://analytics.twitter.com https://*.ads.linkedin.com https://www.facebook.com https://track.hubspot.com www.googletagmanager.com https://*.google.com https://*.clarity.ms https://c.bing.com chart.googleapis.com *.visualwebsiteoptimizer.com app.vwo.com;frame-src consent.api.osano.com tattle.api.osano.com cmp.osano.com disclosure.api.osano.com youtube.com www.youtube.com www.youtube-nocookie.com td.doubleclick.net app.vwo.com *.visualwebsiteoptimizer.com;worker-src blob: consent.api.osano.com tattle.api.osano.com cmp.osano.com disclosure.api.osano.com;upgrade-insecure-requests ;",
      },
    ];

    headers['strict-transport-security'] = [
      { key: 'Strict-Transport-Security', value: 'max-age=1000' },
    ];

    headers['x-xss-protection'] = [
      { key: 'X-Xss-Protection', value: '1; mode=block' },
    ];

    headers['x-frame-options'] = [{ key: 'X-Frame-Options', value: 'DENY' }];

    headers['x-content-type-options'] = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
    ];

    headers['referrer-policy'] = [
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    ];

    headers['feature-policy'] = [
      {
        key: 'Feature-Policy',
        value: "camera 'none'; geolocation 'none'; microphone 'none'",
      },
    ];

    headers['permissions-policy'] = [
      {
        key: 'Permissions-Policy',
        value: 'camera=(), geolocation=(), microphone=()',
      },
    ];
  },
};
