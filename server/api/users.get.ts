import { listAppUsers } from "~~/server/utils/users";

export default defineEventHandler(async event => {
  const { isAuthenticated } = event.context.auth();

  if (!isAuthenticated) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized"
    });
  }

  const users = await listAppUsers();

  return { users };
});
