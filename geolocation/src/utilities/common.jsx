export const kelvinToCelsius = (k) => {
    if(k < 0){
        console.log("Kelvin can't be negative");
        return;
    }
    Math.round((k - 273.15) * 10) / 10
};
export const kelvinToFahrenheit = (k) =>{
    if(k < 0){
        console.log("Kelvin can't be negative");
        return;
    }
    Math.round(((k * 9) / 5 - 459.67) * 10) / 10;
}
