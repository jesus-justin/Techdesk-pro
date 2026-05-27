import type { ReactNode } from "react";
import {
	ASSET_STATUS_COLORS,
	ASSET_STATUS_LABELS,
	PRIORITY_COLORS,
	PRIORITY_LABELS,
	TICKET_STATUS_COLORS,
	TICKET_STATUS_LABELS,
	type AssetStatus,
	type TicketPriority,
	type TicketStatus
} from "@techdesk-pro/constants";

type BadgeStatus = TicketStatus | AssetStatus;

function cn(...parts: Array<string | false | null | undefined>): string {
	return parts.filter(Boolean).join(" ");
}

export function StatusBadge({ status }: { status: BadgeStatus }): JSX.Element {
	const isTicket = status in TICKET_STATUS_LABELS;
	const className = isTicket
		? TICKET_STATUS_COLORS[status as TicketStatus]
		: ASSET_STATUS_COLORS[status as AssetStatus];
	const label = isTicket
		? TICKET_STATUS_LABELS[status as TicketStatus]
		: ASSET_STATUS_LABELS[status as AssetStatus];

	return (
		<span className={cn("inline-flex rounded-full px-2 py-1 text-xs font-semibold", className)}>
			{label}
		</span>
	);
}

export function PriorityBadge({ priority }: { priority: TicketPriority }): JSX.Element {
	return (
		<span
			className={cn(
				"inline-flex rounded-full px-2 py-1 text-xs font-semibold",
				PRIORITY_COLORS[priority]
			)}
		>
			{PRIORITY_LABELS[priority]}
		</span>
	);
}

export function EmptyState({
	icon,
	title,
	subtitle,
	action
}: {
	icon?: ReactNode;
	title: string;
	subtitle: string;
	action?: ReactNode;
}): JSX.Element {
	return (
		<div className="flex min-h-[220px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center">
			<div className="mb-3 text-slate-400">{icon}</div>
			<h3 className="text-lg font-semibold text-slate-900">{title}</h3>
			<p className="mt-1 max-w-md text-sm text-slate-500">{subtitle}</p>
			{action ? <div className="mt-4">{action}</div> : null}
		</div>
	);
}

export function LoadingSpinner(): JSX.Element {
	return (
		<div className="flex min-h-[220px] items-center justify-center">
			<div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-500" />
		</div>
	);
}

export function PageHeader({
	title,
	subtitle,
	right
}: {
	title: string;
	subtitle?: string;
	right?: ReactNode;
}): JSX.Element {
	return (
		<header className="mb-6 flex items-start justify-between gap-4">
			<div>
				<h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
				{subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
			</div>
			{right ? <div>{right}</div> : null}
		</header>
	);
}
