import React, { useState, useEffect, useRef } from 'react';
import '../../css/weathercard.css';

const initialScheduleData = {
  monday: [
    { time: '08:00', activity: 'Morning jog in the park', status: 'pending' },
    { time: '14:30', activity: 'Team meeting', status: 'completed' },
    { time: '16:00', activity: 'Project deadline', status: 'pending' },
    { time: '18:30', activity: 'Grocery shopping', status: 'pending' },
    { time: '20:00', activity: 'Call with family', status: 'pending' },
  ],
  tuesday: [],
  wednesday: [],
  thursday: [
    { time: '19:00', activity: 'Dinner with friends', status: 'cancelled' }
  ],
  friday: [],
  saturday: [],
  sunday: [],
};

const getStatusInfo = (status) => {
  switch (status) {
    case 'completed':
      return { icon: 'fa-check', class: 'completed', pulse: false };
    case 'cancelled':
      return { icon: 'fa-ban', class: 'cancelled', pulse: false };
    default:
      return { icon: 'fa-clock', class: 'pending', pulse: true };
  }
};

const formatTime = (time) => {
  const [h, m] = time.split(':');
  let hours = parseInt(h);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours}:${m} ${ampm}`;
};

const Schedule = () => {
  const [scheduleData, setScheduleData] = useState(initialScheduleData);
  const [currentDay, setCurrentDay] = useState('monday');
  const [showForm, setShowForm] = useState(false);
  const [formDay, setFormDay] = useState('monday');
  const [formTime, setFormTime] = useState('');
  const [formActivity, setFormActivity] = useState('');
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const scrollRef = useRef();

  useEffect(() => {
    const now = new Date();
    setFormTime(`${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`);
  }, [showForm]);

  const handleAddSchedule = () => {
    if (!formTime || !formActivity.trim()) return alert('Fill in all fields.');

    const newData = { ...scheduleData };
    newData[formDay].push({ time: formTime, activity: formActivity.trim(), status: 'pending' });
    setScheduleData(newData);
    setShowForm(false);
    setCurrentDay(formDay);
  };

  const handleStatusChange = (day, index, newStatus) => {
    const newData = { ...scheduleData };
    if (newStatus === 'delete') {
      newData[day].splice(index, 1);
    } else {
      newData[day][index].status = newStatus;
    }
    setScheduleData(newData);
  };

  const sortedSchedule = [...scheduleData[currentDay]].sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div class="weather-card__schedule mt-4 border-t border-gray-100 pt-4" id="schedule-container">
      <div class="flex justify-between items-center mb-3">
        <h4 class="font-medium text-gray-700">My Weekly Schedule</h4>
        <button id="add-schedule-btn" class="text-sm bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-600 transition">
          <i class="fas fa-plus mr-1"></i> Add
        </button>
      </div>

      {/* <!-- Day tabs --> */}
      <div class="flex overflow-x-auto space-x-2 pb-2 mb-3">
        <button class="weather-card__day-tab weather-card__day-tab--active" data-day="monday">Monday</button>
        <button class="weather-card__day-tab" data-day="tuesday">Tuesday</button>
        <button class="weather-card__day-tab" data-day="wednesday">Wednesday</button>
        <button class="weather-card__day-tab" data-day="thursday">Thursday</button>
        <button class="weather-card__day-tab" data-day="friday">Friday</button>
        <button class="weather-card__day-tab" data-day="saturday">Saturday</button>
        <button class="weather-card__day-tab" data-day="sunday">Sunday</button>
      </div>

      {/* <!-- Schedule content --> */}
      <div id="schedule-content" class="space-y-3 max-h-[300px] overflow-y-auto">
        {/* <!-- Schedule items will be dynamically added here --> */}
        <div class="text-gray-500 text-center py-4" id="empty-schedule">
          No activities scheduled for this day.
          <br />
          <span class="text-sm">Click the + button to add one.</span>
        </div>
      </div>

      {/* <!-- Add schedule form (initially hidden) --> */}
      <div id="add-schedule-form" class="mt-4 p-4 bg-blue-50 rounded-lg hidden">
        <h5 class="font-medium text-gray-700 mb-3">Add New Activity</h5>
        <div class="space-y-3">
          <div>
            <label class="block text-sm text-gray-600 mb-1">Day</label>
            <select id="schedule-day" class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="monday">Monday</option>
              <option value="tuesday">Tuesday</option>
              <option value="wednesday">Wednesday</option>
              <option value="thursday">Thursday</option>
              <option value="friday">Friday</option>
              <option value="saturday">Saturday</option>
              <option value="sunday">Sunday</option>
            </select>
          </div>
          <div>
            <label class="block text-sm text-gray-600 mb-1">Time</label>
            <input type="time" id="schedule-time" class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-sm text-gray-600 mb-1">Activity</label>
            <input type="text" id="schedule-activity" placeholder="E.g., Morning run, Meeting, etc." class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div class="flex space-x-2">
            <button id="save-schedule-btn" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition flex-1">Save</button>
            <button id="cancel-schedule-btn" class="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
