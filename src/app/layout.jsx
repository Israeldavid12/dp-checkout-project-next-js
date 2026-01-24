import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Logo from "../../public/logo.webp"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "DROP PAYMENTS CHECKOUT",
  description: "DROP PAYMENTS CHECKOUT",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="facebook-domain-verification" content="m9lhexr65migrozujswi9cvefbcfpf" />
        <link rel="shortcut icon" href={Logo.src} type="image/x-icon" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css"
        />
        <link rel="shortcut icon" href={Logo} type="image/x-icon" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
