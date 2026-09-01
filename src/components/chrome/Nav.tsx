import {useEffect, useState, type RefObject} from "react";
import {useNavigate} from "react-router-dom";
import {Button} from "@heroui/react";

const LINKS = [
    {href: "#work", label: "Work"},
    {href: "#signal", label: "Signal"},
    {href: "#stack", label: "Stack"},
    {href: "#about", label: "About"},
];

function useClock(): string {
    const [now, setNow] = useState(() => new Date());
    useEffect(() => {
        const id = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(id);
    }, []);
    return now.toLocaleTimeString("en-US", {hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false, timeZone: "America/New_York"}) + " EST";
}

export default function Nav({progressRef}: {progressRef: RefObject<HTMLDivElement | null>}) {
    const navigate = useNavigate();
    const clock = useClock();
    return (
        <>
            <div className="fixed top-0 inset-x-0 h-[2px] z-[85] bg-white/6">
                <div ref={progressRef} className="h-full w-0 bg-accent"/>
            </div>
            <nav className="fixed top-0 inset-x-0 z-[80] grid grid-cols-[1fr_auto_1fr] items-center gap-[20px] p-[20px_30px] bg-[linear-gradient(180deg,rgba(10,10,11,.95),rgba(10,10,11,0))] backdrop-blur-[4px]">
                <a href="#top" className="justify-self-start flex items-center gap-[10px] text-ink whitespace-nowrap">
                    <span className="size-[9px] rounded-full bg-accent"/>
                    <span className="font-display font-extrabold text-[15px] tracking-[-.01em] uppercase">Drew Chase</span>
                </a>
                <div className="hidden md:flex items-center gap-[3px] justify-self-center font-mono text-[10px] tracking-[.18em] uppercase">
                    {LINKS.map(l => (
                        <a key={l.href} href={l.href} data-magnet="1" className="p-[8px_12px] text-[#7d7a80] hover:text-[#0a0a0b] hover:bg-accent">
                            {l.label}
                        </a>
                    ))}
                </div>
                <div className="flex items-center gap-[14px] justify-self-end">
                    <span className="hidden sm:block font-mono text-[10px] tracking-[.16em] uppercase text-faint">{clock}</span>
                    <Button
                        onPress={() => navigate("/releases")}
                        data-magnet="1"
                        className="inline-flex items-center gap-[8px] rounded-none px-[16px] py-[10px] h-auto min-w-0 bg-ink text-[#0a0a0b] font-mono text-[10px] font-bold tracking-[.16em] uppercase hover:bg-accent data-[hover=true]:bg-accent"
                    >
                        Index ↗
                    </Button>
                </div>
            </nav>
        </>
    );
}
