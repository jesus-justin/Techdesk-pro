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

export const TICKET_STATUS_LABELS: Record<TicketStatus, string> = {
  [TicketStatus.OPEN]: "Open",
  [TicketStatus.IN_PROGRESS]: "In Progress",
  [TicketStatus.RESOLVED]: "Resolved",
  [TicketStatus.CLOSED]: "Closed"
};

export const TICKET_STATUS_COLORS: Record<TicketStatus, string> = {
  [TicketStatus.OPEN]: "bg-blue-100 text-blue-800",
  [TicketStatus.IN_PROGRESS]: "bg-amber-100 text-amber-800",
  [TicketStatus.RESOLVED]: "bg-emerald-100 text-emerald-800",
  [TicketStatus.CLOSED]: "bg-slate-100 text-slate-800"
};

export const PRIORITY_LABELS: Record<TicketPriority, string> = {
  [TicketPriority.LOW]: "Low",
  [TicketPriority.MEDIUM]: "Medium",
  [TicketPriority.HIGH]: "High",
  [TicketPriority.CRITICAL]: "Critical"
};

export const PRIORITY_COLORS: Record<TicketPriority, string> = {
  [TicketPriority.LOW]: "bg-slate-100 text-slate-700",
  [TicketPriority.MEDIUM]: "bg-blue-100 text-blue-700",
  [TicketPriority.HIGH]: "bg-orange-100 text-orange-700",
  [TicketPriority.CRITICAL]: "bg-red-100 text-red-700"
};

export const ASSET_STATUS_LABELS: Record<AssetStatus, string> = {
  [AssetStatus.AVAILABLE]: "Available",
  [AssetStatus.IN_USE]: "In Use",
  [AssetStatus.UNDER_REPAIR]: "Under Repair",
  [AssetStatus.RETIRED]: "Retired"
};

export const ASSET_STATUS_COLORS: Record<AssetStatus, string> = {
  [AssetStatus.AVAILABLE]: "bg-emerald-100 text-emerald-700",
  [AssetStatus.IN_USE]: "bg-blue-100 text-blue-700",
  [AssetStatus.UNDER_REPAIR]: "bg-amber-100 text-amber-700",
  [AssetStatus.RETIRED]: "bg-slate-100 text-slate-700"
};

export const TICKET_STATUS_FLOW: Record<TicketStatus, TicketStatus[]> = {
  [TicketStatus.OPEN]: [TicketStatus.IN_PROGRESS, TicketStatus.CLOSED],
  [TicketStatus.IN_PROGRESS]: [TicketStatus.RESOLVED, TicketStatus.CLOSED],
  [TicketStatus.RESOLVED]: [TicketStatus.CLOSED, TicketStatus.IN_PROGRESS],
  [TicketStatus.CLOSED]: []
};
