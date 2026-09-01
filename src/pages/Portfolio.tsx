import {useEffect, useMemo, useRef, useState} from "react";
import Nav from "../components/chrome/Nav.tsx";
import SectionRail from "../components/chrome/SectionRail.tsx";
import Footer from "../components/chrome/Footer.tsx";
import Hero from "../components/hero/Hero.tsx";
import WorkSection from "../components/work/WorkSection.tsx";
import SignalSection from "../components/signal/SignalSection.tsx";
import StackSection from "../components/sections/StackSection.tsx";
import AboutSection from "../components/sections/AboutSection.tsx";
import ContactSection from "../components/sections/ContactSection.tsx";
import {usePanels} from "../hooks/panels.ts";
import * as gh from "../lib/gh.ts";
import type {Activity, Profile, Repo} from "../lib/gh.ts";

const SECTIONS = [
    {id: "top", label: "Intro"},
    {id: "work", label: "Work"},
    {id: "signal", label: "Signal"},
    {id: "stack", label: "Stack"},
    {id: "about", label: "About"},
    {id: "contact", label: "Contact"},
] as const;

const SECTION_IDS = SECTIONS.map(s => s.id);

export default function Portfolio() {
    const [repos, setRepos] = useState<Repo[]>([]);
    const [activity, setActivity] = useState<Activity | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const {progressRef, active} = usePanels(SECTION_IDS);
    const loaded = useRef(false);

    useEffect(() => {
        if (loaded.current) return;
        loaded.current = true;
        void gh.fetchRepos().then(setRepos).catch(() => undefined);
        void gh.fetchActivity().then(setActivity).catch(() => undefined);
        void gh.fetchProfile().then(setProfile).catch(() => undefined);
    }, []);

    const years = useMemo(() => {
        const dates = repos.map(r => r.created_at).filter(Boolean).map(d => new Date(d as string).getTime());
        if (!dates.length) return null;
        const oldest = Math.min(...dates);
        return Math.max(1, Math.round((Date.now() - oldest) / 31557600000));
    }, [repos]);

    const note = repos.length ? "Live from the GitHub API" : "Fetching from GitHub…";

    return (
        <div className="relative min-h-screen bg-base text-ink">
            <div className="noise-overlay" aria-hidden="true"/>
            <Nav progressRef={progressRef}/>
            <SectionRail sections={SECTIONS} active={active}/>

            <Hero repos={repos}/>
            <WorkSection repos={repos} profile={profile}/>
            <SignalSection repos={repos} activity={activity} profile={profile}/>
            <StackSection/>
            <AboutSection years={years ?? "—"}/>
            <ContactSection/>
            <Footer note={note}/>
        </div>
    );
}
