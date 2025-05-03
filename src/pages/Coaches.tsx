import { useState, useEffect } from "react";
import { useData } from "@/contexts/DataContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CoachCard from "@/components/CoachCard";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

const Coaches = () => {
  const { coaches } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const [specialty, setSpecialty] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Get unique specialties for filter dropdown, filter out undefined/null/empty
  const specialties = [
    ...new Set(
      coaches
        .map(coach => coach.specialty && coach.specialty.trim())
        .filter(Boolean)
    ),
  ];

  // Filter coaches based on search term and specialty (case-insensitive)
  const filteredCoaches = coaches.filter(coach => {
    const matchesSearch =
      coach.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (coach.bio && coach.bio.toLowerCase().includes(searchTerm.toLowerCase()));

    // Show all coaches (even those without specialty) when "all" is selected
    if (specialty === "all") {
      return matchesSearch;
    }

    const matchesSpecialty =
      coach.specialty &&
      coach.specialty.toLowerCase() === specialty.toLowerCase();

    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Your Perfect Coach</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover expert coaches who can help you achieve your fitness and health goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 max-w-3xl mx-auto">
            <div>
              <Input
                placeholder="Search coaches by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>

            <div>
              <Select value={specialty} onValueChange={setSpecialty}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by specialty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specialties</SelectItem>
                  {specialties.map((specialty) => (
                    <SelectItem key={specialty} value={specialty}>
                      {specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredCoaches.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No coaches found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCoaches.map((coach, index) => (
                <div
                  key={coach.id}
                  className="opacity-0 animate-fade-in"
                  style={{
                    animationDelay: `${index * 150}ms`,
                    animationFillMode: "forwards",
                  }}
                >
                  <CoachCard coach={coach} />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Coaches;