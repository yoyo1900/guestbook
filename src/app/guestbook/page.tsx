// app/guestbook/page.tsx
import GuestbookClient from './_components/guestbookClient'
import GuestbookServer from './_components/guestbookServer'

export default function GuestbookPage() {
    return (
        <div className="h-screen w-screen overflow-x-hidden items-center text-center">
            <div className="max-w-xl p-4 space-y-4 mx-auto">
                <h1 className="text-3xl mt-4 font-bold text-primary">Guestbook</h1>
                <GuestbookClient />
                <GuestbookServer />
            </div>
        </div>
    )
}
