import rain from "../assets/rain.json";
import clear from "../assets/clear.json";
import cloud from "../assets/cloud.json";
import drizzle from "../assets/drizzle.json";
import snow from "../assets/snow.json";
import thunderstorm from "../assets/thunderstorm.json";

export const getLottieForCondition = (condition = "") => {
  const c = condition.toLowerCase();
  if (c.includes("rain")) return rain;
  if (c.includes("cloud")) return cloud;
  if (c.includes("drizzle")) return drizzle;
  if (c.includes("snow")) return snow;
  if (c.includes("thunderstorm")) return thunderstorm;
  return clear;
};