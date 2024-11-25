/**
 * User service module for handling user-related operations such as
 * creating new users and logging in existing users.
 * 
 * This module provides functions to interact with the user database,
 * including user creation and authentication. It utilizes bcrypt for
 * password hashing and verification.
 * 
 * @module user
 */

import { redirect } from "react-router";
import { getUserSessionData } from "./session.server";
import { database } from "~/database/context";
import { users } from "~/database/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

/**
 * Creates a new user in the database.
 * 
 * @param {string} email - The email of the user.
 * @param {string} username - The username of the user.
 * @param {string} password - The password of the user.
 * @returns {Promise<Object>} The created user object.
 * @throws {Error} If the user cannot be created.
 */
export const createUser = async (email: string, username: string, password: string) => {
    try {
        const db = database();

        const passwordHash = bcrypt.hashSync(password!, 10);
        const user = await db
            .insert(users)
            .values({
                username,
                email,
                passwordHash,
            })
            .returning();

        if (!user) {
            throw new Error("User not created");
        }

        return user[0];
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/**
 * Logs in a user by checking their credentials.
 * 
 * @param {string} email - The email of the user.
 * @param {string} password - The password of the user.
 * @returns {Promise<Object>} The logged-in user object or an error object.
 * @throws {Error} If an error occurs during the login process.
 */
export const loginUser = async (email: string, password: string) => {
    try {
        // Check the user's credentials
        const db = database();
        const user = await db.select().from(users).where(eq(users.email, email!));

        if (!user) {
            return { error: "Invalid email or password" };
        }

        if (!bcrypt.compareSync(password!, user[0].passwordHash)) {
            return { error: "Invalid email or password" };
        }

        return user[0];
    } catch (error) {
        console.error(error);
        throw error;
    }
}
