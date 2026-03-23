"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { IoClose, IoLocationSharp, IoSearch } from "react-icons/io5";
import { MdMyLocation } from "react-icons/md";
import LoadingSpinner from "../Reusable/LoadingSpinner";

interface LocationResult {
  address: string;
  latitude: string;
  longitude: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (location: LocationResult) => void;
  currentAddress?: string;
}

interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

export default function LocationPicker({ open, onClose, onSelect, currentAddress }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState("");
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery(currentAddress || "");
      setResults([]);
      setError("");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const searchLocation = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); return; }
    setIsSearching(true);
    setError("");
    try {
      const res = await fetch(`/api/location?q=${encodeURIComponent(q)}`);
      const data: NominatimResult[] = await res.json();
      setResults(Array.isArray(data) ? data : []);
    } catch {
      setError("Search failed. Please try again.");
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchLocation(val), 500);
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    setIsLocating(true);
    setError("");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(
            `/api/location?lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          const address = data.display_name || `${latitude}, ${longitude}`;
          onSelect({ address, latitude: String(latitude), longitude: String(longitude) });
          onClose();
        } catch {
          setError("Could not get address for your location.");
        } finally {
          setIsLocating(false);
        }
      },
      () => {
        setError("Location access denied. Please allow location access.");
        setIsLocating(false);
      }
    );
  };

  const handleSelect = (result: NominatimResult) => {
    onSelect({
      address: result.display_name,
      latitude: result.lat,
      longitude: result.lon,
    });
    onClose();
  };

  if (!open) return null;

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="absolute top-0 left-0 w-full bg-popover border border-border shadow-2xl z-[100] flex flex-col rounded-xl max-h-[320px] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <button onClick={onClose} className="p-1 hover:bg-white/5 rounded-full transition-colors">
          <IoClose className="text-white size-5" />
        </button>
        <h3 className="text-[16px] font-bold text-white">Add Location</h3>
        <div className="w-7" />
      </div>

      {/* Search input */}
      <div className="px-4 pt-4 pb-2">
        <div className="relative flex items-center bg-white/5 rounded-xl px-3 h-11">
          <IoSearch className="text-[#8E8E93] size-4 shrink-0 mr-2" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleQueryChange}
            placeholder="Search for a place..."
            className="flex-1 bg-transparent text-white text-[14px] placeholder:text-[#48484A] outline-none border-none ring-0"
          />
          {isSearching && (
            <div className="scale-50 origin-right">
              <LoadingSpinner />
            </div>
          )}
        </div>
      </div>

      {/* Use current location */}
      {/* <button
        onClick={handleUseCurrentLocation}
        disabled={isLocating}
        className="flex items-center gap-3 mx-4 mt-2 px-3 py-3 rounded-xl hover:bg-white/5 transition-colors text-left"
      >
        <div className="size-9 rounded-full bg-[#1C3A6B] flex items-center justify-center shrink-0">
          {isLocating ? (
            <div className="scale-50">
              <LoadingSpinner />
            </div>
          ) : (
            <MdMyLocation className="text-[#4A9EFF] size-5" />
          )}
        </div>
        <span className="text-[14px] font-semibold text-[#4A9EFF]">
          {isLocating ? "Getting your location..." : "Use current location"}
        </span>
      </button> */}

      {error && (
        <p className="text-red-400 text-[13px] px-5 mt-2">{error}</p>
      )}

      {/* Results */}
      <div className="flex-1 overflow-y-auto mt-2 px-2">
        {results.map((r) => (
          <button
            key={r.place_id}
            onClick={() => handleSelect(r)}
            className="w-full flex items-start gap-3 px-3 py-3 rounded-xl hover:bg-white/5 transition-colors text-left"
          >
            <IoLocationSharp className="text-[#8E8E93] size-5 mt-0.5 shrink-0" />
            <span className="text-[13px] text-white/80 leading-snug line-clamp-2">
              {r.display_name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
