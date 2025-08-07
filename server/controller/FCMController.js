const admin = require('firebase-admin');
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

const FCMController = {
    saveToken: async (req, res) => {
        try {
            const { token, lat, lon } = req.body;
            console.log("Token:", token, "Lat:", lat, "Lon:", lon);
            if (!token || !lat || !lon) {
                return res.status(400).json({ message: "Invalid request body. Token, lat, and lon are required." });
            }

            const docRef = db.collection('FCM_tokens').doc(token);
            const docSnapshot = await docRef.get();

            if (docSnapshot.exists) {
                await docRef.update({
                    lat: lat,
                    lon: lon,
                    timestamp: admin.firestore.FieldValue.serverTimestamp(),
                });
                res.status(200).json({ message: "Token updated with new location." });
            } else {
                await docRef.set({
                    token: token,
                    lat: lat,
                    lon: lon,
                    timestamp: admin.firestore.FieldValue.serverTimestamp(),
                });
                res.status(201).json({ message: "New token saved." });
            }
        } catch (error) {
            console.error("Error saving token:", error);
            res.status(500).json({ message: "Internal server error." });
        }
    },
    deleteToken: async (req, res) => {
        try {
            const { token } = req.body;
            console.log(token)
            if (!token) {
                return res.status(400).json({ message: "Token is required." });
            }

            const docRef = db.collection('FCM_tokens').doc(token);
            const docSnapshot = await docRef.get();

            if (!docSnapshot.exists) {
                return res.status(404).json({ message: "Token not found in database." });
            }

            await docRef.delete();
            return res.status(200).json({ message: "Token deleted successfully." });
        } catch (error) {
            console.error("Error deleting token:", error);
            return res.status(500).json({ message: "Internal server error." });
        }
    }

};
module.exports = FCMController;