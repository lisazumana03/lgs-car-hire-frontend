import { API_BASE_URL, DEFAULT_HEADERS } from "./apiConfig.js";

// Notification API Functions

export async function getAllNotifications() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/notifications`, {
      method: "GET",
      headers: DEFAULT_HEADERS,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch notifications");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Get notifications error:", error);
    throw error;
  }
}

export async function getNotificationById(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/notifications/${id}`, {
      method: "GET",
      headers: DEFAULT_HEADERS,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch notification");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Get notification error:", error);
    throw error;
  }
}

export async function createNotification(notificationData) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/notifications`, {
      method: "POST",
      headers: DEFAULT_HEADERS,
      body: JSON.stringify(notificationData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create notification");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Create notification error:", error);
    throw error;
  }
}

export async function updateNotification(id, notificationData) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/notifications/${id}`, {
      method: "PUT",
      headers: DEFAULT_HEADERS,
      body: JSON.stringify(notificationData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update notification");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Update notification error:", error);
    throw error;
  }
}

export async function deleteNotification(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/notifications/${id}`, {
      method: "DELETE",
      headers: DEFAULT_HEADERS,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete notification");
    }

    return true;
  } catch (error) {
    console.error("Delete notification error:", error);
    throw error;
  }
}
