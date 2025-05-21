// app/page.tsx

export default function Page() {
    return (
        <main className="relative flex justify-center w-full h-screen">
            <div
                className="absolute inset-0 -z-10"
                style={{
                    backgroundImage: 'url("https://media.voog.com/0000/0036/7580/photos/FB_event_cover.png")',
                    backgroundPosition: '50% 10%',
                }}
            />
        </main>
    );
}
