import CustomAvatar from "components/ui/custom/custom-avatar";

const QuestionsAndAnswers = () => {
  return (
    <div className="flex flex-row gap-x-3">
      <CustomAvatar src={"/images/beautiful-image.webp"} className="size-11" name="John Doe" />
      <div className="flex flex-col">
        <p className="font-medium">John Doe</p>
        <p className="text-muted-foreground">
          Actually i want to ask an important thing,How did you get started in Actually i want
          to ask an important thing,How did you get started in Actually i want to ask an
          important thing,How did you get started in Actually i want to ask an important
          thing,How did you get started in
        </p>
      </div>
    </div>
  );
};

export default QuestionsAndAnswers;
