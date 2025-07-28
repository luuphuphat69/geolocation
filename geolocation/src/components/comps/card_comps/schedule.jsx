import React, { useState, useEffect, useRef } from 'react';
import '../../../css/schedule.css'

const ScheduleDataList = {
  monday: [],
  tuesday: [],
  wednesday: [],
  thursday: [],
  friday: [],
  saturday: [],
  sunday: [],
};

const loadScheduleFromBrowser = (cityName, callback) => {
  const request = indexedDB.open("schedule_db", 1);

  request.onsuccess = (event) => {
    const db = event.target.result;
    const tx = db.transaction("schedule_os", "readonly");
    const store = tx.objectStore("schedule_os");

    const getRequest = store.get(cityName);

    getRequest.onsuccess = () => {
      const result = getRequest.result;
      if (result && result.scheduleData) {
        callback(result.scheduleData);
      }
    };

    getRequest.onerror = (event) => {
      console.error("Error retrieving schedule:", event.target.error);
    };

    tx.oncomplete = () => db.close();
  };

  request.onerror = (event) => {
    console.error("Database open error:", event.target.error);
  };
};

const saveScheduleOnBrowser = (scheduleData, cityName) => {
  const request = indexedDB.open("schedule_db", 1);

  request.onupgradeneeded = (event) => {
    const db = event.target.result;

    if (!db.objectStoreNames.contains("schedule_os")) {
      const store = db.createObjectStore("schedule_os", {
        keyPath: "id",
      });

      store.createIndex("schedule", "schedule", { unique: false });
    }
  };

  request.onsuccess = (event) => {
    const db = event.target.result;
    const tx = db.transaction("schedule_os", "readwrite");
    const store = tx.objectStore("schedule_os");

    const record = {
      id: cityName,
      scheduleData: scheduleData,
    };

    const putRequest = store.put(record);

    putRequest.onsuccess = () => {
      console.log("Schedule saved/updated in IndexedDB for city:", cityName);
    };

    putRequest.onerror = (event) => {
      console.error("Error saving schedule:", event.target.error);
    };

    tx.oncomplete = () => db.close();
  };

  request.onerror = (event) => {
    console.error("Database error:", event.target.error);
  };
};

const getStatusInfo = (status) => {
  switch (status) {
    case 'completed':
      return { icon: 'fa-check', class: 'item-content--completed', pulse: false };
    case 'cancelled':
      return { icon: 'fa-ban', class: 'item-content--cancelled', pulse: false };
    case 'pending':
      return { icon: 'fa-clock', class: 'item-content--pending', pulse: true };
    default:
      return { icon: 'fa-question', class: 'unknown', pulse: false };
  }
};

const formatTime = (time) => {
  const [h, m] = time.split(':');
  let hours = parseInt(h);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours}:${m} ${ampm}`;
};

const Schedule = ({ cityName }) => {
  const scheduleContainerRef = useRef(null);

  const getTodayKey = () => {
    const dayIndex = new Date().getDay(); // 0 (Sun) to 6 (Sat)
    const dayMap = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return dayMap[dayIndex];
  };

  const [currentDay, setCurrentDay] = useState(getTodayKey);
  const [scheduleData, setScheduleData] = useState(ScheduleDataList);
  const [showForm, setShowForm] = useState(false);
  const [formDay, setFormDay] = useState('monday');
  const [formTime, setFormTime] = useState('');
  const [formActivity, setFormActivity] = useState('');

  const [dataLoaded, setDataLoaded] = useState(false);

  // Fetch data once
  useEffect(() => {
    loadScheduleFromBrowser(cityName, (dataFromDB) => {
      setScheduleData(dataFromDB);
      setCurrentDay(getTodayKey());
      setDataLoaded(true);
    });
  }, [cityName]);

  // Drag setup only after data is loaded
  useEffect(() => {
    if (!dataLoaded) return;
    const container = scheduleContainerRef.current;
    if (!container) return;

    const handleDragStart = (e) => {
      e.target.classList.add('dragging');
      e.dataTransfer.setData('text/plain', e.target.dataset.id);
      e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragEnd = (e) => {
      e.target.classList.remove('dragging');
      reorderSchedule();
    };

    const handleDragOver = (e) => {
      e.preventDefault();
      const draggingItem = container.querySelector('.dragging');
      const items = [...container.querySelectorAll('.schedule-item:not(.dragging)')];

      const nextItem = items.find(item =>
        e.clientY < item.getBoundingClientRect().top + item.offsetHeight / 2
      );

      if (nextItem) {
        container.insertBefore(draggingItem, nextItem);
      } else {
        container.appendChild(draggingItem);
      }
    };

    container.addEventListener('dragover', handleDragOver);

    const items = container.querySelectorAll('.schedule-item');
    items.forEach(item => {
      item.addEventListener('dragstart', handleDragStart);
      item.addEventListener('dragend', handleDragEnd);
    });

    return () => {
      container.removeEventListener('dragover', handleDragOver);
      items.forEach(item => {
        item.removeEventListener('dragstart', handleDragStart);
        item.removeEventListener('dragend', handleDragEnd);
      });
    };

  }, [dataLoaded, scheduleData, currentDay]);


  const handleAddSchedule = () => {
    if (!formTime || !formActivity.trim()) return alert('Fill in all fields.');

    const newItem = {
      id: Date.now(), // unique ID
      time: formTime,
      activity: formActivity.trim(),
      status: 'pending',
    };

    const updatedData = {
      ...scheduleData,
      [formDay]: [...scheduleData[formDay], newItem],
    };

    setScheduleData(updatedData);
    setShowForm(false);
    setCurrentDay(formDay);
    saveScheduleOnBrowser(updatedData, cityName);
  };



  const handleStatusChange = (day, index, newStatus) => {
    const newData = { ...scheduleData };
    if (newStatus === 'delete') {
      newData[day].splice(index, 1);
    } else {
      newData[day][index].status = newStatus;
    }
    setScheduleData(newData);
    saveScheduleOnBrowser(newData, cityName);
  };

  const sortedSchedule = [...scheduleData[currentDay]].sort((a, b) => a.time.localeCompare(b.time));

  const reorderSchedule = () => {
    const container = scheduleContainerRef.current;
    const items = [...container.querySelectorAll('.schedule-item')];
    const newOrder = items.map(item => {
      const id = parseInt(item.dataset.id, 10);
      return scheduleData[currentDay].find(i => i.id === id);
    });

    const updated = { ...scheduleData, [currentDay]: newOrder };
    setScheduleData(updated);
    saveScheduleOnBrowser(updated, cityName);
  };

  return (
    <div className="weather-card__schedule p-2 border-t border-gray-100" id="schedule-container">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-medium text-gray-700">My Weekly Schedule</h4>
        <button
          id="add-schedule-btn"
          className="text-sm bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-600 transition"
          onClick={() => {
            setFormDay(currentDay); // <-- add this line
            setShowForm(true);
          }}
        >
          <i className="fas fa-plus mr-1"></i> Add
        </button>

      </div>

      {/* <!-- Day tabs --> */}
      <div className="flex overflow-x-auto space-x-2 pb-2 mb-3">
        {Object.keys(scheduleData).map((day) => (
          <button
            key={day}
            className={`weather-card__day-tab ${currentDay === day ? 'weather-card__day-tab--active' : ''}`}
            onClick={() => setCurrentDay(day)}
          >
            {day.charAt(0).toUpperCase() + day.slice(1)}
          </button>
        ))}
      </div>

      {/* <!-- Schedule content --> */}
      <div
        id="schedule-content"
        ref={scheduleContainerRef}
        className="space-y-3 max-h-[300px] overflow-y-auto"
      >

        {sortedSchedule.length === 0 ? (
          <div className="text-gray-500 text-center py-4">
            No activities scheduled for <p style={{ color: "#FF0000" }}>{currentDay.toUpperCase()}</p>
            <br />
            <span className="text-sm">Click the + button to add one.</span>
          </div>
        ) : (
          sortedSchedule.map((item, index) => {
            const statusInfo = getStatusInfo(item.status);
            return (
              <div
                key={item.id}
                data-id={item.id}
                draggable
                className={`schedule-item flex items-center justify-between p-3 rounded-lg border ${statusInfo.class}`}
              >

                <div className="flex items-center gap-3">
                  <i className={`fas ${statusInfo.icon} ${statusInfo.pulse ? 'animate-pulse' : ''}`} />
                  <div>
                    <div
                      className={`text-sm font-semibold truncate w-[300px] overflow-hidden whitespace-nowrap ${item.status === 'completed' ? 'line-through' : ''}`}
                      title={item.activity}
                    >
                      {item.activity}
                    </div>
                    <div className="text-xs">
                      {formatTime(item.time)}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {/* Mark as Completed */}
                  <button
                    onClick={() => handleStatusChange(currentDay, index, 'completed')}
                    className="text-green-600 hover:text-green-800"
                    title="Mark as completed"
                  >
                    <i className="fas fa-check" />
                  </button>

                  {/* Mark as Cancelled */}
                  <button
                    onClick={() => handleStatusChange(currentDay, index, 'cancelled')}
                    className="text-red-500 hover:text-red-700"
                    title="Mark as cancelled"
                  >
                    <i className="fas fa-ban" />
                  </button>

                  {/* Mark as Pending */}
                  <button
                    onClick={() => handleStatusChange(currentDay, index, 'pending')}
                    className="text-yellow-500 hover:text-yellow-600"
                    title="Mark as pending"
                  >
                    <i className="fas fa-clock" />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleStatusChange(currentDay, index, 'delete')}
                    className="text-gray-400 hover:text-gray-600"
                    title="Delete activity"
                  >
                    <i className="fas fa-trash" />
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>


      {/* <!-- Add schedule form (initially hidden) --> */}
      {showForm && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h5 className="font-medium text-gray-700 mb-3">Add New Activity</h5>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Day</label>
              <select
                value={formDay}
                onChange={(e) => setFormDay(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                {Object.keys(scheduleData).map((day) => (
                  <option key={day} value={day}>
                    {day.charAt(0).toUpperCase() + day.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Time</label>
              <input
                type="time"
                value={formTime}
                onChange={(e) => setFormTime(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Activity</label>
              <input
                type="text"
                value={formActivity}
                onChange={(e) => setFormActivity(e.target.value)}
                placeholder="E.g., Morning run, Meeting, etc."
                className="w-full p-2 border border-gray-300 rounded-lg"
                maxLength={64}
              />
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleAddSchedule}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition flex-1"
              >
                Save
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedule;