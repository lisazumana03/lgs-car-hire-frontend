/**
 * Support Ticket Types
 * Date: 09 October 2025
 */

// Enums
export enum TicketStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

export enum TicketPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

// User interface (simplified for ticket context)
export interface TicketUser {
  userId: number;
  name: string;
  email: string;
}

// Booking interface (simplified for ticket context)
export interface TicketBooking {
  bookingID: number;
}

// Support Ticket interface
export interface SupportTicket {
  ticketID?: number;
  user: TicketUser;
  booking?: TicketBooking;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  assignedTo?: TicketUser;
  createdAt?: string;
  updatedAt?: string;
  resolvedAt?: string;
}

// Request payload for creating a ticket
export interface CreateTicketRequest {
  user: TicketUser;
  booking?: TicketBooking;
  subject: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
}

// Request payload for updating a ticket
export interface UpdateTicketRequest {
  ticketID: number;
  user?: TicketUser;
  booking?: TicketBooking;
  subject?: string;
  description?: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  assignedTo?: TicketUser;
}

// Response types
export interface SupportTicketResponse extends SupportTicket {}

export type SupportTicketsResponse = SupportTicket[];
