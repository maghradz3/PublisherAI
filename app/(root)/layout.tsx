import LeftSideBar from "@/components/ui/LeftSideBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <main>
        <LeftSideBar/>
        {children}
        <p className="text-white-1"> Right Sidebar</p>
      </main>
    </div>
  );
}
