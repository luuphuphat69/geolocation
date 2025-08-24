import {expect, test} from 'vitest';
import { kelvinToCelsius, kelvinToFahrenheit } from "../src/utilities/common";

test("Kelvein To Celcius", () => {
    expect(kelvinToCelsius(273.15)).toBe(0)
    expect(kelvinToCelsius(0)).toBe(-273.15)
    expect(kelvinToCelsius(260)).toBe(-13.15)
})

test("kelvin to Fahrenheit", () => {
    expect(kelvinToFahrenheit(460)).toBe(368.33)
    expect(kelvinToFahrenheit(0)).toBe(-459.67)
    expect(kelvinToFahrenheit(460.58)).toBe(369.37)
})