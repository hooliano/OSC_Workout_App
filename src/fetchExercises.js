const API_BASE_URL = 'https://oss.exercisedb.dev/api/v1/exercises';
const PAGE_SIZE = 25;

export async function fetchPage(after = null) {
    const params = new URLSearchParams({limit : String(PAGE_SIZE)});
    if (after) {
        params.set('after', after);
    }

    const res = await fetch(`${API_BASE_URL}?${params}`);

    if (!res.ok) {
        throw new Error(`Error getting exercises: ${res.status}.`);
    }

    const json = await res.json();
    if (!json.success || !Array.isArray(json.data)) {
        throw new Error("Unexpected error getting exercises.");
    }

    return {
        exercises: json.data,
        nextPage: json.meta?.hasNextPage ? json.meta.nextCursor : null,
    };
}