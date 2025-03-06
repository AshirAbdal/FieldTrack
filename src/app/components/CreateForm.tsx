"use client";

import Link from "next/link";

export default function CreateButton() {
  return (
    <div className="w-full flex justify-end p-4">
      <Link href="/createForm">
      <button className="px-8 py-2 bg-black text-white rounded-lg shadow-md hover:bg-gray-800 transition">
  Create Form
</button>

      </Link>
    </div>
  );
}
