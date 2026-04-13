"use client";

import React, { useState, useEffect, useRef } from "react";
import { Camera, MapPin, CalendarDays, ChevronRight, ChevronDown, Check, Loader2, X } from "lucide-react";
import CustomAvatar from "components/ui/custom/custom-avatar";
import { useSession } from "next-auth/react";
import { useProfile } from "src/hooks/useProfile";
import { updateProfile } from "app/api/user";
import LocationPicker from "components/Dashboard/Social/LocationPicker";

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
    const [profession, setProfession] = useState<string>("")
    const [bio, setBio] = useState("");
    const [email, setEmail] = useState("");
    const [gender, setGender] = useState("");
    const [dobDay, setDobDay] = useState("");
    const [dobMonth, setDobMonth] = useState("");
    const [dobYear, setDobYear] = useState("");
    const [location, setLocation] = useState("");
    const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
    const [locationLatitude, setLocationLatitude] = useState("");
    const [locationLongitude, setLocationLongitude] = useState("");
    const [profilePicture, setProfilePicture] = useState("");
    const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);

    // Save state
    const [saving, setSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

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
            setProfession(profile.profession || "")
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

    const handleSave = async () => {
        setSaving(true);
        setErrorMessage("");

        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("username", username);
            formData.append("profession", profession)
            formData.append("bio", bio);
            formData.append("gender", gender.toLowerCase());

            // Build DOB string
            if (dobYear && dobMonth && dobDay) {
                const monthIndex = MONTHS.indexOf(dobMonth);
                if (monthIndex !== -1) {
                    const dob = `${dobYear}-${String(monthIndex + 1).padStart(2, "0")}-${String(dobDay).padStart(2, "0")}`;
                    formData.append("dob", dob);
                }
            }

            // Parse location into city/country
            if (location) {
                const parts = location.split(",").map(s => s.trim());
                if (parts.length >= 2) {
                    formData.append("city", parts[0]);
                    formData.append("country", parts[parts.length - 1]);
                } else {
                    formData.append("city", location);
                    formData.append("country", "");
                }
            }

            if (profilePictureFile) {
                formData.append("profile_picture", profilePictureFile);
            }

            const response = await updateProfile(formData);

            if (response?.status === true) {
                setShowSuccess(true);
                // Auto-dismiss success after 2.5 seconds
                setTimeout(() => setShowSuccess(false), 2500);
            } else {
                setErrorMessage(response?.message || "Something went wrong. Please try again.");
            }
        } catch (error) {
            setErrorMessage("An unexpected error occurred. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-[500px] py-8">
                <div className="animate-pulse space-y-6">
                    <div className="h-6 bg-[#1717190D] dark:bg-[#18181A] rounded w-32" />
                    <div className="h-20 bg-[#1717190D] dark:bg-[#18181A] rounded-xl" />
                    <div className="h-20 bg-[#1717190D] dark:bg-[#18181A] rounded-xl" />
                    <div className="h-14 bg-[#1717190D] dark:bg-[#18181A] rounded-xl" />
                    <div className="h-14 bg-[#1717190D] dark:bg-[#18181A] rounded-xl" />
                    <div className="h-14 bg-[#1717190D] dark:bg-[#18181A] rounded-xl" />
                    <div className="h-14 bg-[#1717190D] dark:bg-[#18181A] rounded-xl" />
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Saving Overlay */}            {saving && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-[#1A1A1A] border border-[#2C2C2E] rounded-2xl px-10 py-8 flex flex-col items-center gap-4 shadow-2xl">
                        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                        <p className="text-white font-medium text-[15px]">Updating your profile...</p>
                    </div>
                </div>
            )}

            {/* Success Overlay */}
            {showSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-[#1A1A1A] border border-[#2C2C2E] rounded-2xl px-10 py-8 flex flex-col items-center gap-4 shadow-2xl animate-in fade-in zoom-in-95 duration-300">
                        <div className="w-14 h-14 rounded-full bg-green-500/10 border-2 border-green-500 flex items-center justify-center">
                            <Check className="w-7 h-7 text-green-500" strokeWidth={3} />
                        </div>
                        <div className="text-center">
                            <p className="text-white font-semibold text-lg">Profile Updated!</p>
                            <p className="text-muted-foreground text-sm mt-1">Your changes have been saved successfully.</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-[500px]">
                <h2 className="text-xl font-semibold text-foreground mb-6 pt-2">Edit Profile</h2>

                {/* Profile Header with editable name/username */}
                <div className="bg-[#1717190D] dark:bg-[#232325] rounded-xl p-4 flex items-center mb-8 relative">
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
                            className="bg-transparent font-semibold text-foreground text-[15px] focus:outline-none w-full"
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
                        <h3 className="text-[15px] font-semibold mb-3 text-foreground">Bio</h3>
                        <div className="bg-background rounded-xl p-4 border border-border focus-within:border-neutral-500 transition-colors relative">
                            <textarea
                                className="w-full bg-transparent text-foreground text-sm resize-none focus:outline-none min-h-[60px]"
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
                        <h3 className="text-[15px] font-semibold mb-3 text-foreground">Email Address</h3>
                        <div className="bg-background rounded-xl p-4 border border-border flex items-center justify-between focus-within:border-neutral-500 transition-colors">
                            <input
                                type="text"
                                className="bg-transparent text-sm w-full text-foreground focus:outline-none"
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
                        <h3 className="text-[15px] text-foreground font-semibold mb-3">Gender</h3>
                        <button
                            onClick={() => setShowGenderDropdown(!showGenderDropdown)}
                            className="w-full bg-background rounded-xl p-4 border border-border flex items-center justify-between hover:bg-background/90 transition-colors"
                        >
                            <span className="text-sm text-foreground">{gender || "Select"}</span>
                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        </button>
                        {showGenderDropdown && (
                            <div className="absolute z-10 w-full mt-1 bg-background border border-border rounded-xl shadow-lg overflow-hidden">
                                {GENDERS.map((g) => (
                                    <button
                                        key={g}
                                        onClick={() => { setGender(g); setShowGenderDropdown(false); }}
                                        className={`w-full text-foreground text-left px-4 py-3 text-sm hover:bg-background/30 transition-colors ${gender === g ? "text-blue-500 font-medium" : ""}`}
                                    >
                                        {g}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Date of birth */}
                    <div>
                        <h3 className="text-[15px] font-semibold text-foreground mb-3">Date of birth</h3>
                        <div className="flex gap-3">
                            {/* Day */}
                            <div ref={dayRef} className="flex-1 relative">
                                <button
                                    onClick={() => setShowDayDropdown(!showDayDropdown)}
                                    className="w-full bg-background rounded-xl p-3 border border-border flex items-center justify-between cursor-pointer hover:bg-background/90"
                                >
                                    <span className="text-sm text-foreground">{dobDay || "Day"}</span>
                                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                                </button>
                                {showDayDropdown && (
                                    <div className="absolute z-10 w-full mt-1 bg-background border border-border rounded-xl shadow-lg max-h-48 overflow-y-auto">
                                        {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                                            <button
                                                key={d}
                                                onClick={() => { setDobDay(String(d)); setShowDayDropdown(false); }}
                                                className={`w-full text-left px-4 py-2.5 text-sm text-foreground hover:bg-background/30 transition-colors ${dobDay === String(d) ? "text-blue-500 font-medium" : ""}`}
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
                                    className="w-full bg-background rounded-xl p-3 border border-border flex items-center justify-between cursor-pointer hover:bg-background/90"
                                >
                                    <span className="text-sm text-foreground">{dobMonth || "Month"}</span>
                                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                                </button>
                                {showMonthDropdown && (
                                    <div className="absolute z-10 w-full mt-1 bg-background border border-border rounded-xl shadow-lg max-h-48 overflow-y-auto">
                                        {MONTHS.map((m) => (
                                            <button
                                                key={m}
                                                onClick={() => { setDobMonth(m); setShowMonthDropdown(false); }}
                                                className={`w-full text-left px-4 py-2.5 text-sm text-foreground hover:bg-background/30 transition-colors ${dobMonth === m ? "text-blue-500 font-medium" : ""}`}
                                            >
                                                {m}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            {/* Year */}
                            <div className="flex-[2] bg-background rounded-xl p-3 border border-border flex items-center justify-between relative cursor-pointer hover:bg-background/90">
                                <input
                                    type="text"
                                    value={dobYear}
                                    onChange={(e) => setDobYear(e.target.value.replace(/\D/g, "").slice(0, 4))}
                                    className="bg-transparent text-foreground text-sm w-full focus:outline-none"
                                    placeholder="Year"
                                />
                                <CalendarDays className="w-4 h-4 text-muted-foreground shrink-0" />
                            </div>
                        </div>
                    </div>

                    {/* Location */}
                    <div>
                        <h3 className="text-[15px] text-foreground font-semibold mb-3">Location</h3>
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setIsLocationPickerOpen(true)}
                                className="w-full bg-background rounded-xl p-4 border border-border flex items-center justify-between hover:border-neutral-500 transition-colors text-left"
                            >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <MapPin className={`w-4 h-4 shrink-0 ${location ? "text-blue-400" : "text-muted-foreground"}`} />
                                    <span className={`text-sm truncate ${location ? "text-foreground" : "text-muted-foreground"}`}>
                                        {location || "Add location"}
                                    </span>
                                </div>
                                {location && (
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setLocation("");
                                            setLocationLatitude("");
                                            setLocationLongitude("");
                                        }}
                                        className="ml-2 p-1 hover:bg-white/10 rounded-full transition-colors shrink-0"
                                    >
                                        <X className="w-4 h-4 text-muted-foreground" />
                                    </button>
                                )}
                            </button>

                            <LocationPicker
                                open={isLocationPickerOpen}
                                onClose={() => setIsLocationPickerOpen(false)}
                                onSelect={(loc) => {
                                    setLocation(loc.address);
                                    setLocationLatitude(loc.latitude);
                                    setLocationLongitude(loc.longitude);
                                }}
                                currentAddress={location || undefined}
                            />
                        </div>
                    </div>
                </div>

                {/* Error message */}
                {errorMessage && (
                    <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                        {errorMessage}
                    </div>
                )}

                {/* Save Button */}
                <div className="mt-12 flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="text-blue-600 font-semibold text-[15px] hover:text-blue-500 transition-colors disabled:opacity-50"
                    >
                        Save
                    </button>
                </div>
            </div>
        </>
    );
};

export default EditProfileContent;
