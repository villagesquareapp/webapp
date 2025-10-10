
"use client";

import { Button } from "components/ui/button";
import { useCallback, useMemo, useState } from "react";
import LiveStreamDialog from "./LiveStreamDialog";
import { FaArrowLeft, FaVideo } from "react-icons/fa";
import StreamSourceStep from "./StreamSourceStep";
import StreamInfoStep from "./StreamInfoStep";
import { createLivestream } from "api/livestreams";
import { getFormattedDateTime } from "lib/getFormattedDateTime";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const StreamSetupModal = () => {
  const router = useRouter();
  type StreamStep = "INFO" | "SOURCE" | "COHOST";
  const [currentStep, setCurrentStep] = useState<StreamStep>("INFO");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // State for Form Fields
  const [showAdditionalSettings, setShowAdditionalSettings] = useState<boolean>(false);
  const [titleInput, setTitleInput] = useState<string>("");
  const [category, setCategory] = useState<string | null>(null);
  const [privacy, setPrivacy] = useState<string | null>(null);
  const [streamSource, setStreamSource] = useState<string | null>(null);
  const [commentsEnabled, setCommentsEnabled] = useState<boolean>(false);
  const [questionsEnabled, setQuestionsEnabled] = useState<boolean>(false);
  const [giftingEnabled, setGiftingEnabled] = useState<boolean>(false);

  const handleBack = useCallback(() => {
    if (currentStep === "SOURCE") {
      setCurrentStep("INFO");
    }
  }, [currentStep]);

  const title = useMemo(() => {
    switch (currentStep) {
      case "INFO":
        return "Go Live: Stream Information";
      case "SOURCE":
        return "Go Live: Select Stream Source";
      case "COHOST":
        return "Add Cohost";
      default:
        return "Go Live";
    }
  }, [currentStep]);

  const isNextDisabled = useMemo(() => {
    if (currentStep === "INFO") {
      return !category || !privacy;
    }
    return false;
  }, [currentStep, category, privacy]);

  const handleGoLive = useCallback(async () => {
    if (!category || !privacy) return;

    const { startDate, startTime } = getFormattedDateTime();
    setIsLoading(true);

    const formData = new FormData();
    formData.append("title", titleInput || "Untitled Livestream");
    formData.append("category_id", "1");
    formData.append('privacy', privacy);
    formData.append('start_date', startDate); 
    formData.append('start_time', startTime);
    formData.append('comments_enabled', commentsEnabled ? 'true' : 'false');
    formData.append('questions_enabled', questionsEnabled ? 'true' : 'false');
    formData.append('gifting_enabled', giftingEnabled ? 'true' : 'false');

    try {
      const response = await createLivestream(formData);

      if (response.status && response.data) {
        toast.success("Livestream created successfully!");
        
        // Close the modal by resetting state
        setCurrentStep("INFO");
        setTitleInput("");
        setCategory(null);
        setPrivacy(null);
        setStreamSource(null);
        setCommentsEnabled(false);
        setQuestionsEnabled(false);
        setGiftingEnabled(false);
        
        // Redirect to the livestream setup page
        router.push(`/dashboard/live-streams/${response.data.uuid}`);
      } else {
        toast.error(response.message || "Failed to create livestream");
      }
    } catch (error) {
      console.error("API error during Go Live:", error);
      toast.error("An error occurred while creating the livestream");
    } finally {
      setIsLoading(false);
    }
  }, [
    titleInput,
    category,
    privacy,
    commentsEnabled,
    questionsEnabled,
    giftingEnabled,
    router
  ]);

  const footerContent = useMemo(() => {
    if (currentStep === "INFO") {
      return (
        <Button
          disabled={isNextDisabled}
          onClick={() => setCurrentStep("SOURCE")}
          className="text-foreground"
          size="lg"
        >
          Next
        </Button>
      );
    }
    if (currentStep === "SOURCE") {
      return (
        <Button
          onClick={handleGoLive}
          disabled={!streamSource || isLoading}
          className="text-foreground bg-primary hover:bg-primary/90"
          size="lg"
        >
          {isLoading ? "Creating..." : "Go Live"}
        </Button>
      );
    }
    return null;
  }, [currentStep, isNextDisabled, handleGoLive, streamSource, isLoading]);

  const renderContent = useMemo(() => {
    switch (currentStep) {
      case "INFO":
        return (
          <StreamInfoStep
            category={category}
            setCategory={setCategory}
            privacy={privacy}
            setPrivacy={setPrivacy}
            showAdditionalSettings={showAdditionalSettings}
            setShowAdditionalSettings={setShowAdditionalSettings}
            setTitleInput={setTitleInput}
            commentsEnabled={commentsEnabled}
            setCommentsEnabled={setCommentsEnabled}
            questionsEnabled={questionsEnabled}
            setQuestionsEnabled={setQuestionsEnabled}
            giftingEnabled={giftingEnabled}
            setGiftingEnabled={setGiftingEnabled}
          />
        );
      case "SOURCE":
        return (
          <StreamSourceStep
            streamSource={streamSource}
            setStreamSource={setStreamSource}
          />
        );
      case "COHOST":
        return <div>Cohost selection coming soon...</div>;
      default:
        return null;
    }
  }, [
    currentStep,
    category,
    setCategory,
    privacy,
    setPrivacy,
    showAdditionalSettings,
    setShowAdditionalSettings,
    streamSource,
    setStreamSource,
    commentsEnabled,
    setCommentsEnabled,
    questionsEnabled,
    setQuestionsEnabled,
    giftingEnabled,
    setGiftingEnabled
  ]);

  return (
    <LiveStreamDialog
      trigger={
        <Button className="ml-auto text-foreground rounded-full py-1 flex my-auto items-center relative">
          <FaVideo className="size-4" /> <span>Go Live</span>
        </Button>
      }
      backIcon={
        currentStep !== "INFO" && (
          <FaArrowLeft className="size-5 cursor-pointer" onClick={handleBack} />
        )
      }
      title={title}
      footer={footerContent}
    >
      {renderContent}
    </LiveStreamDialog>
  );
};

export default StreamSetupModal;
