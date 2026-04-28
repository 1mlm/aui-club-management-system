import { UsersTableClient } from "@/components/UsersTableClient";
import {
  getAllUsers
} from "@/db/admin";

export default async function UsersPage() {
  const users = await getAllUsers();

  return <UsersTableClient initialUsers={users} />;
}
