export default async function fetchApi<T>(url: string, options: RequestInit): Promise<T> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${url}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    });

    if (!res.ok) {
        // API routes return { error: "..." } — surface that message instead
        // of the generic HTTP status text ("Bad Request", etc).
        let message = res.statusText;
        try {
            const body = await res.json();
            if (body?.error) message = body.error;
        } catch {
            // response wasn't JSON — fall back to statusText
        }
        throw new Error(message);
    }

    return res.json();
}
