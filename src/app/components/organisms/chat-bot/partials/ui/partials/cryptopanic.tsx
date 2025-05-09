// ui/partials/cryptoPanic.tsx
import React from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { z } from "zod";

// ——————————————————————————————————————————————————————————————————————————
// Types & Constants
// ——————————————————————————————————————————————————————————————————————————
const API_TOKEN = "a87d14078537c40c966c25a609668534cae6ffc8";
const BASE_URL = "https://cryptopanic.com/api/v1";

interface CryptoPanicPost {
  id: number;
  title: string;
  url: string;
  published_at: string;
  currencies: { code: string }[];
  domain: string;
  votes: { positive: number; negative: number; interesting: number };
  kind: "news" | "media";
}

// ——————————————————————————————————————————————————————————————————————————
// Shared Renderer
// ——————————————————————————————————————————————————————————————————————————
function PostsList({ posts }: { posts: CryptoPanicPost[] }) {
  if (!posts.length) {
    return (
      <div className="rounded-lg bg-muted/50 p-4 text-center text-sm text-muted-foreground">
        No posts found.
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-lg bg-muted/50 p-4">
      {posts.map((p) => (
        <div key={p.id} className="space-y-1 border-b border-gray-700 pb-2">
          <Link
            href={p.url}
            target="_blank"
            className="flex items-center justify-between hover:text-accent"
          >
            <span className="font-medium">{p.title}</span>
            <ExternalLink className="ml-2 h-4 w-4" />
          </Link>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span>{new Date(p.published_at).toLocaleString()}</span>
            <span>•</span>
            <span>{p.domain}</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>👍 {p.votes.positive}</span>
            <span>👎 {p.votes.negative}</span>
            <span>💡 {p.votes.interesting}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ——————————————————————————————————————————————————————————————————————————
// Tool Definitions
// ——————————————————————————————————————————————————————————————————————————
export const cryptoPanicTools = {
  // Latest public posts
  getCryptoPanicPosts: {
    displayName: "📰 Latest Crypto News",
    isCollapsible: true,
    isExpandedByDefault: false,
    description: "Fetch the latest public crypto news posts from CryptoPanic.",
    parameters: z.object({
      limit: z
        .number()
        .min(1)
        .max(50)
        .optional()
        .describe("Number of posts to fetch (max 50)"),
    }),
    execute: async ({ limit }: { limit?: number }) => {
      // default to 10 if undefined or invalid
      const safeLimit = Number.isInteger(limit) ? limit! : 10;
      const res = await fetch(`/api/cryptopanic/posts?limit=${safeLimit}`);
      if (!res.ok) throw new Error(res.statusText);
      const json = await res.json();
      const posts = (json.results as any[]).map((r) => ({
        id: r.id,
        title: r.title,
        url: r.url,
        published_at: r.published_at,
        currencies: r.currencies,
        domain: r.domain,
        votes: r.votes,
        kind: r.kind,
      })) as CryptoPanicPost[];
      return { suppressFollowUp: true, data: posts };
    },
    render: (raw: unknown) => {
      const posts = (raw as any).data as CryptoPanicPost[];
      return <PostsList posts={posts} />;
    },
  },

  // Rising/trending posts
  getCryptoPanicTrending: {
    displayName: "🚀 Trending Crypto News",
    isCollapsible: true,
    isExpandedByDefault: false,
    description:
      "Fetch the ‘rising’ trending crypto posts from CryptoPanic, optionally filtered by currency codes (comma‑separated).",
    parameters: z.object({
      limit: z
        .number()
        .min(1)
        .max(50)
        .optional()
        .describe("Number of posts to fetch (max 50)"),
      currencies: z
        .string()
        .optional()
        .describe("Comma‑separated currency codes (e.g. 'BTC,ETH')"),
    }),
    execute: async ({
      limit,
      currencies,
    }: {
      limit?: number;
      currencies?: string;
    }) => {
      const safeLimit = Number.isInteger(limit) ? limit! : 10;
      const params = new URLSearchParams({
        auth_token: API_TOKEN,
        public: "true",
        filter: "rising",
        limit: String(safeLimit),
      });
      if (currencies) params.set("currencies", currencies);

      const res = await fetch(`/api/cryptopanic/trending?${q.toString()}`);

      if (!res.ok) throw new Error(res.statusText);
      const json = await res.json();
      const posts = (json.results as any[]).map((r) => ({
        id: r.id,
        title: r.title,
        url: r.url,
        published_at: r.published_at,
        currencies: r.currencies,
        domain: r.domain,
        votes: r.votes,
        kind: r.kind,
      })) as CryptoPanicPost[];
      return { suppressFollowUp: true, data: posts };
    },
    render: (raw: unknown) => {
      const posts = (raw as any).data as CryptoPanicPost[];
      return <PostsList posts={posts} />;
    },
  },
};
