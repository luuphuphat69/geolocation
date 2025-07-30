import { getToken } from "firebase/messaging";
import { sendTokenToServer } from "./ultilities/api/api";
const getFCMToken = (messaging) => {
  getToken(messaging, { vapidKey: import.meta.env.VITE_VAPID_KEY })
    .then((currentToken) => {
      if (currentToken) {
        // Fetch the current location
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            await sendTokenToServer(currentToken, lat, lon);
          },
          (error) => {
            console.error("Error getting location:", error);
          }
        );
      } else {
        console.log("No registration token available. Request permission to generate one.");
      }
    })
    .catch((err) => {
      console.log("An error occurred while retrieving token: ", err);
    });
};

export default getFCMToken;