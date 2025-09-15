import Image from "next/image";
import { Navbar } from "@/components/layouts/navbar";
import { getCurrentUser } from "@/lib/auth";

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <Navbar user={user} />
      
      {/* Static Hero Image - Full Screen */}
      <div className="relative w-full h-[calc(100vh-4rem)]">
        <Image
          src="/image4.svg"
          alt="ZEST hero static image"
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
}
