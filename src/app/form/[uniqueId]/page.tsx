"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  ClipboardIcon,
  CheckIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Header from "../../components/Header";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";

// Update the interface so _id is required
interface MessageData {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export default function FormDetailsPage() {
  const { status } = useSession();
  const router = useRouter();
  const routerParams = useParams();
  const uniqueId = routerParams.uniqueId as string;

  const [requestUrl, setRequestUrl] = useState<string>("");
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Track which message's reply form is open
  const [replyOpen, setReplyOpen] = useState<string | null>(null);
  // Store reply text per message ID
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated" && uniqueId) {
      const fetchFormDetails = async () => {
        try {
          const response = await axios.get(`/api/form/${uniqueId}`);
          setRequestUrl(response.data.requestUrl);
          setMessages(response.data.messages || []);
        } catch (err) {
          setError("Failed to fetch form details");
          console.error("API error:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchFormDetails();
    }
  }, [uniqueId, status, router]);

  // Copy the API endpoint URL
  const handleCopyUrl = () => {
    navigator.clipboard
      .writeText(requestUrl)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch((err) => console.error("Failed to copy URL", err));
  };

  // Delete the entire form
  const handleDeleteForm = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this form? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      await axios.delete(`/api/form/${uniqueId}`);
      router.push("/dashboard");
    } catch (err) {
      setError("Failed to delete form");
      console.error("Delete error:", err);
      setIsDeleting(false);
    }
  };


  const handleToggleReply = (messageId: string) => {
    setReplyOpen((prev) => (prev === messageId ? null : messageId));
  };


  const handleSendReply = async (e: React.FormEvent, messageId: string) => {
    e.preventDefault();

    try {
      await axios.post(`/api/messages/${messageId}/reply`, {
        replyText: replyText[messageId],
      });
      alert("Reply sent successfully!");
  
      setReplyOpen(null);
      setReplyText((prev) => ({ ...prev, [messageId]: "" }));
    } catch (err) {
      console.error("Error sending reply:", err);
      alert("Failed to send reply.");
    }
  };

  if (status === "loading" || loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (status === "unauthenticated") {
    return <div className="text-center p-4">Please log in to view this page</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  return (
    <div>
      <Header />
      <div className="container mx-auto p-4 max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Form Details</h1>
          <button
  onClick={handleDeleteForm}
  disabled={isDeleting}
  className={`flex items-center px-4 py-2 text-white bg-black rounded-md hover:bg-gray-800 transition-colors ${
    isDeleting ? "opacity-50 cursor-not-allowed" : ""
  }`}
>
  <TrashIcon className="h-5 w-5 mr-2" />
  {isDeleting ? "Deleting..." : "Delete Form"}
</button>

        </div>

        {/* API Endpoint Section */}
        <div className="bg-gray-100 rounded-lg p-4 mb-6 flex items-center justify-between">
          <div>
            <p className="text-gray-700 font-medium mb-2">API Endpoint:</p>
            <a
              href={requestUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline break-all"
            >
              {requestUrl}
            </a>
          </div>
          <button
            onClick={handleCopyUrl}
            className="ml-4 p-2 rounded-full hover:bg-gray-200"
          >
            {isCopied ? (
              <CheckIcon className="h-6 w-6 text-green-500" />
            ) : (
              <ClipboardIcon className="h-6 w-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Messages Section */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold mb-4">Messages</h2>
          {messages.length > 0 ? (
            <ul>
              {messages.map((msg) => (
                <li key={msg._id} className="mb-4 pb-4 border-b last:border-b-0">
                  <p className="text-gray-800">
                    <strong>Name:</strong> {msg.name}
                  </p>
                  <p className="text-gray-800">
                    <strong>Email:</strong> {msg.email}
                  </p>
                  <p className="text-gray-800">
                    <strong>Message:</strong> {msg.message}
                  </p>
                  <p className="text-gray-600 text-sm mt-2">
                    <strong>Created At:</strong>{" "}
                    {new Date(msg.createdAt).toLocaleString()}
                  </p>
                  <button
                    onClick={() => handleToggleReply(msg._id)}
                    className="mt-2 text-blue-600 hover:underline"
                  >
                    Reply
                  </button>
                  {replyOpen === msg._id && (
                    <form
                      onSubmit={(e) => handleSendReply(e, msg._id)}
                      className="mt-2"
                    >
                      <textarea
                        className="w-full p-2 border rounded"
                        rows={3}
                        placeholder="Type your reply..."
                        value={replyText[msg._id] || ""}
                        onChange={(e) =>
                          setReplyText((prev) => ({
                            ...prev,
                            [msg._id]: e.target.value,
                          }))
                        }
                      />
                      <button
                        type="submit"
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Send
                      </button>
                    </form>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No messages found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
