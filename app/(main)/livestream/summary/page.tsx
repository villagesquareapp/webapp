"use client";

import CustomAvatar from "components/ui/custom/custom-avatar";
import { Button } from "components/ui/button";
import { FaPlay, FaHeart, FaComment, FaShareAlt } from "react-icons/fa";
import { IoCalendarOutline } from "react-icons/io5";
import { BiDiamond } from "react-icons/bi";
import { HiOutlineUserGroup } from "react-icons/hi";
import { MdOutlinePersonAdd, MdOutlineAccessTime } from "react-icons/md";
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";
import { LuGift, LuWallet } from "react-icons/lu";
import { Separator } from "components/ui/separator";
import Image from "next/image";

const STATS = [
  { icon: <HiOutlineUserGroup className="size-6 text-red-400" />, label: "Total Viewers", value: "12,500", change: "+18% vs last live" },
  { icon: <Image src="/images/gifts/vs-coin.svg" alt="Cowries" className="" width={30} height={30} />, label: "Cowries Earned", value: "CWR 467", change: "+22.3% vs last live" },
  { icon: <LuGift className="size-6 text-green-400" />, label: "Gifts Received", value: "1,246", change: "+7.2% vs last live" },
  { icon: <MdOutlinePersonAdd className="size-6 text-blue-400" />, label: "New Followers", value: "541", change: "+15% vs last live" },
];

const ENGAGEMENT = [
  { icon: <FaHeart className="size-4 text-pink-500" />, label: "Likes", value: "25,600", change: "+23.1%" },
  { icon: <FaComment className="size-4 text-[#8E8E93]" />, label: "Comments", value: "5,410", change: "+17.2%" },
  { icon: <FaShareAlt className="size-4 text-green-400" />, label: "Shares", value: "1,204", change: "+14.6%" },
  { icon: <MdOutlineAccessTime className="size-4 text-blue-400" />, label: "Average\nWatch Time", value: "42m 18s", change: "+13.1%" },
];

const EARNINGS = [
  { icon: <BiDiamond className="size-5 text-white/70" />, label: "Total Diamonds", value: "45,890", bg: "bg-white/5" },
  { icon: <LuWallet className="size-5 text-green-400" />, label: "Total Earnings", value: "$453,00", bg: "bg-white/5" },
  { icon: <LuGift className="size-5 text-cyan-400" />, label: "Estimated Payout", value: "$312,10", bg: "bg-white/5" },
];

const TOP_GIFTERS = [
  { name: "Ohyinn Art", rank: "Top 1", avatar: "", gifts: "1,500" },
  { name: "Dame Lovelyn", rank: "Top 2", avatar: "", gifts: "300" },
  { name: "L.Bradson", rank: "Top 3", avatar: "", gifts: "850" },
  { name: "OladeBeauty", rank: "", avatar: "", gifts: "1,200" },
  { name: "VegasofVegas", rank: "", avatar: "", gifts: "450" },
];

const GIFTS = [
  { name: "Shekere", count: "x 10", image: "/images/gifts/shekere.svg" },
  { name: "Diamond", count: "x 1", image: "/images/gifts/diamond.svg" },
  { name: "Opal", count: "x 3", image: "/images/gifts/opal.svg" },
  { name: "Calabash", count: "x 5", image: "/images/gifts/calabash.svg" },
  { name: "Protea Flower", count: "x 2", image: "/images/gifts/protea.svg" },
];

export default function LiveSummaryPage() {
  return (
    <div className="flex flex-col h-full overflow-y-auto no-scrollbar px-6 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Live Summary</h1>
          <p className="text-sm text-[#8E8E93] mt-0.5">Here&apos;s how your live stream performed.</p>
        </div>
        <div className="flex items-center gap-2 text-[#8E8E93] text-sm">
          <IoCalendarOutline className="size-4" />
          <span>June 25, 2026 • 7:30 PM • 1h 30m 45s</span>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        {STATS.map((stat, i) => (
          <div key={i} className="bg-[#232325] rounded-xl px-4 py-4 flex items-center gap-3">
            <div className="shrink-0 mt-0.5">{stat.icon}</div>
            <div className="flex flex-col">
              <span className="text-[#8E8E93] text-xs">{stat.label}</span>
              <p className="text-white text-lg font-bold leading-tight mt-0.5">{stat.value}</p>
              <p className="text-green-400 text-[11px] mt-0.5">{stat.change}</p>
            </div>
          </div>
        ))}
      </div>

      {/* View Replay button */}
      <div className="flex justify-end mb-5">
        <Button variant="outline" className="rounded-full border-white/10 text-white/80 text-sm h-9 px-4 gap-2">
          <FaPlay className="size-3" />
          View Replay
        </Button>
      </div>

      {/* Main content — grid layout */}
      <div className="grid grid-cols-12 gap-4 mb-8">
        {/* Left column: Engagement */}
        <div className="col-span-4">
          <div className="bg-[#232325] rounded-xl p-5 h-full flex flex-col">
            <h3 className="text-white font-semibold text-sm mb-3">Engagement</h3>
            <div className="flex flex-col gap-3">
              {ENGAGEMENT.map((item, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span className="text-white/80 text-sm whitespace-pre-line leading-tight">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-semibold text-sm">{item.value}</span>
                      <span className="text-green-400 text-xs">{item.change}</span>
                    </div>
                  </div>
                  {i < ENGAGEMENT.length - 1 && <Separator className="bg-white/5" />}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Middle column: Earnings Summary */}
        <div className="col-span-4">
          <div className="bg-[#232325] rounded-xl p-5 h-full flex flex-col">
            <h3 className="text-white font-semibold text-sm mb-4">Earnings Summary</h3>
            <div className="flex flex-col gap-3">
              {EARNINGS.map((item, i) => (
                <div key={i} className={`${item.bg} rounded-lg px-3 py-3 flex items-center gap-3`}>
                  <div className="size-9 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-[#8E8E93] text-xs">{item.label}</p>
                    <p className="text-white font-semibold text-sm">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-5 text-center border border-white/10 rounded-xl py-3 text-[#8E8E93] text-sm hover:bg-white/5 transition-colors">
              View Earnings Details
            </button>
          </div>
        </div>

        {/* Right column: Top Gifters — spans 2 rows */}
        <div className="col-span-4 row-span-2">
          <div className="bg-[#232325] rounded-xl p-5 h-full flex flex-col">
            <h3 className="text-white font-semibold text-sm mb-4">Top Gifters</h3>
            <div className="flex flex-col gap-4 flex-1">
              {TOP_GIFTERS.map((gifter, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CustomAvatar src={"https://cdn-assets.villagesquare.io/profile_pictures/default_user.png"} name={gifter.name} className="size-10" />
                    <div className="flex items-center gap-2">
                      <span className="text-white text-sm font-medium">{gifter.name}</span>
                      {gifter.rank && (
                        <span className="text-white text-[10px] bg-[#1F2733] px-2 py-0.5 rounded-full font-medium">{gifter.rank}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Image src={"/images/gifts/villagesquare_coin.svg"} alt="VS_coin" width={25} height={25} />
                    <span className="text-green-400 text-xs font-medium">{gifter.gifts}</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 text-center border border-white/10 rounded-lg py-2.5 text-[#8E8E93] text-sm hover:bg-white/5 transition-colors">
              See more...
            </button>
          </div>
        </div>

        {/* Gifts Highlights — spans under Engagement + Earnings (col 1-8) */}
        <div className="col-span-8">
          <div className="bg-[#232325] rounded-xl p-5">
            <h3 className="text-white font-semibold text-sm mb-4">Gifts Highlights</h3>
            <div className="flex items-center justify-around gap-6">
              {GIFTS.map((gift, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5">
                  <div className="size-14 rounded-full bg-white/5 flex items-center justify-center overflow-hidden">
                    <Image src={gift.image} alt={gift.name} width={36} height={36} className="object-contain" />
                  </div>
                  <span className="text-white/80 text-[11px] text-center leading-tight">{gift.name}</span>
                  <span className="text-[#8E8E93] text-[11px] font-medium">{gift.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between py-4 border-t border-white/5">
        <p className="text-[#8E8E93] text-xs">All stats are estimated and may be delayed.</p>
        <div className="flex items-center gap-3">
          <span className="text-[#8E8E93] text-xs">How was your live experience ?</span>
          <button className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <AiOutlineLike className="size-4 text-white/60" />
          </button>
          <button className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <AiOutlineDislike className="size-4 text-white/60" />
          </button>
        </div>
      </div>
    </div>
  );
}
