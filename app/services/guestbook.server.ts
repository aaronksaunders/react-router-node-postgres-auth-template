import { database } from "~/database/context";
import * as schema from "~/database/schema";

export interface GuestBookEntry {
    id: number;
    name: string;
    email: string;
}

export async function addGuestBookEntry(name: string, email: string) {
    const db = database();
    await db.insert(schema.guestBook).values({ name, email });
}

export async function getGuestBookEntries() {
    const db = database();
    return db.query.guestBook.findMany({
        columns: {
            id: true,
            name: true,
        },
    });
}