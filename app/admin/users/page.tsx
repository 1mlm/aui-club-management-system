import { getAllUsers, updateUserAdminStatus, updateUserDisplayName, deleteUser } from "@/db/admin";
import type { AdminUser } from "@/db/admin";
import { UsersTableClient } from "@/components/UsersTableClient";

export default async function UsersPage() {
  const users = await getAllUsers();

  return (
    <UsersTableClient initialUsers={users} />
  );
}
