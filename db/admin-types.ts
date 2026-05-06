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
  mainColor?: string;
  iconName?: string;
};

export type AdminJoinRequest = {
  id: number;
  userId: number;
  userEmail: string;
  userDisplayName: string;
  clubName: string;
  status: string;
  createdAt: string;
};
