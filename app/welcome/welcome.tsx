import { Form, useNavigation } from "react-router";

import logoDark from "./logo-dark.svg";
import logoLight from "./logo-light.svg";
import { logout } from "~/services/session.server";

export function Welcome({
  guestBook,
  guestBookError,
  message,
  onLogout,
}: {
  guestBook: {
    name: string;
    id: number;
  }[];
  guestBookError?: string;
  message: string;
  onLogout: () => void;
}) {
  const navigation = useNavigation();

  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <div className="flex-1 flex flex-col items-center gap-8 min-h-0">
        <header className="flex flex-col items-center gap-9">
          <h1 className="sr-only">{message}</h1>
          <div className="w-[200px] max-w-[100vw] p-4">
            <img
              src={logoLight}
              alt="React Router"
              className="block w-full dark:hidden"
            />
            <img
              src={logoDark}
              alt="React Router"
              className="hidden w-full dark:block"
            />
          </div>
        </header>
        <div className="max-w-[300px] w-full space-y-6 px-4">
          <section className="rounded-3xl border border-gray-200 p-6 dark:border-gray-700 space-y-4">
            <Form
              method="post"
              className="space-y-4 w-full max-w-lg"
              onSubmit={(event) => {
                if (navigation.state === "submitting") {
                  event.preventDefault();
                }
                const form = event.currentTarget;
                requestAnimationFrame(() => {
                  form.reset();
                });
              }}
            >
              <input
                name="name"
                placeholder="Name"
                required
                className="w-full dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:focus:ring-blue-500 h-10 px-3 rounded-lg border border-gray-200 focus:ring-1 focus:ring-blue-500"
              />
              <input
                name="email"
                type="email"
                placeholder="your@email.com"
                required
                className="w-full dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:focus:ring-blue-500 h-10 px-3 rounded-lg border border-gray-200 focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={navigation.state === "submitting"}
                className="w-full h-10 px-3 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
              >
                Sign Guest Book
              </button>
              {guestBookError && (
                <p className="text-red-500 dark:text-red-400">
                  {guestBookError}
                </p>
              )}
            </Form>
            <ul className="text-center">
              {<li className="p-3">{message}</li>}
              {guestBook.map(({ id, name }) => (
                <li key={id} className="p-3">
                  {name}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <button
          onClick={onLogout}
          className="border rounded px-2.5 py-1 w-32 hover:bg-slate-400 hover:text-white"
        >
          Logout
        </button>
      </div>
    </main>
  );
}
