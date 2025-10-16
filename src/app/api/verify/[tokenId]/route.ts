import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params?: { tokenId?: string } }
) {
  const tokenId = context.params?.tokenId;

  if (!tokenId) {
    return NextResponse.json({ error: "Token ID is required" }, { status: 400 });
  }

  try {
    const mirrorNodeUrl = `https://testnet.mirrornode.hedera.com/api/v1/tokens/${tokenId}/nfts/1`;

    const response = await fetch(mirrorNodeUrl);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch NFT info from mirror node. Status: ${response.status}`
      );
    }

    const data = await response.json();
    const decodedMetadata = Buffer.from(data.metadata, "base64").toString("utf8");

    return NextResponse.json({
      tokenId,
      serialNumber: data.serial_number,
      metadata: decodedMetadata,
    });
  } catch (error) {
    console.error(`Error verifying token ${tokenId}:`, error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
