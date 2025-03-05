
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { IForm } from "@/models/Form";
import mongoose from "mongoose";


interface ExtendedForm extends IForm {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
}

export default function MessagesPage() {
  const [forms, setForms] = useState<ExtendedForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const response = await axios.get("/api/get-forms");
      setForms(response.data.forms);
    } catch (err) {
      setError("Failed to fetch forms");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
    alert("Copied to clipboard!");
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Form Endpoints</h1>
      <div className="grid gap-4">
        {forms.map((form) => (
          <div
            key={form._id.toString()}
            className="bg-white p-4 rounded-lg shadow-md border"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-lg font-semibold">{form.name}</h2>
                <p className="text-gray-600">{form.email}</p>
              </div>
              <button
                onClick={() => copyToClipboard(form.requestUrl)}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
              >
                Copy URL
              </button>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm font-mono break-all">{form.requestUrl}</p>
            </div>
            <div className="mt-4 text-sm text-gray-500">
              <p>Form ID: {form._id.toString()}</p>
              <p>Created: {new Date(form.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
