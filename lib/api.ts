export default async function fetchApi<T>(url: string, options: RequestInit): Promise<T> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${url}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    });

    if (!res.ok) {
        throw new Error(`API Error: ${res.statusText}`);
    }

    return res.json();
}