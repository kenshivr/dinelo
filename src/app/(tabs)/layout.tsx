import { NavBar } from "@/components/nav-bar";

export default function TabsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col">
      <main className="flex flex-1 flex-col gap-3 px-[18px] pt-[calc(env(safe-area-inset-top)+12px)]">
        {children}
      </main>
      <NavBar />
    </div>
  );
}
