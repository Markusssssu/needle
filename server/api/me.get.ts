import { clerkClient } from "@clerk/nuxt/server";
import { getAppUserByClerkId, upsertAppUserFromClerkUser } from "~~/server/utils/users";

export default defineEventHandler(async event => {
  const { isAuthenticated, userId, orgRole } = event.context.auth();

  if (!isAuthenticated || !userId) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized"
    });
  }

  const existingUser = await getAppUserByClerkId(userId);
  const clerkUser = await clerkClient(event).users.getUser(userId);
  const appUser = await upsertAppUserFromClerkUser(
    clerkUser,
    existingUser?.role,
    orgRole ?? null
  );

  return { user: appUser };
});
