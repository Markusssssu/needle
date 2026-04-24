import { eq } from "drizzle-orm";
import { users } from "~~/server/db/schema";
import { db } from "~~/server/utils/db";

type AppUserRole = "admin" | "member";

type ClerkEmailAddress = {
  id: string;
  emailAddress: string;
};

type ClerkUserLike = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string;
  primaryEmailAddressId: string | null;
  emailAddresses: ClerkEmailAddress[];
  publicMetadata?: Record<string, unknown>;
};

const normalizeDbRole = (role: unknown, orgRole?: unknown): AppUserRole =>
  role === "admin" || orgRole === "org:admin" ? "admin" : "member";

const getPrimaryEmail = (
  clerkUser: ClerkUserLike,
  fallbackEmail?: string | null
) => {
  const primaryEmail = clerkUser.emailAddresses.find(
    email => email.id === clerkUser.primaryEmailAddressId
  );

  return (
    primaryEmail?.emailAddress ??
    clerkUser.emailAddresses[0]?.emailAddress ??
    fallbackEmail ??
    null
  );
};

export const getAppUserByClerkId = async (clerkId: string) =>
  db.query.users.findFirst({
    where: eq(users.clerkId, clerkId)
  });

export const listAppUsers = async () =>
  db.query.users.findMany({
    orderBy: (users, { desc }) => [desc(users.createdAt)]
  });

export const upsertAppUserFromClerkUser = async (
  clerkUser: ClerkUserLike,
  existingRole?: AppUserRole,
  orgRole?: string | null
) => {
  const existingUser = await getAppUserByClerkId(clerkUser.id);
  const email = getPrimaryEmail(clerkUser, existingUser?.email);

  if (!email) {
    throw createError({
      statusCode: 400,
      statusMessage: "Clerk user does not have an email address"
    });
  }

  const role = normalizeDbRole(
    clerkUser.publicMetadata?.role ?? existingRole ?? existingUser?.role,
    orgRole
  );

  const [appUser] = await db
    .insert(users)
    .values({
      clerkId: clerkUser.id,
      email,
      role,
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      imageUrl: clerkUser.imageUrl,
      updatedAt: new Date()
    })
    .onConflictDoUpdate({
      target: users.clerkId,
      set: {
        email,
        role,
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        imageUrl: clerkUser.imageUrl,
        updatedAt: new Date()
      }
    })
    .returning();

  return appUser;
};

export const deleteAppUserByClerkId = async (clerkId: string) => {
  await db.delete(users).where(eq(users.clerkId, clerkId));
};
