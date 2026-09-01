import { LANG_COLOR, fmtBytes, fmtDate, relTime } from "../../lib/gh";
import type { Release, Repo } from "../../lib/gh";

function md(src: string): string {
  if (!src || !src.trim()) return '<p style="color:#4a484e">No changelog was written for this release.</p>';
  const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const inline = (s: string) => esc(s)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\[([^\]]+)\]\((https?:[^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
    .replace(/(^|\s)(https?:\/\/[^\s<]+)/g, '$1<a href="$2" target="_blank" rel="noopener">$2</a>')
    .replace(/@([a-z0-9-]{2,})/gi, '<span style="color:#7d7a80">@$1</span>');
  const lines = src.replace(/\r/g, "").split("\n").slice(0, 90);
  let out = "";
  let inList = false;
  const closeList = () => { if (inList) { out += "</ul>"; inList = false; } };
  for (const raw of lines) {
    const l = raw.trim();
    if (!l) { closeList(); continue; }
    const h = l.match(/^(#{1,4})\s+(.*)$/);
    if (h) { closeList(); out += `<h3>${inline(h[2])}</h3>`; continue; }
    const li = l.match(/^([-*+]|\d+\.)\s+(.*)$/);
    if (li) { if (!inList) { out += "<ul>"; inList = true; } out += `<li>${inline(li[2])}</li>`; continue; }
    if (/^(-{3,}|={3,})$/.test(l)) { closeList(); continue; }
    closeList();
    out += `<p>${inline(l)}</p>`;
  }
  closeList();
  return out;
}

const actionLink = "text-ink border border-white/16 px-[13px] py-[8px] rounded-[2px] hover:border-accent hover:text-accent";

interface ReleaseRowProps {
  repo: Repo;
  index: number;
  open: boolean;
  loading: boolean;
  releases?: Release[];
  onToggle: (name: string) => void;
}

export default function ReleaseRow({ repo, index, open, loading, releases, onToggle }: ReleaseRowProps) {
  const rel = releases;
  const langCol = (repo.language && LANG_COLOR[repo.language]) || "#4a484e";
  const meta = [repo.license, `${repo.forks} forks`, `created ${fmtDate(repo.created_at)}`].filter(Boolean).join(" · ");
  return (
    <div className="bg-panel">
      <div
        onClick={() => onToggle(repo.name)}
        className="grid grid-cols-[minmax(0,1fr)_auto] gap-[26px] items-start p-[24px_26px] cursor-pointer hover:bg-panel-2"
      >
        <div className="min-w-0">
          <div className="flex items-baseline gap-[12px] flex-wrap mb-[9px]">
            <span className="font-mono text-[10px] text-faint tracking-[.1em]">{String(index).padStart(3, "0")}</span>
            <h2 className={`font-display font-extrabold text-[28px] leading-none tracking-[-.03em] uppercase ${open ? "text-accent" : "text-ink"}`}>
              {repo.name}
            </h2>
            {rel && rel.length > 0 && (
              <span className="font-mono text-[9.5px] tracking-[.14em] uppercase text-base bg-accent px-[8px] py-[4px] rounded-[2px]">
                {rel.length} version{rel.length === 1 ? "" : "s"}
              </span>
            )}
            {repo.archived && (
              <span className="font-mono text-[9.5px] tracking-[.14em] uppercase text-mute border border-white/16 px-[7px] py-[3px] rounded-[2px]">
                Archived
              </span>
            )}
          </div>
          <p className="text-[14px] leading-[1.6] text-mute max-w-[760px] text-pretty">{repo.description || "—"}</p>
        </div>
        <div className="flex items-center gap-[22px] font-mono text-[10.5px] tracking-[.1em] text-dim whitespace-nowrap">
          <span className="flex items-center gap-[7px]" style={{ color: langCol }}>
            <span className="w-[7px] h-[7px] rounded-full" style={{ background: langCol }} />
            {repo.language || "—"}
          </span>
          <span>★ {repo.stars}</span>
          <span>{relTime(repo.pushed_at)}</span>
          <span className="text-[14px]" style={{ color: open ? "#d8fb3c" : "#4a484e" }}>{open ? "–" : "+"}</span>
        </div>
      </div>
      {open && (
        <div
          className="border-t border-white/8 bg-base-2 p-[26px_26px_30px]"
          style={{ animation: "riseIn .4s cubic-bezier(.16,1,.3,1) both" }}
        >
          <div className="flex items-center gap-[14px] flex-wrap mb-[24px] font-mono text-[10px] tracking-[.16em] uppercase">
            <a href={repo.url} target="_blank" rel="noreferrer" className={actionLink}>Repository ↗</a>
            {repo.homepage && <a href={repo.homepage} target="_blank" rel="noreferrer" className={actionLink}>Live site ↗</a>}
            <a href={`${repo.url}/archive/refs/heads/HEAD.zip`} className={actionLink}>Source ↓</a>
            <span className="text-faint">{meta}</span>
          </div>

          {loading && (
            <div className="flex items-center gap-[12px] font-mono text-[11px] tracking-[.14em] uppercase text-dim py-[14px]">
              <span
                className="w-[11px] h-[11px] border-[1.5px] border-[rgba(216,251,60,.3)] border-t-accent rounded-full"
                style={{ animation: "spin .8s linear infinite" }}
              />
              Fetching releases…
            </div>
          )}

          {rel && rel.length === 0 && (
            <div className="font-mono text-[11.5px] leading-[1.6] text-faint border-l border-white/12 pl-[16px] py-[4px]">
              No tagged releases — this one ships from source.
            </div>
          )}

          {rel && rel.length > 0 && (
            <div className="flex flex-col gap-px bg-white/7 border border-white/7">
              {rel.map((v, vi) => {
                const total = v.assets.reduce((n, a) => n + a.downloads, 0);
                const assets = v.assets.length
                  ? v.assets
                  : [{ name: `${repo.name}-${v.tag}-source.zip`, size: 0, downloads: 0, url: v.zip }];
                return (
                  <div key={`${vi}-${v.tag}`} className="bg-panel grid grid-cols-[210px_minmax(0,1fr)]">
                    <div className="p-[24px] border-r border-white/7">
                      <div className="flex items-baseline gap-[9px] flex-wrap mb-[12px]">
                        <span className="font-mono text-[17px] font-medium" style={{ color: vi === 0 ? "#d8fb3c" : "#f4f2ed" }}>{v.tag}</span>
                        {v.prerelease && (
                          <span className="font-mono text-[9px] tracking-[.14em] uppercase text-hot border border-hot/40 px-[6px] py-[3px] rounded-[2px]">Pre</span>
                        )}
                        {vi === 0 && !v.prerelease && (
                          <span className="font-mono text-[9px] tracking-[.14em] uppercase text-base bg-signal px-[6px] py-[3px] rounded-[2px]">Latest</span>
                        )}
                      </div>
                      <div className="font-mono text-[10px] tracking-[.12em] uppercase text-dim leading-[1.9]">
                        <div>{fmtDate(v.published_at)}</div>
                        <div>{v.assets.length ? `${total} downloads` : "source only"}</div>
                      </div>
                      <a
                        href={v.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block mt-[14px] font-mono text-[10px] tracking-[.12em] uppercase text-mute border-b border-white/20 hover:text-accent hover:border-accent"
                      >
                        On GitHub ↗
                      </a>
                    </div>
                    <div className="p-[24px] min-w-0">
                      <div className="font-mono text-[9.5px] tracking-[.2em] uppercase text-faint mb-[14px]">Changelog</div>
                      <div
                        className="cl text-[13.5px] leading-[1.68] text-[#b6b4bb] max-w-[780px] mb-[22px]"
                        dangerouslySetInnerHTML={{ __html: md(v.body) }}
                      />
                      <div className="font-mono text-[9.5px] tracking-[.2em] uppercase text-faint mb-[12px]">Downloads</div>
                      <div className="flex flex-col gap-px bg-white/7 border border-white/7">
                        {assets.map((a, ai) => (
                          <a
                            key={`${ai}-${a.name}`}
                            href={a.url}
                            className="grid grid-cols-[minmax(0,1fr)_auto_auto] gap-[20px] items-center bg-panel-3 px-[16px] py-[13px] font-mono text-[11.5px] text-[#c9c7ce] hover:bg-panel-4 hover:text-accent"
                          >
                            <span className="overflow-hidden text-ellipsis whitespace-nowrap">{a.name}</span>
                            <span className="text-dim text-[10px] tracking-[.1em]">{a.size ? fmtBytes(a.size) : "source"}</span>
                            <span className="text-dim text-[10px] tracking-[.1em]">↓ {a.downloads}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
