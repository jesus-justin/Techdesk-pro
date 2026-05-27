import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaClient, AssetStatus, Role, TicketPriority, TicketStatus, AuditAction } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding started...");
  await prisma.auditLog.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.assetAssignment.deleteMany();
  await prisma.asset.deleteMany();
  await prisma.user.deleteMany();

  console.log("1) Seeding users...");
  const passwordHash = await bcrypt.hash("Password123!", 10);

  const users = await Promise.all([
    prisma.user.create({ data: { email: "admin@techdesk.local", name: "System Admin", role: Role.ADMIN, passwordHash } }),
    prisma.user.create({ data: { email: "staff1@techdesk.local", name: "Carlo Reyes", role: Role.IT_STAFF, passwordHash } }),
    prisma.user.create({ data: { email: "staff2@techdesk.local", name: "Maria Santos", role: Role.IT_STAFF, passwordHash } }),
    prisma.user.create({ data: { email: "emp1@techdesk.local", name: "Juan dela Cruz", role: Role.EMPLOYEE, passwordHash } }),
    prisma.user.create({ data: { email: "emp2@techdesk.local", name: "Ana Gomez", role: Role.EMPLOYEE, passwordHash } }),
    prisma.user.create({ data: { email: "emp3@techdesk.local", name: "Ben Torres", role: Role.EMPLOYEE, passwordHash } })
  ]);

  const [admin, staff1, staff2, emp1, emp2, emp3] = users;

  console.log("2) Seeding assets...");
  const assets = await Promise.all([
    prisma.asset.create({ data: { name: "Dell Latitude 5540", category: "laptop", serialNumber: "TD-0001", model: "Latitude 5540", manufacturer: "Dell", status: AssetStatus.AVAILABLE } }),
    prisma.asset.create({ data: { name: "Lenovo ThinkPad X1", category: "laptop", serialNumber: "TD-0002", model: "ThinkPad X1", manufacturer: "Lenovo", status: AssetStatus.IN_USE } }),
    prisma.asset.create({ data: { name: "HP EliteBook 840", category: "laptop", serialNumber: "TD-0003", model: "EliteBook 840", manufacturer: "HP", status: AssetStatus.IN_USE } }),
    prisma.asset.create({ data: { name: "MacBook Pro 14", category: "laptop", serialNumber: "TD-0004", model: "MacBook Pro 14", manufacturer: "Apple", status: AssetStatus.AVAILABLE } }),
    prisma.asset.create({ data: { name: "LG 27UK850 Monitor", category: "monitor", serialNumber: "TD-0005", model: "27UK850", manufacturer: "LG", status: AssetStatus.AVAILABLE } }),
    prisma.asset.create({ data: { name: "Samsung 32 Curved", category: "monitor", serialNumber: "TD-0006", model: "32 Curved", manufacturer: "Samsung", status: AssetStatus.AVAILABLE } }),
    prisma.asset.create({ data: { name: "Dell UltraSharp 24", category: "monitor", serialNumber: "TD-0007", model: "UltraSharp 24", manufacturer: "Dell", status: AssetStatus.AVAILABLE } }),
    prisma.asset.create({ data: { name: "Logitech MX Keys", category: "keyboard", serialNumber: "TD-0008", model: "MX Keys", manufacturer: "Logitech", status: AssetStatus.IN_USE } }),
    prisma.asset.create({ data: { name: "Keychron K2", category: "keyboard", serialNumber: "TD-0009", model: "K2", manufacturer: "Keychron", status: AssetStatus.IN_USE } }),
    prisma.asset.create({ data: { name: "Logitech MX Master 3", category: "mouse", serialNumber: "TD-0010", model: "MX Master 3", manufacturer: "Logitech", status: AssetStatus.IN_USE } }),
    prisma.asset.create({ data: { name: "Razer DeathAdder", category: "mouse", serialNumber: "TD-0011", model: "DeathAdder", manufacturer: "Razer", status: AssetStatus.IN_USE } }),
    prisma.asset.create({ data: { name: "Dell Thunderbolt Dock", category: "docking station", serialNumber: "TD-0012", model: "TB Dock", manufacturer: "Dell", status: AssetStatus.UNDER_REPAIR } })
  ]);

  const byName = new Map(assets.map((asset) => [asset.name, asset]));

  console.log("3) Seeding asset assignments...");
  const assignmentRows = [
    { asset: "Lenovo ThinkPad X1", userId: emp1.id, daysAgo: 45 },
    { asset: "HP EliteBook 840", userId: emp2.id, daysAgo: 38 },
    { asset: "Logitech MX Keys", userId: emp1.id, daysAgo: 20 },
    { asset: "Keychron K2", userId: emp2.id, daysAgo: 17 },
    { asset: "Logitech MX Master 3", userId: emp1.id, daysAgo: 15 },
    { asset: "Razer DeathAdder", userId: emp2.id, daysAgo: 10 }
  ];

  for (const row of assignmentRows) {
    const assignedAt = new Date(Date.now() - row.daysAgo * 24 * 60 * 60 * 1000);
    const asset = byName.get(row.asset)!;
    await prisma.assetAssignment.create({
      data: {
        assetId: asset.id,
        userId: row.userId,
        assignedAt,
        notes: "Assigned for daily work"
      }
    });
  }

  console.log("4) Seeding tickets...");
  const tickets = await Promise.all([
    prisma.ticket.create({ data: { title: "Laptop won't connect to company VPN", description: "VPN client fails with timeout errors.", priority: TicketPriority.HIGH, status: TicketStatus.OPEN, submittedById: emp1.id } }),
    prisma.ticket.create({ data: { title: "Monitor flickering intermittently", description: "External monitor flickers every few minutes.", priority: TicketPriority.MEDIUM, status: TicketStatus.OPEN, submittedById: emp2.id } }),
    prisma.ticket.create({ data: { title: "Need Adobe Acrobat installed", description: "Requesting Adobe Acrobat for document workflows.", priority: TicketPriority.LOW, status: TicketStatus.OPEN, submittedById: emp3.id } }),
    prisma.ticket.create({ data: { title: "Outlook keeps crashing on startup", description: "Outlook closes immediately after opening.", priority: TicketPriority.HIGH, status: TicketStatus.OPEN, submittedById: emp1.id } }),
    prisma.ticket.create({ data: { title: "Printer on 3rd floor is offline", description: "Printer cannot be reached from network.", priority: TicketPriority.MEDIUM, status: TicketStatus.OPEN, submittedById: emp2.id } }),

    prisma.ticket.create({ data: { title: "Email not syncing on mobile device", description: "Exchange mailbox does not sync new messages.", priority: TicketPriority.MEDIUM, status: TicketStatus.IN_PROGRESS, submittedById: emp3.id, assignedToId: staff1.id } }),
    prisma.ticket.create({ data: { title: "Blue screen error on startup", description: "BSOD appears before login screen.", priority: TicketPriority.CRITICAL, status: TicketStatus.IN_PROGRESS, submittedById: emp1.id, assignedToId: staff1.id } }),
    prisma.ticket.create({ data: { title: "Slow internet on workstation", description: "Internet speed below 5 Mbps.", priority: TicketPriority.LOW, status: TicketStatus.IN_PROGRESS, submittedById: emp2.id, assignedToId: staff2.id } }),
    prisma.ticket.create({ data: { title: "USB ports not recognized", description: "All USB peripherals disconnect randomly.", priority: TicketPriority.HIGH, status: TicketStatus.IN_PROGRESS, submittedById: emp3.id, assignedToId: staff2.id } }),

    prisma.ticket.create({ data: { title: "Need password reset", description: "Forgot domain password after vacation.", priority: TicketPriority.LOW, status: TicketStatus.RESOLVED, submittedById: emp1.id, assignedToId: staff1.id, resolvedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) } }),
    prisma.ticket.create({ data: { title: "Screen brightness stuck at minimum", description: "Brightness controls have no effect.", priority: TicketPriority.LOW, status: TicketStatus.RESOLVED, submittedById: emp2.id, assignedToId: staff2.id, resolvedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) } }),
    prisma.ticket.create({ data: { title: "Teams audio not working", description: "No microphone or speaker output during calls.", priority: TicketPriority.MEDIUM, status: TicketStatus.RESOLVED, submittedById: emp3.id, assignedToId: staff1.id, resolvedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) } }),
    prisma.ticket.create({ data: { title: "VPN keeps disconnecting", description: "Drops every 10-15 minutes.", priority: TicketPriority.HIGH, status: TicketStatus.RESOLVED, submittedById: emp1.id, assignedToId: staff2.id, resolvedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) } }),

    prisma.ticket.create({ data: { title: "New employee laptop setup", description: "Provision laptop for new hire onboarding.", priority: TicketPriority.MEDIUM, status: TicketStatus.CLOSED, submittedById: emp2.id, assignedToId: staff1.id, closedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000) } }),
    prisma.ticket.create({ data: { title: "Software license renewal", description: "Renew expiring productivity suite license.", priority: TicketPriority.LOW, status: TicketStatus.CLOSED, submittedById: emp3.id, assignedToId: staff2.id, closedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } })
  ]);

  console.log("5) Seeding comments...");
  const targets = tickets.filter((ticket) =>
    ticket.status === TicketStatus.IN_PROGRESS || ticket.status === TicketStatus.RESOLVED
  );

  for (const ticket of targets) {
    await prisma.comment.createMany({
      data: [
        {
          ticketId: ticket.id,
          authorId: ticket.assignedToId ?? staff1.id,
          content: "Initial diagnostics started. Gathering logs and checking affected services."
        },
        {
          ticketId: ticket.id,
          authorId: ticket.submittedById,
          content: "Thanks for the update. I am available for remote troubleshooting this afternoon."
        },
        {
          ticketId: ticket.id,
          authorId: ticket.assignedToId ?? staff2.id,
          content: "Applied fix and monitoring for stability. Will close after user confirmation."
        }
      ]
    });
  }

  console.log("6) Seeding audit logs...");
  const userIds = [admin.id, staff1.id, staff2.id, emp1.id, emp2.id, emp3.id];

  for (const user of users) {
    await prisma.auditLog.create({
      data: {
        action: AuditAction.CREATE,
        entity: "USER",
        entityId: user.id,
        performedById: admin.id,
        metadata: { email: user.email, role: user.role }
      }
    });
  }

  for (const asset of assets) {
    await prisma.auditLog.create({
      data: {
        action: AuditAction.CREATE,
        entity: "ASSET",
        entityId: asset.id,
        performedById: staff1.id,
        metadata: { name: asset.name, status: asset.status }
      }
    });
  }

  const assignments = await prisma.assetAssignment.findMany();
  for (const assignment of assignments) {
    await prisma.auditLog.create({
      data: {
        action: AuditAction.ASSIGN,
        entity: "ASSET_ASSIGNMENT",
        entityId: assignment.id,
        performedById: staff2.id,
        metadata: { assetId: assignment.assetId, userId: assignment.userId }
      }
    });
  }

  for (const ticket of tickets) {
    await prisma.auditLog.create({
      data: {
        action: AuditAction.CREATE,
        entity: "TICKET",
        entityId: ticket.id,
        performedById: userIds[Math.floor(Math.random() * userIds.length)]!,
        metadata: { status: ticket.status, priority: ticket.priority }
      }
    });

    if (ticket.status === TicketStatus.RESOLVED) {
      await prisma.auditLog.create({
        data: {
          action: AuditAction.RESOLVE,
          entity: "TICKET",
          entityId: ticket.id,
          performedById: ticket.assignedToId ?? staff1.id,
          metadata: { resolvedAt: ticket.resolvedAt?.toISOString() }
        }
      });
    }

    if (ticket.status === TicketStatus.CLOSED) {
      await prisma.auditLog.create({
        data: {
          action: AuditAction.CLOSE,
          entity: "TICKET",
          entityId: ticket.id,
          performedById: ticket.assignedToId ?? staff2.id,
          metadata: { closedAt: ticket.closedAt?.toISOString() }
        }
      });
    }
  }

  console.log("Seeding completed.");
}

main()
  .catch((error) => {
    console.error("Seeding failed", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
