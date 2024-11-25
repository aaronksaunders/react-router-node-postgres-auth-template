import { Form, Link, redirect, type MetaFunction } from "react-router";
import { createUserSession, getUserId } from "~/services/session.server";
import { Route } from "./+types/login";
import { loginUser } from "~/services/user.server";
import { z } from "zod";

const LoginSchema = z.object({
  email: z.string().email().trim(),
  password: z.string().min(6),
});

export const meta: MetaFunction = () => {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
};

export async function loader({ request }: Route.LoaderArgs) {
  // Check if the user is already logged in
  const userId = await getUserId(request);
  if (userId) {
    throw redirect("/");
  }

  return { user: null, error: null };
}

export async function action({ request }: Route.ActionArgs) {
  let response: Response;
  try {
    const formData = await request.formData();
    const result = LoginSchema.safeParse(Object.fromEntries(formData));
    if (!result.success) {
      return { error: "Invalid form data" };
    }

    const user = await loginUser(result.data.email, result.data.password);

    if ("error" in user) {
      return { error: user.error };
    }

    // Create a session
    response = await createUserSession({
      request,
      user: user,
      remember: true,
    });

    if (!response) {
      throw new Error("An error occurred while creating the session");
    }
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }

    return { error: "An unknown error occurred" };
  }

  throw response;
}

export default function Login({ actionData }: Route.ComponentProps) {
  return (
    <div className="p-8 min-w-3/4 w-96">
      <h1 className="text-2xl">React Router v7 Auth: Login</h1>
      <Form method="post" className="mt-6 ">
        <div className="flex flex-col gap-2">
          <div className="flex flex-row">
            <label className="min-w-24 ">Email:</label>
            <input className="flex-1" type="email" name="email" />
          </div>
          <div className="flex flex-row">
            <label className="min-w-24 ">Password:</label>
            <input className="flex-1" type="password" name="password" />
          </div>
          <div className="flex flex-row-reverse mt-4 gap-4">
            <button
              type="submit"
              className="border rounded px-2.5 py-1 w-32 hover:bg-slate-400 hover:text-white"
            >
              Login
            </button>
            <Link to="/register">
              <button
                type="submit"
                className="border rounded px-2.5 py-1 w-32 hover:bg-slate-400 hover:text-white"
              >
                Register
              </button>
            </Link>
          </div>
          {actionData?.error ? (
            <div className="flex flex-row">
              <p className="text-red-600 mt-4 ">{actionData?.error}</p>
            </div>
          ) : null}
        </div>
      </Form>
    </div>
  );
}
