/**
 * Support Ticket Service
 * Date: 09 October 2025
 * Updated: 10 October 2025 - Converted to TypeScript
 * Handles all API calls for support tickets
 */

import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { getAuthToken } from './authService';
import type {
  SupportTicket,
  SupportTicketResponse,
  SupportTicketsResponse,
  CreateTicketRequest,
  UpdateTicketRequest,
  TicketStatus,
} from '../types/support.types';

const API_URL = 'http://localhost:3045/support';

const getConfig = (): AxiosRequestConfig => {
  const token = getAuthToken();
  return token
    ? {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    : {
        headers: {
          'Content-Type': 'application/json',
        },
      };
};

// Create a new support ticket
export const createTicket = (
  ticket: CreateTicketRequest
): Promise<AxiosResponse<SupportTicketResponse>> => {
  return axios.post(`${API_URL}/create`, ticket, getConfig());
};

// Read a specific ticket by ID
export const getTicketById = (
  ticketId: number
): Promise<AxiosResponse<SupportTicketResponse>> => {
  return axios.get(`${API_URL}/read/${ticketId}`, getConfig());
};

// Update an existing ticket
export const updateTicket = (
  ticket: UpdateTicketRequest
): Promise<AxiosResponse<SupportTicketResponse>> => {
  return axios.put(`${API_URL}/update`, ticket, getConfig());
};

// Delete a ticket by ID
export const deleteTicket = (ticketId: number): Promise<AxiosResponse<void>> => {
  return axios.delete(`${API_URL}/delete/${ticketId}`, getConfig());
};

// Get all tickets
export const getAllTickets = (): Promise<AxiosResponse<SupportTicketsResponse>> => {
  return axios.get(`${API_URL}/all`, getConfig());
};

// Get tickets by user ID
export const getTicketsByUser = (
  userId: number
): Promise<AxiosResponse<SupportTicketsResponse>> => {
  return axios.get(`${API_URL}/user/${userId}`, getConfig());
};

// Get tickets by status
export const getTicketsByStatus = (
  status: TicketStatus
): Promise<AxiosResponse<SupportTicketsResponse>> => {
  return axios.get(`${API_URL}/status/${status}`, getConfig());
};

// Get tickets by booking ID
export const getTicketsByBooking = (
  bookingId: number
): Promise<AxiosResponse<SupportTicketsResponse>> => {
  return axios.get(`${API_URL}/booking/${bookingId}`, getConfig());
};

// Update ticket status
export const updateTicketStatus = (
  ticketId: number,
  status: TicketStatus
): Promise<AxiosResponse<SupportTicketResponse>> => {
  return axios.put(`${API_URL}/${ticketId}/status?status=${status}`, null, getConfig());
};

// Assign ticket to support staff
export const assignTicket = (
  ticketId: number,
  assignedToUserId: number
): Promise<AxiosResponse<SupportTicketResponse>> => {
  return axios.put(
    `${API_URL}/${ticketId}/assign?assignedToUserId=${assignedToUserId}`,
    null,
    getConfig()
  );
};

// Resolve a ticket
export const resolveTicket = (
  ticketId: number
): Promise<AxiosResponse<SupportTicketResponse>> => {
  return axios.put(`${API_URL}/${ticketId}/resolve`, null, getConfig());
};

// Legacy function names for backward compatibility
export const create = createTicket;
export const getAllTickects = getAllTickets; // Keep typo for backward compatibility
export const updateSupportTicket = updateTicket;
export const deleteSupportTicket = deleteTicket;
export const cancelSupportTicket = deleteTicket;
