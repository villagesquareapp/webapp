import { Button } from "components/ui/button";
import { FaVideo } from "react-icons/fa";

const GoLiveButton = () => {
  return (
    <Button className="ml-auto text-foreground rounded-full py-1 flex my-auto items-center relative">
      <FaVideo className="size-4" /> <span>Go Live</span>
    </Button>
  );
};

export default GoLiveButton;
