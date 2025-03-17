import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./Sidebar";
import DirectMessagesSidebar from "./DirectMessagesSidebar";
import ChatWindow from "./ChatWindow";
import { ChatProvider } from "../context/ChatContext";
import "../styles/MessagingLayout.css";

const MessagingLayout = () => {
  return (
    <ChatProvider>
      <div className="messaging-container">
        <Sidebar />
        <DirectMessagesSidebar />
        <Routes>
          <Route
            path="/"
            element={
              <div className="empty-chat">
                Select a conversation to start messaging
              </div>
            }
          />
          <Route path=":contactId" element={<ChatWindow />} />
        </Routes>
      </div>
    </ChatProvider>
  );
};

export default MessagingLayout;
