import { db } from "~~/server/utils/db";
import { transactions } from "~~/server/db/schema";

export default defineEventHandler(async () => {
  try {
    const allTransactions = await db.query.transactions.findMany({
      orderBy: (transactions, { desc }) => [desc(transactions.createdAt)]
    });

    return { allTransactions };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
