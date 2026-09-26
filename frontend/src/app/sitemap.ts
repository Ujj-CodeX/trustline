export default async function sitemap(){
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sitemap-data/`);
    const sessions = await res.json();

    return sessions.map((s:any) => ({
        url: `https://trustline.com/chat/${s.slug}`,
        lastModified: s.created_at,

    }));
}