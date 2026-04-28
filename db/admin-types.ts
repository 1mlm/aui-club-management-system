export type AdminUser = {
  id: number;
  email: string;
  displayName: string;
  isSystemAdmin: boolean;
  createdAt: string;
};

export type AdminClub = {
  id: number;
  name: string;
  ownerEmail: string;
  status: string;
  createdAt: string;
};

export type AdminJoinRequest = {
  id: number;
  userEmail: string;
  clubName: string;
  status: string;
  createdAt: string;
};
