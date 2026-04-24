export const txService = {
  list: () => db.select().from(transactions),
  stats: () => db.select({ count: count() }).from(transactions),
};
