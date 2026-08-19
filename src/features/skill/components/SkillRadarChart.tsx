"use client";

import { useMemo } from "react";
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    Tooltip,
} from "recharts";
import type { Skill } from "../types/skill.types";

interface SkillRadarChartProps {
    skills: Skill[];
}

export function SkillRadarChart({ skills }: SkillRadarChartProps) {
    // ডাটাবেজে percentage না থাকায় অর্ডারের ওপর ভিত্তি করে বাস্তবসম্মত মান ক্যালকুলেশন
    const chartData = useMemo(() => {
        return skills.map((item, index) => {
            const baseScore = 95 - (index % 4) * 4;
            const score = Math.max(75, Math.min(95, baseScore));

            return {
                skill: item.title,
                proficiency: score,
                description: item.shortDesc,
            };
        });
    }, [skills]);

    return (
        <div className="relative mx-auto flex h-[380px] w-full max-w-3xl items-center justify-center p-2 sm:h-[460px]">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="72%" data={chartData}>
                    {/* গ্রিড ব্যাকগ্রাউন্ড লাইন */}
                    <PolarGrid
                        stroke="currentColor"
                        className="text-border/60"
                        strokeDasharray="3 3"
                    />

                    {/* টেক্সট লেবেলসমূহ */}
                    <PolarAngleAxis
                        dataKey="skill"
                        tick={({ payload, x, y, textAnchor }) => (
                            <text
                                x={x}
                                y={y}
                                textAnchor={textAnchor}
                                className="fill-muted-foreground text-[11px] font-medium transition-colors hover:fill-foreground sm:text-xs"
                            >
                                {payload.value}
                            </text>
                        )}
                    />

                    <PolarRadiusAxis
                        angle={30}
                        domain={[0, 100]}
                        tick={false}
                        axisLine={false}
                    />

                    {/* 🟢 লাইম-গ্রিন রাডার পলিগন */}
                    <Radar
                        name="Proficiency"
                        dataKey="proficiency"
                        stroke="#84cc16"
                        strokeWidth={2}
                        fill="#84cc16"
                        fillOpacity={0.25}
                        dot={{
                            r: 4,
                            fill: "#84cc16",
                            stroke: "var(--background)",
                            strokeWidth: 1.5,
                        }}
                    />

                    {/* হোভার টুলটিপ */}
                    <Tooltip
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                const data = payload[0].payload;
                                return (
                                    <div className="rounded-lg border border-border bg-popover/90 px-3 py-1.5 text-xs text-popover-foreground shadow-md backdrop-blur-md">
                                        <p className="font-semibold">{data.skill}</p>
                                        {data.description && (
                                            <p className="text-muted-foreground mt-0.5 max-w-xs text-[11px] leading-relaxed">
                                                {data.description}
                                            </p>
                                        )}
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
}