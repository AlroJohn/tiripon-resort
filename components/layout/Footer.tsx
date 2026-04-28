import { ArrowRight, ArrowRightFromLine, X } from "lucide-react";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";

export default function Footer() {
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
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
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
                <Separator className="max-w-4 border" /> Monday - Friday: 9am -
                6pm
              </span>
              <span className="flex gap-2 items-center">
                <Separator className="max-w-4 border" />
                Saturday: 10am - 4pm
              </span>
              <span className="flex gap-2 items-center">
                <Separator className="max-w-4 border" /> Sunday: Closed
              </span>
            </div>
          </div>
          <div className="w-full flex flex-col gap-4">
            <h3 className="text-xl font-semibold ">Terms</h3>
            <div className="pl-4">
              <span className="flex gap-2 items-center">
                <Separator className="max-w-4 border" /> Privacy Policy
              </span>
              <span className="flex gap-2 items-center">
                <Separator className="max-w-4 border" /> Terms and Conditions
              </span>
              <span className="flex gap-2 items-center">
                <Separator className="max-w-4 border" /> Refund Policy
              </span>
              <span className="flex gap-2 items-center">
                <Separator className="max-w-4 border" /> Support
              </span>
            </div>
          </div>
        </div>
        <Separator className="border w-full md:hidden block" />
        <div className="col-span-1 flex flex-col gap-4 md:p-0 p-6 font-googlesansflex">
          <h3 className="capitalize text-xl font-semibold ">
            Subscribe to our newsletter
          </h3>
          <div className="relative w-full">
            <Input
              className=" h-14 pr-14 rounded-none border-4 border-brown/70"
              placeholder="Enter your email"
            />

            <ArrowRight className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 bg-till text-accent-foreground p-2 cursor-pointer" />
          </div>
        </div>
      </div>
      <Separator className="" />
      <div className="max-w-[90dvw] w-full md:py-6 py-6 h-[15dvh] md:h-[10dvh] flex md:flex-row flex-col gap-2 md:gap-4 justify-between items-center">
        <p className="text-center md:text-start">
          Hotel and Resort created by Alro John Mercado
        </p>
        <p>Copyright &copy; {new Date().getFullYear()} All rights reserved.</p>
      </div>
    </div>
  );
}
