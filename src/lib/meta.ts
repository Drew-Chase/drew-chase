import {useEffect} from "react";

// Per-page title/description. Social/OG tags stay static in index.html —
// social crawlers do not execute JS and static hosts cannot rewrite per route.
export function usePageMeta(title: string, description?: string) {
    useEffect(() => {
        document.title = title;
        if (description) {
            document.querySelector('meta[name="description"]')?.setAttribute("content", description);
        }
    }, [title, description]);
}
