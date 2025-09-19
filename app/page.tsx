import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/layouts/navbar";
import { getCurrentUser } from "@/lib/auth";

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-white">
      <Navbar user={user} />
      
      {/* Hero Section */}
      <section className="bg-primary py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-display font-bold text-dark mb-6">
              New Drops! Test. Generate. Relaunch.
            </h1>
            <p className="text-xl text-dark mb-8 max-w-3xl mx-auto">
              A yellow bridge between brands and creators.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Button size="lg" asChild>
                  <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button size="lg" asChild>
                    <Link href="/request-access">Get Started</Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link href="/campaigns">Browse Campaigns</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-dark mb-4">
              Why Choose ZEST?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform creates meaningful connections between brands and student creators, 
              fostering authentic partnerships that drive real results.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-primary text-4xl font-bold mb-2">🎯</CardTitle>
                <CardTitle>Targeted Reach</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Connect with students and young creators who understand your target demographic 
                  and can create authentic content that resonates.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-primary text-4xl font-bold mb-2">🤝</CardTitle>
                <CardTitle>Authentic Partnerships</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Build genuine relationships with creators who believe in your brand, 
                  resulting in more engaging and trustworthy marketing content.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-primary text-4xl font-bold mb-2">📊</CardTitle>
                <CardTitle>Measurable Results</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Track campaign performance with detailed analytics and insights 
                  to optimize your marketing strategy and ROI.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-dark mb-4">
              How ZEST Works
            </h2>
            <p className="text-lg text-gray-600">
              Simple steps to launch your next successful campaign
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-dark font-bold text-xl">1</span>
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">Create Campaign</h3>
              <p className="text-gray-600">Brands post detailed campaign briefs with requirements and budget</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-dark font-bold text-xl">2</span>
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">Creators Apply</h3>
              <p className="text-gray-600">Students and influencers submit proposals with their ideas and portfolio</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-dark font-bold text-xl">3</span>
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">Collaborate</h3>
              <p className="text-gray-600">Brands select creators and work together to produce amazing content</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-dark font-bold text-xl">4</span>
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">Launch & Measure</h3>
              <p className="text-gray-600">Deploy campaigns and track performance with detailed analytics</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-dark mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of brands and creators who are already using ZEST to create 
            impactful marketing campaigns.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/request-access">Join as Creator</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/request-access">Partner as Brand</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-primary rounded-lg p-2">
                  <span className="text-dark font-logo font-bold text-xl">Z</span>
                </div>
                <span className="font-logo font-bold text-xl">ZEST</span>
              </div>
              <p className="text-gray-400">
                Connecting brands with student creators for authentic marketing campaigns.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/campaigns" className="hover:text-primary transition-colors">Browse Campaigns</Link></li>
                <li><Link href="/about" className="hover:text-primary transition-colors">About</Link></li>
                <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">For Creators</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/request-access" className="hover:text-primary transition-colors">Join as Creator</Link></li>
                <li><Link href="/login" className="hover:text-primary transition-colors">Creator Login</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">For Brands</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/request-access" className="hover:text-primary transition-colors">Partner with Us</Link></li>
                <li><Link href="/login" className="hover:text-primary transition-colors">Brand Login</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ZEST. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
