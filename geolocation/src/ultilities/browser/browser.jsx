export const getAllIndexDB = (callback) => {
  const request = indexedDB.open("schedule_db", 1);

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
        const data = cursor.value.scheduleData;
        schedules.push({ id, scheduleData: data });
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