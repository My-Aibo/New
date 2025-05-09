let tokenListCache: any[] | null = null;

export async function loadSolanaTokenList(): Promise<any[]> {
  if (tokenListCache) return tokenListCache;

  const res = await fetch(
    "https://cdn.jsdelivr.net/gh/solana-labs/token-list@main/src/tokens/solana.tokenlist.json"
  );
  const data = await res.json();
  tokenListCache = data.tokens;
  return tokenListCache;
}

// ✅ Known big token symbols to search ONLY in Solana list
const SOLANA_ONLY_SYMBOLS = ["SOL"];

export async function findTokenByNameOrAddress(
  query: string
): Promise<any | null> {
  if (!query) return null;

  const normalized = query.trim().toUpperCase();

  const shouldUseSolanaList = SOLANA_ONLY_SYMBOLS.includes(normalized);

  if (shouldUseSolanaList) {
    const tokens = await loadSolanaTokenList();

    // Direct match on mint address
    const byAddress = tokens.find((t) => t.address === query);
    if (byAddress) return byAddress;

    // Exact symbol match
    const bySymbol = tokens.find((t) => t.symbol.toUpperCase() === normalized);
    if (bySymbol) return bySymbol;

    // Name includes match
    const byName = tokens.find((t) =>
      t.name?.toLowerCase().includes(normalized.toLowerCase())
    );
    if (byName) return byName;

    return null; // nothing found in Solana list
  }

  // 👇 DexScreener fallback for other coins
  try {
    const res = await fetch(
      `https://api.dexscreener.com/latest/dex/search?q=${encodeURIComponent(
        query
      )}`
    );

    if (!res.ok) {
      console.error("DexScreener API error:", await res.text());
      return null;
    }

    const data = await res.json();

    if (data.pairs?.length > 0) {
      const pair = data.pairs[0];
      const token = pair.baseToken;

      return {
        address: token.address,
        symbol: token.symbol,
        name: token.name,
        logoURI: pair?.info?.imageUrl || null,
        pairAddress: pair.pairAddress,
        dexId: pair.dexId,
        priceUsd: pair.priceUsd,
      };
    }

    return null;
  } catch (err) {
    console.error("DexScreener token lookup failed:", err);
    return null;
  }
}

export async function resolveMintParam(params: any): Promise<any | null> {
  if (typeof params?.mint === "string") return { address: params.mint };
  if (typeof params?.tokenAddress === "string")
    return { address: params.tokenAddress };

  if (typeof params?.symbol === "string") {
    const token = await findTokenByNameOrAddress(params.symbol.trim());
    return token ? { address: token.address, symbol: token.symbol } : null;
  }

  return null;
}
