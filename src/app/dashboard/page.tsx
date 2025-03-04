"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { ClipboardIcon, CheckIcon } from "@heroicons/react/24/outline";
import Header from "@/src/app/components/Header";
import CreateButton from "@/src/app/components/CreateForm";

// Define a proper type for the form
interface Form {
  _id: string;
  name: string;
  email: string;
  uniqueId: string;
  requestUrl: string;
  createdAt: string;
}

export default function Dashboard() {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedFormId, setCopiedFormId] = useState<string | null>(null);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await axios.get("/api/get-forms");
        setForms(response.data.forms);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch forms", err);
        setLoading(false);
      }
    };

    fetchForms();
  }, []);

  const handleCopyUrl = (url: string, formId: string) => {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setCopiedFormId(formId);

        setTimeout(() => {
          setCopiedFormId(null);
        }, 2000);
      })
      .catch((err) => {
        console.error("Failed to copy URL", err);
      });
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="container mx-auto p-4 text-center">
          <p>Loading forms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Your Forms ({forms.length})</h1>
          <CreateButton />
        </div>

        {forms.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <p className="text-gray-500">No forms created yet</p>
            <p className="text-sm text-gray-400 mt-2">
              Click &quot;New Form&quot; to get started
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {forms.map((form) => (
              <div
                key={form._id}
                className="bg-white border rounded-lg p-4 shadow-sm flex justify-between items-center"
              >
                <div className="flex-grow">
                  <h2 className="text-lg font-semibold mb-1">{form.name}</h2>
                  <Link
                    href={`/form/${form.uniqueId}`}
                    className="text-blue-600 hover:underline break-all text-sm"
                  >
                    {form.requestUrl}
                  </Link>
                </div>

                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleCopyUrl(form.requestUrl, form._id)}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="Copy URL"
                  >
                    {copiedFormId === form._id ? (
                      <CheckIcon className="h-5 w-5 text-green-500" />
                    ) : (
                      <ClipboardIcon className="h-5 w-5 text-gray-600" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
