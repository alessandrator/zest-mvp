import { Navbar } from "@/components/layouts/navbar";
import { NewHeroSection } from "@/components/ui/new-hero-section";
import { getCurrentUser } from "@/lib/auth";

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-gray-200 overflow-x-hidden">
      <Navbar user={user} />
      
      {/* New Hero Section - faithful to the provided design */}
      <NewHeroSection />
    </div>
  );
}
