import { useRef, useState, useEffect } from "react";
import { useAppOptions } from "../../AppOptionsContext";
import { getFCMToken, deleteFCMToken } from "../../messagingManageToken";
import { getMessaging } from "firebase/messaging";
import firebaseApp from "../../firebaseapp";
import { requestLocation, requestPermission } from "../../utilities/browser/browser";
import "../../css/toast.css"

const SettingsComp = () => {
  const slidePanelRef = useRef(null);
  const panelOverlayRef = useRef(null);
  const settingsBtnRef = useRef(null);

  const { isCelciusUnit, setIsCelciusUnit } = useAppOptions();

  // Local states
  const [isNotifications, setIsNotifications] = useState(
    !!localStorage.getItem("fcm_token")
  );
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Open/Close panel
  const openSettingsPanel = () => {
    slidePanelRef.current.classList.add("open");
    panelOverlayRef.current.classList.add("active");
    settingsBtnRef.current.style.display = "none";
    document.body.style.overflow = "hidden";
  };

  const closeSettingsPanel = () => {
    slidePanelRef.current.classList.remove("open");
    panelOverlayRef.current.classList.remove("active");
    settingsBtnRef.current.style.display = "block";
    document.body.style.overflow = "auto";
  };

  // Toggle Celsius
  const toggleCelsius = () => setIsCelciusUnit(!isCelciusUnit);

  // Show toast helper
  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 5000);
  };

  // Handle notifications (same logic as AllowNotify)
  const handleNotifySwitchClick = async () => {
    if (loading) return;
    setLoading(true);

    const newStatus = !isNotifications;

    if (newStatus) {
      // Turn ON
      const existingToken = localStorage.getItem("fcm_token");
      if (existingToken) {
        setIsNotifications(true);
        showToast("We will send you weather's info at some specific times");
        setLoading(false);
        return;
      }

      try {
        await requestPermission();
        await requestLocation();
        await getFCMToken(getMessaging(firebaseApp));
        setIsNotifications(true);
        showToast("We will notify your weather's info daily");
      } catch (err) {
        console.warn("Permission or location denied:", err);
        setIsNotifications(false);
      } finally {
        setLoading(false);
      }
    } else {
      // Turn OFF
      const existingToken = localStorage.getItem("fcm_token");
      if (!existingToken) {
        setIsNotifications(false);
        setLoading(false);
        return;
      }

      try {
        await deleteFCMToken(getMessaging(firebaseApp));
        setIsNotifications(false);
        showToast("Notifications turned off");
      } catch (err) {
        console.error("Error deleting token:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <button
        ref={settingsBtnRef}
        className="search-page-settings-btn"
        onClick={openSettingsPanel}
      >
        Settings
      </button>

      <div
        ref={panelOverlayRef}
        className="search-page-panel-overlay"
        onClick={closeSettingsPanel}
      ></div>

      <div ref={slidePanelRef} className="search-page-slide-panel">
        <div className="search-page-panel-header">
          <button
            className="search-page-close-panel-btn"
            onClick={closeSettingsPanel}
          >
            ✕ Close
          </button>

          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: 800,
              margin: 0,
              clear: "both",
              textTransform: "uppercase",
            }}
          >
            Settings
          </h2>

          <p
            style={{
              fontSize: "0.875rem",
              fontWeight: 600,
              margin: "0.5rem 0 0 0",
              opacity: 0.9,
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Customize App
          </p>
        </div>

        <div className="search-page-panel-content" id="settingsContent">
          {/* Celsius Switch */}
          <div className="search-page-switch-container">
            <span className="search-page-switch-label">Use Celsius</span>
            <div
              className={`search-page-switch ${isCelciusUnit ? "active" : ""}`}
              onClick={toggleCelsius}
            >
              <div className="search-page-switch-handle"></div>
            </div>
          </div>

          {/* Notifications Switch */}
          <div className="search-page-switch-container">
            <span className="search-page-switch-label">Notifications</span>
            <div
              className={`search-page-switch ${
                isNotifications ? "active" : ""
              } ${loading ? "loading" : ""}`}
              onClick={handleNotifySwitchClick}
            >
              <div className="search-page-switch-handle"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Neo-Brutalist Toast */}
      {toast && (
        <div className="neo-toast neo-toast--info">
          <span className="neo-toast__text">{toast}</span>
        </div>
      )}
    </>
  );
};

export default SettingsComp;
