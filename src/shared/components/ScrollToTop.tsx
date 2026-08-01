"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export function ScrollToTop() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        // 🎯 ১. ব্রাউজারের ডিফল্ট স্ক্রল রিস্টোরেশন ম্যানুয়াল করা
        if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
            window.history.scrollRestoration = "manual";
        }

        // 🎯 ২. ইউজার যদি কোনো নির্দিষ্ট সেকশনে লিঙ্ক ধরে আসে (e.g. /about#our-team), তবে স্ক্রোল টপ স্কিপ করবে
        if (typeof window !== "undefined" && window.location.hash) {
            try {
                const targetElement = document.querySelector(window.location.hash);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: "smooth" });
                    return;
                }
            } catch (error) {
                // Ignore invalid CSS selector syntax errors
            }
        }

        let animationFrameId: number;

        // 🎯 ৩. Vercel Style Browser Frame Sync (rAF)
        const forceScrollTop = () => {
            window.scrollTo({ top: 0, left: 0, behavior: "instant" });
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;

            // কাস্টম মেইন বা অভারফ্লোইং স্ক্রোল কন্টেইনার থাকলে
            const mainElement = document.querySelector("main");
            if (mainElement) {
                mainElement.scrollTop = 0;
            }
        };

        // ১ম রেন্ডার ফ্রেমে টপে পাঠানো
        forceScrollTop();

        // নেক্সট ব্রাউজার অ্যানিমেশন ফ্রেমে রি-চেক করা (Async Content / Hydration Jump Safe)
        animationFrameId = requestAnimationFrame(() => {
            forceScrollTop();
        });

        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, [pathname, searchParams]);

    return null;
}