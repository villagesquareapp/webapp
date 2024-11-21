import NewSocialField from "components/Dashboard/Social/NewSocialField";
import SocialPost from "components/Dashboard/Social/SocialPost";
import SocialFlash from "components/Dashboard/Social/SocialFlash";
import AddPost from "components/Dashboard/Social/AddPost";

const SocialPage = () => {
  return (
    <div className="flex flex-col gap-y-4 w-full">
      <AddPost />
      <SocialFlash />
      <NewSocialField />
      <SocialPost />
    </div>
  );
};

export default SocialPage;
