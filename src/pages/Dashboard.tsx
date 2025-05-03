import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ClientCard from '@/components/ClientCard';
import ChatInterface from '@/components/ChatInterface';
import { Subscription } from '@/contexts/DataContext';

const ClientDashboard = () => {
  const { user } = useAuth();
  const { coaches, subscriptions, updateSubscriptionStatus, cancelSubscription } = useData();
  const [selectedCoach, setSelectedCoach] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState('coaches');

  const userSubscriptions = subscriptions.filter(
    sub => sub.clientId === user?.id
  );

  const myCoaches = userSubscriptions
    .filter(sub => sub.status === 'active')
    .map(sub => {
      const coach = coaches.find(coach => coach.id === sub.coachId);
      return coach ? { ...coach, subscription: sub } : null;
    })
    .filter(Boolean);

  const pendingSubscriptions = userSubscriptions
    .filter(sub => sub.status === 'pending')
    .map(sub => {
      const coach = coaches.find(coach => coach.id === sub.coachId);
      return coach ? { ...coach, subscription: sub } : null;
    })
    .filter(Boolean);

  return (
    <div className="container mx-auto p-4 my-8">
      <h2 className="text-2xl font-bold mb-6">Client Dashboard</h2>
      
      <Tabs defaultValue="coaches" onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="coaches">My Coaches</TabsTrigger>
          <TabsTrigger value="pending">Pending Requests</TabsTrigger>
          <TabsTrigger value="chat">Messages</TabsTrigger>
          <TabsTrigger value="programs">Training Programs</TabsTrigger>
          <TabsTrigger value="meals">Meal Plans</TabsTrigger>
        </TabsList>
        
        <TabsContent value="coaches" className="space-y-4">
          {myCoaches.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">You don't have any active coaches yet.</p>
                <Button className="mt-4" onClick={() => window.location.href = '/'}>
                  Find a Coach
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myCoaches.map((coach) => (
                <Card key={coach.id} className="overflow-hidden">
                  <div className="h-28 bg-gradient-to-r from-primary/20 to-secondary/20"></div>
                  <div className="px-4 -mt-12 pb-4 relative">
                    <div className="flex flex-col items-center">
                      <div className="h-24 w-24 rounded-full bg-white p-1 shadow-lg">
                        <img 
                          src={coach.profilePicture} 
                          alt={coach.name} 
                          className="h-full w-full rounded-full object-cover" 
                        />
                      </div>
                      <h3 className="mt-2 text-xl font-semibold">{coach.name}</h3>
                      <span className="text-sm text-muted-foreground">{coach.specialty}</span>
                      
                      <p className="mt-4 text-sm text-gray-600 text-center line-clamp-3">
                        {coach.bio}
                      </p>
                      
                      <div className="flex gap-2 mt-4 w-full">
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => {
                            setSelectedCoach(coach);
                            setActiveTab('chat');
                          }}
                        >
                          Message
                        </Button>
                        <Button 
                          variant="destructive" 
                          className="flex-1"
                          onClick={() => cancelSubscription(coach.subscription.id)}
                        >
                          Unsubscribe
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="pending" className="space-y-4">
          {pendingSubscriptions.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">You don't have any pending subscription requests.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingSubscriptions.map((coach) => (
                <Card key={coach.id} className="overflow-hidden">
                  <div className="h-28 bg-gradient-to-r from-yellow-100/50 to-yellow-300/50"></div>
                  <div className="px-4 -mt-12 pb-4 relative">
                    <div className="flex flex-col items-center">
                      <div className="h-24 w-24 rounded-full bg-white p-1 shadow-lg">
                        <img 
                          src={coach.profilePicture} 
                          alt={coach.name} 
                          className="h-full w-full rounded-full object-cover" 
                        />
                      </div>
                      <h3 className="mt-2 text-xl font-semibold">{coach.name}</h3>
                      <span className="text-sm text-muted-foreground">{coach.specialty}</span>
                      
                      <div className="mt-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                        Request Pending
                      </div>
                      
                      <p className="mt-4 text-sm text-gray-600 text-center line-clamp-3">
                        {coach.bio}
                      </p>
                      
                      <Button 
                        variant="outline" 
                        className="mt-4 w-full"
                        onClick={() => cancelSubscription(coach.subscription.id)}
                      >
                        Cancel Request
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="chat">
          {selectedCoach ? (
            <ChatInterface 
              receiverId={selectedCoach.id} 
              receiverName={selectedCoach.name}
              receiverImage={selectedCoach.profilePicture}
            />
          ) : myCoaches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myCoaches.map((coach) => (
                <Card 
                  key={coach.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedCoach(coach)}
                >
                  <CardContent className="flex items-center p-4">
                    <div className="h-12 w-12 rounded-full mr-4">
                      <img 
                        src={coach.profilePicture} 
                        alt={coach.name} 
                        className="h-full w-full rounded-full object-cover" 
                      />
                    </div>
                    <div>
                      <h4 className="font-medium">{coach.name}</h4>
                      <p className="text-sm text-muted-foreground">{coach.specialty}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">Subscribe to a coach to start messaging.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="programs">
          <Card>
            <CardHeader>
              <CardTitle>My Training Programs</CardTitle>
              <CardDescription>
                View your personalized training programs from your coaches
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Programs would be displayed here */}
              <p className="text-muted-foreground">Your training programs will appear here once your coach creates them.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="meals">
          <Card>
            <CardHeader>
              <CardTitle>My Meal Plans</CardTitle>
              <CardDescription>
                View your personalized meal plans from your coaches
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Meal plans would be displayed here */}
              <p className="text-muted-foreground">Your meal plans will appear here once your coach creates them.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const CoachDashboard = () => {
  const { user } = useAuth();
  const { subscriptions, updateSubscriptionStatus } = useData();
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState('clients');

  const coachSubscriptions = subscriptions.filter(
    sub => sub.coachId === user?.id
  );

  useEffect(() => {
    const mockClients = [
      {
        id: "c1",
        name: "John Smith",
        email: "john@example.com",
        profilePicture: "https://images.unsplash.com/photo-1531891437562-4301cf35b7e4",
        bio: "Looking to improve my strength and endurance."
      },
      {
        id: "c2",
        name: "Sarah Johnson",
        email: "sarah@example.com",
        profilePicture: "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
        bio: "Focused on weight loss and nutrition."
      }
    ];
    
    setClients(mockClients);
  }, []);

  const handleAccept = (subscriptionId: string) => {
    updateSubscriptionStatus(subscriptionId, "active");
  };

  const handleReject = (subscriptionId: string) => {
    updateSubscriptionStatus(subscriptionId, "rejected");
  };

  const handleViewClient = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    if (client) {
      setSelectedClient(client);
      setActiveTab('chat');
    }
  };

  const activeSubscriptions = coachSubscriptions.filter(sub => sub.status === "active");
  const pendingSubscriptions = coachSubscriptions.filter(sub => sub.status === "pending");
  
  return (
    <div className="container mx-auto p-4 my-8">
      <h2 className="text-2xl font-bold mb-6">Coach Dashboard</h2>
      
      <Tabs defaultValue="clients" onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="clients">My Clients</TabsTrigger>
          <TabsTrigger value="pending">Pending Requests</TabsTrigger>
          <TabsTrigger value="chat">Messages</TabsTrigger>
        </TabsList>
        
        <TabsContent value="clients">
          {activeSubscriptions.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">You don't have any active clients yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeSubscriptions.map((subscription) => {
                const client = clients.find(c => c.id === subscription.clientId);
                return client ? (
                  <ClientCard
                    key={subscription.id}
                    client={client}
                    subscription={subscription}
                    onAccept={handleAccept}
                    onReject={handleReject}
                    onViewDetails={handleViewClient}
                  />
                ) : null;
              })}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="pending">
          {pendingSubscriptions.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">You don't have any pending client requests.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingSubscriptions.map((subscription) => {
                const client = clients.find(c => c.id === subscription.clientId);
                return client ? (
                  <ClientCard
                    key={subscription.id}
                    client={client}
                    subscription={subscription}
                    onAccept={handleAccept}
                    onReject={handleReject}
                    onViewDetails={handleViewClient}
                  />
                ) : null;
              })}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="chat">
          {selectedClient ? (
            <ChatInterface 
              receiverId={selectedClient.id} 
              receiverName={selectedClient.name}
              receiverImage={selectedClient.profilePicture}
            />
          ) : activeSubscriptions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeSubscriptions.map((subscription) => {
                const client = clients.find(c => c.id === subscription.clientId);
                return client ? (
                  <Card 
                    key={subscription.id} 
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedClient(client)}
                  >
                    <CardContent className="flex items-center p-4">
                      <div className="h-12 w-12 rounded-full mr-4">
                        <img 
                          src={client.profilePicture} 
                          alt={client.name} 
                          className="h-full w-full rounded-full object-cover" 
                        />
                      </div>
                      <div>
                        <h4 className="font-medium">{client.name}</h4>
                        <p className="text-sm text-muted-foreground">{client.email}</p>
                      </div>
                    </CardContent>
                  </Card>
                ) : null;
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">Accept client requests to start messaging.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

const Dashboard = () => {
  const { user, isAuthenticated, role } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 bg-gray-50">
        {role === "client" ? <ClientDashboard /> : <CoachDashboard />}
      </div>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
