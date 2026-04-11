// --- CONTENT INJECTION LOGIC ---
const BUCKET_URL = "https://YOUR_PROJECT_ID.supabase.co/storage/v1/object/public/blog-content";

async function injectContent() {
    try {
        // 1. Inject Home Text
        const textReq = await fetch(`${BUCKET_URL}/home/intro.txt`);
        if (textReq.ok) {
            const text = await textReq.text();
            document.getElementById('page-body').innerText = text;
            document.getElementById('page-title').innerText = "Home Feed";
        }

        // 2. Inject Music
        const audio = document.getElementById('player');
        audio.src = `${BUCKET_URL}/home/music-1.mp3`;

        // 3. Inject Webmaster Bio
        const bioReq = await fetch(`${BUCKET_URL}/about/bio.txt`);
        if (bioReq.ok) {
            document.getElementById('webmaster-desc').innerText = await bioReq.text();
        }

        // 4. Inject Update Log
        const logReq = await fetch(`${BUCKET_URL}/logs/updates.txt`);
        if (logReq.ok) {
            document.getElementById('update-log').innerText = await logReq.text();
        }

    } catch (err) {
        console.log("Bucket not ready or files missing.", err);
    }
}

injectContent();
