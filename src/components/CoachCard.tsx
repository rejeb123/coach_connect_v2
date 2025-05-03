
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface CoachCardProps {
  coach: {
    id: string;
    name: string;
    profilePicture: string;
    specialty: string;
    bio: string;
    rating: number;
    clientCount: number;
  };
}

const CoachCard = ({ coach }: CoachCardProps) => {
  const { requestSubscription, subscriptions } = useData();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Check if the current client has a subscription with this coach
  const hasSubscription = isAuthenticated && user?.role === "client" && 
    subscriptions.some(sub => 
      sub.coachId === coach.id && 
      sub.clientId === user.id
    );

  // Get subscription status if exists
  const subscriptionStatus = hasSubscription ? 
    subscriptions.find(sub => sub.coachId === coach.id && sub.clientId === user?.id)?.status : 
    null;

  const handleSubscribe = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    requestSubscription(coach.id);
  };
  
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md hover:translate-y-[-5px] duration-300">
      <CardHeader className="p-0">
        <div className="h-28 bg-gradient-to-r from-primary/20 to-secondary/20">
          <div className="h-full w-full flex items-center justify-center">
            <Badge className="bg-white text-primary border border-primary/20">
              {coach.specialty}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 -mt-12 relative">
        <div className="flex flex-col items-center">
          <Avatar className="h-24 w-24 border-4 border-white shadow-md">
            <AvatarImage src={coach.profilePicture} alt={coach.name} />
            <AvatarFallback>{coach.name.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <h3 className="mt-2 text-xl font-semibold">{coach.name}</h3>
          
          <div className="flex items-center mt-1 space-x-2">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              <span className="ml-1 text-sm font-medium text-gray-700">
                {coach.rating} ({coach.clientCount} clients)
              </span>
            </div>
          </div>
          
          <p className="mt-3 text-sm text-gray-600 text-center">
            {coach.bio.length > 120 ? `${coach.bio.substring(0, 120)}...` : coach.bio}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <Button 
          variant="outline" 
          onClick={() => navigate(`/coach/${coach.id}`)} 
          className="flex-1 mr-2"
        >
          View Profile
        </Button>
        
        {user?.role !== "coach" && (
          <Button 
            onClick={handleSubscribe} 
            disabled={hasSubscription} 
            className="flex-1"
          >
            {subscriptionStatus === "pending" 
              ? "Request Pending" 
              : subscriptionStatus === "active" 
                ? "Subscribed" 
                : "Subscribe"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default CoachCard;
