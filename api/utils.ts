// Helper function to create slugs
export const createSlug = (text: string): string => {
    return text
        .toLowerCase()
        .replace(/'/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
};

// Merge results from both searches, prioritizing by search_count
// and limiting to maxResults
export const mergeResults = (companies: any[], divisions: any[], maxResults: number): any[] => {
    // Combine both arrays
    const combined = [...companies, ...divisions];

    // Sort by search_count in descending order
    combined.sort((a, b) => b.search_count - a.search_count);

    // Limit to maxResults
    const top5Results = combined.slice(0, maxResults);

    return top5Results.map(({ name, slug }) => ({ name, slug }));

};
