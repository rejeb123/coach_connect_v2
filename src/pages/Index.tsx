import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CoachCard from '@/components/CoachCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Search } from 'lucide-react';

const Index = () => {
  const { coaches, filteredCoaches, filterCoaches } = useData();
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("all");
  const navigate = useNavigate();

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "all") {
      filterCoaches(null);
    } else {
      filterCoaches(value);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="relative bg-gradient-to-r from-primary to-secondary h-[500px] flex items-center">
        <div className="absolute inset-0 bg-black/20"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              Find the Perfect Coach for Your Fitness Journey
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Connect with expert coaches and get personalized training programs and meal plans to achieve your fitness goals.
            </p>
            {!isAuthenticated && (
              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg" 
                  onClick={() => navigate("/signup?role=client")}
                  className="bg-white text-primary hover:bg-white/90 text-lg"
                >
                  Join as Client
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => navigate("/signup?role=coach")}
                  className="bg-transparent border-white text-white hover:bg-white/10 text-lg"
                >
                  Become a Coach
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">How CoachConnect Works</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              We connect you with expert coaches who provide personalized guidance for your fitness journey
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Find a Coach</h3>
              <p className="text-gray-600">
                Browse our selection of expert coaches and find the perfect match for your fitness goals.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Subscribe</h3>
              <p className="text-gray-600">
                Subscribe to your chosen coach and get access to personalized programs and support.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Achieve Results</h3>
              <p className="text-gray-600">
                Follow your personalized plans and achieve the results you've been striving for.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Available Coaches</h2>
            <p className="mt-4 text-xl text-gray-600">
              Expert coaches ready to help you achieve your fitness goals
            </p>
          </div>
          
          <Tabs defaultValue="all" onValueChange={handleTabChange} className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="Strength Training">Strength</TabsTrigger>
                <TabsTrigger value="Yoga">Yoga</TabsTrigger>
                <TabsTrigger value="Diet">Diet</TabsTrigger>
                <TabsTrigger value="Weight Loss">Weight Loss</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value={activeTab} className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCoaches.map((coach) => (
                  <CoachCard key={coach.id} coach={coach} />
                ))}
              </div>
              
              {filteredCoaches.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No coaches found for this category.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
          
          <div className="mt-12 text-center">
            <Button 
              onClick={() => navigate("/coaches")} 
              size="lg"
              variant="outline"
              className="text-primary hover:bg-primary/5"
            >
              View All Coaches
            </Button>
          </div>
        </div>
      </section>
      
      {!isAuthenticated && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl overflow-hidden shadow-lg">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/2 p-8 md:p-12">
                  <h2 className="text-3xl font-bold text-white mb-4">
                    Ready to Transform Your Fitness Journey?
                  </h2>
                  <p className="text-white/90 text-lg mb-6">
                    Join CoachConnect today and get matched with the perfect coach for your goals and preferences.
                  </p>
                  <Button 
                    onClick={() => navigate("/signup")} 
                    size="lg"
                    className="bg-white text-primary hover:bg-white/90"
                  >
                    Get Started Now
                  </Button>
                </div>
                
                <div className="md:w-1/2 bg-white/10 p-8 md:p-12 flex items-center justify-center">
                  <img 
                    src="https://images.unsplash.com/photo-1581122584612-713f89daa8eb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                    alt="Fitness training" 
                    className="rounded-lg shadow-lg max-w-full h-auto" 
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      
      <Footer />
    </div>
  );
};

export default Index;
