import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import { useSubmit } from "react-router";
import {
  addGuestBookEntry,
  getGuestBookEntries,
} from "~/services/guestbook.server";
import { getUserSessionData } from "~/services/session.server";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  let name = formData.get("name");
  let email = formData.get("email");
  if (typeof name !== "string" || typeof email !== "string") {
    return { guestBookError: "Name and email are required" };
  }

  name = name.trim();
  email = email.trim();
  if (!name || !email) {
    return { guestBookError: "Name and email are required" };
  }

  try {
    await addGuestBookEntry(name, email);
  } catch (error) {
    return { guestBookError: "Error adding to guest book" };
  }
}

export async function loader({ context, request }: Route.LoaderArgs) {
  const user = await getUserSessionData(request);

  const guestBook = await getGuestBookEntries();

  return {
    guestBook,
    user: user,
    message: context.VALUE_FROM_EXPRESS,
  };
}

export default function Home({ actionData, loaderData }: Route.ComponentProps) {
  console.log("Home component rendered", loaderData);
  const submit = useSubmit();
  return (
    <Welcome
      guestBook={loaderData.guestBook}
      guestBookError={actionData?.guestBookError}
      message={"Hello " + (loaderData.user as any).username}
      onLogout={() => submit(null, { method: "post", action: "/logout" })}
    />
  );
}
