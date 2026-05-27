export type ID = string;

export type UserRole = "ADMIN" | "IT_STAFF" | "EMPLOYEE";
export type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
export type TicketPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type AssetStatus = "AVAILABLE" | "IN_USE" | "UNDER_REPAIR" | "RETIRED";
export type SyncOperation = "CREATE" | "UPDATE" | "DELETE";

export interface BaseEntity {
  id: ID;
  createdAt: string;
  updatedAt: string;
}

export interface User extends BaseEntity {
  email: string;
  name: string;
  role: UserRole;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresInSeconds: number;
}

export interface AuthSession {
  user: User;
  tokens: AuthTokens;
}

export interface Comment extends BaseEntity {
  ticketId: ID;
  authorId: ID;
  body: string;
}

export interface Ticket extends BaseEntity {
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdById: ID;
  assignedToId: ID | null;
  assetId: ID | null;
  resolvedAt: string | null;
  closedAt: string | null;
}

export interface TicketWithRelations extends Ticket {
  comments: Comment[];
}

export interface Asset extends BaseEntity {
  name: string;
  category: string;
  serialNumber: string;
  model: string | null;
  manufacturer: string | null;
  purchaseDate: string | null;
  status: AssetStatus;
  notes: string | null;
}

export interface AssetAssignment extends BaseEntity {
  assetId: ID;
  userId: ID;
  assignedAt: string;
  unassignedAt: string | null;
  note: string | null;
}

export interface AuditLog extends BaseEntity {
  actorId: ID;
  action: string;
  entityType: string;
  entityId: ID;
  oldValues: Record<string, unknown> | null;
  newValues: Record<string, unknown> | null;
  ipAddress: string | null;
  userAgent: string | null;
}

export interface SyncQueueItem extends BaseEntity {
  clientMutationId: string;
  userId: ID | null;
  entityType: string;
  entityId: ID | null;
  operation: SyncOperation;
  payload: Record<string, unknown>;
  retryCount: number;
  lastError: string | null;
  serverTimestamp: string | null;
  lastAttemptAt: string | null;
  syncedAt: string | null;
}

export interface TicketStatsByStatus {
  OPEN: number;
  IN_PROGRESS: number;
  RESOLVED: number;
  CLOSED: number;
}

export interface TicketStatsByPriority {
  LOW: number;
  MEDIUM: number;
  HIGH: number;
  CRITICAL: number;
}

export interface DashboardStats {
  ticketsByStatus: TicketStatsByStatus;
  ticketsByPriority: TicketStatsByPriority;
  assetsByStatus: Record<AssetStatus, number>;
  recentActivity: AuditLog[];
}

export interface PaginationQuery {
  page: number;
  pageSize: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
}
