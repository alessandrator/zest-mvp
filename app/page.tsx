import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fbfe5e' }}>
      {/* Header */}
      <header className="py-8" style={{ backgroundColor: '#fbfe5e' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-gaiza-stencil text-6xl md:text-8xl font-bold text-black">
              zest
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Headline */}
          <h2 className="font-gaiza-stencil text-4xl md:text-6xl font-bold text-black mb-8">
            New Drops! Testa .Genera.Rilancia.
          </h2>
          
          {/* Subtitle */}
          <p className="font-gaiza-stencil text-2xl md:text-3xl text-black mb-16">
            Un ponte giallo tra brand e creativi.
          </p>
          
          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              size="lg" 
              className="bg-black text-[#fbfe5e] hover:bg-gray-800 px-8 py-4 text-xl font-semibold min-w-[160px]"
              asChild
            >
              <Link href="/login">Accedi</Link>
            </Button>
            <Button 
              size="lg" 
              className="bg-black text-[#fbfe5e] hover:bg-gray-800 px-8 py-4 text-xl font-semibold min-w-[160px]"
              asChild
            >
              <Link href="/request-access">Registrati</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
