"use client";

import { Button } from "components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function ProfileNotFound({ username }: { username: string }) {
    return (
        <div className="flex flex-col gap-y-4 w-full place-items-center m-auto py-24">
            <Image src="/images/result.png" alt="Profile Not Found" width={220} height={220} />
            <div className="flex flex-col gap-y-3 place-items-center text-center">
                <p className="text-2xl font-bold text-foreground">Profile Not Found</p>
                <p className="text-sm text-muted-foreground max-w-sm">
                    We couldn&apos;t find a profile for{" "}
                    <span className="font-semibold text-foreground">@{username}</span>.
                    The account may have been removed or the username is incorrect.
                </p>
                <Link href="/home">
                    <Button className="mt-2 px-10 h-11 rounded-full bg-[#0D52D2] hover:bg-[#0D52D2]/90 text-white font-semibold">
                        Go home
                    </Button>
                </Link>
            </div>
        </div>
    );
}
