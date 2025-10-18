'use client';

import { useState } from 'react';

//=============================================================================
// SECTION 1: CERTIFICATION COMPONENT (Top Half of the Page)
// This component handles the main title, the certification form, and its results.
//=============================================================================
function Certifier() {
  // State for the certification form inputs
  const [productName, setProductName] = useState('');
  const [checklist, setChecklist] = useState({ handPicked: false, moistureProof: false });
  
  // State for handling API request status and results
  const [isLoading, setIsLoading] = useState(false);
  const [certificationResult, setCertificationResult] = useState<{ tokenId: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // State for the "Copy ID" button feedback
  const [isCopied, setIsCopied] = useState(false);

  // Function to copy the Token ID to the clipboard
  const handleCopy = async (tokenId: string) => {
    try {
      await navigator.clipboard.writeText(tokenId);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset feedback after 2s
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Function to submit the certification form data
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setCertificationResult(null);
    setErrorMessage('');

    try {
      const response = await fetch('/api/certify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productName, qualityChecks: checklist }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Something went wrong');
      setCertificationResult({ tokenId: result.tokenId });
    } catch (error: any) {
      setErrorMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8">
      {/*-- Part 1.1: Main Title and Subtitle --*/}
      <div>
        <h1 className="text-3xl font-bold text-center">AgroKwalify</h1>
        <p className="mt-2 text-center text-gray-400">Certify Your Agricultural Produce on Hedera</p>
      </div>
      
      {/*-- Part 1.2: Certification Form --*/}
      <form onSubmit={handleSubmit} suppressHydrationWarning className="mt-8 space-y-6 bg-gray-800 p-8 rounded-lg shadow-lg">
        <div>
          <label htmlFor="product-name" className="block text-sm font-medium text-gray-300">Product Name</label>
          <input
            id="product-name" type="text" required value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm p-2"
            placeholder="e.g., Stone-Free Ewa Oloyin"
          />
        </div>
        <div className="space-y-4">
          <p className="text-sm font-medium text-gray-300">Quality Checklist</p>
          <div className="flex items-center">
            <input id="hand-picked" type="checkbox" checked={checklist.handPicked} onChange={(e) => setChecklist({ ...checklist, handPicked: e.target.checked })} className="h-4 w-4 rounded border-gray-500 bg-gray-700 text-blue-600" />
            <label htmlFor="hand-picked" className="ml-3 block text-sm text-gray-300">Hand-Picked & Stone-Free</label>
          </div>
          <div className="flex items-center">
            <input id="moisture-proof" type="checkbox" checked={checklist.moistureProof} onChange={(e) => setChecklist({ ...checklist, moistureProof: e.target.checked })} className="h-4 w-4 rounded border-gray-500 bg-gray-700 text-blue-600" />
            <label htmlFor="moisture-proof" className="ml-3 block text-sm text-gray-300">Stored in Moisture-Proof Bag</label>
          </div>
        </div>
        <div>
          <button type="submit" disabled={isLoading} className="group flex w-full justify-center rounded-md border bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-gray-500">
            {isLoading ? 'Certifying...' : 'Certify Product'}
          </button>
        </div>
      </form>

      {/*-- Part 1.3: Certification Result (Success Message) --*/}
      {certificationResult && (
        <div className="mt-4 text-center text-sm text-gray-300">
          Success! Your Certificate NFT was created.
          <div className="flex items-center justify-center space-x-2 mt-2">
            <a href={`https://hashscan.io/testnet/token/${certificationResult.tokenId}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
              View Token {certificationResult.tokenId} on HashScan
            </a>
            <button onClick={() => handleCopy(certificationResult.tokenId)} disabled={isCopied} className="bg-gray-600 text-white px-2 py-1 rounded text-xs transition-colors duration-200 ease-in-out hover:bg-gray-500 disabled:bg-green-500 disabled:cursor-not-allowed">
              {isCopied ? 'Copied!' : 'Copy ID'}
            </button>
          </div>
        </div>
      )}

      {/*-- Part 1.4: Certification Result (Error Message) --*/}
      {errorMessage && <div className="mt-4 text-center text-sm text-red-400">{errorMessage}</div>}
    </div>
  );
}


//=============================================================================
// SECTION 2: VERIFIER COMPONENT (Bottom Half of the Page)
// This component handles the verification form, its results, and the purchase simulation.
//=============================================================================
function Verifier() {
  // State for the verification form input
  const [tokenId, setTokenId] = useState('');
  
  // State for handling API request status and results
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  // Function to submit the verification form
  const handleVerify = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setResult(null);
    setError('');

    try {
      const response = await fetch(`/api/verify/${tokenId}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Verification failed. Please check the Token ID.');
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to simulate a product purchase
  const handleSimulatePurchase = () => {
    alert("Purchase Simulated! In a full version, a smart contract would lock funds and transfer this NFT to the buyer's account upon delivery confirmation.");
  };

  return (
    <div className="w-full max-w-md space-y-4 mt-16">
      {/*-- Part 2.1: Verifier Title --*/}
      <h2 className="text-2xl font-bold text-center">Verify a Product</h2>
      
      {/*-- Part 2.2: Verification Form --*/}
      <form onSubmit={handleVerify} className="space-y-6 bg-gray-800 p-8 rounded-lg">
        <div>
          <label htmlFor="token-id" className="block text-sm font-medium text-gray-300">
            Enter Certificate Token ID
          </label>
          <input
            id="token-id" type="text" value={tokenId}
            onChange={(e) => setTokenId(e.target.value)} required
            className="mt-1 block w-full bg-gray-700 border border-gray-600 p-3 rounded-md focus:ring-2 focus:ring-green-500 outline-none"
            placeholder="0.0.1234567"
          />
        </div>
        <button type="submit" disabled={isLoading} className="w-full bg-green-600 p-3 rounded-md font-bold text-white hover:bg-green-700 disabled:bg-gray-500">
          {isLoading ? 'Verifying...' : 'Verify Certificate'}
        </button>
      </form>
      
      {/*-- Part 2.3: Verification Result (Error Message) --*/}
      {error && <div className="mt-4 p-4 rounded bg-red-900/20 text-red-300 text-center"><p><b>Error:</b> {error}</p></div>}
      
      {/*-- Part 2.4: Verification Result (Success Message) --*/}
      {result && (
        <div className="bg-gray-700 p-4 rounded-lg mt-4 text-center">
          <h3 className="font-bold text-green-300">Verification Successful!</h3>
          <p className="mt-2"><b>Token ID:</b> {result.tokenId}</p>
          <a href={result.metadata} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline break-all">
            View HCS Proof on HashScan
          </a>
          <button onClick={handleSimulatePurchase} className="w-full bg-yellow-500 text-black p-3 mt-4 rounded-md font-bold hover:bg-yellow-600">
            Simulate Purchase
          </button>
        </div>
      )}
    </div>
  );
}


//=============================================================================
// FINAL PAGE ASSEMBLY
// The main page component that renders the Certifier and Verifier in order.
//=============================================================================
export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white p-8">
      <Certifier />
      <Verifier />
    </main>
  );
}