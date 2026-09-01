import React, {useEffect} from "react";
import {BrowserRouter, Route, Routes, useLocation} from "react-router-dom";
import ReactDOM from "react-dom/client";

import "./css/index.css";

const Portfolio = React.lazy(() => import("./pages/Portfolio.tsx"));
const Releases = React.lazy(() => import("./pages/Releases.tsx"));
const Blog = React.lazy(() => import("./pages/Blog.tsx"));
const NotFound = React.lazy(() => import("./pages/NotFound.tsx"));

function ScrollToTop() {
    const {pathname} = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <BrowserRouter>
            <ScrollToTop/>
            <React.Suspense fallback={null}>
                <Routes>
                    <Route path="/" element={<Portfolio/>}/>
                    <Route path="/releases" element={<Releases/>}/>
                    <Route path="/blog/*" element={<Blog/>}/>
                    <Route path="*" element={<NotFound/>}/>
                </Routes>
            </React.Suspense>
        </BrowserRouter>
    </React.StrictMode>
);
