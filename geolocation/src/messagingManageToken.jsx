import { getToken, deleteToken } from "firebase/messaging";
import { sendTokenToServer, deleteFCMTokenFromServer } from "./utilities/api/api";

export const getFCMToken = async (messaging) => {
  try {
    const currentToken = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_VAPID_KEY
    });

    if (!currentToken) {
      console.log("No FCM token available.");
      return;
    }

    if (currentToken) {
      // Set token in localstorage
      localStorage.setItem("fcm_token", currentToken);

      // Get location
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          await sendTokenToServer(currentToken, lat, lon);
          console.log("New token sent to server and stored.");
        },
        (err) => {
          console.error("Failed to get location:", err);
        }
      );
    }

  } catch (err) {
    console.error("Error getting token:", err);
  }
};

export const deleteFCMToken = async (messaging) => {
  try {
    const currentToken = localStorage.getItem("fcm_token");
    if (!currentToken) return;

    await deleteFCMTokenFromServer(currentToken);
    await deleteToken(messaging);
    localStorage.removeItem("fcm_token");
    //console.log("FCM token deleted successfully.");
  } catch (err) {
    console.error("Error deleting FCM token:", err);
  }
};