import { Button } from "components/ui/button";
import Image from "next/image";
import { BiSolidGift } from "react-icons/bi";
import LiveStreamDialog from "./LiveStreamDialog";
import VSCoin from "components/ui/custom/vs-coin";
import { IoIosArrowForward } from "react-icons/io";
import { useState } from "react";

const LiveStreamGift = () => {
  const [sendingGift, setSendingGift] = useState(false);
  const [giftSent, setGiftSent] = useState(false);
  const [balanceInsufficient, setBalanceInsufficient] = useState(false);
  const [recharging, setRecharging] = useState(false);
  const [recharged, setRecharged] = useState(false);
  const [selectedGift, setSelectedGift] = useState(1);
  const [selectedBalance, setSelectedBalance] = useState(1);

  const getTitle = () => {
    if (sendingGift) return "Gifts";
    if (recharging) return "Recharge";
    if (giftSent || balanceInsufficient || recharged) return null;
    return null;
  };

  const handleSendGift = () => {
    // Simulate checking balance
    const hasEnoughBalance = Math.random() > 0.5; // For demo purposes

    if (hasEnoughBalance) {
      setGiftSent(true);
      setSendingGift(false);
      setRecharging(false);
      setBalanceInsufficient(false);
      setRecharged(false);
    } else {
      setBalanceInsufficient(true);
      setSendingGift(false);
      setRecharging(false);
      setGiftSent(false);
      setRecharged(false);
    }
  };

  const handleRecharge = () => {
    setRecharged(true);
    setRecharging(false);
    setBalanceInsufficient(false);
    setSendingGift(false);
    setGiftSent(false);
  };

  const handleOkayClick = () => {
    // Reset all states
    setGiftSent(false);
    setRecharged(false);
    setBalanceInsufficient(false);
    setRecharging(false);
    setSendingGift(true);
  };

  const handleRechargeClick = () => {
    setRecharging(true);
    setBalanceInsufficient(false);
    setSendingGift(false);
    setGiftSent(false);
    setRecharged(false);
  };

  const handleGiftClick = () => {
    setSendingGift(true);
    setRecharging(false);
    setGiftSent(false);
    setBalanceInsufficient(false);
    setRecharged(false);
  };

  return (
    <LiveStreamDialog
      removeFooterBorder={sendingGift ? true : false}
      contentClassName={`${
        giftSent || recharged || balanceInsufficient
          ? "w-[420px] h-[420px]"
          : "max-w-[650px] max-h-[500px] h-fit"
      } `}
      trigger={
        <div
          className="bg-white/10 rounded-full size-10 place-content-center items-center cursor-pointer"
          onClick={handleGiftClick}
        >
          <BiSolidGift className="size-5 flex mx-auto" />
        </div>
      }
      title={getTitle()}
      leftAndRightButton={
        balanceInsufficient ? (
          <span className="font-semibold cursor-pointer" onClick={handleRechargeClick}>
            Recharge
          </span>
        ) : null
      }
      footer={
        recharging ? (
          <Button className="text-foreground" size="lg" onClick={handleRecharge}>
            Recharge
          </Button>
        ) : giftSent || recharged ? (
          <span
            className="font-semibold text-center -mb-10 cursor-pointer"
            onClick={handleOkayClick}
          >
            Okay
          </span>
        ) : sendingGift ? (
          <Button
            size={"lg"}
            className="bg-accent !border-none !outline-none !ring-0 font-semibold text-center mx-auto text-foreground px-3 flex flex-row items-center mb-4 justify-between w-40"
            onClick={handleSendGift}
          >
            <span className="flex items-center gap-x-1 flex-row">
              <VSCoin />
              <p>2,489</p>
            </span>
            <IoIosArrowForward className="size-5" />
          </Button>
        ) : null
      }
    >
      <div className={` h-full overflow-y-hidden`}>
        {giftSent && (
          <div className="flex flex-col gap-y-4 place-items-center text-center">
            <Image
              src={"/images/successful-check.png"}
              alt="success"
              width={150}
              height={150}
            />
            <p className="text-center font-semibold">Gift Sent Successfully!</p>
            <p>Your Protea flower gift has been successfully delivered to the host.</p>
          </div>
        )}
        {recharged && (
          <div className="flex flex-col gap-y-4 place-items-center text-center">
            <Image
              src={"/images/successful-check.png"}
              alt="success"
              width={150}
              height={150}
            />
            <p className="text-center font-semibold">Recharged Successfully!</p>
            <p>You have successfully recharged your balance.</p>
          </div>
        )}
        {balanceInsufficient && (
          <div className="flex flex-col gap-y-4 place-items-center text-center">
            <Image
              src={"/images/successful-check.png"}
              alt="question-and-answer"
              width={150}
              height={150}
            />
            <p className="text-center font-semibold">Balance Insufficient!</p>
            <p>
              Your balance is insufficient to send this gift. Please recharge your balance.
            </p>
          </div>
        )}
        {sendingGift && (
          <div className="h-full overflow-y-auto py-8">
            <div className="grid grid-cols-4 overflow-y-auto gap-10">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-0 cursor-pointer"
                  onClick={() => setSelectedGift(index)}
                >
                  <div
                    className={`${
                      selectedGift === index && "bg-secondary rounded-t-xl"
                    } py-2 flex flex-col gap-y-2 h-[175px] place-items-center`}
                  >
                    <Image
                      src={"/images/gifts/baobab-tree.png"}
                      alt="question-and-answer"
                      width={100}
                      height={100}
                    />
                    <div className="flex flex-col place-items-center">
                      <p className="text-center">Baobab Tree</p>
                      <div className="flex items-center gap-x-1.5">
                        <VSCoin />
                        <p>50</p>
                      </div>
                    </div>
                  </div>
                  {selectedGift === index && (
                    <Button
                      size={"sm"}
                      className="rounded-b-xl rounded-t-none text-foreground !border-none !outline-none !ring-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSendGift();
                      }}
                    >
                      Send
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        {recharging && (
          <div className="h-full overflow-y-auto">
            <div className="grid grid-cols-3 overflow-y-hidden gap-5">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className={`rounded-xl h-[100px] flex justify-center items-center cursor-pointer ${
                    selectedBalance === index ? "bg-primary" : "bg-secondary"
                  }`}
                  onClick={() => setSelectedBalance(index)}
                >
                  <div className="flex flex-col items-center gap-y-1">
                    <div className="flex items-center gap-x-1.5">
                      <VSCoin />
                      <p className="font-semibold">50</p>
                    </div>
                    <p
                      className={`text-xs ${
                        selectedBalance === index ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      $12.70
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </LiveStreamDialog>
  );
};

export default LiveStreamGift;
