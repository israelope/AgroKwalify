"use client";
import { useState } from "react";
import axios from "axios";

export default function CertifyPage() {
  const [batchId, setBatchId] = useState("");
  const [grade, setGrade] = useState("A");
  const [attributes, setAttributes] = useState("");
  const [response, setResponse] = useState<any>(null);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const res = await axios.post("/api/certify", {
      batchId,
      grade,
      attributes: attributes.split(","),
    });
    setResponse(res.data);
  };

  return (
    <div className="p-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Certify Agricultural Product</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input placeholder="Batch ID" value={batchId} onChange={e => setBatchId(e.target.value)} className="border p-2 rounded" />
        <input placeholder="Grade (A/B/C)" value={grade} onChange={e => setGrade(e.target.value)} className="border p-2 rounded" />
        <input placeholder="Attributes (comma-separated)" value={attributes} onChange={e => setAttributes(e.target.value)} className="border p-2 rounded" />
        <button type="submit" className="bg-green-600 text-white p-2 rounded">Submit</button>
      </form>

      {response && (
        <div className="mt-6 border p-4 rounded bg-gray-100">
          <p><b>Transaction ID:</b> {response.transactionId}</p>
          <p><b>Status:</b> {response.consensusStatus}</p>
          <a href={`https://hashscan.io/testnet/transaction/${response.transactionId}`} target="_blank" className="text-blue-500 underline">
            View on HashScan
          </a>
        </div>
      )}
    </div>
  );
}

