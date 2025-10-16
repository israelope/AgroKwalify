import { TopicCreateTransaction } from "@hashgraph/sdk";
import { getHederaClient } from "../src/lib/hederaClient.ts"; // We'll reuse our client helper

async function main() {
  const client = getHederaClient();

  console.log("Creating a new topic...");
  const transaction = await new TopicCreateTransaction().execute(client);
  const receipt = await transaction.getReceipt(client);

  const newTopicId = receipt.topicId;

  if (!newTopicId) {
    throw new Error("Topic ID was not created correctly.");
  }

  console.log(`Success! Your new private topic ID is: ${newTopicId}`);
  console.log("Please add this to your .env.local file as HEDERA_TOPIC_ID");
}

main().catch((error) => {
  console.error("Error creating topic:", error);
  process.exit(1);
});