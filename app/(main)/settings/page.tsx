import React from "react";
import SettingsPageClient from "components/Dashboard/Settings/SettingsPageClient";

export const metadata = {
    title: "Settings - VillageSquare",
    description: "Manage your account settings and preferences on VillageSquare.",
};

export default function SettingsPage() {
    return (
        <div className="w-full h-full bg-background rounded-lg overflow-hidden">
            <SettingsPageClient />
        </div>
    );
}
