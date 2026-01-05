import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ locals, plannerDb }) => {
  if (!locals.user) {
    return json(null);
  }

  const userId = locals.user.id;

  const [userData] = await plannerDb
    .selectFrom("user")
    .selectAll()
    .where("id", "=", userId)
    .limit(1)
    .execute();

  if (!userData) {
    return json(null);
  }

  return json({
    id: userData.id,
    name: userData.name,
    email: userData.email,
    emailVerified: Boolean(userData.emailVerified),
    image: userData.image,
  });
};
