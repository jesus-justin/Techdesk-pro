export enum Role {
  ADMIN = "ADMIN",
  IT_STAFF = "IT_STAFF",
  EMPLOYEE = "EMPLOYEE"
}

export enum TicketStatus {
  OPEN = "OPEN",
  IN_PROGRESS = "IN_PROGRESS",
  RESOLVED = "RESOLVED",
  CLOSED = "CLOSED"
}

export enum TicketPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL"
}

export enum AssetStatus {
  AVAILABLE = "AVAILABLE",
  IN_USE = "IN_USE",
  UNDER_REPAIR = "UNDER_REPAIR",
  RETIRED = "RETIRED"
}

export enum SyncOperation {
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  DELETE = "DELETE"
}

export enum AuditAction {
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
  LOGIN = "LOGIN",
  LOGOUT = "LOGOUT",
  ASSIGN = "ASSIGN",
  RESOLVE = "RESOLVE",
  CLOSE = "CLOSE"
}

export enum SyncQueueStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  DONE = "DONE",
  FAILED = "FAILED"
}

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: Role;
  refreshToken: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  submittedById: string;
  assignedToId: string | null;
  assetId: string | null;
  resolvedAt: Date | null;
  closedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  ticketId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Asset {
  id: string;
  name: string;
  category: string;
  serialNumber: string;
  model: string;
  manufacturer: string;
  purchaseDate: Date | null;
  status: AssetStatus;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AssetAssignment {
  id: string;
  assetId: string;
  userId: string;
  assignedAt: Date;
  returnedAt: Date | null;
  notes: string | null;
}

export interface AuditLog {
  id: string;
  action: AuditAction;
  entity: string;
  entityId: string;
  performedById: string;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
}

export interface SyncQueue {
  id: string;
  operation: SyncOperation;
  entity: string;
  payload: Record<string, unknown>;
  retryCount: number;
  maxRetries: number;
  status: SyncQueueStatus;
  createdAt: Date;
  processedAt: Date | null;
}

export interface PaginationMeta {
  page: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: PaginationMeta;
}

export interface JwtPayload {
  userId: string;
  role: Role;
  iat: number;
  exp: number;
}

export interface DashboardStats {
  openTickets: number;
  inProgressTickets: number;
  resolvedTickets: number;
  totalTickets: number;
  totalAssets: number;
  availableAssets: number;
  recentActivity: AuditLog[];
}

export interface OfflineQueueItem {
  id: string;
  operation: SyncOperation;
  entity: string;
  payload: Record<string, unknown>;
  retryCount: number;
  createdAt: Date;
}
