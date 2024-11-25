/**
 * Session management module for user authentication and session handling.
 * 
 * This module provides functions to create, retrieve, and manage user sessions
 * using cookie-based session storage. It includes utilities for user authentication,
 * session data retrieval, and session destruction.
 * 
 * @module session
 */

import { createCookieSessionStorage, redirect } from "react-router";
import { users } from "~/database/schema";

// Types
type User = typeof users._.inferSelect;
export type UserSession = Omit<User, 'passwordHash'>;

declare module 'react-router' {
    export interface SessionData {
        [USER_SESSION_KEY]: UserSession;
    }
}

// Constants
const USER_SESSION_KEY = "USER-INFO";
const SESSION_EXPIRY = 60 * 60 * 24 * 7; // 7 days

// Session Configuration
export const sessionStorage = createCookieSessionStorage({
    cookie: {
        name: "__session",
        secrets: ["s3cret"],
        sameSite: "lax",
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    },
});

export const { commitSession, destroySession } = sessionStorage;

/**
 * Retrieves the user session from the request.
 * @param {Request} request - The incoming request object.
 * @returns {Promise<Session>} The session object.
 */
export async function getUserSession(request: Request) {
    return sessionStorage.getSession(request.headers.get("Cookie"));
}

/**
 * Retrieves the user ID from the session.
 * @param {Request} request - The incoming request object.
 * @returns {Promise<number | undefined>} The user ID or undefined if not found.
 */
export async function getUserId(request: Request): Promise<number | undefined> {
    const session = await getUserSession(request);
    const user = session.get(USER_SESSION_KEY);
    return user?.id;
}

/**
 * Ensures the user is authenticated. Redirects to login if not.
 * @param {Request} request - The incoming request object.
 * @returns {Promise<number>} The user ID.
 * @throws {Redirect} Redirects to the login page if not authenticated.
 */
export async function requireUser(request: Request) {
    const session = await getUserSession(request);
    const userId = session.get(USER_SESSION_KEY);
    if (!userId) {
        throw redirect("/login");
    }
    return userId;
}

/**
 * Retrieves user session data, redirecting if not found.
 * @param {Request} request - The incoming request object.
 * @param {string} [redirectUrl="/login"] - The URL to redirect to if no user data is found.
 * @returns {Promise<UserSession>} The user session data.
 * @throws {Redirect} Redirects to the specified URL if no user data is found.
 */
export async function getUserSessionData(request: Request, redirectUrl = "/login") {
    const session = await getUserSession(request);
    const userData = session.get(USER_SESSION_KEY);
    if (!userData) {
        throw redirect(redirectUrl);
    }
    return userData as UserSession;
}

/**
 * Creates a user session and redirects to the specified URL.
 * @param {Object} params - The parameters for creating a user session.
 * @param {Request} params.request - The incoming request object.
 * @param {User} params.user - The user object to store in the session.
 * @param {boolean} [params.remember=true] - Whether to remember the session.
 * @param {string} [params.redirectUrl="/"] - The URL to redirect to after creating the session.
 * @returns {Promise<Redirect>} The redirect response.
 */
export async function createUserSession({
    request,
    user,
    remember = true,
    redirectUrl = "/",
}: {
    request: Request;
    user: User;
    remember?: boolean;
    redirectUrl?: string;
}) {
    const session = await getUserSession(request);
    const { passwordHash, ...userWithoutPassword } = user;
    session.set(USER_SESSION_KEY, userWithoutPassword);

    return redirect(redirectUrl, {
        headers: {
            "Set-Cookie": await sessionStorage.commitSession(session, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: remember ? SESSION_EXPIRY : undefined,
            }),
        },
    });
}

/**
 * Logs out the user by destroying the session and redirecting to the home page.
 * @param {Request} request - The incoming request object.
 * @returns {Promise<Redirect>} The redirect response to the home page.
 */
export async function logout(request: Request) {
    const session = await getUserSession(request);
    session.unset(USER_SESSION_KEY);
    return redirect("/", {
        headers: {
            "Set-Cookie": await sessionStorage.destroySession(session),
        },
    });
}