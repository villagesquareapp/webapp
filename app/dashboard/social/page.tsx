import NewSocialField from "components/Dashboard/Social/NewSocialField";
import SocialPost from "components/Dashboard/Social/SocialPost";
import SocialFlash from "components/Dashboard/Social/SocialFlash";

const SocialPage = () => {
  return (
    <div className="flex flex-col gap-y-4 w-full">
      <SocialFlash />
      <NewSocialField />
      <SocialPost />
    </div>
  );
};

export default SocialPage;
