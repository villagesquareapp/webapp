"use client";

import { Button } from "components/ui/button";
import { useSidebar } from "components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

const PageNotFound = () => {
    const { setOpen } = useSidebar();

    // Always expand the sidebar on 404 pages
    useEffect(() => {
        setOpen(true);
    }, [setOpen]);

    return (
        <div className="flex flex-col gap-y-3 w-full place-items-center m-auto py-20">
            <Image src="/images/result.png" alt="Not Found" width={250} height={250} />
            <div className="flex flex-col gap-y-4 place-items-center">
                <p className="text-2xl font-bold text-foreground">
                    Oopss...this page doesn&apos;t exist.
                </p>
                <p className="text-sm text-center text-muted-foreground max-w-md">
                    The page you are looking for might have been removed or is temporarily
                    unavailable.
                </p>
                <Link href="/home">
                    <Button className="mt-2 px-10 h-11 rounded-full bg-[#0D52D2] hover:bg-[#0D52D2]/90 text-white font-semibold">
                        Go home
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default PageNotFound;
