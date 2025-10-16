import { NextRequest, NextResponse } from "next/server";

// This function will be called when we visit /api/verify/THE_TOKEN_ID
export async function GET(
  request: NextRequest,
  context: { params: { tokenId: string } }
) {
  const { tokenId } = context.params;

  if (!tokenId) {
    return new NextResponse("Token ID is required", { status: 400 });
  }

  try {
    // We will query the official Hedera Testnet Mirror Node REST API
    const mirrorNodeUrl = `https://testnet.mirrornode.hedera.com/api/v1/tokens/${tokenId}/nfts/1`;

    const response = await fetch(mirrorNodeUrl);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch NFT info from mirror node. Status: ${response.status}`
      );
    }

    const data = await response.json();

    // The metadata is encoded in Base64, so we need to decode it.
    const decodedMetadata = Buffer.from(data.metadata, "base64").toString("utf8");

    // Send the useful information back to our front-end
    return NextResponse.json({
      tokenId: tokenId,
      serialNumber: data.serial_number,
      metadata: decodedMetadata, // This is the link to the HCS transaction
    });
  } catch (error) {
    console.error(`Error verifying token ${tokenId}:`, error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
