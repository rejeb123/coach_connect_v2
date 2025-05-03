import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

export type SubscriptionStatus = "pending" | "active" | "rejected" | "accepted";

export interface Subscription {
  id: string;
  coachId: string;
  clientId: string;
  status: SubscriptionStatus;
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Program {
  id: string;
  coachId: string;
  clientId: string;
  title: string;
  description: string;
  exercises: {
    name: string;
    sets: number;
    reps: number;
    notes?: string;
  }[];
  createdAt: string;
}

export interface MealPlan {
  id: string;
  coachId: string;
  clientId: string;
  title: string;
  description: string;
  meals: {
    name: string;
    time: string;
    foods: string[];
    calories?: number;
  }[];
  createdAt: string;
}

interface DataContextType {
  coaches: any[];
  filteredCoaches: any[];
  filterCoaches: (specialty: string | null) => void;
  subscriptions: Subscription[];
  messages: Message[];
  programs: Program[];
  mealPlans: MealPlan[];
  requestSubscription: (coachId: string) => Promise<void>;
  cancelSubscription: (subscriptionId: string) => Promise<void>;
  updateSubscriptionStatus: (subscriptionId: string, status: SubscriptionStatus) => Promise<void>;
  sendMessage: (receiverId: string, content: string) => Promise<void>;
  getMessages: (userId: string) => Promise<Message[]>;
  createProgram: (clientId: string, program: Omit<Program, "id" | "coachId" | "createdAt">) => Promise<void>;
  createMealPlan: (clientId: string, mealPlan: Omit<MealPlan, "id" | "coachId" | "createdAt">) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const BASE_URL = "http://localhost:5000/api"; // Change to your backend URL

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [coaches, setCoaches] = useState<any[]>([]);
  const [filteredCoaches, setFilteredCoaches] = useState<any[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);

  // Fetch coaches from backend
  useEffect(() => {
    fetch(`${BASE_URL}/coaches`)
      .then(res => res.json())
      .then(data => {
        setCoaches(data);
        setFilteredCoaches(data);
      })
      .catch(() => toast.error("Failed to load coaches"));
  }, []);

  // Fetch subscriptions from backend
  useEffect(() => {
    fetch(`${BASE_URL}/subscriptions`)
      .then(res => res.json())
      .then(data => setSubscriptions(data))
      .catch(() => toast.error("Failed to load subscriptions"));
  }, []);

  // Fetch programs from backend
  useEffect(() => {
    fetch(`${BASE_URL}/training-programs`)
      .then(res => res.json())
      .then(data => setPrograms(data))
      .catch(() => toast.error("Failed to load programs"));
  }, []);

  // Fetch meal plans from backend
  useEffect(() => {
    fetch(`${BASE_URL}/meal-plans`)
      .then(res => res.json())
      .then(data => setMealPlans(data))
      .catch(() => toast.error("Failed to load meal plans"));
  }, []);

  // Filter coaches by specialty
  const filterCoaches = (specialty: string | null) => {
    if (!specialty) {
      setFilteredCoaches(coaches);
    } else {
      setFilteredCoaches(coaches.filter(coach => coach.specialty === specialty));
    }
  };

  // Request a subscription to a coach
    const requestSubscription = async (coachId: string) => {
    if (!user) {
      toast.error("You must be logged in to subscribe to a coach");
      return;
    }
    try {
      console.log("Requesting subscription for coach:", coachId); // Debugging
      const res = await fetch(`${BASE_URL}/subscriptions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client: user.id,
          coach: coachId,
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          amount: 100
        })
      });
      const responseData = await res.json();
      console.log("Subscription response:", responseData); // Debugging
      if (!res.ok) throw new Error(responseData.message || "Failed to request subscription");
      const { subscription } = responseData;
      setSubscriptions(prev => [...prev, subscription]);
      toast.success("Subscription request sent to coach");
    } catch (error) {
      console.error("Error requesting subscription:", error); // Debugging
      toast.error("Failed to request subscription");
    }
  };

  // Cancel a subscription
  const cancelSubscription = async (subscriptionId: string) => {
    try {
      const res = await fetch(`${BASE_URL}/subscriptions/${subscriptionId}`, {
        method: "DELETE"
      });
      if (!res.ok) throw new Error();
      setSubscriptions(subs => subs.filter(sub => sub.id !== subscriptionId));
      toast.success("Subscription canceled");
    } catch {
      toast.error("Failed to cancel subscription");
    }
  };

  // Update subscription status
  const updateSubscriptionStatus = async (subscriptionId: string, status: SubscriptionStatus) => {
    try {
      const res = await fetch(`${BASE_URL}/subscriptions/${subscriptionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setSubscriptions(subs =>
        subs.map(sub => sub.id === subscriptionId ? updated : sub)
      );
      if (status === "active" || status === "accepted") {
        toast.success("Subscription request accepted");
      } else if (status === "rejected") {
        toast.info("Subscription request rejected");
      }
    } catch {
      toast.error("Failed to update subscription status");
    }
  };

  // Send a message
  const sendMessage = async (receiverId: string, content: string) => {
    if (!user) {
      toast.error("You must be logged in to send messages");
      return;
    }
    try {
      // First, get or create chat
      const chatRes = await fetch(`${BASE_URL}/chats`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId: user.role === "client" ? user.id : receiverId, coachId: user.role === "coach" ? user.id : receiverId })
      });
      if (!chatRes.ok) throw new Error();
      const chat = await chatRes.json();

      // Then, send message
      const msgRes = await fetch(`${BASE_URL}/chats/${chat._id}/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderId: user.id, text: content })
      });
      if (!msgRes.ok) throw new Error();
      toast.success("Message sent");
    } catch {
      toast.error("Failed to send message");
    }
  };

  // Get messages between current user and another user
  const getMessages = async (userId: string) => {
    if (!user) return [];
    try {
      // First, get or create chat
      const chatRes = await fetch(`${BASE_URL}/chats`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId: user.role === "client" ? user.id : userId, coachId: user.role === "coach" ? user.id : userId })
      });
      if (!chatRes.ok) throw new Error();
      const chat = await chatRes.json();

      // Then, get messages
      const msgRes = await fetch(`${BASE_URL}/chats/${chat._id}/messages`);
      if (!msgRes.ok) throw new Error();
      const msgs = await msgRes.json();
      setMessages(msgs);
      return msgs;
    } catch {
      toast.error("Failed to fetch messages");
      return [];
    }
  };

  // Create a training program
  const createProgram = async (clientId: string, programData: Omit<Program, "id" | "coachId" | "createdAt">) => {
    if (!user || user.role !== "coach") {
      toast.error("Only coaches can create training programs");
      return;
    }
    try {
      const res = await fetch(`${BASE_URL}/training-programs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...programData,
          coach: user.id,
          client: clientId
        })
      });
      if (!res.ok) throw new Error();
      const program = await res.json();
      setPrograms(prev => [...prev, program]);
      toast.success("Training program created successfully");
    } catch {
      toast.error("Failed to create training program");
    }
  };

  // Create a meal plan
  const createMealPlan = async (clientId: string, mealPlanData: Omit<MealPlan, "id" | "coachId" | "createdAt">) => {
    if (!user || user.role !== "coach") {
      toast.error("Only coaches can create meal plans");
      return;
    }
    try {
      const res = await fetch(`${BASE_URL}/meal-plans`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...mealPlanData,
          coach: user.id,
          client: clientId
        })
      });
      if (!res.ok) throw new Error();
      const mealPlan = await res.json();
      setMealPlans(prev => [...prev, mealPlan]);
      toast.success("Meal plan created successfully");
    } catch {
      toast.error("Failed to create meal plan");
    }
  };

  return (
    <DataContext.Provider
      value={{
        coaches,
        filteredCoaches,
        filterCoaches,
        subscriptions,
        messages,
        programs,
        mealPlans,
        requestSubscription,
        cancelSubscription,
        updateSubscriptionStatus,
        sendMessage,
        getMessages,
        createProgram,
        createMealPlan
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};