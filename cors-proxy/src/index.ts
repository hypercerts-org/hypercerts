/**
 * Constants
 */
// The endpoint you want the CORS reverse proxy to be on
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
  "Access-Control-Max-Age": "86400",
};

const QUERYSTRING_KEY = "url";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Env {
  // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
  // MY_KV_NAMESPACE: KVNamespace;
  //
  // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
  // MY_DURABLE_OBJECT: DurableObjectNamespace;
  //
  // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
  // MY_BUCKET: R2Bucket;
}

export default {
  async fetch(
    request: Request,
    _env: Env,
    _ctx: ExecutionContext,
  ): Promise<Response> {
    async function handleOptions(request: Request) {
      if (
        request.headers.get("Origin") !== null &&
        request.headers.get("Access-Control-Request-Method") !== null &&
        request.headers.get("Access-Control-Request-Headers") !== null
      ) {
        // Handle CORS preflight requests.
        const allowControlRequestHeaders = request.headers.get(
          "Access-Control-Request-Headers",
        );
        return new Response(null, {
          headers: {
            ...CORS_HEADERS,
            ...(allowControlRequestHeaders
              ? {
                  "Access-Control-Allow-Headers": allowControlRequestHeaders,
                }
              : {}),
          },
        });
      } else {
        // Handle standard OPTIONS request.
        return new Response(null, {
          headers: {
            Allow: "GET, HEAD, POST, OPTIONS",
          },
        });
      }
    }

    async function handleRequest(request: Request) {
      const url = new URL(request.url);
      const apiUrl = url.searchParams.get(QUERYSTRING_KEY);

      if (apiUrl == null) {
        return new Response(`Missing GET parameter: ${QUERYSTRING_KEY}`, {
          status: 400,
          statusText: `Bad Request: ${QUERYSTRING_KEY} param undefined`,
        });
      }

      // Rewrite request to point to API URL. This also makes the request mutable
      // so you can add the correct Origin header to make the API server think
      // that this request is not cross-site.
      request = new Request(apiUrl, request);
      request.headers.set("Origin", new URL(apiUrl).origin);
      let response = await fetch(request);
      // Recreate the response so you can modify the headers
      response = new Response(response.body, response);
      // Set CORS headers
      //response.headers.set('Access-Control-Allow-Origin', url.origin);
      response.headers.set("Access-Control-Allow-Origin", "*");
      // Append to/Add Vary header so browser will cache response correctly
      response.headers.append("Vary", "Origin");
      return response;
    }

    if (request.method === "OPTIONS") {
      // Handle CORS preflight requests
      return handleOptions(request);
    } else if (
      request.method === "GET" ||
      request.method === "HEAD" ||
      request.method === "POST"
    ) {
      // Handle requests to the API server
      return handleRequest(request);
    } else {
      return new Response(null, {
        status: 405,
        statusText: "Method Not Allowed",
      });
    }
  },
};
