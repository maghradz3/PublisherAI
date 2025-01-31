import LeftSideBar from "@/components/ui/LeftSideBar";

import RigthSideBar from "@/components/ui/RigthSideBar";
import Image from "next/image";

import { Toaster } from "@/components/ui/toaster";
import PublicationPlayer from "@/components/PublicationPlayer";
import MobileNav from "@/components/MobileNav";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex flex-col">
      <main className="relative flex bg-black-3">
        <LeftSideBar />
        <section className=" flex min-h-screen flex-1 flex-col p-4 sm:px-14">
          <div className="mx-auto flex w-full max-w-5xl flex-col max-sm:px-4">
            <div className="flex h-16 items-center justify-between md:hidden">
              <Image
                src="/Publishe-trans.png"
                alt="main logo"
                width={50}
                height={50}
              />
              <MobileNav />
            </div>
            <div className="flex flex-col md:pb-14">
              <Toaster />
              {children}
            </div>
          </div>
        </section>

        <RigthSideBar />
      </main>
      <PublicationPlayer />
    </div>
  );
}
