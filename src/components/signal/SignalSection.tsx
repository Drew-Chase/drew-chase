import { isSignal, languageBreakdown, type Activity, type Profile, type Repo } from "../../lib/gh";
import LanguageRadial from "./LanguageRadial";
import ActivityChart from "./ActivityChart";

export default function SignalSection({
  repos,
  activity,
  profile,
}: {
  repos: Repo[];
  activity: Activity | null;
  profile: Profile | null;
}) {
  const signal = repos.filter(isSignal);
  const stars = repos.reduce((s, r) => s + r.stars, 0);
  const stats = [
    { value: String(profile?.public_repos || repos.length || "—"), label: "Public repositories" },
    { value: String(signal.length), label: "Substantive projects" },
    { value: String(languageBreakdown(signal).length), label: "Languages shipped" },
    { value: repos.length ? String(stars) : "—", label: "Stars earned" },
  ];

  return (
    <section
      id="signal"
      data-panel="Signal"
      className="relative min-h-screen snap-start overflow-hidden p-[120px_34px]"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-[40px] right-[26px] font-display text-[min(26vw,380px)] leading-[.74] text-white/[.025] select-none"
      >
        02
      </span>
      <div data-stage="1" className="relative mx-auto max-w-[1360px]">
        <div className="mb-[18px] font-mono text-[10px] tracking-[.26em] uppercase text-dim">02 — Signal</div>
        <h2 className="m-0 mb-[14px] font-display font-normal text-[length:clamp(38px,4.6vw,76px)] leading-none tracking-[-.02em]">
          Ten years of output,
          <br />
          <i className="text-signal">measured.</i>
        </h2>
        <p className="m-0 mb-[58px] max-w-[560px] text-[15px] leading-[1.65] text-mute">
          Pulled live from the GitHub API. Nothing here is hand-written — if I push tonight, this page changes
          tomorrow.
        </p>

        <div className="mb-px grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-px border border-white/8 bg-white/8">
          {stats.map(s => (
            <div key={s.label} className="bg-panel p-[30px]">
              <div className="font-display text-[58px] leading-none tracking-[-.02em] text-ink">{s.value}</div>
              <div className="mt-[14px] font-mono text-[10px] tracking-[.2em] uppercase text-dim">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] gap-px border border-white/8 bg-white/8">
          <div className="min-w-0 bg-panel p-[34px_30px_20px]">
            <div className="mb-[8px] flex items-baseline justify-between gap-5">
              <h3 className="m-0 font-mono text-[11px] font-medium tracking-[.2em] uppercase text-ink">
                Language distribution
              </h3>
              <span className="font-mono text-[10px] tracking-[.14em] uppercase text-dim">by repo count</span>
            </div>
            <LanguageRadial repos={repos} />
          </div>
          <div className="min-w-0 bg-panel p-[34px_30px_20px]">
            <div className="mb-[8px] flex items-baseline justify-between gap-5">
              <h3 className="m-0 font-mono text-[11px] font-medium tracking-[.2em] uppercase text-ink">
                Commit activity
              </h3>
              <span className="font-mono text-[10px] tracking-[.14em] uppercase text-dim">trailing 90 days</span>
            </div>
            <ActivityChart activity={activity} />
          </div>
        </div>
      </div>
    </section>
  );
}
