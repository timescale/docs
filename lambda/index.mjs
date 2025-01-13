import csp from './csp.js';
import redirects from './redirects.js';
import regexRedirects from './regexRedirects.js';

export const handler = async (event, context, callback) => {
  const request = event.Records[0].cf.request;
  const response = event.Records[0].cf.response;
  const headers = response.headers;

  csp.setPolicies(headers);

  let requestUri = request.uri?.split('#')[0];
  //
  // Remove trailing slash if present
  if (requestUri.endsWith('/')) {
    requestUri = requestUri.slice(0, -1);
  }

  for (const { from, to } of regexRedirects) {
    if (from.test(requestUri)) {
      return {
        status: 301,
        statusDescription: 'Moved Permanently',
        headers: {
          location: [{ key: 'Location', value: to }],
        },
      };
    }
  }

  for (const { from, to } of redirects) {
    const source = from.endsWith('/') ? from.slice(0, -1) : from;
    if (source == requestUri) {
      return {
        status: '301',
        statusDescription: 'Moved Permanently',
        headers: {
          location: [{ value: to }],
        },
      };
    }
  }

  callback(null, response);
};
