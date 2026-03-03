function flattenTagValue(value, out) {
    if (value === null || value === undefined) {
        return;
    }

    if (Array.isArray(value)) {
        value.forEach(v => flattenTagValue(v, out));
        return;
    }

    if (typeof value === "object") {
        if (Object.prototype.hasOwnProperty.call(value, "value")) {
            flattenTagValue(value.value, out);
        }
        return;
    }

    if (typeof value === "string") {
        const trimmed = value.trim();
        if (!trimmed) {
            return;
        }

        if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
            try {
                flattenTagValue(JSON.parse(trimmed), out);
                return;
            } catch (_) {
                // Fall through and keep the raw string.
            }
        }

        out.push(trimmed);
        return;
    }

    out.push(String(value));
}

export function normalizeTags(input) {
    const flattened = [];
    flattenTagValue(input, flattened);
    return Array.from(new Set(flattened));
}
