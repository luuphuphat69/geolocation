import { getToken } from "firebase/messaging";
import axios from "axios";

const getFCMToken = (messaging) => {
  getToken(messaging, { vapidKey: 'BIlewf0QgEylFCklz96td3EH_FsUBuqMZ1_3b4pNUMOU5rIkxc1zTCBBr7Tw8Dxb-yCxog5l5xeDzJHSgN65tqs' })
    .then((currentToken) => {
      if (currentToken) {
        // Fetch the current location
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            console.log("Latitude:", lat, "Longitude:", lon);

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

async function sendTokenToServer(token, lat, lon) {
  await axios.post('http://localhost:3000/v1/FCM/token', {
    token: token,
    lat: lat,
    lon: lon,
  })
    .then(function (response) {
      // console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
}

export default getFCMToken;