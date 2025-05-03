
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useData } from "@/contexts/DataContext";
import { Subscription } from "@/contexts/DataContext";

interface ClientCardProps {
  client: {
    id: string;
    name: string;
    profilePicture?: string;
    bio?: string;
    email: string;
  };
  subscription: Subscription;
  onAccept: (subscriptionId: string) => void;
  onReject: (subscriptionId: string) => void;
  onViewDetails: (clientId: string) => void;
}

const ClientCard = ({ client, subscription, onAccept, onReject, onViewDetails }: ClientCardProps) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardContent className="pt-6 pb-2 relative">
        <div className="flex items-center">
          <Avatar className="h-12 w-12 border-2 border-white shadow">
            <AvatarImage src={client.profilePicture} alt={client.name} />
            <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <div className="ml-3">
            <h3 className="text-base font-semibold">{client.name}</h3>
            <p className="text-xs text-muted-foreground">{client.email}</p>
          </div>

          {subscription.status === "pending" && (
            <span className="absolute top-2 right-2 px-2 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-full">
              Pending
            </span>
          )}
          
          {subscription.status === "active" && (
            <span className="absolute top-2 right-2 px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
              Active
            </span>
          )}
          
          {subscription.status === "rejected" && (
            <span className="absolute top-2 right-2 px-2 py-1 text-xs font-medium text-red-800 bg-red-100 rounded-full">
              Rejected
            </span>
          )}
        </div>
        
        <p className="mt-3 text-sm text-gray-600">
          {client.bio ? (client.bio.length > 80 ? `${client.bio.substring(0, 80)}...` : client.bio) : "No bio available."}
        </p>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-0 pb-4">
        <Button 
          variant="outline" 
          onClick={() => onViewDetails(client.id)}
          className="flex-1 mr-2 text-sm h-9"
        >
          View Details
        </Button>
        
        {subscription.status === "pending" && (
          <>
            <Button 
              onClick={() => onAccept(subscription.id)} 
              variant="default"
              className="flex-1 mr-1 text-sm h-9"
            >
              Accept
            </Button>
            <Button 
              onClick={() => onReject(subscription.id)} 
              variant="destructive"
              className="flex-1 text-sm h-9"
            >
              Reject
            </Button>
          </>
        )}

        {subscription.status === "active" && (
          <Button 
            onClick={() => onViewDetails(client.id)}
            className="flex-1 text-sm h-9"
          >
            Manage
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ClientCard;
