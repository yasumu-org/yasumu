export const HeaderType = {
  StandardRequest: 'standard-request',
  NonStandardRequest: 'non-standard-request',
  StandardResponse: 'standard-response',
  NonStandardResponse: 'non-standard-response',
  Custom: 'custom',
} as const;

export type HeaderType = (typeof HeaderType)[keyof typeof HeaderType];

export type HeaderDict = Record<
  | 'StandardRequestFields'
  | 'CommonNonStandardRequestFields'
  | 'StandardResponseFields'
  | 'CommonNonStandardResponseFields',
  HeaderInfo[]
>;

export const HttpHeaderDetails: HeaderDict = {
  StandardRequestFields: [
    {
      name: 'A-IM',
      type: HeaderType.StandardRequest,
      description: 'Acceptable instance-manipulations for the request.',
    },
    {
      name: 'Accept',
      type: HeaderType.StandardRequest,
      description: 'Media type(s) that is/are acceptable for the response. See Content negotiation.',
    },
    {
      name: 'Accept-Charset',
      type: HeaderType.StandardRequest,
      description: 'Character sets that are acceptable.',
    },
    {
      name: 'Accept-Datetime',
      type: HeaderType.StandardRequest,
      description: 'Acceptable version in time.',
    },
    {
      name: 'Accept-Encoding',
      type: HeaderType.StandardRequest,
      description: 'List of acceptable encodings. See HTTP compression.',
    },
    {
      name: 'Accept-Language',
      type: HeaderType.StandardRequest,
      description: 'List of acceptable human languages for response. See Content negotiation.',
    },
    {
      name: 'Access-Control-Request-Method,Access-Control-Request-Headers',
      type: HeaderType.StandardRequest,
      description: 'Initiates a request for cross-origin resource sharing with Origin (below).',
    },
    {
      name: 'Authorization',
      type: HeaderType.StandardRequest,
      description: 'Authentication credentials for HTTP authentication.',
    },
    {
      name: 'Cache-Control',
      type: HeaderType.StandardRequest,
      description:
        'Used to specify directives that must be obeyed by all caching mechanisms along the request-response chain.',
    },
    {
      name: 'Connection',
      type: HeaderType.StandardRequest,
      description:
        'Control options for the current connection and list of hop-by-hop request fields.\nMust not be used with HTTP/2.',
    },
    {
      name: 'Content-Encoding',
      type: HeaderType.StandardRequest,
      description: 'The type of encoding used on the data. See HTTP compression.',
    },
    {
      name: 'Content-Length',
      type: HeaderType.StandardRequest,
      description: 'The length of the request body in octets (8-bit bytes).',
    },
    {
      name: 'Content-MD5',
      type: HeaderType.StandardRequest,
      description: 'A Base64-encoded binary MD5 sum of the content of the request body.',
    },
    {
      name: 'Content-Type',
      type: HeaderType.StandardRequest,
      description: 'The Media type of the body of the request (used with POST and PUT requests).',
    },
    {
      name: 'Cookie',
      type: HeaderType.StandardRequest,
      description: 'An HTTP cookie previously sent by the server with Set-Cookie (below).',
    },
    {
      name: 'Date',
      type: HeaderType.StandardRequest,
      description:
        'The date and time at which the message was originated (in "HTTP-date" format as defined by RFC 9110: HTTP Semantics, section 5.6.7 "Date/Time Formats").',
    },
    {
      name: 'Expect',
      type: HeaderType.StandardRequest,
      description: 'Indicates that particular server behaviors are required by the client.',
    },
    {
      name: 'Forwarded',
      type: HeaderType.StandardRequest,
      description: 'Disclose original information of a client connecting to a web server through an HTTP proxy.',
    },
    {
      name: 'From',
      type: HeaderType.StandardRequest,
      description: 'The email address of the user making the request.',
    },
    {
      name: 'Host',
      type: HeaderType.StandardRequest,
      description:
        'The domain name of the server (for virtual hosting), and the TCP port number on which the server is listening. The port number may be omitted if the port is the standard port for the service requested.\nMandatory since HTTP/1.1.\nIf the request is generated directly in HTTP/2, it should not be used.',
    },
    {
      name: 'HTTP2-Settings',
      type: HeaderType.StandardRequest,
      description:
        'A request that upgrades from HTTP/1.1 to HTTP/2 MUST include exactly one HTTP2-Settings header field. The HTTP2-Settings header field is a connection-specific header field that includes parameters that govern the HTTP/2 connection, provided in anticipation of the server accepting the request to upgrade.',
    },
    {
      name: 'If-Match',
      type: HeaderType.StandardRequest,
      description:
        'Only perform the action if the client supplied entity matches the same entity on the server. This is mainly for methods like PUT to only update a resource if it has not been modified since the user last updated it.',
    },
    {
      name: 'If-Modified-Since',
      type: HeaderType.StandardRequest,
      description: 'Allows a 304 Not Modified to be returned if content is unchanged.',
    },
    {
      name: 'If-None-Match',
      type: HeaderType.StandardRequest,
      description: 'Allows a 304 Not Modified to be returned if content is unchanged, see HTTP ETag.',
    },
    {
      name: 'If-Range',
      type: HeaderType.StandardRequest,
      description:
        'If the entity is unchanged, send me the part(s) that I am missing; otherwise, send me the entire new entity.',
    },
    {
      name: 'If-Unmodified-Since',
      type: HeaderType.StandardRequest,
      description: 'Only send the response if the entity has not been modified since a specific time.',
    },
    {
      name: 'Max-Forwards',
      type: HeaderType.StandardRequest,
      description: 'Limit the number of times the message can be forwarded through proxies or gateways.',
    },
    {
      name: 'Origin',
      type: HeaderType.StandardRequest,
      description:
        'Initiates a request for cross-origin resource sharing (asks server for Access-Control-* response fields).',
    },
    {
      name: 'Pragma',
      type: HeaderType.StandardRequest,
      description:
        'Implementation-specific fields that may have various effects anywhere along the request-response chain.',
    },
    {
      name: 'Prefer',
      type: HeaderType.StandardRequest,
      description:
        'Allows client to request that certain behaviors be employed by a server while processing a request.',
    },
    {
      name: 'Proxy-Authorization',
      type: HeaderType.StandardRequest,
      description: 'Authorization credentials for connecting to a proxy.',
    },
    {
      name: 'Range',
      type: HeaderType.StandardRequest,
      description: 'Request only part of an entity.  Bytes are numbered from 0.  See Byte serving.',
    },
    {
      name: 'Referer',
      type: HeaderType.StandardRequest,
      description:
        'This is the address of the previous web page from which a link to the currently requested page was followed. (The word "referrer" has been misspelled in the RFC as well as in most implementations to the point that it has become standard usage and is considered correct terminology)',
    },
    {
      name: 'TE',
      type: HeaderType.StandardRequest,
      description:
        'The transfer encodings the user agent is willing to accept: the same values as for the response header field Transfer-Encoding can be used, plus the "trailers" value (related to the "chunked" transfer method) to notify the server it expects to receive additional fields in the trailer after the last, zero-sized, chunk.\nOnly trailers is supported in HTTP/2.',
    },
    {
      name: 'Trailer',
      type: HeaderType.StandardRequest,
      description:
        'The Trailer general field value indicates that the given set of header fields is present in the trailer of a message encoded with chunked transfer coding.',
    },
    {
      name: 'Transfer-Encoding',
      type: HeaderType.StandardRequest,
      description:
        'The form of encoding used to safely transfer the entity to the user. Currently defined methods are: chunked, compress, deflate, gzip, identity.\nMust not be used with HTTP/2.',
    },
    {
      name: 'User-Agent',
      type: HeaderType.StandardRequest,
      description: 'The user agent string of the user agent.',
    },
    {
      name: 'Upgrade',
      type: HeaderType.StandardRequest,
      description: 'Ask the server to upgrade to another protocol.\nMust not be used in HTTP/2.',
    },
    {
      name: 'Via',
      type: HeaderType.StandardRequest,
      description: 'Informs the server of proxies through which the request was sent.',
    },
    {
      name: 'Warning',
      type: HeaderType.StandardRequest,
      description: 'A general warning about possible problems with the entity body.',
    },
  ],
  CommonNonStandardRequestFields: [
    {
      name: 'Upgrade-Insecure-Requests',
      type: HeaderType.NonStandardRequest,
      description:
        'Tells a server which (presumably in the middle of a HTTP -> HTTPS migration) hosts mixed content that the client would prefer redirection to HTTPS and can handle Content-Security-Policy: upgrade-insecure-requests',
    },
    {
      name: 'X-Requested-With',
      type: HeaderType.NonStandardRequest,
      description:
        'Mainly used to identify Ajax requests (most JavaScript frameworks send this field with value of XMLHttpRequest); also identifies Android apps using WebView',
    },
    {
      name: 'DNT',
      type: HeaderType.NonStandardRequest,
      description:
        "Requests a web application to disable their tracking of a user. This is Mozilla's version of the X-Do-Not-Track header field (since Firefox 4.0 Beta 11).  Safari and IE9 also have support for this field.  On March 7, 2011, a draft proposal was submitted to IETF. The W3C Tracking Protection Working Group is producing a specification.",
    },
    {
      name: 'X-Forwarded-For',
      type: HeaderType.NonStandardRequest,
      description:
        'A de facto standard for identifying the originating IP address of a client connecting to a web server through an HTTP proxy or load balancer. Superseded by Forwarded header.',
    },
    {
      name: 'X-Forwarded-Host',
      type: HeaderType.NonStandardRequest,
      description:
        'A de facto standard for identifying the original host requested by the client in the Host HTTP request header, since the host name and/or port of the reverse proxy (load balancer) may differ from the origin server handling the request. Superseded by Forwarded header.',
    },
    {
      name: 'X-Forwarded-Proto',
      type: HeaderType.NonStandardRequest,
      description:
        'A de facto standard for identifying the originating protocol of an HTTP request, since a reverse proxy (or a load balancer) may communicate with a web server using HTTP even if the request to the reverse proxy is HTTPS.  An alternative form of the header (X-ProxyUser-Ip) is used by Google clients talking to Google servers. Superseded by Forwarded header.',
    },
    {
      name: 'Front-End-Https',
      type: HeaderType.NonStandardRequest,
      description: 'Non-standard header field used by Microsoft applications and load-balancers',
    },
    {
      name: 'X-Http-Method-Override',
      type: HeaderType.NonStandardRequest,
      description:
        'Requests a web application to override the method specified in the request (typically POST) with the method given in the header field (typically PUT or DELETE). This can be used when a user agent or firewall prevents PUT or DELETE methods from being sent directly (this is either a bug in the software component, which ought to be fixed, or an intentional configuration, in which case bypassing it may be the wrong thing to do).',
    },
    {
      name: 'X-ATT-DeviceId',
      type: HeaderType.NonStandardRequest,
      description:
        'Allows easier parsing of the MakeModel/Firmware that is usually found in the User-Agent String of AT&T Devices',
    },
    {
      name: 'X-Wap-Profile',
      type: HeaderType.NonStandardRequest,
      description:
        'Links to an XML file on the Internet with a full description and details about the device currently connecting. In the example to the right is an XML file for an AT&T Samsung Galaxy S2.',
    },
    {
      name: 'Proxy-Connection',
      type: HeaderType.NonStandardRequest,
      description:
        'Implemented as a misunderstanding of the HTTP specifications. Common because of mistakes in implementations of early HTTP versions. Has exactly the same functionality as standard Connection field.\nMust not be used with HTTP/2.',
    },
    {
      name: 'X-UIDH',
      type: HeaderType.NonStandardRequest,
      description:
        'Server-side deep packet inspection of a unique ID identifying customers of Verizon Wireless; also known as "perma-cookie" or "supercookie"',
    },
    {
      name: 'X-Csrf-Token',
      type: HeaderType.NonStandardRequest,
      description:
        'Used to prevent cross-site request forgery. Alternative header names are: X-CSRFToken and X-XSRF-TOKEN',
    },
    {
      name: 'X-Request-ID,\nX-Correlation-ID,\nCorrelation-ID',
      type: HeaderType.NonStandardRequest,
      description: 'Correlates HTTP requests between a client and server. Superseded by the traceparent header',
    },
    {
      name: 'Save-Data',
      type: HeaderType.NonStandardRequest,
      description:
        'The Save-Data client hint request header available in Chrome, Opera, and Yandex browsers lets developers deliver lighter, faster applications to users who opt-in to data saving mode in their browser.',
    },
    {
      name: 'Sec-GPC',
      type: HeaderType.NonStandardRequest,
      description:
        'The Sec-GPC (Global Privacy Control) request header indicates whether the user consents to a website or service selling or sharing their personal information with third parties.',
    },
  ],
  StandardResponseFields: [
    {
      name: 'Accept-CH',
      type: HeaderType.StandardResponse,
      description: 'Requests HTTP Client Hints',
    },
    {
      name: 'Access-Control-Allow-Origin,Access-Control-Allow-Credentials,Access-Control-Expose-Headers,Access-Control-Max-Age,Access-Control-Allow-Methods,Access-Control-Allow-Headers',
      type: HeaderType.StandardResponse,
      description: 'Specifying which web sites can participate in cross-origin resource sharing',
    },
    {
      name: 'Accept-Patch',
      type: HeaderType.StandardResponse,
      description: 'Specifies which patch document formats this server supports',
    },
    {
      name: 'Accept-Ranges',
      type: HeaderType.StandardResponse,
      description: 'What partial content range types this server supports via byte serving',
    },
    {
      name: 'Age',
      type: HeaderType.StandardResponse,
      description: 'The age the object has been in a proxy cache in seconds',
    },
    {
      name: 'Allow',
      type: HeaderType.StandardResponse,
      description: 'Valid methods for a specified resource. To be used for a 405 Method not allowed',
    },
    {
      name: 'Alt-Svc',
      type: HeaderType.StandardResponse,
      description:
        'A server uses "Alt-Svc" header (meaning Alternative Services) to indicate that its resources can also be accessed at a different network location (host or port) or using a different protocol\nWhen using HTTP/2, servers should instead send an ALTSVC frame.',
    },
    {
      name: 'Cache-Control',
      type: HeaderType.StandardResponse,
      description:
        'Tells all caching mechanisms from server to client whether they may cache this object. It is measured in seconds',
    },
    {
      name: 'Connection',
      type: HeaderType.StandardResponse,
      description:
        'Control options for the current connection and list of hop-by-hop response fields.\nMust not be used with HTTP/2.',
    },
    {
      name: 'Content-Disposition',
      type: HeaderType.StandardResponse,
      description:
        'An opportunity to raise a "File Download" dialogue box for a known MIME type with binary format or suggest a filename for dynamic content. Quotes are necessary with special characters.',
    },
    {
      name: 'Content-Encoding',
      type: HeaderType.StandardResponse,
      description: 'The type of encoding used on the data. See HTTP compression.',
    },
    {
      name: 'Content-Language',
      type: HeaderType.StandardResponse,
      description: 'The natural language or languages of the intended audience for the enclosed content',
    },
    {
      name: 'Content-Length',
      type: HeaderType.StandardResponse,
      description: 'The length of the response body in octets (8-bit bytes)',
    },
    {
      name: 'Content-Location',
      type: HeaderType.StandardResponse,
      description: 'An alternate location for the returned data',
    },
    {
      name: 'Content-MD5',
      type: HeaderType.StandardResponse,
      description: 'A Base64-encoded binary MD5 sum of the content of the response',
    },
    {
      name: 'Content-Range',
      type: HeaderType.StandardResponse,
      description: 'Where in a full body message this partial message belongs',
    },
    {
      name: 'Content-Type',
      type: HeaderType.StandardResponse,
      description: 'The MIME type of this content',
    },
    {
      name: 'Date',
      type: HeaderType.StandardResponse,
      description: 'The date and time that the message was sent (in "HTTP-date" format as defined by RFC 9110)',
    },
    {
      name: 'Delta-Base',
      type: HeaderType.StandardResponse,
      description: 'Specifies the delta-encoding entity tag of the response.',
    },
    {
      name: 'ETag',
      type: HeaderType.StandardResponse,
      description: 'An identifier for a specific version of a resource, often a message digest',
    },
    {
      name: 'Expires',
      type: HeaderType.StandardResponse,
      description:
        'Gives the date/time after which the response is considered stale (in "HTTP-date" format as defined by RFC 9110)',
    },
    {
      name: 'IM',
      type: HeaderType.StandardResponse,
      description: 'Instance-manipulations applied to the response.',
    },
    {
      name: 'Last-Modified',
      type: HeaderType.StandardResponse,
      description: 'The last modified date for the requested object (in "HTTP-date" format as defined by RFC 9110)',
    },
    {
      name: 'Link',
      type: HeaderType.StandardResponse,
      description:
        'Used to express a typed relationship with another resource, where the relation type is defined by RFC 5988',
    },
    {
      name: 'Location',
      type: HeaderType.StandardResponse,
      description: 'Used in redirection, or when a new resource has been created.',
    },
    {
      name: 'P3P',
      type: HeaderType.StandardResponse,
      description:
        'This field is supposed to set P3P policy, in the form of P3P:CP="your_compact_policy". However, P3P did not take off, most browsers have never fully implemented it, a lot of websites set this field with fake policy text, that was enough to fool browsers the existence of P3P policy and grant permissions for third party cookies.',
    },
    {
      name: 'Pragma',
      type: HeaderType.StandardResponse,
      description:
        'Implementation-specific fields that may have various effects anywhere along the request-response chain.',
    },
    {
      name: 'Preference-Applied',
      type: HeaderType.StandardResponse,
      description:
        'Indicates which Prefer tokens were honored by the server and applied to the processing of the request.',
    },
    {
      name: 'Proxy-Authenticate',
      type: HeaderType.StandardResponse,
      description: 'Request authentication to access the proxy.',
    },
    {
      name: 'Public-Key-Pins',
      type: HeaderType.StandardResponse,
      description: "HTTP Public Key Pinning, announces hash of website's authentic TLS certificate",
    },
    {
      name: 'Retry-After',
      type: HeaderType.StandardResponse,
      description:
        'If an entity is temporarily unavailable, this instructs the client to try again later. Value could be a specified period of time (in seconds) or a HTTP-date.',
    },
    {
      name: 'Server',
      type: HeaderType.StandardResponse,
      description: 'A name for the server',
    },
    {
      name: 'Set-Cookie',
      type: HeaderType.StandardResponse,
      description: 'An HTTP cookie',
    },
    {
      name: 'Strict-Transport-Security',
      type: HeaderType.StandardResponse,
      description:
        'A HSTS Policy informing the HTTP client how long to cache the HTTPS only policy and whether this applies to subdomains.',
    },
    {
      name: 'Trailer',
      type: HeaderType.StandardResponse,
      description:
        'The Trailer general field value indicates that the given set of header fields is present in the trailer of a message encoded with chunked transfer coding.',
    },
    {
      name: 'Transfer-Encoding',
      type: HeaderType.StandardResponse,
      description:
        'The form of encoding used to safely transfer the entity to the user. Currently defined methods are: chunked, compress, deflate, gzip, identity.\nMust not be used with HTTP/2.',
    },
    {
      name: 'Tk',
      type: HeaderType.StandardResponse,
      description:
        'Tracking Status header, value suggested to be sent in response to a DNT(do-not-track), possible values:\n"!" — under construction\n"?" — dynamic\n"G" — gateway to multiple parties\n"N" — not tracking\n"T" — tracking\n"C" — tracking with consent\n"P" — tracking only if consented\n"D" — disregarding DNT\n"U" — updated',
    },
    {
      name: 'Upgrade',
      type: HeaderType.StandardResponse,
      description: 'Ask the client to upgrade to another protocol.\nMust not be used in HTTP/2',
    },
    {
      name: 'Vary',
      type: HeaderType.StandardResponse,
      description:
        'Tells downstream proxies how to match future request headers to decide whether the cached response can be used rather than requesting a fresh one from the origin server.',
    },
    {
      name: 'Via',
      type: HeaderType.StandardResponse,
      description: 'Informs the client of proxies through which the response was sent.',
    },
    {
      name: 'Warning',
      type: HeaderType.StandardResponse,
      description: 'A general warning about possible problems with the entity body.',
    },
    {
      name: 'WWW-Authenticate',
      type: HeaderType.StandardResponse,
      description: 'Indicates the authentication scheme that should be used to access the requested entity.',
    },
    {
      name: 'X-Frame-Options',
      type: HeaderType.StandardResponse,
      description:
        'Clickjacking protection: deny - no rendering within a frame, sameorigin - no rendering if origin mismatch, allow-from - allow from specified location, allowall - non-standard, allow from any location',
    },
  ],
  CommonNonStandardResponseFields: [
    {
      name: 'Content-Security-Policy,X-Content-Security-Policy,X-WebKit-CSP',
      type: HeaderType.NonStandardResponse,
      description: 'Content Security Policy definition.',
    },
    {
      name: 'Expect-CT',
      type: HeaderType.NonStandardResponse,
      description: 'Notify to prefer to enforce Certificate Transparency.',
    },
    {
      name: 'NEL',
      type: HeaderType.NonStandardResponse,
      description: 'Used to configure network request logging.',
    },
    {
      name: 'Permissions-Policy',
      type: HeaderType.NonStandardResponse,
      description: 'To allow or disable different features or APIs of the browser.',
    },
    {
      name: 'Refresh',
      type: HeaderType.NonStandardResponse,
      description:
        'Used in redirection, or when a new resource has been created.  This refresh redirects after 5 seconds. Header extension introduced by Netscape and supported by most web browsers. Defined by HTML Standard',
    },
    {
      name: 'Report-To',
      type: HeaderType.NonStandardResponse,
      description: 'Instructs the user agent to store reporting endpoints for an origin.',
    },
    {
      name: 'Status',
      type: HeaderType.NonStandardResponse,
      description:
        'CGI header field specifying the status of the HTTP response. Normal HTTP responses use a separate "Status-Line" instead, defined by RFC 9110.',
    },
    {
      name: 'Timing-Allow-Origin',
      type: HeaderType.NonStandardResponse,
      description:
        'The Timing-Allow-Origin response header specifies origins that are allowed to see values of attributes retrieved via features of the Resource Timing API, which would otherwise be reported as zero due to cross-origin restrictions.',
    },
    {
      name: 'X-Content-Duration',
      type: HeaderType.NonStandardResponse,
      description:
        'Provide the duration of the audio or video in seconds. Not supported by current browsers – the header was only supported by Gecko browsers, from which support was removed in 2015.',
    },
    {
      name: 'X-Content-Type-Options',
      type: HeaderType.NonStandardResponse,
      description:
        'The only defined value, "nosniff", prevents Internet Explorer from MIME-sniffing a response away from the declared content-type. This also applies to Google Chrome, when downloading extensions.',
    },
    {
      name: 'X-Powered-By',
      type: HeaderType.NonStandardResponse,
      description:
        'Specifies the technology (e.g. ASP.NET, PHP, JBoss) supporting the web application (version details are often in X-Runtime, X-Version, or X-AspNet-Version)',
    },
    {
      name: 'X-Redirect-By',
      type: HeaderType.NonStandardResponse,
      description: 'Specifies the component that is responsible for a particular redirect.',
    },
    {
      name: 'X-Request-ID, X-Correlation-ID',
      type: HeaderType.NonStandardResponse,
      description: 'Correlates HTTP requests between a client and server.',
    },
    {
      name: 'X-UA-Compatible',
      type: HeaderType.NonStandardResponse,
      description:
        'Recommends the preferred rendering engine (often a backward-compatibility mode) to use to display the content. Also used to activate Chrome Frame in Internet Explorer. In HTML Standard, only the IE=edge value is defined.',
    },
    {
      name: 'X-XSS-Protection',
      type: HeaderType.NonStandardResponse,
      description: 'Cross-site scripting (XSS) filter',
    },
  ],
};

const AllHeaders: HeaderInfo[] = [
  ...HttpHeaderDetails.StandardRequestFields,
  ...HttpHeaderDetails.CommonNonStandardRequestFields,
  ...HttpHeaderDetails.StandardResponseFields,
  ...HttpHeaderDetails.CommonNonStandardResponseFields,
];

export interface HeaderInfo {
  name: string;
  type: HeaderType;
  description: string;
}

function findName(names: string, headerName: string): string {
  return (
    names
      .split(',')
      .map((n) => n.trim())
      .find((n) => n.toLowerCase() === headerName.toLowerCase()) ?? headerName
  );
}

export function getHeaderDetails(headerName: string): HeaderInfo {
  const header = AllHeaders.find((f) =>
    !f.name.includes(',')
      ? f.name.toLowerCase() === headerName.toLowerCase()
      : f.name
          .split(',')
          .map((n) => n.trim().toLowerCase())
          .includes(headerName.toLowerCase()),
  );

  if (!header) {
    return {
      name: headerName,
      type: HeaderType.Custom,
      description: 'Custom header',
    };
  }

  return {
    ...header,
    name: header.name.includes(',') ? findName(header.name, headerName) : header.name,
  };
}
