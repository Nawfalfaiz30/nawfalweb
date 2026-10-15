type ApiRequest = { method?: string };
type ApiResponse = { setHeader(name: string, value: string): void; status(code: number): ApiResponse; json(body: unknown): void };

export default async function handler(request: ApiRequest, response: ApiResponse) {
  response.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=3600");
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return response.status(405).json({ error: "Metode tidak didukung." });
  }
  try {
    const headers = { Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" };
    const [profileResponse, reposResponse] = await Promise.all([
      fetch(`https://api.github.com/users/${encodeURIComponent("NawfalFaiz30")}`, { headers, signal: AbortSignal.timeout(8000) }),
      fetch(`https://api.github.com/users/${encodeURIComponent("NawfalFaiz30")}/repos?sort=updated&per_page=100`, { headers, signal: AbortSignal.timeout(8000) }),
    ]);
    if (!profileResponse.ok || !reposResponse.ok) return response.status(profileResponse.status === 404 || reposResponse.status === 404 ? 404 : 502).json({ error: "Profil GitHub belum dapat dimuat." });
    const profile = await profileResponse.json() as Record<string, unknown>;
    const result = reposResponse;
    const repos = await result.json() as Array<Record<string, unknown>>;
    const selected = repos
      .filter((repo) => !repo.fork && !repo.archived)
      .sort((a, b) => Number(b.stargazers_count ?? 0) - Number(a.stargazers_count ?? 0))
      .slice(0, 6)
      .map(({ id, name, description, html_url, language, stargazers_count, updated_at }) => ({ id, name, description, html_url, language, stargazers_count, updated_at }));
    return response.status(200).json({ profile: { name: profile.name, bio: profile.bio, public_repos: profile.public_repos, followers: profile.followers, html_url: profile.html_url }, repos: selected });
  } catch {
    return response.status(502).json({ error: "Repositori GitHub belum dapat dimuat." });
  }
}
