"use server";

import { getDbPool } from "@/db/client";

export async function runQuery(queryText: string) {
    try {
        if (!queryText || !queryText.trim()) {
            return { error: "Query is empty." };
        }
        const pool = getDbPool();
        // Since it's a simulator for a POC, we allow generic queries.
        // Usually, we'd limit this or use a read-only role, but for this demo, 
        // we'll execute the raw SQL string.
        const res = await pool.query(queryText);
        return { data: res.rows };
    } catch (e: any) {
        return { error: e.message || "Failed to execute query." };
    }
}
