const admin = require('firebase-admin');
if (
  !process.env.FIREBASE_SERVICE_ACCOUNT_KEY &&
  !process.env.FIREBASE_SERVICE_ACCOUNT_KEY_BASE64 &&
  !process.env.FIREBASE_SERVICE_ACCOUNT_JSON &&
  !process.env.FIREBASE_SERVICE_ACCOUNT_JSON_BASE64
) {
  console.error('ERROR: FIREBASE_SERVICE_ACCOUNT_* environment variables are not set');
  throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY or FIREBASE_SERVICE_ACCOUNT_JSON environment variable is required');
}

function normalizePemFormatting(rawValue) {
  if (!rawValue) return rawValue;
  let value = rawValue.trim();
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    value = value.slice(1, -1);
  }
  value = value.replace(/\r\n/g, '\n');
  value = value.replace(/\\n/g, '\n');
  // Normalize header/footer
  value = value.replace(/-*BEGIN PRIVATE KEY-*[ \t]*\n?/i, '-----BEGIN PRIVATE KEY-----\n');
  value = value.replace(/\n?-*END PRIVATE KEY-*/i, '\n-----END PRIVATE KEY-----');
  if (!value.endsWith('\n')) value += '\n';
  return value;
}

function parsePrivateKeyFromEnvironment() {
  const base64Key = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_BASE64;
  if (base64Key && base64Key.trim() !== '') {
    try {
      const decoded = Buffer.from(base64Key, 'base64').toString('utf8');
      return normalizePemFormatting(decoded);
    } catch (error) {
      console.error('Failed to decode FIREBASE_SERVICE_ACCOUNT_KEY_BASE64');
      throw error;
    }
  }

  const rawKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!rawKey) return undefined;
  return normalizePemFormatting(rawKey);
}

function getServiceAccountFromEnvironment() {
  // Prefer full JSON if available
  const jsonB64 = process.env.FIREBASE_SERVICE_ACCOUNT_JSON_BASE64;
  if (jsonB64 && jsonB64.trim() !== '') {
    try {
      const json = Buffer.from(jsonB64, 'base64').toString('utf8');
      return JSON.parse(json);
    } catch (error) {
      console.error('Failed to decode/parse FIREBASE_SERVICE_ACCOUNT_JSON_BASE64');
      throw error;
    }
  }

  const jsonRaw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (jsonRaw && jsonRaw.trim() !== '') {
    try {
      const trimmed = jsonRaw.trim();
      const unquoted = (trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))
        ? trimmed.slice(1, -1)
        : trimmed;
      return JSON.parse(unquoted);
    } catch (error) {
      console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON');
      throw error;
    }
  }
  
  // Fallback to building from env + normalized PEM
  return {
    type: "service_account",
    project_id: "geolocation-72da3",
    private_key_id: "f42ea64c6860f642924f0c683f7c0f265f8221c4",
    private_key: parsePrivateKeyFromEnvironment(),
    client_email: "firebase-adminsdk-1mxbz@geolocation-72da3.iam.gserviceaccount.com",
    client_id: "109778214831327660491",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-1mxbz%40geolocation-72da3.iam.gserviceaccount.com",
    universe_domain: "googleapis.com"
  };
}

// Build the service account object (prefer full JSON from env)
const serviceAccount = getServiceAccountFromEnvironment();

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