import { Badge } from "@/shadcn/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shadcn/ui/card";
import { SimulatorClient } from "./SimulatorClient";

const EXAMPLE_QUERIES = [
  {
    id: "active-clubs",
    title: "Active clubs with owners",
    description: "List active clubs alongside their owner emails.",
    tags: ["select", "join"],
    sql: `SELECT
  c.club_id,
  c.name,
  u.email AS owner_email,
  c.status,
  c.created_at
FROM club c
INNER JOIN users u ON u.user_id = c.owner_id
WHERE c.status = 'active'
ORDER BY c.created_at DESC;`,
  },
  {
    id: "club-membership-count",
    title: "Membership count per club",
    description: "Count active members in each club.",
    tags: ["group by", "aggregate"],
    sql: `SELECT
  c.club_id,
  c.name,
  COUNT(m.membership_id) AS member_count
FROM club c
LEFT JOIN membership m
  ON m.club_id = c.club_id
  AND m.membership_status = 'active'
  AND m.left_at IS NULL
GROUP BY c.club_id, c.name
ORDER BY member_count DESC;`,
  },
  {
    id: "pending-requests",
    title: "Pending join requests",
    description: "Show pending requests with requester + club names.",
    tags: ["where", "join"],
    sql: `SELECT
  jr.request_id,
  u.email AS requester_email,
  c.name AS club_name,
  jr.created_at
FROM joinrequest jr
INNER JOIN users u ON u.user_id = jr.initiator_user_id
INNER JOIN club c ON c.club_id = jr.target_club_id
WHERE jr.status = 'pending'
ORDER BY jr.created_at DESC;`,
  },
  {
    id: "recent-posts",
    title: "Recent posts by club",
    description: "Recent posts and their authors.",
    tags: ["order by", "limit"],
    sql: `SELECT
  p.post_id,
  p.title,
  c.name AS club_name,
  u.display_name AS author,
  p.created_at
FROM post p
INNER JOIN club c ON c.club_id = p.club_id
INNER JOIN users u ON u.user_id = p.user_id
WHERE p.is_deleted = FALSE
ORDER BY p.created_at DESC
LIMIT 10;`,
  },
] as const;

export default function QueriesPage() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-1 items-start justify-between sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-semibold">SQL Queries</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Reference queries and interactive simulator for the AUI club database schema.
          </p>
        </div>
      </div>

      <SimulatorClient exampleQueries={[...EXAMPLE_QUERIES]} />

      <div className="grid gap-4 pt-4">
        <h2 className="text-lg font-semibold">Example References</h2>
        {EXAMPLE_QUERIES.map((query) => (
          <Card key={query.id}>
            <CardHeader className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {query.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
              <CardTitle className="text-base">{query.title}</CardTitle>
              <CardDescription>{query.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="overflow-x-auto rounded-md border border-border bg-muted/40 p-4 text-xs leading-relaxed">
                <code>{query.sql}</code>
              </pre>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
