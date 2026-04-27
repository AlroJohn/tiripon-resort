import { X } from "lucide-react";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";

export default function Footer() {
  return (
    <div className="md:h-fit min-h-full w-full flex flex-col items-center">
      <div className="h-[20dvh] w-full max-w-[90dvw] overflow-hidden pb-12">
        <div className=" flex flex-row gap-4 items-center justify-center">
          <Separator className="border border-accent-foreground/50" />
          <img src={"logo/logo.png"} alt="Logo" className="h-32" />
          <Separator className="border border-accent-foreground/50" />
        </div>
      </div>
      <div className="max-w-[90dvw] w-full h-full grid grid-cols-3 gap-6 border border-black">
        <div className="col-span-1 flex flex-col gap-4">
          <h3 className="text-lg font-bold ">About Us</h3>
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
        <div className="col-span-1 border border-black flex flex-row min-h-[20dvh]">
          <div className="w-full border border-black flex flex-col gap-4">
            <h3 className="text-lg font-bold">Hours</h3>
            <div className="pl-4">
              <p>Monday - Friday: 9am - 6pm</p>
              <p>Saturday: 10am - 4pm</p>
              <p>Sunday: Closed</p>
            </div>
          </div>
          <div className="w-full flex flex-col gap-4">
            <h3 className="text-lg font-bold">Terms</h3>
            <div className="pl-4">
              <p>Facebook</p>
              <p>Twitter</p>
              <p>Instagram</p>
            </div>
          </div>
        </div>
        <div className="col-span-1 flex flex-col gap-4">
          <h3 className="capitalize text-lg font-bold">
            Subscribe to our newsletter
          </h3>
          <Input className="border rounded-none max-w-[80%]" />
        </div>
      </div>
      <Separator className="border border-black" />
      <div className="max-w-[90dvw] w-full border border-black h-[10dvh] flex justify-between items-center">
        <p>Hotel and Resort created by Alro John Mercado</p>
        <p>Copyright &copy; {new Date().getFullYear()} All rights reserved.</p>
      </div>
    </div>
  );
}
