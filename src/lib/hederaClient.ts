import { Client, AccountId, PrivateKey } from "@hashgraph/sdk";

export function getHederaClient() {
  const accountId = process.env.HEDERA_ACCOUNT_ID!;
  const privateKey = process.env.HEDERA_PRIVATE_KEY!;

  if (!accountId || !privateKey) {
    throw new Error("Missing Hedera credentials in .env.local");
  }

  const client = Client.forTestnet();
  client.setOperator(AccountId.fromString(accountId), PrivateKey.fromStringECDSA(privateKey));
  return client;
}
