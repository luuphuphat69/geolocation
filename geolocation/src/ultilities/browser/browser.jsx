export const getAllIndexDB = (callback) => {
  const request = indexedDB.open("schedule_db", 1);

  request.onupgradeneeded = (event) => {
    const db = event.target.result;

    // Create the object store if it doesn't exist
    if (!db.objectStoreNames.contains("schedule_os")) {
      db.createObjectStore("schedule_os", { keyPath: "id", autoIncrement: true });
    }
  };

  request.onsuccess = (event) => {
    const db = event.target.result;
    const tx = db.transaction("schedule_os", "readonly");
    const store = tx.objectStore("schedule_os");

    const schedules = [];

    const cursorRequest = store.openCursor();

    cursorRequest.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        const id = cursor.key;
        const lat = cursor.value.lat;
        const long = cursor.value.long;
        const data = cursor.value.scheduleData;
        schedules.push({ id, scheduleData: data, lat, long });
        cursor.continue();
      } else {
        // Finished reading all entries
        callback(schedules);
      }
    };

    cursorRequest.onerror = (event) => {
      console.error("Error using cursor to read schedules:", event.target.error);
    };

    tx.oncomplete = () => db.close();
  };

  request.onerror = (event) => {
    console.error("Error opening database:", event.target.error);
  };
};

export const deleteSelectedIndex = (id) => {
  const request = indexedDB.open("schedule_db", 1);

  request.onsuccess = (event) => {
    const db = event.target.result;
    const tx = db.transaction("schedule_os", "readwrite");
    const store = tx.objectStore("schedule_os");

    const deleteRequest = store.delete(id);

    deleteRequest.onsuccess = () => {
      console.log(`Deleted record with id: ${id}`);
    };

    deleteRequest.onerror = (e) => {
      console.error("Error deleting record:", e.target.error);
    };

    tx.oncomplete = () => {
      db.close();
    };
  };

  request.onerror = (e) => {
    console.error("Error opening IndexedDB:", e.target.error);
  };
};
