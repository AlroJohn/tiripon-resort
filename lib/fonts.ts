import localFont from "next/font/local";

export const bodoniModa = localFont({
  src: [
    {
      path: "../public/fonts/BodoniModa-VariableFont_opsz,wght.ttf",
      weight: "400 900",
      style: "normal",
    },
  ],
  variable: "--font-bodoni-moda",
  display: "swap",
});

export const urbanist = localFont({
  src: [
    {
      path: "../public/fonts/Urbanist-VariableFont_wght.ttf",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--font-urbanist",
  display: "swap",
});

export const googleSans = localFont({
  src: [
    {
      path: "../public/fonts/GoogleSansFlex-VariableFont_GRAD,ROND,opsz,slnt,wdth,wght.ttf",
      weight: "100 1000",
      style: "normal",
    },
  ],
  variable: "--font-google-sans",
  display: "swap",
});

export const spanLight = localFont({
  src: [
    {
      path: "../public/fonts/span-light.otf",
      weight: "300",
      style: "normal",
    },
  ],
  variable: "--font-span-light",
  display: "swap",
});