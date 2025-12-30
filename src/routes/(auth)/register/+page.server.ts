import { fail, redirect } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { valibot } from "sveltekit-superforms/adapters";
import { validateRegisterSchema } from "$lib/validation/auth";
import { getAuth } from "$lib/server/auth";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals: { user } }) => {
	if (user) {
		redirect(302, "/dashboard");
	}

	const registrationForm = await superValidate(valibot(validateRegisterSchema));
	return { registrationForm };
};

export const actions: Actions = {
	default: async ({ request, platform }) => {
		const startTime = Date.now();

		if (!platform?.env?.vowsmarry) {
			return fail(500, {
				error: "Database configuration error",
			});
		}

		const auth = getAuth(platform.env.vowsmarry);
		const formData = await request.formData();
		const firstName = formData.get("firstName") as string;
		const lastName = formData.get("lastName") as string;
		const email = formData.get("email") as string;
		const password = formData.get("password") as string;
		const confirmPassword = formData.get("confirmPassword") as string;

		if (!firstName || !lastName || !email || !password || !confirmPassword) {
			return fail(400, {
				error: "All fields are required",
				firstName,
				lastName,
				email,
			});
		}

		if (password !== confirmPassword) {
			return fail(400, {
				error: "Passwords do not match",
				firstName,
				lastName,
				email,
			});
		}

		if (password.length < 6) {
			return fail(400, {
				error: "Password must be at least 6 characters long",
				firstName,
				lastName,
				email,
			});
		}

		try {
			// Use Better Auth to sign up
			await auth.api.signUpEmail({
				body: {
					email,
					password,
					name: `${firstName} ${lastName}`,
				},
			});
		} catch (error: unknown) {
			console.error("Registration error:", error);

			// Handle specific registration errors from Better Auth
			const errorMessage =
				error instanceof Error
					? error.message
					: typeof error === "object" && error !== null && "message" in error
						? String((error as { message: unknown }).message)
						: "";

			if (
				errorMessage.includes("already registered") ||
				errorMessage.includes("already exists") ||
				errorMessage.includes("User already exists")
			) {
				return fail(400, {
					error:
						"An account with this email already exists. Try logging in instead.",
					errorType: "email_already_exists",
					firstName,
					lastName,
					email,
				});
			} else if (
				errorMessage.includes("password") &&
				(errorMessage.includes("weak") || errorMessage.includes("strength"))
			) {
				return fail(400, {
					error: "Password is too weak. Please choose a stronger password.",
					errorType: "weak_password",
					firstName,
					lastName,
					email,
				});
			} else if (
				errorMessage.includes("email") &&
				errorMessage.includes("invalid")
			) {
				return fail(400, {
					error: "Please enter a valid email address.",
					errorType: "invalid_email",
					firstName,
					lastName,
					email,
				});
			} else if (
				errorMessage.includes("Too many") ||
				errorMessage.includes("rate limit")
			) {
				return fail(429, {
					error:
						"Too many registration attempts. Please wait a moment before trying again.",
					errorType: "rate_limit",
					firstName,
					lastName,
					email,
				});
			} else {
				// Generic error message for other registration issues
				return fail(400, {
					error: errorMessage || "Registration failed. Please try again.",
					errorType: "registration_error",
					firstName,
					lastName,
					email,
				});
			}
		}

		const totalTime = Date.now() - startTime;
		console.log(`Registration completed in ${totalTime}ms`);

		// Redirect to dashboard on success (outside try-catch to avoid catching redirect)
		throw redirect(303, "/dashboard");
	},
};
