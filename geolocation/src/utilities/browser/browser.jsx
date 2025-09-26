// ---- Get all records ----
export const getAllIndexDB = (callback) => {
  const request = indexedDB.open("schedule_db", 1);

  request.onupgradeneeded = (event) => {
    const db = event.target.result;
    if (!db.objectStoreNames.contains("schedule_os")) {
      db.createObjectStore("schedule_os", { keyPath: "id", autoIncrement: true });
    }
  };

  request.onsuccess = (event) => {
    const db = event.target.result;

    if (!db.objectStoreNames.contains("schedule_os")) {
      console.warn("Object store 'schedule_os' not fOund, returning empty list");
      callback([]);
      db.close();
      return;
    }

    const tx = db.transaction("schedule_os", "readonly");
    const store = tx.objectStore("schedule_os");

    const schedules = [];
    const cursorRequest = store.openCursor();

    cursorRequest.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        const { lat, long, scheduleData } = cursor.value;
        schedules.push({ id: cursor.key, scheduleData, lat, long });
        cursor.continue();
      } else {
        callback(schedules); // Done
      }
    };

    cursorRequest.onerror = (event) => {
      console.error("Error using cursor to read schedules:", event.target.error);
    };

    tx.oncomplete = () => db.close();
  };

  request.onerror = (event) => {
    console.error("Error opening database:", event.target.error);
    callback([]);
  };
};

// ---- Delete a record by id ----
export const deleteSelectedIndex = (id) => {
  const request = indexedDB.open("schedule_db", 1);

  request.onsuccess = (event) => {
    const db = event.target.result;

    if (!db.objectStoreNames.contains("schedule_os")) {
      console.warn("Object store 'schedule_os' not found, nothing to delete");
      db.close();
      return;
    }

    const tx = db.transaction("schedule_os", "readwrite");
    const store = tx.objectStore("schedule_os");

    const deleteRequest = store.delete(id);

    deleteRequest.onsuccess = () => {
      console.log(`Deleted record with id: ${id}`);
    };

    deleteRequest.onerror = (e) => {
      console.error("Error deleting record:", e.target.error);
    };

    tx.oncomplete = () => db.close();
  };

  request.onerror = (e) => {
    console.error("Error opening IndexedDB:", e.target.error);
  };
};

export function requestLocation() {
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

export function requestPermission() {
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