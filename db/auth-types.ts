export type AuthUser = {
  id: number;
  email: string;
  displayName: string;
  clubCount: number;
  isSystemAdmin?: boolean;
};
