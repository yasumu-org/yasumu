/**
 * Using variables in your Postman requests eliminates the need to duplicate requests, which can save a lot of time. Variables can be defined, and referenced to from any part of a request.
 */
export type Variable =
  | {
      [k: string]: unknown;
    }
  | {
      [k: string]: unknown;
    }
  | {
      [k: string]: unknown;
    };
/**
 * Collection variables allow you to define a set of variables, that are a *part of the collection*, as opposed to environments, which are separate entities.
 * *Note: Collection variables must not contain any sensitive information.*
 */
export type VariableList = Variable[];
/**
 * Postman allows you to configure scripts to run when specific events occur. These scripts are stored here, and can be referenced in the collection by their ID.
 */
export type EventList = Event[] | null;
/**
 * If object, contains the complete broken-down URL for this request. If string, contains the literal request URL.
 */
export type Url =
  | {
      /**
       * The string representation of the request URL, including the protocol, host, path, hash, query parameter(s) and path variable(s).
       */
      raw?: string;
      /**
       * The protocol associated with the request, E.g: 'http'
       */
      protocol?: string;
      host?: Host;
      path?:
        | string
        | (
            | string
            | {
                type?: string;
                value?: string;
                [k: string]: unknown;
              }
          )[];
      /**
       * The port number present in this URL. An empty value implies 80/443 depending on whether the protocol field contains http/https.
       */
      port?: string;
      /**
       * An array of QueryParams, which is basically the query string part of the URL, parsed into separate variables
       */
      query?: QueryParam[];
      /**
       * Contains the URL fragment (if any). Usually this is not transmitted over the network, but it could be useful to store this in some cases.
       */
      hash?: string;
      /**
       * Postman supports path variables with the syntax `/path/:variableName/to/somewhere`. These variables are stored in this field.
       */
      variable?: Variable[];
      [k: string]: unknown;
    }
  | string;
/**
 * The host for the URL, E.g: api.yourdomain.com. Can be stored as a string or as an array of strings.
 */
export type Host = string | string[];
/**
 * A Description can be a raw text, or be an object, which holds the description along with its format.
 */
export type Description = Description1 | string | null;
/**
 * The attributes for API Key Authentication
 */
export type APIKeyAuthentication = Auth1[];
/**
 * The attributes for [AWS Auth](http://docs.aws.amazon.com/AmazonS3/latest/dev/RESTAuthentication.html).
 */
export type AWSSignatureV4 = Auth1[];
/**
 * The attributes for [Basic Authentication](https://en.wikipedia.org/wiki/Basic_access_authentication).
 */
export type BasicAuthentication = Auth1[];
/**
 * The helper attributes for [Bearer Token Authentication](https://tools.ietf.org/html/rfc6750)
 */
export type BearerTokenAuthentication = Auth1[];
/**
 * The attributes for [Digest Authentication](https://en.wikipedia.org/wiki/Digest_access_authentication).
 */
export type DigestAuthentication = Auth1[];
/**
 * The attributes for [Akamai EdgeGrid Authentication](https://developer.akamai.com/legacy/introduction/Client_Auth.html).
 */
export type EdgeGridAuthentication = Auth1[];
/**
 * The attributes for [Hawk Authentication](https://github.com/hueniverse/hawk)
 */
export type HawkAuthentication = Auth1[];
/**
 * The attributes for [NTLM Authentication](https://msdn.microsoft.com/en-us/library/cc237488.aspx)
 */
export type NTLMAuthentication = Auth1[];
/**
 * The attributes for [OAuth2](https://oauth.net/1/)
 */
export type OAuth1 = Auth1[];
/**
 * Helper attributes for [OAuth2](https://oauth.net/2/)
 */
export type OAuth2 = Auth1[];
/**
 * A request represents an HTTP request.
 */
export type Request =
  | {
      [k: string]: unknown;
    }
  | {
      [k: string]: unknown;
    };

export interface PostmanCollection {
  /**
   * Every collection is identified by the unique value of this field. The value of this field is usually easiest to generate using a [UID](https://tools.ietf.org/html/rfc4122#section-4.4%29) generator function. If you already have a collection, it is recommended that you maintain the same id since changing the id usually implies that this is a different collection than it was originally.
   */
  id: string;
  /**
   * A collection's friendly name is defined by this field. You would want to set this field to a value that would allow you to easily identify this collection among a bunch of other collections, as such outlining its usage or content.
   */
  name: string;
  /**
   * Provide a long description of this collection using this field. This field supports markdown syntax to better format the description.
   */
  description?: string | null;
  variables?: VariableList | null;
  /**
   * The order array ensures that your requests and folders don't randomly get shuffled up. It holds a sequence of [UUIDs](https://en.wikipedia.org/wiki/Universally_unique_identifier) corresponding to folders and requests.
   *  *Note that if a folder ID or a request ID (if the request is not already part of a folder) is not included in the order array, the request or the folder will not show up in the collection.*
   */
  order: string[];
  /**
   * The folders order array ensures that your requests and folders don't randomly get shuffled up. It holds a sequence of [UUIDs](https://en.wikipedia.org/wiki/Universally_unique_identifier) corresponding to folders and requests.
   *  *Note that if a folder ID or a request ID (if the request is not already part of a folder) is not included in the order array, the request or the folder will not show up in the collection.*
   */
  folders_order?: string[];
  /**
   * Folders are the way to go if you want to group your requests and to keep things organised. Folders can also be useful in sequentially requesting a part of the entire collection by using [Postman Collection Runner](https://www.getpostman.com/docs/jetpacks_running_collections) or [Newman](https://github.com/postmanlabs/newman) on a particular folder.
   */
  folders?: Folder[];
  timestamp?: number;
  requests: Request[];
  events?: EventList;
  auth?: null | Auth;
  protocolProfileBehavior?: ProtocolProfileBehavior;
  [k: string]: unknown;
}
/**
 * One of the primary goals of Postman is to organize the development of APIs. To this end, it is necessary to be able to group requests together. This can be achived using 'Folders'. A folder just is an ordered set of requests.
 */
export interface Folder {
  /**
   * In order to be able to uniquely identify different folders within a collection, Postman assigns each folder a unique ID (a [UUID](https://en.wikipedia.org/wiki/Globally_unique_identifier)). This field contains that value.
   */
  id: string;
  /**
   * A folder's friendly name is defined by this field. You would want to set this field to a value that would allow you to easily identify this folder.
   */
  name: string;
  /**
   * Essays about the folder go into this field!
   */
  description: string;
  /**
   * Postman preserves the order of your requests within each folder. This field holds a sequence of [UUIDs](https://en.wikipedia.org/wiki/Globally_unique_identifier), where each ID corresponds to a particular Postman request.
   */
  order: string[];
  /**
   * Postman preserves the order of your folders within each folder. This field holds a sequence of [UUIDs](https://en.wikipedia.org/wiki/Globally_unique_identifier), where each ID corresponds to a particular collection folder.
   */
  folders_order?: string[];
  /**
   * Postman folders are always a part of a collection. That collection's unique ID (which is a [UUID](https://en.wikipedia.org/wiki/Globally_unique_identifier)) is stored in this field.
   */
  collection_id?: string;
  /**
   * Postman folders are always a part of a collection. That collection's unique ID (which is a [UUID](https://en.wikipedia.org/wiki/Globally_unique_identifier)) is stored in this field.
   */
  collection?: string;
  variables?: VariableList;
  events?: EventList;
  auth?: null | Auth;
  protocolProfileBehavior?: ProtocolProfileBehavior;
  [k: string]: unknown;
}
/**
 * Defines a script associated with an associated event name
 */
export interface Event {
  /**
   * A unique identifier for the enclosing event.
   */
  id?: string;
  /**
   * Can be set to `test` or `prerequest` for test scripts or pre-request scripts respectively.
   */
  listen: string;
  script?: Script;
  /**
   * Indicates whether the event is disabled. If absent, the event is assumed to be enabled.
   */
  disabled?: boolean;
  [k: string]: unknown;
}
/**
 * A script is a snippet of Javascript code that can be used to to perform setup or teardown operations on a particular response.
 */
export interface Script {
  /**
   * A unique, user defined identifier that can  be used to refer to this script from requests.
   */
  id?: string;
  /**
   * Type of the script. E.g: 'text/javascript'
   */
  type?: string;
  exec?: string[] | string;
  src?: Url;
  /**
   * Script name
   */
  name?: string;
  [k: string]: unknown;
}
export interface QueryParam {
  key?: string | null;
  value?: string | null;
  /**
   * If set to true, the current query parameter will not be sent with the request.
   */
  disabled?: boolean;
  description?: Description;
  [k: string]: unknown;
}
export interface Description1 {
  /**
   * The content of the description goes here, as a raw string.
   */
  content?: string;
  /**
   * Holds the mime type of the raw description content. E.g: 'text/markdown' or 'text/html'.
   * The type is used to correctly render the description when generating documentation, or in the Postman app.
   */
  type?: string;
  /**
   * Description can have versions associated with it, which should be put in this property.
   */
  version?: {
    [k: string]: unknown;
  };
  [k: string]: unknown;
}
/**
 * Represents authentication helpers provided by Postman
 */
export interface Auth {
  type:
    | 'apikey'
    | 'awsv4'
    | 'basic'
    | 'bearer'
    | 'digest'
    | 'edgegrid'
    | 'hawk'
    | 'noauth'
    | 'oauth1'
    | 'oauth2'
    | 'ntlm';
  noauth?: unknown;
  apikey?: APIKeyAuthentication;
  awsv4?: AWSSignatureV4;
  basic?: BasicAuthentication;
  bearer?: BearerTokenAuthentication;
  digest?: DigestAuthentication;
  edgegrid?: EdgeGridAuthentication;
  hawk?: HawkAuthentication;
  ntlm?: NTLMAuthentication;
  oauth1?: OAuth1;
  oauth2?: OAuth2;
  [k: string]: unknown;
}
/**
 * Represents an attribute for any authorization method provided by Postman. For example `username` and `password` are set as auth attributes for Basic Authentication method.
 */
export interface Auth1 {
  key: string;
  value?: unknown;
  type?: string;
  [k: string]: unknown;
}
/**
 * Set of configurations used to alter the usual behavior of sending the request
 */
export interface ProtocolProfileBehavior {
  [k: string]: unknown;
}
