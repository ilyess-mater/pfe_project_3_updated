import React, { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "../App";

// Create chat context
export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [contacts, setContacts] = useState([]);
  const [messages, setMessages] = useState({});
  const [activeContact, setActiveContact] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize with sample data
  useEffect(() => {
    if (isAuthenticated) {
      setLoading(true);

      // Simulate API call with a delay (in a real app, this would fetch from a backend)
      setTimeout(() => {
        // Sample contacts data
        const sampleContacts = [
          {
            id: 1,
            name: "Ilyess Mater",
            status: "online",
            avatar: "I",
            unreadCount: 2,
            lastSeen: new Date(),
          },
          {
            id: 2,
            name: "Koussay Samti",
            status: "online",
            avatar: "K",
            unreadCount: 0,
            lastSeen: new Date(),
          },
          {
            id: 3,
            name: "Sarah Miller",
            status: "offline",
            avatar: "S",
            unreadCount: 5,
            lastSeen: new Date(Date.now() - 3600000),
          },
          {
            id: 4,
            name: "David Wilson",
            status: "offline",
            avatar: "D",
            unreadCount: 0,
            lastSeen: new Date(Date.now() - 86400000),
          },
        ];

        // Sample messages data
        const sampleMessages = {
          1: [
            {
              id: 1,
              senderId: 1,
              text: "Hey, how's it going?",
              timestamp: new Date(Date.now() - 120000),
              status: "read",
            },
            {
              id: 2,
              senderId: user?.id || "me",
              text: "Good, working on the project",
              timestamp: new Date(Date.now() - 60000),
              status: "read",
            },
            {
              id: 3,
              senderId: 1,
              text: "How far along are you?",
              timestamp: new Date(),
              status: "unread",
            },
          ],
          2: [
            {
              id: 1,
              senderId: 2,
              text: "Did you review the documentation?",
              timestamp: new Date(Date.now() - 3600000),
              status: "read",
            },
            {
              id: 2,
              senderId: user?.id || "me",
              text: "Yes, I've gone through it",
              timestamp: new Date(Date.now() - 3000000),
              status: "read",
            },
          ],
          3: [
            {
              id: 1,
              senderId: 3,
              text: "Have you seen the latest proposal?",
              timestamp: new Date(Date.now() - 259200000),
              status: "unread",
            },
            {
              id: 2,
              senderId: 3,
              text: "I need your feedback on it",
              timestamp: new Date(Date.now() - 172800000),
              status: "unread",
            },
            {
              id: 3,
              senderId: 3,
              text: "Please check it by tomorrow",
              timestamp: new Date(Date.now() - 86400000),
              status: "unread",
            },
            {
              id: 4,
              senderId: 3,
              text: "It's really important",
              timestamp: new Date(Date.now() - 43200000),
              status: "unread",
            },
            {
              id: 5,
              senderId: 3,
              text: "Let me know when you've had a look",
              timestamp: new Date(Date.now() - 3600000),
              status: "unread",
            },
          ],
        };

        setContacts(sampleContacts);
        setMessages(sampleMessages);
        setLoading(false);
      }, 1000);
    }
  }, [isAuthenticated, user]);

  // Function to send a message
  const sendMessage = (contactId, text) => {
    if (!text.trim()) return;

    const newMessage = {
      id: Date.now(),
      senderId: user?.id || "me",
      text,
      timestamp: new Date(),
      status: "sent",
    };

    setMessages((prevMessages) => {
      const updatedMessages = { ...prevMessages };
      if (updatedMessages[contactId]) {
        updatedMessages[contactId] = [
          ...updatedMessages[contactId],
          newMessage,
        ];
      } else {
        updatedMessages[contactId] = [newMessage];
      }
      return updatedMessages;
    });

    // Update unread count for the contact
    setContacts((prevContacts) =>
      prevContacts.map((contact) =>
        contact.id === contactId ? { ...contact, unreadCount: 0 } : contact
      )
    );

    // Simulate a response after 1-3 seconds (in a real app, this would be a socket message)
    if (Math.random() > 0.3) {
      // 70% chance of getting a response
      const replyDelay = 1000 + Math.random() * 2000;

      setTimeout(() => {
        const sampleReplies = [
          "Thanks for the update!",
          "Got it, will check.",
          "When can we meet to discuss this?",
          "I'll get back to you soon.",
          "Can you provide more details?",
        ];

        const replyIndex = Math.floor(Math.random() * sampleReplies.length);
        const replyText = sampleReplies[replyIndex];

        const replyMessage = {
          id: Date.now(),
          senderId: contactId,
          text: replyText,
          timestamp: new Date(),
          status: "received",
        };

        setMessages((prevMessages) => {
          const updatedMessages = { ...prevMessages };
          if (updatedMessages[contactId]) {
            updatedMessages[contactId] = [
              ...updatedMessages[contactId],
              replyMessage,
            ];
          }
          return updatedMessages;
        });

        // Update unread count for the contact if not active
        if (activeContact !== contactId) {
          setContacts((prevContacts) =>
            prevContacts.map((contact) =>
              contact.id === contactId
                ? { ...contact, unreadCount: (contact.unreadCount || 0) + 1 }
                : contact
            )
          );
        }
      }, replyDelay);
    }
  };

  // Function to mark messages as read
  const markMessagesAsRead = (contactId) => {
    setContacts((prevContacts) =>
      prevContacts.map((contact) =>
        contact.id === contactId ? { ...contact, unreadCount: 0 } : contact
      )
    );

    setMessages((prevMessages) => {
      if (!prevMessages[contactId]) return prevMessages;

      const updatedMessages = { ...prevMessages };
      updatedMessages[contactId] = prevMessages[contactId].map((msg) => ({
        ...msg,
        status: msg.senderId !== user?.id ? "read" : msg.status,
      }));

      return updatedMessages;
    });
  };

  // Set active contact
  const setActiveChat = (contactId) => {
    setActiveContact(contactId);
    if (contactId) markMessagesAsRead(contactId);
  };

  return (
    <ChatContext.Provider
      value={{
        contacts,
        messages,
        activeContact,
        loading,
        sendMessage,
        markMessagesAsRead,
        setActiveChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => useContext(ChatContext);
