import { Button } from "components/ui/button";
import CustomAvatar from "components/ui/custom/custom-avatar";
import { Separator } from "components/ui/separator";
import Image from "next/image";
import { FaHeart, FaCommentAlt } from "react-icons/fa";
import { BiMessageRounded } from "react-icons/bi";
import { TbDots } from "react-icons/tb";

const HotTrendsData = [
    {
        name: "Simi Sanyaa",
        username: "simi sofinesofly",
        time: "21h",
        content: "Good vibes only! #weddingparty #vibes",
        image: "/images/beautiful-image.webp",
        likes: 97,
        comments: 30,
    },
    {
        name: "Reehanat",
        username: "badgalree",
        time: "1d",
        content: "Some experiences don't just teach you, they shape you. I just wrapped up... Read more",
        image: "",
        likes: 97,
        comments: 30,
    },
    {
        name: "Anny Faith",
        username: "anny_faith",
        time: "6h",
        content: "Weekend glow #weddingparty #vibes",
        image: "/images/beautiful-image.webp",
        likes: 856,
        comments: 204,
    },
];

const ConnectWithData = [
    { name: "Adanna Linus", username: "adalinus" },
    { name: "Jadesola Hampton", username: "jadesola_hampton" },
    { name: "Jerry Samson", username: "sexyyjerry" },
    { name: "Jerry Samson", username: "sexyyjerry" },
];

const RightSidebar = () => {
    return (
        <div className="flex flex-col gap-6 w-full sticky top-24 pb-12 h-[calc(100vh-6rem)] overflow-y-auto overflow-x-hidden no-scrollbar">
            {/* Hot Trends Section */}
            <div className="w-full border border-white/5 rounded-[20px] flex flex-col p-5">
                <h3 className="font-bold flex items-center gap-2 mb-4 text-base">
                    <span className="text-xl">🔥</span> Hot Trends
                </h3>
                      <Separator className="my-2 md:my-0 hidden md:block opacity-40" />

                <div className="flex flex-col gap-y-5">
                    {HotTrendsData.map((post, idx) => (
                        <div key={idx} className="flex flex-col">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-x-2">
                                    <CustomAvatar src={post.image || ""} name={post.name} className="size-10" />
                                    <div className="flex flex-col leading-tight">
                                        <p className="font-semibold text-sm flex items-center gap-1">
                                            {post.name} <span className="text-muted-foreground font-normal text-xs">• {post.time}</span>
                                        </p>
                                        <p className="text-xs text-muted-foreground">@{post.username}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between gap-3">
                                <div className="flex-1">
                                    <p className="text-sm font-medium mb-3 leading-relaxed">
                                        {post.content.split(' ').map((word, i) =>
                                            word.startsWith('#') ? <span key={i} className="text-blue-500">{word} </span> : word + ' '
                                        )}
                                    </p>
                                    <div className="flex items-center gap-4 text-muted-foreground text-xs font-medium">
                                        <div className="flex items-center gap-1.5 focus:outline-none cursor-pointer">
                                            <FaHeart className="size-3.5" /> {post.likes}
                                        </div>
                                        <div className="flex items-center gap-1.5 focus:outline-none cursor-pointer">
                                            <BiMessageRounded className="size-4" /> {post.comments}
                                        </div>
                                    </div>
                                </div>
                                {post.image && (
                                    <div className="w-24 h-[70px] shrink-0 relative rounded-lg overflow-hidden my-auto">
                                        <Image src={post.image} alt="post media" fill className="object-cover" />
                                    </div>
                                )}
                            </div>

                            {idx !== HotTrendsData.length - 1 && <Separator className="mt-5 opacity-50" />}
                        </div>
                    ))}
                    <Button variant="link" className="text-blue-500 justify-start px-0 -mt-2 h-auto text-sm font-medium">
                        View more
                    </Button>
                </div>
            </div>

            {/* Who to Connect With Section */}
            <div className="w-full border border-white/5 rounded-[20px] flex flex-col p-5">
                <h3 className="font-bold mb-5 text-base text-white/90">Who to Connect With</h3>

                <div className="flex flex-col gap-y-4">
                    {ConnectWithData.map((person, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                            <div className="flex items-center gap-x-3">
                                <CustomAvatar src="" name={person.name} className="size-10" />
                                <div className="flex flex-col leading-tight">
                                    <p className="font-semibold text-sm">{person.name}</p>
                                    <p className="text-xs text-muted-foreground">@{person.username}</p>
                                </div>
                            </div>
                            <Button size="sm" className="h-8 rounded-full bg-[#0D52D2] hover:bg-[#0D52D2]/90 text-white px-5 text-xs font-semibold">
                                Follow
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RightSidebar;
