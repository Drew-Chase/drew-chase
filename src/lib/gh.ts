// GitHub data layer: fetch + localStorage cache. No auth (60 req/hr per IP), so
// everything is cached and every call degrades to a usable fallback.

const USER = "Drew-Chase";
const API = "https://api.github.com";
const NS = "dcgh_v1_";
const TTL = 1000 * 60 * 30;

export interface Repo {
  name: string;
  full_name: string;
  owner?: string;
  description: string;
  language?: string;
  stars: number;
  forks: number;
  size: number;
  fork: boolean;
  archived: boolean;
  topics: string[];
  homepage: string;
  url: string;
  pushed_at?: string;
  created_at?: string;
  license?: string;
}

export interface FeaturedRepo {
  index: string;
  title: string;
  name: string;
  description: string;
  language: string;
  langColor: string;
  stars: number | string;
  pushed: string;
  tags: string[];
  url: string;
}

export interface ActivityDay {
  date: string;
  day: number;
  commits: number;
  repos: string[];
}

export interface Activity {
  days: ActivityDay[];
  source: string;
  total: number;
}

export interface Profile {
  login: string;
  name?: string;
  avatar_url?: string;
  followers?: number;
  public_repos?: number;
}

export interface ReleaseAsset {
  name: string;
  size: number;
  downloads: number;
  url: string;
}

export interface Release {
  tag: string;
  name: string;
  body: string;
  published_at?: string;
  prerelease: boolean;
  url: string;
  assets: ReleaseAsset[];
  zip: string;
}

interface LangStat {
  language: string;
  count: number;
  bytes: number;
}

// repos that are forks-of-others / noise even though GitHub doesn't flag them
const DENY = new Set([
  "slint", "modrinth-code", "bruno", "wizarr", "parallel-disk-usage", "KodiAddonExodus",
]);
const DENY_RE = /(assignment|^lab-|-test$|^test|learning|_test$|template-bulider|^Minecraft$)/i;

function read(key: string): { v: unknown; stale: boolean } | null {
  try {
    const raw = localStorage.getItem(NS + key);
    if (!raw) return null;
    const { t, v } = JSON.parse(raw) as { t: number; v: unknown };
    if (Date.now() - t > TTL) return { v, stale: true };
    return { v, stale: false };
  } catch {
    return null;
  }
}

function write(key: string, v: unknown): void {
  try {
    localStorage.setItem(NS + key, JSON.stringify({ t: Date.now(), v }));
  } catch {
    /* storage full or unavailable */
  }
}

async function get<T>(path: string, key: string): Promise<T> {
  const hit = read(key);
  if (hit && !hit.stale) return hit.v as T;
  try {
    const res = await fetch(API + path, { headers: { Accept: "application/vnd.github+json" } });
    if (!res.ok) throw new Error(String(res.status));
    const json = (await res.json()) as T;
    write(key, json);
    return json;
  } catch (e) {
    if (hit) return hit.v as T; // stale beats nothing
    throw e;
  }
}

export const FEATURED = [
  "playarr", "quay-sftp", "mush", "obsidian-server-panel", "sievemc", "serde_hash",
];

export const SEED: Record<string, { title: string; language: string; description: string; tags: string[] }> = {
  playarr: {
    title: "Playarr", language: "Rust",
    description: "Self-hosted media dashboard unifying Plex, Sonarr, Radarr, TMDB and download clients.",
    tags: ["Rust", "React", "Self-hosted"],
  },
  "quay-sftp": {
    title: "Quay", language: "Rust",
    description: "Modern SFTP / FTP / cloud explorer with a built-in shell and code editor.",
    tags: ["Rust", "Iced", "Desktop"],
  },
  mush: {
    title: "Mush", language: "Rust",
    description: "Cross-platform shell interpreter — a drop-in replacement for PowerShell, BASH and ZSH.",
    tags: ["Rust", "Shell", "Cross-platform"],
  },
  "obsidian-server-panel": {
    title: "Obsidian", language: "Rust",
    description: "Minecraft server panel with Git-based backups and an async scheduler underneath.",
    tags: ["Rust", "React", "Minecraft"],
  },
  sievemc: {
    title: "SieveMC", language: "Rust",
    description: "Detects and filters Minecraft mod jars by side. Fabric, NeoForge and Forge.",
    tags: ["Rust", "CLI", "Tooling"],
  },
  serde_hash: {
    title: "serde_hash", language: "Rust",
    description: "HashIds wired into Serde — obfuscate numeric IDs without touching your structs.",
    tags: ["Rust", "Crate", "Serde"],
  },
};

export async function fetchProfile(): Promise<Profile> {
  try {
    return await get<Profile>(`/users/${USER}`, "profile");
  } catch {
    return { login: USER, name: "Drew Chase", followers: undefined, public_repos: 242 };
  }
}

interface RawRepo {
  name: string; full_name: string; owner?: { login: string }; description?: string;
  language?: string; stargazers_count?: number; forks_count?: number; size?: number;
  fork?: boolean; archived?: boolean; topics?: string[]; homepage?: string;
  html_url: string; pushed_at?: string; created_at?: string; license?: { spdx_id?: string };
}

function normalize(r: RawRepo): Repo {
  return {
    name: r.name,
    full_name: r.full_name,
    owner: r.owner?.login,
    description: r.description || "",
    language: r.language,
    stars: r.stargazers_count || 0,
    forks: r.forks_count || 0,
    size: r.size || 0,
    fork: !!r.fork,
    archived: !!r.archived,
    topics: r.topics || [],
    homepage: r.homepage || "",
    url: r.html_url,
    pushed_at: r.pushed_at,
    created_at: r.created_at,
    license: r.license?.spdx_id,
  };
}

export async function fetchRepos(): Promise<Repo[]> {
  const all: RawRepo[] = [];
  for (const p of [1, 2, 3]) {
    try {
      const chunk = await get<RawRepo[]>(`/users/${USER}/repos?sort=pushed&per_page=100&page=${p}`, `repos_${p}`);
      if (!Array.isArray(chunk)) break;
      all.push(...chunk);
      if (chunk.length < 100) break;
    } catch {
      break;
    }
  }
  return all.map(normalize);
}

// "real work" filter: no forks, has a description or stars, not obviously a scratch repo
export function isSignal(r: Repo): boolean {
  if (r.fork || DENY.has(r.name) || DENY_RE.test(r.name)) return false;
  if (r.stars >= 3) return true;
  return !!r.description && r.size > 60;
}

export function languageBreakdown(repos: Repo[]): LangStat[] {
  const m = new Map<string, LangStat>();
  for (const r of repos) {
    if (!r.language || r.fork) continue;
    const e = m.get(r.language) || { language: r.language, count: 0, bytes: 0 };
    e.count += 1;
    e.bytes += r.size;
    m.set(r.language, e);
  }
  return [...m.values()].sort((a, b) => b.count - a.count);
}

// Commit activity for the trailing 90 days from public events (real data, no auth).
export async function fetchActivity(): Promise<Activity> {
  const days = 91;
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const byDay = new Map<string, { commits: number; repos: Set<string> }>();
  let source = "events";
  try {
    const events: { type: string; created_at: string; payload?: { size?: number }; repo?: { name: string } }[] = [];
    for (const p of [1, 2, 3]) {
      const chunk = await get<typeof events>(`/users/${USER}/events/public?per_page=100&page=${p}`, `events_${p}`);
      if (!Array.isArray(chunk) || !chunk.length) break;
      events.push(...chunk);
      if (chunk.length < 100) break;
    }
    for (const ev of events) {
      if (ev.type !== "PushEvent") continue;
      const key = ev.created_at.slice(0, 10);
      const e = byDay.get(key) || { commits: 0, repos: new Set<string>() };
      e.commits += ev.payload?.size || 1;
      e.repos.add(ev.repo?.name || "");
      byDay.set(key, e);
    }
  } catch {
    source = "none";
  }

  const grid: ActivityDay[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today.getTime() - i * 86400000);
    const key = d.toISOString().slice(0, 10);
    const e = byDay.get(key);
    grid.push({
      date: key,
      day: d.getDay(),
      commits: e ? e.commits : 0,
      repos: e ? [...e.repos].map(s => (s || "").split("/")[1]).filter(Boolean) : [],
    });
  }
  return { days: grid, source, total: grid.reduce((s, d) => s + d.commits, 0) };
}

interface RawRelease {
  tag_name: string;
  name?: string;
  body?: string;
  published_at?: string;
  prerelease?: boolean;
  html_url: string;
  assets?: { name: string; size: number; download_count: number; browser_download_url: string }[];
}

export async function fetchReleases(owner: string, name: string): Promise<Release[]> {
  try {
    const rel = await get<RawRelease[]>(`/repos/${owner}/${name}/releases?per_page=20`, `rel_${owner}_${name}`);
    if (!Array.isArray(rel)) return [];
    return rel.map(r => ({
      tag: r.tag_name,
      name: r.name || r.tag_name,
      body: r.body || "",
      published_at: r.published_at,
      prerelease: !!r.prerelease,
      url: r.html_url,
      assets: (r.assets || []).map(a => ({
        name: a.name, size: a.size, downloads: a.download_count, url: a.browser_download_url,
      })),
      zip: `https://github.com/${owner}/${name}/archive/refs/tags/${r.tag_name}.zip`,
    }));
  } catch {
    return [];
  }
}

export function fmtBytes(n: number): string {
  if (!n) return "-";
  const u = ["B", "KB", "MB", "GB"];
  let i = 0;
  while (n >= 1024 && i < u.length - 1) {
    n /= 1024;
    i++;
  }
  return `${n < 10 && i > 0 ? n.toFixed(1) : Math.round(n)} ${u[i]}`;
}

export function fmtDate(s?: string): string {
  if (!s) return "-";
  return new Date(s).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function relTime(s?: string): string {
  if (!s) return "-";
  const d = (Date.now() - new Date(s).getTime()) / 86400000;
  if (d < 1) return "today";
  if (d < 2) return "yesterday";
  if (d < 30) return `${Math.round(d)}d ago`;
  if (d < 365) return `${Math.round(d / 30)}mo ago`;
  return `${(d / 365).toFixed(1)}y ago`;
}

export const LANG_COLOR: Record<string, string> = {
  Rust: "#ffb340", TypeScript: "#4fd8e8", JavaScript: "#f0d264", "C++": "#8b7fe8",
  "C#": "#b487f0", Java: "#e88b6a", PHP: "#7f8be8", Python: "#5ae0a0", C: "#a0a6b4",
  HTML: "#e86a5a", CSS: "#6a9ae8", Shell: "#9ae86a", Vue: "#5ae0a0", Kotlin: "#e0a05a",
  Blade: "#e05a7a", Dart: "#5ac8e0", Lua: "#5a7ae0", Batchfile: "#8a8a92",
};

export function langColor(language?: string): string {
  return (language && LANG_COLOR[language]) || "#57555e";
}

// Build the six featured cards, merging live repo data over the authored seed copy.
export function buildFeatured(repos: Repo[]): FeaturedRepo[] {
  const byName = new Map(repos.map(r => [r.name.toLowerCase(), r]));
  return FEATURED.map((n, i) => {
    const r = byName.get(n.toLowerCase());
    const s = SEED[n];
    const lang = r?.language || s.language;
    return {
      index: String(i + 1).padStart(2, "0"),
      title: s.title,
      name: n,
      description: r?.description || s.description,
      language: lang,
      langColor: LANG_COLOR[lang] || "#a3a1a8",
      stars: r ? r.stars : "—",
      pushed: r?.pushed_at ? relTime(r.pushed_at) : "—",
      tags: s.tags || (r?.topics || []).slice(0, 3),
      url: r?.url || `https://github.com/Drew-Chase/${n}`,
    };
  });
}
