import '../../css/allownotify.css';
import { useState, useRef } from 'react';
import { getFCMToken, deleteFCMToken } from '../../messagingManageToken';
import { getMessaging } from 'firebase/messaging';
import firebaseApp from '../../firebaseapp';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
function requestLocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported in your browser.');
            return reject("Unsupported");
        }

        navigator.permissions.query({ name: 'geolocation' }).then((permissionStatus) => {
            if (permissionStatus.state === 'denied') {
                alert('Location permission is denied. Please allow it in your browser settings.');
                reject("Denied");
            } else {
                navigator.geolocation.getCurrentPosition(
                    () => resolve("Granted"),
                    (err) => {
                        console.error("Error getting location:", err.message);
                        alert("Unable to retrieve location.");
                        reject(err.message);
                    },
                    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
                );
            }
        });
    });
}

function requestPermission() {
    return new Promise((resolve, reject) => {
        Notification.requestPermission()
            .then((permission) => {
                if (permission === 'granted') {
                    resolve("Granted");
                } else {
                    alert("Notification permission denied.");
                    reject("Notification denied");
                }
            })
            .catch((error) => {
                console.log("Permission error:", error);
                reject(error);
            });
    });
}

const AllowNotify = () => {
    const [loading, setLoading] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [notifyStatus, setNotifyStatus] = useState(() => !!localStorage.getItem("fcm_token"));

    const handleNotifySwitchClick = async () => {
        if (loading) return;
        setLoading(true);

        const newStatus = !notifyStatus;

        if (newStatus) {
            // Turn ON logic
            const existingToken = localStorage.getItem("fcm_token");
            if (existingToken) {
                console.log("FCM token already exists:", existingToken);
                setNotifyStatus(true);
                setShowDialog(true); // <== Show dialog here
                setLoading(false);
                return;
            }

            try {
                await requestPermission();
                await requestLocation();
                await getFCMToken(getMessaging(firebaseApp));
                setNotifyStatus(true);
                setShowDialog(true); // <== Show dialog after success
            } catch (err) {
                console.warn("Permission or location denied:", err);
                setNotifyStatus(false);
            } finally {
                setLoading(false);
            }
        }
        else {
            const existingToken = localStorage.getItem("fcm_token");
            if (!existingToken) {
                console.log("No token to delete");
                setNotifyStatus(false);
                setLoading(false);
                return;
            }

            try {
                await deleteFCMToken(getMessaging(firebaseApp));
                setNotifyStatus(false);
            } catch (err) {
                console.error("Error deleting token:", err);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="flex items-center justify-center mb-6">
            <div className="notification-container flex items-center space-x-3 rounded-full px-6 py-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5 5v-5zM4.868 19.718A8.966 8.966 0 0112 21a8.966 8.966 0 017.132-1.282M6.343 6.343A8 8 0 0112 4c1.566 0 3.02.448 4.243 1.225M12 8v4l3 3" />
                </svg>
                <span className="text-white font-medium">Notifications</span>
                <div className="relative" onClick={handleNotifySwitchClick}>
                    <input type="checkbox" className="sr-only" checked={notifyStatus} readOnly />
                    <div className={`notification-toggle-bg w-12 h-6 bg-white/30 rounded-full shadow-inner cursor-pointer transition-colors duration-300 ${notifyStatus ? 'active' : ''}`}></div>

                    <div
                        className={`notification-toggle-dot absolute w-5 h-5 bg-white rounded-full shadow-md top-0.5 left-0.5 transition-transform duration-300 transform flex items-center justify-center
                        ${notifyStatus ? 'active' : ''} ${loading ? 'loading' : ''}`}
                    >
                        <div className={`loading-spinner ${loading ? '' : 'hidden'}`} />
                    </div>
                </div>
                <span className="text-white text-sm font-medium">
                    {loading ? 'Loading...' : notifyStatus ? 'ON' : 'OFF'}
                </span>
            </div>
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Notifications Enabled</DialogTitle>
                        <DialogDescription>
                            You’ll now receive weather alerts at 10AM based on your current location.
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>

        </div>
    );
};

export default AllowNotify;
