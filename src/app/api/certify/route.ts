import { NextResponse } from 'next/server';
import { 
  PrivateKey, 
  TopicMessageSubmitTransaction, 
  TokenCreateTransaction,
  TokenType,
  TokenSupplyType,
  TokenMintTransaction,
  Hbar
} from '@hashgraph/sdk';

// 1. IMPORT YOUR NEW HELPER FUNCTION
import { getHederaClient } from '@/lib/hederaClient'; // Assuming you renamed the file

export async function POST(request: Request) {
  try {
    // 2. GET THE CLIENT FROM YOUR HELPER
    const client = getHederaClient();
    // We still need these variables for other operations
    const operatorId = process.env.HEDERA_ACCOUNT_ID!;
    const operatorKey = process.env.HEDERA_PRIVATE_KEY!;

    const body = await request.json();
    const { productName, qualityChecks } = body;
    const formDataString = JSON.stringify(body);

    // --- SUBMIT DATA TO HEDERA CONSENSUS SERVICE (HCS) ---
    const topicId = process.env.HEDERA_TOPIC_ID;
if (!topicId) {
  throw new Error("HEDERA_TOPIC_ID must be set in .env.local");
}

const hcsTransaction = await new TopicMessageSubmitTransaction({
  topicId: topicId, 
  message: formDataString,
}).execute(client);
    
    const hcsReceipt = await hcsTransaction.getReceipt(client);
    const hcsTransactionId = hcsTransaction.transactionId.toString();
    console.log(`HCS Message submitted successfully. Transaction ID: ${hcsTransactionId}`);

    // --- CREATE AN NFT TO REPRESENT THE CERTIFICATE ---
    const tokenCreateTx = await new TokenCreateTransaction()
      .setTokenName(`Certificate for ${productName}`)
      .setTokenSymbol("AGROK")
      .setTokenType(TokenType.NonFungibleUnique)
      .setDecimals(0)
      .setInitialSupply(0)
      .setSupplyType(TokenSupplyType.Finite)
      .setMaxSupply(1)
      .setTreasuryAccountId(operatorId)
      .setSupplyKey(PrivateKey.fromStringECDSA(operatorKey))
      .setMaxTransactionFee(new Hbar(30))
      .freezeWith(client);

    const tokenCreateSign = await tokenCreateTx.sign(PrivateKey.fromStringECDSA(operatorKey));
    const tokenCreateSubmit = await tokenCreateSign.execute(client);
    const tokenCreateRx = await tokenCreateSubmit.getReceipt(client);
    const tokenId = tokenCreateRx.tokenId;

    if (!tokenId) {
      throw new Error("Token ID was not created correctly.");
    }
    console.log(`Created new NFT with Token ID: ${tokenId}`);

    // --- MINT THE NFT AND ADD METADATA ---
    const metadata = `https://hashscan.io/testnet/transaction/${hcsTransactionId}`;
    const mintTx = await new TokenMintTransaction()
      .setTokenId(tokenId)
      .setMetadata([Buffer.from(metadata)])
      .freezeWith(client);

    const mintTxSign = await mintTx.sign(PrivateKey.fromStringECDSA(operatorKey));
    const mintTxSubmit = await mintTxSign.execute(client);
    const mintRx = await mintTxSubmit.getReceipt(client);

    console.log(`Minted NFT with serial number: ${mintRx.serials[0].low}`);

    // --- SEND THE REAL DATA BACK TO THE FRONT-END ---
    return NextResponse.json({ 
      message: "Certificate created successfully on Hedera!",
      hcsTransactionId: hcsTransactionId,
      tokenId: tokenId.toString(),
      nftSerialNumber: mintRx.serials[0].low.toString(),
    });

  } catch (error: any) {
    console.error("Error calling Hedera API:", error);
    return new NextResponse(`Internal Server Error: ${error.message}`, { status: 500 });
  }
}