import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  FEATURED,
  LANG_COLOR,
  fetchProfile,
  fetchReleases,
  fetchRepos,
  isSignal,
  languageBreakdown,
} from "../lib/gh";
import type { Profile, Release, Repo } from "../lib/gh";
import ReleaseRow from "../components/releases/ReleaseRow";

const SORTS = [
  { key: "pushed", label: "Recently pushed" },
  { key: "stars", label: "Most starred" },
  { key: "created", label: "Newest first" },
  { key: "name", label: "Alphabetical" },
] as const;
type SortKey = (typeof SORTS)[number]["key"];

const PAGE_SIZE = 60;

interface LangChip {
  language: string | null;
  count: number;
}

export default function Releases() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("pushed");
  const [lang, setLang] = useState<string | null>(null);
  const [scope, setScope] = useState<"signal" | "all">("signal");
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [releases, setReleases] = useState<Record<string, Release[]>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [ready, setReady] = useState(false);

  const reposRef = useRef<Repo[]>([]);
  const loadedRef = useRef(new Set<string>());
  const inFlightRef = useRef(new Set<string>());

  const fetchFor = useCallback(async (name: string, quiet = false) => {
    if (loadedRef.current.has(name) || inFlightRef.current.has(name)) return;
    const owner = reposRef.current.find(r => r.name === name)?.owner || "Drew-Chase";
    inFlightRef.current.add(name);
    if (!quiet) setLoading(s => ({ ...s, [name]: true }));
    const rel = await fetchReleases(owner, name);
    loadedRef.current.add(name);
    inFlightRef.current.delete(name);
    setReleases(s => ({ ...s, [name]: rel }));
    if (!quiet) setLoading(s => ({ ...s, [name]: false }));
  }, []);

  useEffect(() => {
    let alive = true;
    void (async () => {
      void fetchProfile().then(p => { if (alive) setProfile(p); });
      const rs = await fetchRepos().catch(() => []);
      if (!alive) return;
      reposRef.current = rs;
      setRepos(rs);
      setReady(true);
      FEATURED.forEach((n, i) => { setTimeout(() => void fetchFor(n, true), i * 260); });
    })();
    return () => { alive = false; };
  }, [fetchFor]);

  const filtered = useMemo(() => {
    let list = repos.slice();
    if (scope === "signal") list = list.filter(isSignal);
    if (lang) list = list.filter(r => r.language === lang);
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        (r.language || "").toLowerCase().includes(q) ||
        r.topics.some(t => t.includes(q))
      );
    }
    list.sort((a, b) => {
      if (sort === "stars") return b.stars - a.stars || a.name.localeCompare(b.name);
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "created") return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      return new Date(b.pushed_at || 0).getTime() - new Date(a.pushed_at || 0).getTime();
    });
    return list;
  }, [repos, query, sort, lang, scope]);

  const shown = useMemo(() => filtered.slice(0, PAGE_SIZE), [filtered]);

  const langChips = useMemo<LangChip[]>(() => {
    const counts = languageBreakdown(repos.filter(isSignal)).slice(0, 10);
    const chips: LangChip[] = [{ language: null, count: repos.length }];
    return chips.concat(counts);
  }, [repos]);

  const loadVisible = () => {
    filtered.slice(0, 12).forEach((r, i) => { setTimeout(() => void fetchFor(r.name, true), i * 240); });
  };

  const toggle = (name: string) => {
    const willOpen = !open[name];
    setOpen(s => ({ ...s, [name]: willOpen }));
    if (willOpen) void fetchFor(name);
  };

  const relVals = Object.values(releases);
  const withRel = relVals.filter(v => v.length > 0).length;
  const totalVersions = relVals.reduce((n, v) => n + v.length, 0);
  const scopeLabel = scope === "signal"
    ? "Curated · hiding noise"
    : `Everything · ${profile?.public_repos || repos.length} repos`;
  const statusLine = ready ? `${repos.length} repos indexed` : "Indexing GitHub…";
  const resultLabel = ready
    ? `${filtered.length} project${filtered.length === 1 ? "" : "s"} shown`
    : "Loading…";
  const releaseLabel = withRel > 0
    ? `${withRel} with releases · ${totalVersions} versions scanned`
    : "Expand a project to load its versions";

  return (
    <div className="min-h-screen bg-base text-ink">
      <nav className="sticky top-0 z-50 flex items-center justify-between gap-[24px] p-[16px_34px] bg-[rgba(8,8,10,.9)] backdrop-blur-[10px] border-b border-white/8">
        <Link to="/" className="flex items-center gap-[12px] text-ink">
          <span className="font-mono text-[11px] tracking-[.18em] uppercase text-mute">← Drew Chase</span>
        </Link>
        <div className="flex items-center gap-[16px] font-mono text-[10px] tracking-[.16em] uppercase text-dim">
          <span>{statusLine}</span>
          <a href="https://github.com/Drew-Chase?tab=repositories" target="_blank" rel="noreferrer" className="text-mute hover:text-accent-hi">
            GitHub ↗
          </a>
        </div>
      </nav>

      <header className="p-[74px_34px_44px] border-b border-white/8">
        <div className="max-w-[1440px] mx-auto">
          <div className="font-mono text-[10px] tracking-[.26em] uppercase text-dim mb-[18px]">Index · Versions · Downloads</div>
          <h1 className="font-display font-normal text-[clamp(44px,6.6vw,104px)] leading-[.96] tracking-[-.025em] mb-[24px]">
            The whole<br /><span className="italic text-accent">paper trail.</span>
          </h1>
          <p className="max-w-[640px] text-[16px] leading-[1.66] text-[#a3a1a8] text-pretty">
            Every public repository, pulled live from GitHub. Expand a project to see its tagged versions, changelogs and downloadable build artifacts.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-[280px_minmax(0,1fr)] max-w-[1440px] mx-auto items-start">
        <aside className="sticky top-[61px] flex flex-col gap-[34px] border-r border-white/8 p-[34px_26px_60px_34px]">
          <div>
            <div className="font-mono text-[10px] tracking-[.2em] uppercase text-dim mb-[12px]">Search</div>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="name, topic, language…"
              className="w-full bg-panel border border-white/14 text-ink font-mono text-[12px] px-[12px] py-[11px] rounded-[2px] outline-none placeholder:text-faint focus:border-accent"
            />
          </div>

          <div>
            <div className="font-mono text-[10px] tracking-[.2em] uppercase text-dim mb-[12px]">Sort</div>
            <div className="flex flex-col gap-px bg-white/10 border border-white/10">
              {SORTS.map(s => {
                const on = sort === s.key;
                return (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => setSort(s.key)}
                    className={`text-left border-0 px-[13px] py-[11px] font-mono text-[10.5px] tracking-[.14em] uppercase cursor-pointer ${on ? "bg-accent/12 text-accent" : "bg-panel text-mute"}`}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="font-mono text-[10px] tracking-[.2em] uppercase text-dim mb-[12px]">Language</div>
            <div className="flex flex-wrap gap-[6px]">
              {langChips.map(c => {
                const on = lang === c.language;
                const col = c.language ? (LANG_COLOR[c.language] || "#8b8992") : "#ffb340";
                return (
                  <button
                    key={c.language ?? "all"}
                    type="button"
                    onClick={() => setLang(c.language)}
                    className="px-[10px] py-[6px] font-mono text-[10px] tracking-[.1em] uppercase rounded-[2px] cursor-pointer border"
                    style={{
                      background: on ? "rgba(255,255,255,.08)" : "transparent",
                      color: on ? col : "#8b8992",
                      borderColor: on ? col : "rgba(255,255,255,.12)",
                    }}
                  >
                    {c.language ? `${c.language} ${c.count}` : "All"}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="font-mono text-[10px] tracking-[.2em] uppercase text-dim mb-[12px]">Scope</div>
            <button
              type="button"
              onClick={() => setScope(s => (s === "signal" ? "all" : "signal"))}
              className="w-full text-left bg-panel border border-white/14 text-ink px-[12px] py-[11px] font-mono text-[10.5px] tracking-[.12em] uppercase rounded-[2px] cursor-pointer hover:border-accent"
            >
              {scopeLabel}
            </button>
            <div className="text-[11px] leading-[1.55] text-faint mt-[10px] font-mono">
              Forks, scratch repos and class assignments are hidden by default.
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={loadVisible}
              className="w-full bg-accent/10 border border-accent/40 text-accent py-[12px] font-mono text-[10.5px] tracking-[.14em] uppercase rounded-[2px] cursor-pointer hover:bg-accent/18"
            >
              Scan visible for releases
            </button>
            <div className="text-[11px] leading-[1.55] text-faint mt-[10px] font-mono">
              Release data loads on demand — the GitHub API allows 60 anonymous calls an hour.
            </div>
          </div>
        </aside>

        <main className="p-[34px_34px_100px_30px] min-w-0">
          <div className="flex items-baseline justify-between gap-[20px] flex-wrap mb-[20px] font-mono text-[10px] tracking-[.18em] uppercase text-dim">
            <span>{resultLabel}</span>
            <span>{releaseLabel}</span>
          </div>

          <div className="flex flex-col gap-px bg-white/8 border border-white/8">
            {shown.map((r, i) => (
              <ReleaseRow
                key={r.name}
                repo={r}
                index={i + 1}
                open={!!open[r.name]}
                loading={!!loading[r.name]}
                releases={releases[r.name]}
                onToggle={toggle}
              />
            ))}
          </div>

          {ready && filtered.length === 0 && (
            <div className="py-[70px] text-center font-mono text-[11px] tracking-[.18em] uppercase text-faint">
              Nothing matches that filter
            </div>
          )}
        </main>
      </div>

      <footer className="flex items-center justify-between gap-[24px] flex-wrap p-[28px_34px] border-t border-white/7 font-mono text-[10px] tracking-[.16em] uppercase text-faint">
        <span>© 2026 Drew Chase</span>
        <Link to="/" className="text-mute hover:text-accent">← Back to the front</Link>
      </footer>
    </div>
  );
}
