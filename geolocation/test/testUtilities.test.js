import {expect, test} from 'vitest';
import { kelvinToCelsius, kelvinToFahrenheit } from "../src/utilities/common";

test("Kelvein To Celcius", () => {
    expect(kelvinToCelsius(273.15)).toBe(0)
    expect(kelvinToCelsius(0)).toBe(-273.1)
    expect(kelvinToCelsius(260)).toBe(-13.1)
    expect(() => kelvinToCelsius(-1)).toThrow("Kelvin can't be negative"); // Expect function to throw err
})

test("kelvin to Fahrenheit", () => {
    expect(kelvinToFahrenheit(460)).toBe(368.3)
    expect(kelvinToFahrenheit(0)).toBe(-459.7)
    expect(kelvinToFahrenheit(460.58)).toBe(369.4)
    expect(() => kelvinToCelsius(-1)).toThrow("Kelvin can't be negative");
})