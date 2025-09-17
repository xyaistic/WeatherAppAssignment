
export const celsiusToFahrenheit = (celsius: number) => {
    console.log(celsius)
  return Math.round((celsius * 9 / 5) + 32);
}

export const fahrenheitToCelsius = (fahrenheit: number) => {
  return (fahrenheit - 32) * 5 / 9;
}