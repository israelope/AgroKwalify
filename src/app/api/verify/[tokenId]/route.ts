// src/app/api/verify/[tokenId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(
  request: NextRequest,
  // The context object itself is not a promise, but its params property now is.
  context: { params: Promise<{ tokenId: string }> }
) {
  // Await the params to resolve them
  const { tokenId } = await context.params;

  try {
    const mirrorNodeUrl = `https://testnet.mirrornode.hedera.com/api/v1/tokens/${tokenId}/nfts/1`;
    
    const response = await axios.get(mirrorNodeUrl);
    const data = response.data;

    const decodedMetadata = Buffer.from(data.metadata, 'base64').toString('utf8');

    return NextResponse.json({
      tokenId: data.token_id,
      serialNumber: data.serial_number,
      metadata: decodedMetadata,
    });

  } catch (error: any) {
    console.error(`Error verifying token ${tokenId}:`, error.message);
    
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || "Invalid Token ID";

    return NextResponse.json({ message }, { status });
  }
}