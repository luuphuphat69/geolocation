export const kelvinToCelsius = (k) => {
  if (k < 0) {
    throw new Error("Kelvin can't be negative")
  }
  const temp = Math.round((k - 273.15) * 10) / 10
  return temp;
};

export const kelvinToFahrenheit = (k) => {
  if (k < 0) {
    throw new Error("Kelvin can't be negative")
  }
  const temp = Math.round(((k * 9) / 5 - 459.67) * 10) / 10;
  return temp;
}

export const fahrenheitToCelsius = (f) => {
  const temp = Math.round(((f - 32) * 5 / 9) * 10) / 10;
  return temp;
};

export const celsiusToFahrenheit = (c) => {
  const temp = Math.round(((c * 9) / 5 + 32) * 10) / 10;
  return temp;
};

export const getCurrentTimeHHMMSS = () => {
  const now = new Date(); // Create a new Date object representing the current date and time

  // Get individual components: hours, minutes, and seconds
  let hours = now.getHours();
  let minutes = now.getMinutes();
  let seconds = now.getSeconds();

  // Pad single-digit numbers with a leading zero to ensure HH:MM:SS format
  hours = hours < 10 ? '0' + hours : hours;
  minutes = minutes < 10 ? '0' + minutes : minutes;

  // Combine the components into the desired format
  return `${hours}:${minutes}`;
}

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};
