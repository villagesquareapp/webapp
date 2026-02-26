import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const PROXY_ROUTE = "/api/media-proxy";
const HLS_CONTENT_TYPE = "application/vnd.apple.mpegurl";
const HLS_MIME = "application/x-mpegURL";

const allowedHostsFromEnv = (process.env.MEDIA_PROXY_ALLOWED_HOSTS || "")
  .split(",")
  .map((host) => host.trim().toLowerCase())
  .filter(Boolean);

const explicitAllowedHosts = new Set<string>([
  "cdn-assets.villagesquare.io",
  ...allowedHostsFromEnv,
]);

const isAllowedHost = (hostname: string) => {
  const normalized = hostname.toLowerCase();

  if (explicitAllowedHosts.has(normalized)) return true;
  if (normalized === "villagesquare.io") return true;
  if (normalized.endsWith(".villagesquare.io")) return true;

  return false;
};

const buildProxyUrl = (absoluteUrl: string) =>
  `${PROXY_ROUTE}?url=${encodeURIComponent(absoluteUrl)}`;

const rewritePlaylist = (playlistText: string, baseUrl: URL) =>
  playlistText
    .split(/\r?\n/)
    .map((line) => {
      const trimmed = line.trim();
      if (!trimmed) return line;

      if (trimmed.startsWith("#")) {
        if (!trimmed.includes('URI="')) return line;

        return line.replace(/URI="([^"]+)"/g, (_match, uri: string) => {
          const absolute = new URL(uri, baseUrl).toString();
          return `URI="${buildProxyUrl(absolute)}"`;
        });
      }

      const absolute = new URL(trimmed, baseUrl).toString();
      return buildProxyUrl(absolute);
    })
    .join("\n");

const copyHeaderIfPresent = (
  target: Headers,
  source: Headers,
  headerName: string
) => {
  const value = source.get(headerName);
  if (value) target.set(headerName, value);
};

const handleProxyRequest = async (request: NextRequest, method: "GET" | "HEAD") => {
  const targetParam = request.nextUrl.searchParams.get("url");

  if (!targetParam) {
    return NextResponse.json(
      { status: false, message: "Missing `url` query parameter." },
      { status: 400 }
    );
  }

  let targetUrl: URL;
  try {
    targetUrl = new URL(targetParam);
  } catch {
    return NextResponse.json(
      { status: false, message: "Invalid `url` query parameter." },
      { status: 400 }
    );
  }

  if (!["http:", "https:"].includes(targetUrl.protocol)) {
    return NextResponse.json(
      { status: false, message: "Only HTTP(S) targets are allowed." },
      { status: 400 }
    );
  }

  if (!isAllowedHost(targetUrl.hostname)) {
    return NextResponse.json(
      {
        status: false,
        message: `Host \`${targetUrl.hostname}\` is not allowed by media proxy.`,
      },
      { status: 403 }
    );
  }

  const upstreamHeaders = new Headers();
  const rangeHeader = request.headers.get("range");
  if (rangeHeader) {
    upstreamHeaders.set("Range", rangeHeader);
  }

  const upstreamResponse = await fetch(targetUrl.toString(), {
    method,
    headers: upstreamHeaders,
    cache: "no-store",
    redirect: "follow",
  });

  const responseHeaders = new Headers();
  copyHeaderIfPresent(responseHeaders, upstreamResponse.headers, "content-type");
  copyHeaderIfPresent(responseHeaders, upstreamResponse.headers, "content-length");
  copyHeaderIfPresent(responseHeaders, upstreamResponse.headers, "content-range");
  copyHeaderIfPresent(responseHeaders, upstreamResponse.headers, "accept-ranges");
  copyHeaderIfPresent(responseHeaders, upstreamResponse.headers, "cache-control");
  copyHeaderIfPresent(responseHeaders, upstreamResponse.headers, "etag");
  copyHeaderIfPresent(responseHeaders, upstreamResponse.headers, "last-modified");

  // Keep media readable in-browser regardless of upstream origin policy.
  responseHeaders.set("Access-Control-Allow-Origin", "*");
  responseHeaders.set("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
  responseHeaders.set("Access-Control-Allow-Headers", "Range, Origin, Accept");
  responseHeaders.set(
    "Access-Control-Expose-Headers",
    "Content-Length, Content-Range, Accept-Ranges"
  );

  if (method === "HEAD") {
    return new NextResponse(null, {
      status: upstreamResponse.status,
      headers: responseHeaders,
    });
  }

  const contentType = upstreamResponse.headers.get("content-type") || "";
  const isPlaylist =
    targetUrl.pathname.endsWith(".m3u8") ||
    contentType.includes(HLS_CONTENT_TYPE) ||
    contentType.includes(HLS_MIME);

  if (isPlaylist) {
    const playlistText = await upstreamResponse.text();
    const rewritten = rewritePlaylist(playlistText, targetUrl);

    responseHeaders.set("content-type", `${HLS_CONTENT_TYPE}; charset=utf-8`);
    return new NextResponse(rewritten, {
      status: upstreamResponse.status,
      headers: responseHeaders,
    });
  }

  return new NextResponse(upstreamResponse.body, {
    status: upstreamResponse.status,
    headers: responseHeaders,
  });
};

export async function GET(request: NextRequest) {
  return handleProxyRequest(request, "GET");
}

export async function HEAD(request: NextRequest) {
  return handleProxyRequest(request, "HEAD");
}
