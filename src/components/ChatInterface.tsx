import React, { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useData, Message } from "@/contexts/DataContext";
import { formatDistanceToNow } from 'date-fns';

interface ChatInterfaceProps {
  receiverId: string;
  receiverName: string;
  receiverImage?: string;
}

const ChatInterface = ({ receiverId, receiverName, receiverImage }: ChatInterfaceProps) => {
  const { user } = useAuth();
  const { sendMessage, getMessages } = useData();
  const [newMessage, setNewMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load messages when receiverId changes
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    getMessages(receiverId).then(msgs => {
      if (isMounted) setChatMessages(msgs);
      setLoading(false);
    });
    return () => { isMounted = false; };
    // eslint-disable-next-line
  }, [receiverId]);

  // Auto scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && user) {
      await sendMessage(receiverId, newMessage);
      setNewMessage('');
      // Refresh messages after sending
      const msgs = await getMessages(receiverId);
      setChatMessages(msgs);
    }
  };

  // Format the timestamp to be more readable
  const formatTimestamp = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (error) {
      console.error("Date formatting error:", error);
      return "recently";
    }
  };

  return (
    <Card className="flex flex-col h-[500px] border bg-white">
      <div className="flex items-center border-b p-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={receiverImage} alt={receiverName} />
          <AvatarFallback>{receiverName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="ml-3">
          <h3 className="text-sm font-medium">{receiverName}</h3>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            Loading messages...
          </div>
        ) : chatMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            No messages yet. Start the conversation!
          </div>
        ) : (
          chatMessages.map((message) => (
            <div 
              key={message.id}
              className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] ${message.senderId === user?.id ? 'bg-primary text-primary-foreground' : 'bg-muted'} px-4 py-2 rounded-lg`}>
                <p className="text-sm">{message.content}</p>
                <span className={`text-xs mt-1 block text-right ${message.senderId === user?.id ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                  {formatTimestamp(message.timestamp)}
                </span>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSendMessage} className="border-t p-4 flex">
        <Input 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 mr-2"
        />
        <Button type="submit" disabled={!newMessage.trim() || loading}>
          Send
        </Button>
      </form>
    </Card>
  );
};

export default ChatInterface;