export const HttpStatusCodes = {
  100: {
    code: 100,
    text: 'Continue',
    description: 'The server has received the request headers and the client should proceed to send the request body.',
  },
  101: {
    code: 101,
    text: 'Switching Protocols',
    description: 'The requester has asked the server to switch protocols.',
  },
  102: {
    code: 102,
    text: 'Processing',
    description: 'The server has received and is processing the request, but no response is available yet.',
  },
  103: {
    code: 103,
    text: 'Early Hints',
    description: 'Used to return some response headers before final HTTP message.',
  },
  200: {
    code: 200,
    text: 'OK',
    description: 'The request is successful.',
  },
  201: {
    code: 201,
    text: 'Created',
    description: 'The request is complete, and a new resource is created.',
  },
  202: {
    code: 202,
    text: 'Accepted',
    description: 'The request is accepted for processing, but the processing is not complete.',
  },
  203: {
    code: 203,
    text: 'Non-Authoritative Information',
    description:
      'The information in the entity header is from a local or third-party copy, not from the original server.',
  },
  204: {
    code: 204,
    text: 'No Content',
    description: 'A status code and a header are given in the response, but there is no entity-body in the reply.',
  },
  205: {
    code: 205,
    text: 'Reset Content',
    description: 'The browser should clear the form used for this transaction for additional input.',
  },
  206: {
    code: 206,
    text: 'Partial Content',
    description: 'The server is returning partial data of the size requested.',
  },
  207: {
    code: 207,
    text: 'Multi-Status',
    description:
      'The message body that follows is by default an XML message and can contain a number of separate response codes, depending on how many sub-requests were made.',
  },
  208: {
    code: 208,
    text: 'Already Reported',
    description:
      'The members of a DAV binding have already been enumerated in a previous reply to this request, and are not being included again.',
  },
  226: {
    code: 226,
    text: 'IM Used',
    description:
      'The server has fulfilled a GET request for the resource, and the response is a representation of the result of one or more instance-manipulations applied to the current instance.',
  },
  300: {
    code: 300,
    text: 'Multiple Choices',
    description: 'A link list. The user can select a link and go to that location. Maximum five addresses.',
  },
  301: {
    code: 301,
    text: 'Moved Permanently',
    description: 'The requested page has moved to a new URL.',
  },
  302: {
    code: 302,
    text: 'Found',
    description: 'The requested page has moved temporarily to a new URL.',
  },
  303: {
    code: 303,
    text: 'See Other',
    description: 'The requested page can be found under a different URL.',
  },
  304: {
    code: 304,
    text: 'Not Modified',
    description:
      'This is the response code to an If-Modified-Since or If-None-Match header, where the URL has not been modified since the specified date.',
  },
  305: {
    code: 305,
    text: 'Use Proxy',
    description: 'The requested URL must be accessed through the proxy mentioned in the Location header.',
  },
  306: {
    code: 306,
    text: 'unused',
    description: 'This response code is no longer used; it is just reserved.',
  },
  307: {
    code: 307,
    text: 'Temporary Redirect',
    description: 'The requested page has moved temporarily to a new URL.',
  },
  308: {
    code: 308,
    text: 'Permanent Redirect',
    description:
      'This means that the resource is now permanently located at another URL, specified by the Location: HTTP Response header.',
  },
  400: {
    code: 400,
    text: 'Bad Request',
    description: 'The server did not understand the request.',
  },
  401: {
    code: 401,
    text: 'Unauthorized',
    description: 'The requested page needs a username and a password.',
  },
  402: {
    code: 402,
    text: 'Payment Required',
    description: 'You can not use this code yet.',
  },
  403: {
    code: 403,
    text: 'Forbidden',
    description: 'Access is forbidden to the requested page.',
  },
  404: {
    code: 404,
    text: 'Not Found',
    description: 'The server can not find the requested page.',
  },
  405: {
    code: 405,
    text: 'Method Not Allowed',
    description: 'The method specified in the request is not allowed.',
  },
  406: {
    code: 406,
    text: 'Not Acceptable',
    description: 'The server can only generate a response that is not accepted by the client.',
  },
  407: {
    code: 407,
    text: 'Proxy Authentication Required',
    description: 'You must authenticate with a proxy server before this request can be served.',
  },
  408: {
    code: 408,
    text: 'Request Timeout',
    description: 'The request took longer than the server was prepared to wait.',
  },
  409: {
    code: 409,
    text: 'Conflict',
    description: 'The request could not be completed because of a conflict.',
  },
  410: {
    code: 410,
    text: 'Gone',
    description: 'The requested page is no longer available.',
  },
  411: {
    code: 411,
    text: 'Length Required',
    description: 'The "Content-Length" is not defined. The server will not accept the request without it.',
  },
  412: {
    code: 412,
    text: 'Precondition Failed',
    description: 'The pre-condition given in the request evaluated to false by the server.',
  },
  413: {
    code: 413,
    text: 'Request Entity Too Large',
    description: 'The server will not accept the request, because the request entity is too large.',
  },
  414: {
    code: 414,
    text: 'Request-URI Too Long',
    description:
      'The server will not accept the request, because the URL is too long. Occurs when you convert a POST request to a GET request with a long query information.',
  },
  415: {
    code: 415,
    text: 'Unsupported Media Type',
    description: 'The server will not accept the request, because the media type is not supported.',
  },
  416: {
    code: 416,
    text: 'Requested Range Not Satisfiable',
    description: 'The client has asked for a portion of the file, but the server cannot supply that portion.',
  },
  417: {
    code: 417,
    text: 'Expectation Failed',
    description: 'The server cannot meet the requirements of the Expect request-header field.',
  },
  418: {
    code: 418,
    text: "I'm a teapot",
    description: 'The server refuses the attempt to brew coffee with a teapot.',
  },
  421: {
    code: 421,
    text: 'Misdirected Request',
    description: 'The request was directed at a server that is not able to produce a response.',
  },
  422: {
    code: 422,
    text: 'Unprocessable Entity',
    description: 'The request was well-formed but was unable to be followed due to semantic errors.',
  },
  423: {
    code: 423,
    text: 'Locked',
    description: 'The resource that is being accessed is locked.',
  },
  424: {
    code: 424,
    text: 'Failed Dependency',
    description: 'The request failed due to failure of a previous request.',
  },
  425: {
    code: 425,
    text: 'Too Early',
    description: 'Indicates that the server is unwilling to risk processing a request that might be replayed.',
  },
  426: {
    code: 426,
    text: 'Upgrade Required',
    description: 'The client should switch to a different protocol such as TLS/1.0.',
  },
  428: {
    code: 428,
    text: 'Precondition Required',
    description: 'The origin server requires the request to be conditional.',
  },
  429: {
    code: 429,
    text: 'Too Many Requests',
    description: 'The user has sent too many requests in a given amount of time.',
  },
  431: {
    code: 431,
    text: 'Request Header Fields Too Large',
    description:
      'The server is unwilling to process the request because either an individual header field, or all the header fields collectively, are too large.',
  },
  451: {
    code: 451,
    text: 'Unavailable For Legal Reasons',
    description: 'The user requests an illegal resource, such as a web page censored by a government.',
  },
  500: {
    code: 500,
    text: 'Internal Server Error',
    description:
      'A generic error message, given when an unexpected condition was encountered and no more specific message is suitable.',
  },
  501: {
    code: 501,
    text: 'Not Implemented',
    description:
      'The server either does not recognize the request method, or it lacks the ability to fulfill the request.',
  },
  502: {
    code: 502,
    text: 'Bad Gateway',
    description:
      'The server was acting as a gateway or proxy and received an invalid response from the upstream server.',
  },
  503: {
    code: 503,
    text: 'Service Unavailable',
    description: 'The server is currently unavailable (overloaded or down).',
  },
  504: {
    code: 504,
    text: 'Gateway Timeout',
    description:
      'The server was acting as a gateway or proxy and did not receive a timely response from the upstream server.',
  },
  505: {
    code: 505,
    text: 'HTTP Version Not Supported',
    description: 'The server does not support the HTTP protocol version used in the request.',
  },
  506: {
    code: 506,
    text: 'Variant Also Negotiates',
    description: 'Transparent content negotiation for the request results in a circular reference.',
  },
  507: {
    code: 507,
    text: 'Insufficient Storage',
    description: 'The server is unable to store the representation needed to complete the request.',
  },
  508: {
    code: 508,
    text: 'Loop Detected',
    description: 'The server detected an infinite loop while processing the request.',
  },
  510: {
    code: 510,
    text: 'Not Extended',
    description: 'Further extensions to the request are required for the server to fulfill it.',
  },
  511: {
    code: 511,
    text: 'Network Authentication Required',
    description: 'The 511 status code indicates that the client needs to authenticate to gain network access.',
  },
} as const;

export const getResponse = (code: number) => {
  return (
    HttpStatusCodes[code as keyof typeof HttpStatusCodes] ??
    ({
      code,
      text: 'Unknown',
      description: 'The server returned an unknown/custom status code.',
    } as const)
  );
};
