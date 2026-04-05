"use client";

import React, { useState, useEffect, useRef } from "react";
import { Camera, MapPin, CalendarDays, ChevronRight, ChevronDown } from "lucide-react";
import CustomAvatar from "components/ui/custom/custom-avatar";
import { useSession } from "next-auth/react";
import { useProfile } from "src/hooks/useProfile";

const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

const GENDERS = ["Male", "Female", "Other", "Prefer not to say"];

const BIO_MAX = 150;
const EMAIL_MAX = 40;

const EditProfileContent = () => {
    const { data: session } = useSession();
    const userId = session?.user?.uuid || "";
    const { profile, loading } = useProfile(userId);

    // Form state
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [bio, setBio] = useState("");
    const [email, setEmail] = useState("");
    const [gender, setGender] = useState("");
    const [dobDay, setDobDay] = useState("");
    const [dobMonth, setDobMonth] = useState("");
    const [dobYear, setDobYear] = useState("");
    const [location, setLocation] = useState("");
    const [profilePicture, setProfilePicture] = useState("");
    const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);

    // Dropdown state
    const [showGenderDropdown, setShowGenderDropdown] = useState(false);
    const [showDayDropdown, setShowDayDropdown] = useState(false);
    const [showMonthDropdown, setShowMonthDropdown] = useState(false);

    const genderRef = useRef<HTMLDivElement>(null);
    const dayRef = useRef<HTMLDivElement>(null);
    const monthRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Populate form from profile data
    useEffect(() => {
        if (profile) {
            setName(profile.name || "");
            setUsername(profile.username || "");
            setBio(profile.bio || "");
            setEmail(profile.email || "");
            setGender(profile.gender || "");
            setProfilePicture(profile.profile_picture || "");

            // Parse location from address or city/country
            const loc = profile.address || [profile.city, profile.country].filter(Boolean).join(", ");
            setLocation(loc || "");

            // Parse DOB (format: "YYYY-MM-DD" or similar)
            if (profile.dob) {
                const dateObj = new Date(profile.dob);
                if (!isNaN(dateObj.getTime())) {
                    setDobDay(String(dateObj.getDate()));
                    setDobMonth(MONTHS[dateObj.getMonth()]);
                    setDobYear(String(dateObj.getFullYear()));
                }
            }
        }
    }, [profile]);

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (genderRef.current && !genderRef.current.contains(e.target as Node)) setShowGenderDropdown(false);
            if (dayRef.current && !dayRef.current.contains(e.target as Node)) setShowDayDropdown(false);
            if (monthRef.current && !monthRef.current.contains(e.target as Node)) setShowMonthDropdown(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setProfilePictureFile(file);
            setProfilePicture(URL.createObjectURL(file));
        }
    };

    if (loading) {
        return (
            <div className="max-w-[500px] py-8">
                <div className="animate-pulse space-y-6">
                    <div className="h-6 bg-[#18181A] rounded w-32" />
                    <div className="h-20 bg-[#18181A] rounded-xl" />
                    <div className="h-20 bg-[#18181A] rounded-xl" />
                    <div className="h-14 bg-[#18181A] rounded-xl" />
                    <div className="h-14 bg-[#18181A] rounded-xl" />
                    <div className="h-14 bg-[#18181A] rounded-xl" />
                    <div className="h-14 bg-[#18181A] rounded-xl" />
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-[500px]">
            <h2 className="text-xl font-semibold mb-6">Edit Profile</h2>

            {/* Profile Header with editable name/username */}
            <div className="bg-[#18181A] rounded-xl p-4 flex items-center mb-8 relative">
                <div className="relative mr-4">
                    <CustomAvatar
                        src={profilePicture}
                        name={name || "?"}
                        className="w-16 h-16 border-0"
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-0 right-0 bg-black/60 rounded-full p-1 border border-background"
                    >
                        <Camera className="w-3.5 h-3.5 text-white" />
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleProfilePictureChange}
                    />
                </div>

                <div className="flex flex-col justify-center flex-1">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-transparent font-semibold text-[15px] focus:outline-none w-full"
                        placeholder="Full Name"
                    />
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="bg-transparent text-muted-foreground text-sm focus:outline-none w-full"
                        placeholder="username"
                    />
                </div>
            </div>

            <div className="space-y-6">
                {/* Bio */}
                <div>
                    <h3 className="text-[15px] font-semibold mb-3">Bio</h3>
                    <div className="bg-[#18181A] rounded-xl p-4 border border-[#2C2C2E] focus-within:border-neutral-500 transition-colors relative">
                        <textarea
                            className="w-full bg-transparent text-sm resize-none focus:outline-none min-h-[60px]"
                            value={bio}
                            onChange={(e) => {
                                if (e.target.value.length <= BIO_MAX) setBio(e.target.value);
                            }}
                        />
                        <div className="absolute right-3 bottom-3 text-xs text-muted-foreground">
                            {bio.length} / {BIO_MAX}
                        </div>
                    </div>
                </div>

                {/* Email Address */}
                <div>
                    <h3 className="text-[15px] font-semibold mb-3">Email Address</h3>
                    <div className="bg-[#18181A] rounded-xl p-4 border border-[#2C2C2E] flex items-center justify-between focus-within:border-neutral-500 transition-colors">
                        <input
                            type="text"
                            className="bg-transparent text-sm w-full focus:outline-none"
                            value={email}
                            onChange={(e) => {
                                if (e.target.value.length <= EMAIL_MAX) setEmail(e.target.value);
                            }}
                            readOnly
                            
                        />
                        <span className="text-xs text-muted-foreground shrink-0 pl-2">
                            {email.length} / {EMAIL_MAX}
                        </span>
                    </div>
                </div>

                {/* Gender */}
                <div ref={genderRef} className="relative">
                    <h3 className="text-[15px] font-semibold mb-3">Gender</h3>
                    <button
                        onClick={() => setShowGenderDropdown(!showGenderDropdown)}
                        className="w-full bg-[#18181A] rounded-xl p-4 border border-[#2C2C2E] flex items-center justify-between hover:bg-[#202022] transition-colors"
                    >
                        <span className="text-sm">{gender || "Select"}</span>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </button>
                    {showGenderDropdown && (
                        <div className="absolute z-10 w-full mt-1 bg-[#1A1A1A] border border-[#2C2C2E] rounded-xl shadow-lg overflow-hidden">
                            {GENDERS.map((g) => (
                                <button
                                    key={g}
                                    onClick={() => { setGender(g); setShowGenderDropdown(false); }}
                                    className={`w-full text-left px-4 py-3 text-sm hover:bg-[#252528] transition-colors ${gender === g ? "text-blue-500 font-medium" : ""}`}
                                >
                                    {g}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Date of birth */}
                <div>
                    <h3 className="text-[15px] font-semibold mb-3">Date of birth</h3>
                    <div className="flex gap-3">
                        {/* Day */}
                        <div ref={dayRef} className="flex-1 relative">
                            <button
                                onClick={() => setShowDayDropdown(!showDayDropdown)}
                                className="w-full bg-[#18181A] rounded-xl p-3 border border-[#2C2C2E] flex items-center justify-between cursor-pointer hover:bg-[#202022]"
                            >
                                <span className="text-sm">{dobDay || "Day"}</span>
                                <ChevronDown className="w-4 h-4 text-muted-foreground" />
                            </button>
                            {showDayDropdown && (
                                <div className="absolute z-10 w-full mt-1 bg-[#1A1A1A] border border-[#2C2C2E] rounded-xl shadow-lg max-h-48 overflow-y-auto">
                                    {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                                        <button
                                            key={d}
                                            onClick={() => { setDobDay(String(d)); setShowDayDropdown(false); }}
                                            className={`w-full text-left px-4 py-2.5 text-sm hover:bg-[#252528] transition-colors ${dobDay === String(d) ? "text-blue-500 font-medium" : ""}`}
                                        >
                                            {d}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        {/* Month */}
                        <div ref={monthRef} className="flex-[2] relative">
                            <button
                                onClick={() => setShowMonthDropdown(!showMonthDropdown)}
                                className="w-full bg-[#18181A] rounded-xl p-3 border border-[#2C2C2E] flex items-center justify-between cursor-pointer hover:bg-[#202022]"
                            >
                                <span className="text-sm">{dobMonth || "Month"}</span>
                                <ChevronDown className="w-4 h-4 text-muted-foreground" />
                            </button>
                            {showMonthDropdown && (
                                <div className="absolute z-10 w-full mt-1 bg-[#1A1A1A] border border-[#2C2C2E] rounded-xl shadow-lg max-h-48 overflow-y-auto">
                                    {MONTHS.map((m) => (
                                        <button
                                            key={m}
                                            onClick={() => { setDobMonth(m); setShowMonthDropdown(false); }}
                                            className={`w-full text-left px-4 py-2.5 text-sm hover:bg-[#252528] transition-colors ${dobMonth === m ? "text-blue-500 font-medium" : ""}`}
                                        >
                                            {m}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        {/* Year */}
                        <div className="flex-[2] bg-[#18181A] rounded-xl p-3 border border-[#2C2C2E] flex items-center justify-between relative cursor-pointer hover:bg-[#202022]">
                            <input
                                type="text"
                                value={dobYear}
                                onChange={(e) => setDobYear(e.target.value.replace(/\D/g, "").slice(0, 4))}
                                className="bg-transparent text-sm w-full focus:outline-none"
                                placeholder="Year"
                            />
                            <CalendarDays className="w-4 h-4 text-muted-foreground shrink-0" />
                        </div>
                    </div>
                </div>

                {/* Location */}
                <div>
                    <h3 className="text-[15px] font-semibold mb-3">Location</h3>
                    <div className="bg-[#18181A] rounded-xl p-4 border border-[#2C2C2E] flex items-center focus-within:border-neutral-500 transition-colors">
                        <MapPin className="w-4 h-4 text-muted-foreground mr-3 shrink-0" />
                        <input
                            type="text"
                            className="bg-transparent text-sm w-full focus:outline-none"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div className="mt-12 flex justify-end">
                <button className="text-blue-600 font-semibold text-[15px] hover:text-blue-500 transition-colors">
                    Save
                </button>
            </div>
        </div>
    );
};

export default EditProfileContent;
