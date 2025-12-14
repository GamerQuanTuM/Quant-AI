import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { protect } from "@/middleware/protect"
import { ValidationResponseError } from "@/lib/zod-validate"

import { formatLargeNumber } from "@/lib/format-number";

const analytics = async (req: Request, userId: string) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { credits: true }
        });

        const projectsWithStats = await prisma.project.findMany({
            where: { userId },
            select: {
                id: true,
                createdAt: true,
                contents: {
                    select: {
                        outputText: true,
                        createdAt: true
                    }
                }
            }
        });

        let totalWords = 0;
        let projectsThisWeek = 0;
        let projectsLastWeek = 0;
        let wordsToday = 0;
        let wordsYesterday = 0;

        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

        const startOfToday = new Date(now);
        startOfToday.setHours(0, 0, 0, 0);

        const startOfYesterday = new Date(startOfToday);
        startOfYesterday.setDate(startOfYesterday.getDate() - 1);

        projectsWithStats.forEach(project => {
            const projectDate = new Date(project.createdAt);
            if (projectDate >= oneWeekAgo) {
                projectsThisWeek++;
            } else if (projectDate >= twoWeeksAgo) {
                projectsLastWeek++;
            }

            project.contents.forEach(content => {
                const wordCount = (content.outputText.match(/\S+/g) || []).length;
                totalWords += wordCount;

                const contentDate = new Date(content.createdAt);
                if (contentDate >= startOfToday) {
                    wordsToday += wordCount;
                } else if (contentDate >= startOfYesterday && contentDate < startOfToday) {
                    wordsYesterday += wordCount;
                }
            });
        });

        const analytics = {
            totalWords: formatLargeNumber(totalWords),
            totalProjects: formatLargeNumber(projectsWithStats.length, 0),
            totalCredits: formatLargeNumber(user?.credits || 0),
            projectGrowth: formatLargeNumber(projectsThisWeek - projectsLastWeek),
            wordGrowth: formatLargeNumber(wordsToday - wordsYesterday)
        };

        return NextResponse.json(analytics, { status: 200 });
    } catch (error) {
        if (error instanceof ValidationResponseError) {
            return error.response;
        }
        return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
    }
};

export const GET = protect(analytics)