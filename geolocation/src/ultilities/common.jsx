import axios from "axios";

export const kelvinToCelsius = (k) => Math.round((k - 273.15) * 10) / 10;
export const kelvinToFahrenheit = (k) => Math.round(((k * 9) / 5 - 459.67) * 10) / 10;
