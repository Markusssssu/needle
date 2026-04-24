import { clerkMiddleware, createRouteMatcher } from "@clerk/nuxt/server";

export default clerkMiddleware((event) => {
  const { isAuthenticated, has } = event.context.auth();
  const isProtectedRoute = createRouteMatcher([
    "/api/invoices(.*)",
    "/api/admin(.*)",
  ]);
  const canCreateInvoices = has({
    permission: "org:invoices:create",
  });

  if (!isAuthenticated && isProtectedRoute(event)) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized: User not signed in",
    });
  }

  if (!canCreateInvoices && isProtectedRoute(event)) {
    throw createError({
      statusCode: 403,
      statusMessage: "Unauthorized: Missing Permission to create invoices",
    });
  }
});
