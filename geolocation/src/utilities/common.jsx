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

export const getCurrentTimeHHMM = () => {
  const now = new Date();

  let hours = now.getHours();
  let minutes = now.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";

  // convert 24h → 12h format
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'

  // zero-pad minutes
  minutes = minutes < 10 ? "0" + minutes : minutes;

  return `${hours}:${minutes} ${ampm}`;
};


export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};

export const formatUnixToLocalHHMM = (unixTime, timezoneOffset = 0) => {
  // Convert UNIX (seconds) → milliseconds
  const utcMillis = unixTime * 1000;

  // Apply OpenWeather offset (seconds → ms)
  const localMillis = utcMillis + timezoneOffset * 1000;

  // Get hours/minutes from this manually
  const date = new Date(localMillis);
  const hours = date.getUTCHours(); // use UTC hours so we don't apply local system offset
  const minutes = date.getUTCMinutes();

  // Format to 12-hour AM/PM
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHour = hours % 12 === 0 ? 12 : hours % 12;
  const displayMinutes = minutes.toString().padStart(2, "0");

  return `${displayHour}:${displayMinutes} ${ampm}`;
};