export type Url = {
  id: string;
  url: string;
  hash: string;
  createdAt: string;
  expiredAt: string | null;
  disabledAt: string | null;
  clicks: number;
};
