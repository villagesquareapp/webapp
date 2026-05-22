import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "api/auth/authOptions";
import SearchResultsClient from "components/Dashboard/Search/SearchResultsClient";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Search | VillageSquare",
};

export default async function SearchPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user) return null;
    return (
        <Suspense fallback={<div className="p-8 text-muted-foreground">Loading...</div>}>
            <SearchResultsClient user={session.user} />
        </Suspense>
    );
}
