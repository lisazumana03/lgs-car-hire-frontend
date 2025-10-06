import { API_BASE_URL, DEFAULT_HEADERS } from "./apiConfig.js";

// Notification endpoints
const NOTIFICATION_API_URL = `${API_BASE_URL}/notifications`;

// Notification API Functions

export async function getAllNotifications() {
  try {
    const response = await fetch(`${NOTIFICATION_API_URL}`, {
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
    const response = await fetch(`${NOTIFICATION_API_URL}/${id}`, {
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
    console.log("Creating notification with data:", notificationData);
    console.log("API URL:", `${NOTIFICATION_API_URL}`);

    const response = await fetch(`${NOTIFICATION_API_URL}`, {
      method: "POST",
      headers: DEFAULT_HEADERS,
      body: JSON.stringify(notificationData),
    });

    console.log("Response status:", response.status);
    console.log("Response ok:", response.ok);

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
        console.log("Error response data:", errorData);
      } catch (parseError) {
        console.log("Could not parse error response as JSON");
        const textError = await response.text();
        console.log("Error response text:", textError);
        throw new Error(
          `HTTP ${response.status}: ${
            textError || "Failed to create notification"
          }`
        );
      }
      throw new Error(
        errorData.message ||
          `HTTP ${response.status}: Failed to create notification`
      );
    }

    const data = await response.json();
    console.log("Success response:", data);
    return data;
  } catch (error) {
    console.error("Create notification error:", error);
    throw error;
  }
}

export async function updateNotification(id, notificationData) {
  try {
    const response = await fetch(`${NOTIFICATION_API_URL}/${id}`, {
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
    const response = await fetch(`${NOTIFICATION_API_URL}/${id}`, {
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
