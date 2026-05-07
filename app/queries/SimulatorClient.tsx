"use client";

import { useState } from "react";
import { Button } from "@/shadcn/ui/button";
import { runQuery } from "./actions";

export function SimulatorClient({ exampleQueries }: { exampleQueries: any[] }) {
    const [query, setQuery] = useState(exampleQueries[0].sql);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const execute = async () => {
        setLoading(true);
        setError("");
        setResult(null);
        try {
            const res = await runQuery(query);
            if (res.error) {
                setError(res.error);
            } else {
                setResult(res.data);
            }
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-4 rounded-lg border p-4 bg-card text-card-foreground">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Interactive SQL Simulator</h2>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setQuery(exampleQueries[Math.floor(Math.random() * exampleQueries.length)].sql)}>
                        Use Example
                    </Button>
                    <Button onClick={execute} disabled={loading}>{loading ? "Running..." : "Run Query"}</Button>
                </div>
            </div>
            <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full h-32 p-3 font-mono text-sm bg-muted text-foreground border rounded-md"
                placeholder={'SELECT * FROM "user"...'}
            />

            {error && <div className="text-destructive font-mono text-sm">{error}</div>}

            {result && (
                <div className="overflow-x-auto border rounded-md">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted text-muted-foreground uppercase text-xs">
                            <tr>
                                {result.length > 0 ? Object.keys(result[0]).map(key => (
                                    <th key={key} className="px-4 py-2 border-b">{key}</th>
                                )) : <th className="px-4 py-2 border-b">Result</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {result.length === 0 && <tr><td className="px-4 py-2 text-muted-foreground">0 rows returned.</td></tr>}
                            {result.map((row: any, i: number) => (
                                <tr key={i} className="border-b last:border-0 hover:bg-muted/50">
                                    {Object.values(row).map((val: any, j: number) => (
                                        <td key={j} className="px-4 py-2 truncate max-w-xs">{String(val)}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="p-2 text-xs text-muted-foreground bg-muted">
                        {result.length} rows returned.
                    </div>
                </div>
            )}
        </div>
    )
}
