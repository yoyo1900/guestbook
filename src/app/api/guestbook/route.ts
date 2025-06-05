// app/api/guestbook/route.ts
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from "@/prisma";

const guestbookSchema = z.object({
    name: z.string().min(1),
    message: z.string().min(1),
    hide: z.boolean(),
})

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, message, hide } = guestbookSchema.parse(body)

        const entry = await prisma.guestbookEntry.create({
            data: { name, message, hide },
        })

        return NextResponse.json(
            { id: entry.id, createdAt: entry.createdAt },
            { status: 201 }
        )
    } catch (err) {
        if (err instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Validation failed', details: err.errors },
                { status: 400 }
            )
        }
        console.error(err)
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}
