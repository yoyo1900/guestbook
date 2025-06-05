// app/guestbook/page.tsx
import { prisma } from "@/prisma";
import type { GuestbookEntry } from "@prisma/client";

export default async function GuestbookList() {
    let entries: GuestbookEntry[];;
    let fetchError = false;

    try {
        entries = await prisma.guestbookEntry.findMany({
            where: { hide: false },
            orderBy: { createdAt: "desc" },
            take: 20,
        });
    } catch (err) {
        console.error("Failed to load guestbook entries:", err);
        fetchError = true;
        entries = [];
    }

    if (fetchError) {
        return (
            <main className="max-w-2xl mx-auto p-6">
                <h1 className="text-2xl font-semibold mb-6">Guests</h1>
                <p className="text-red-600">Unable to load entries. Please try again later.</p>
            </main>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="mt-4 mb-4 h-[1px] w-full bg-gray-300"></div>
            <h1 className="text-2xl font-semibold mt-6 mb-6">Guests</h1>
            {entries.length === 0 ? (
                <p className="text-gray-600">No entries yet.</p>
            ) : (
                <ul className="space-y-4">
                    {entries.map((entry) => (
                        <li key={entry.id} className="border rounded p-4">
                            <p className="font-medium">{entry.name}</p>
                            <p className="text-sm text-gray-600">
                                {entry.createdAt.toLocaleString()}
                            </p>
                            <p className="mt-2">{entry.message}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
