"use client";

import { FormEvent, useState } from "react";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useSubscribe } from "@/hooks/use-subscribe";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialog,
  AlertDialogFooter,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

const policyContent = {
  privacy: {
    title: "Privacy Policy",
    description:
      "We only collect booking details needed to process reservations and guest support. Contact details are used for confirmation and updates, and are not sold to third parties.",
  },
  terms: {
    title: "Terms and Conditions",
    description:
      "Bookings are confirmed after required guest details are submitted and 50% down payment is acknowledged. Guests are expected to follow resort safety rules, respect facilities, and avoid disruptive behavior during their stay.",
  },
  refund: {
    title: "Refund Policy",
    description:
      "Refunds are available for cancellations made at least 2 to 3 days before the scheduled check-in date. Late cancellations and no-shows may be non-refundable depending on booking status.",
  },
  support: {
    title: "Support",
    description:
      "For booking updates, schedule changes, or general concerns, contact resort support through the official Facebook page or front desk contact channels during operating hours.",
  },
} as const;

type PolicyKey = keyof typeof policyContent;

export default function Footer() {
  const [activePolicy, setActivePolicy] = useState<PolicyKey | null>(null);
  const [isAntiBotModalOpen, setIsAntiBotModalOpen] = useState(false);
  const [antiBotTitle, setAntiBotTitle] = useState("Request Blocked");
  const [antiBotMessage, setAntiBotMessage] = useState("");
  const [pendingSubscribe, setPendingSubscribe] = useState<{
    email: string;
    website: string;
    formStartedAt: number;
  } | null>(null);
  const [isConfirmMode, setIsConfirmMode] = useState(false);
  const [subscriberEmail, setSubscriberEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [formStartedAt] = useState(() => Date.now());
  const { subscribe, isLoading } = useSubscribe();
  const activePolicyData = activePolicy ? policyContent[activePolicy] : null;

  const handleSubscribe = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const elapsed = Date.now() - formStartedAt;

    if (website.trim().length > 0) {
      setAntiBotTitle("Request Blocked");
      setAntiBotMessage("Bot-like submission detected. Request was blocked.");
      setIsAntiBotModalOpen(true);
      return;
    }

    if (elapsed < 1500) {
      setAntiBotTitle("Request Blocked");
      setAntiBotMessage(
        "Submission was too fast. Please wait a moment and try again.",
      );
      setIsAntiBotModalOpen(true);
      return;
    }

    setPendingSubscribe({
      email: subscriberEmail,
      website,
      formStartedAt,
    });
    setIsConfirmMode(true);
    setAntiBotTitle("Verify Submission");
    setAntiBotMessage(
      "Anti-bot checks passed. Continue and submit this email to the database?",
    );
    setIsAntiBotModalOpen(true);
  };

  const continueSubscribe = async () => {
    if (!pendingSubscribe) return;

    try {
      const message = await subscribe(pendingSubscribe);
      setAntiBotTitle("Anti-bot Verified");
      setAntiBotMessage(
        "Request passed anti-bot checks and your subscription was accepted.",
      );
      setIsConfirmMode(false);
      setSubscriberEmail("");
      setWebsite("");
      setPendingSubscribe(null);
      toast.success("Subscribed", { description: message });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Please try again later.";

      if (
        /request rejected|too many requests|too many attempts/i.test(message)
      ) {
        setAntiBotTitle("Request Blocked");
        setAntiBotMessage(message);
        setIsAntiBotModalOpen(true);
      }
      setPendingSubscribe(null);
      setIsConfirmMode(false);

      toast.error("Subscription failed", {
        description: message,
      });
    }
  };

  return (
    <div className="md:h-fit min-h-full w-full flex flex-col items-center pt-24">
      <div className="h-[20dvh] w-full max-w-[90dvw] overflow-hidden pb-12">
        <div className=" flex flex-row gap-4 items-center justify-center">
          <Separator className="border border-accent-foreground/50 md:block hidden" />
          <img src={"logo/logo.png"} alt="Logo" className="h-32" />
          <Separator className="border border-accent-foreground/50 md:block hidden" />
        </div>
      </div>
      <div className="md:max-w-[90dvw] w-full h-full md:grid md:grid-cols-4 sm:grid-cols-2 flex flex-col gap-6 pb-12">
        <Separator className="border w-full md:hidden block " />
        <div className="col-span-1 flex flex-col gap-4 font-googlesansflex md:p-0 p-4">
          <h3 className="text-2xl font-semibold ">About Us</h3>
          <p className="cormorant-garamond md:max-w-[80%]">
            Since 2019, our resort in Zone 8 Basagan, Tabaco City has welcomed
            families and friends with relaxing day stays, scenic views, and warm
            local hospitality.
          </p>
          <div className="flex gap-2">
            <img
              className="max-w-8 max-h-8"
              src={"svg/facebook.svg"}
              alt="Facebook"
            />
            <img
              className="max-w-8 max-h-8"
              src={"svg/twitter.svg"}
              alt="Twitter"
            />
            <img
              className="max-w-8 max-h-8"
              src={"svg/instagram.svg"}
              alt="Instagram"
            />
          </div>
        </div>
        <Separator className="border w-full md:hidden block" />
        <div className="font-googlesansflex col-span-2 md:p-0 p-4 flex flex-row gap-6 w-full min-h-[20dvh]">
          <div className="w-full  flex flex-col gap-4">
            <h3 className="text-xl font-semibold ">Hours</h3>
            <div className="">
              <span className="flex gap-2 items-center">
                <Separator className="max-w-4 border" /> Monday - Friday: 7am -
                6pm
              </span>
              <span className="flex gap-2 items-center">
                <Separator className="max-w-4 border" />
                Saturday - Sunday: 8am - 6pm
              </span>
            </div>
          </div>
          <div className="w-full flex flex-col gap-4">
            <h3 className="text-xl font-semibold ">Terms</h3>
            <div className="pl-4 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setActivePolicy("privacy")}
                className="flex w-full items-center gap-2 text-left"
              >
                <Separator className="max-w-4 border" />
                <span className="break-normal whitespace-normal">
                  Privacy Policy
                </span>
              </button>
              <button
                type="button"
                onClick={() => setActivePolicy("terms")}
                className="flex w-full items-center gap-2 text-left"
              >
                <Separator className="max-w-4 border" />
                <span className="break-normal whitespace-normal">
                  Terms and Conditions
                </span>
              </button>
              <button
                type="button"
                onClick={() => setActivePolicy("refund")}
                className="flex w-full items-center gap-2 text-left"
              >
                <Separator className="max-w-4 border" />
                <span className="break-normal whitespace-normal">
                  Refund Policy
                </span>
              </button>
              <button
                type="button"
                onClick={() => setActivePolicy("support")}
                className="flex w-full items-center gap-2 text-left"
              >
                <Separator className="max-w-4 border" />
                <span className="break-normal whitespace-normal">Support</span>
              </button>
            </div>
          </div>
        </div>
        <Separator className="border w-full md:hidden block" />
        <div className="col-span-1 flex flex-col gap-4 md:p-0 p-6 font-googlesansflex">
          <h3 className="capitalize text-xl font-semibold ">
            Subscribe to our newsletter
          </h3>
          <form className="relative w-full" onSubmit={handleSubscribe}>
            <Input
              type="email"
              value={subscriberEmail}
              onChange={(event) => setSubscriberEmail(event.target.value)}
              required
              className="h-14 pr-14 rounded-none border-4 border-brown/70"
              placeholder="Enter your email"
            />
            <input
              type="text"
              name="website"
              value={website}
              onChange={(event) => setWebsite(event.target.value)}
              tabIndex={-1}
              autoComplete="off"
              className="sr-only"
              aria-hidden="true"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2"
              aria-label="Subscribe"
            >
              <ArrowRight className="h-10 w-10 bg-till p-2 text-accent-foreground cursor-pointer" />
            </button>
          </form>
        </div>
      </div>
      <Separator className="" />
      <div className="max-w-[90dvw] w-full py-6 h-[15dvh] md:h-[10dvh] flex md:flex-row flex-col gap-2 md:gap-4 md:justify-between justify-center items-center">
        <p className="text-center md:text-start">
          Hotel and Resort created by Alro John Mercado
        </p>
        <p>Copyright &copy; {new Date().getFullYear()} All rights reserved.</p>
      </div>

      <AlertDialog
        open={isAntiBotModalOpen}
        onOpenChange={setIsAntiBotModalOpen}
      >
        <AlertDialogContent className="rounded-none bg-cream text-brown sm:max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading text-3xl">
              {antiBotTitle}
            </AlertDialogTitle>
            <AlertDialogDescription className="font-googlesansflex text-brown/80">
              {antiBotMessage ||
                "Your request was blocked by our anti-bot checks. Please try again in a moment."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {isConfirmMode ? (
              <>
                <AlertDialogCancel
                  className="rounded-none"
                  onClick={() => {
                    setPendingSubscribe(null);
                    setIsConfirmMode(false);
                  }}
                >
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  className="rounded-none bg-brown text-cream hover:bg-brown/90"
                  onClick={continueSubscribe}
                >
                  Continue
                </AlertDialogAction>
              </>
            ) : (
              <AlertDialogAction className="rounded-none bg-brown text-cream hover:bg-brown/90">
                Close
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={activePolicy !== null}
        onOpenChange={(isOpen) => {
          if (!isOpen) setActivePolicy(null);
        }}
      >
        <AlertDialogContent className="rounded-none bg-cream text-brown sm:max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading text-3xl">
              {activePolicyData?.title}
            </AlertDialogTitle>
            <AlertDialogDescription className="font-googlesansflex text-brown/80">
              {activePolicyData?.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction className="rounded-none bg-brown text-cream hover:bg-brown/90">
              Close
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
