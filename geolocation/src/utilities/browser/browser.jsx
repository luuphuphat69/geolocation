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