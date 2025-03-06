

"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Header from '../components/Header';

export default function CreateFormPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Reset error message

    try {
      const response = await axios.post('/api/create-form', { name, email });

      // Redirect to the form details or show success message
      router.push(`/form/${response.data.form.uniqueId}`);
    } catch (error: unknown) {
      console.error('Error creating form:', error);
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "Failed to create form. Please try again.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div>
      <Header />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl mb-4">Create New Form</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="mb-4">
            <label className="block mb-2">Name</label>
            <input
  placeholder="Name"
  type="text"
  value={name}
  onChange={(e) => setName(e.target.value)}
  className="w-full px-3 py-2 border rounded placeholder-gray-500"
  required
/>

          </div>
          <div className="mb-4">
            <label className="block mb-2">Forward To</label>
            <input
  placeholder="Email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  className="w-full px-3 py-2 border rounded placeholder-gray-500"
  required
/>

          </div>
          <button
  type="submit"
  className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
>
  Create Form
</button>

        </form>
      </div>
    </div>
  );
}
