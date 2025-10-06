/*
Notification Service
Handles automatic notification creation throughout the app
*/

import { createNotification } from "../scripts/notificationApi.js";

export class NotificationService {
  static async createBookingNotification(user, booking, type = "BOOKED") {
    try {
      const message = this.getBookingMessage(booking, type);
      const notificationData = {
        message: message,
        status: type,
        userId: user?.id || 1,
        userName:
          user?.name || user?.firstName
            ? user.name || `${user.firstName} ${user.lastName || ""}`.trim()
            : "User",
        dateSent: new Date().toISOString().split("T")[0],
      };

      console.log("Creating booking notification with data:", notificationData);
      return await createNotification(notificationData);
    } catch (error) {
      console.error("Failed to create booking notification:", error);
      throw error;
    }
  }

  static async createPaymentNotification(user, booking, type = "COMPLETED") {
    try {
      const message = this.getPaymentMessage(booking, type);
      const notificationData = {
        message: message,
        status: type,
        userId: user?.id || 1,
        userName:
          user?.name || user?.firstName
            ? user.name || `${user.firstName} ${user.lastName || ""}`.trim()
            : "User",
        dateSent: new Date().toISOString().split("T")[0],
      };

      console.log("Creating payment notification with data:", notificationData);
      console.log("User object:", user);
      return await createNotification(notificationData);
    } catch (error) {
      console.error("Failed to create payment notification:", error);
      throw error;
    }
  }

  static async createCustomNotification(user, message, status = "PENDING") {
    try {
      const notificationData = {
        message: message,
        status: status,
        userId: user?.id || 1,
        userName:
          user?.name || user?.firstName
            ? user.name || `${user.firstName} ${user.lastName || ""}`.trim()
            : "User",
        dateSent: new Date().toISOString().split("T")[0],
      };

      console.log("Creating custom notification with data:", notificationData);
      return await createNotification(notificationData);
    } catch (error) {
      console.error("Failed to create custom notification:", error);
      throw error;
    }
  }

  static getBookingMessage(booking, type) {
    const carInfo = booking?.car
      ? `${booking.car.brand} ${booking.car.model}`
      : "your selected car";
    const bookingId = booking?.bookingID || booking?.id || "N/A";

    switch (type) {
      case "BOOKED":
        return `Your booking #${bookingId} for ${carInfo} has been confirmed. Pickup scheduled for ${
          booking?.startDate || "your selected date"
        }.`;
      case "PENDING":
        return `Your booking #${bookingId} for ${carInfo} is being processed. We'll notify you once confirmed.`;
      case "CANCELLED":
        return `Your booking #${bookingId} for ${carInfo} has been cancelled. Please contact us if you have any questions.`;
      default:
        return `Update for your booking #${bookingId} for ${carInfo}.`;
    }
  }

  static getPaymentMessage(booking, type) {
    const amount = booking?.totalAmount || booking?.car?.rentalPrice || 0;
    const bookingId = booking?.bookingID || booking?.id || "N/A";

    switch (type) {
      case "COMPLETED":
        return `Payment of R${amount} for booking #${bookingId} has been successfully processed. Your booking is now confirmed.`;
      case "PENDING":
        return `Payment of R${amount} for booking #${bookingId} is being processed. You'll receive confirmation once completed.`;
      case "FAILED":
        return `Payment for booking #${bookingId} failed. Please try again or contact support.`;
      default:
        return `Payment update for booking #${bookingId}.`;
    }
  }
}

export default NotificationService;
