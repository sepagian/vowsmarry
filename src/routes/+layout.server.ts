import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = ({ locals, cookies }) => {
  const { user, session } = locals;

  return {
    user: user
      ? {
          id: user.id,
          email: user.email,
          name: user.name,
          firstName:
            user.name?.split(" ")[0] || user.email?.split("@")[0] || null,
        }
      : null,
    session,
    cookies: cookies.getAll(),
  };
};
