export type SslStatus = "OK" | "WARNING" | "ERROR";

export type NotificationEmail = {
  id: string;
  address: string;
  label: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: { urls: number };
};

export type MonitoredUrl = {
  id: string;
  url: string;
  label: string | null;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
  emails: { email: NotificationEmail }[];
  checks: SslCheckResult[];
};

export type SslCheckResult = {
  id: string;
  urlId: string;
  checkedAt: string;
  status: SslStatus;
  validTo: string | null;
  daysRemaining: number | null;
  issuer: string | null;
  errorCode: string | null;
  errorMessage: string | null;
};

export type Overview = {
  emailCount: number;
  urlCount: number;
  enabledCount: number;
  failing: {
    id: string;
    url: string;
    label: string | null;
    status: SslStatus;
    daysRemaining: number | null;
    checkedAt: string;
  }[];
  lastRunAt: string | null;
};
