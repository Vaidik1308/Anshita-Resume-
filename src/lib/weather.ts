// WMO weather interpretation codes, as used by Open-Meteo.
export type WeatherKind = "clear" | "partly" | "cloudy" | "fog" | "drizzle" | "rain" | "snow" | "storm";

const TABLE: [codes: number[], kind: WeatherKind, label: string][] = [
  [[0], "clear", "Clear"],
  [[1], "partly", "Mainly clear"],
  [[2], "partly", "Partly cloudy"],
  [[3], "cloudy", "Overcast"],
  [[45, 48], "fog", "Fog"],
  [[51, 53, 55, 56, 57], "drizzle", "Drizzle"],
  [[61, 63, 65, 66, 67, 80, 81, 82], "rain", "Rain"],
  [[71, 73, 75, 77, 85, 86], "snow", "Snow"],
  [[95, 96, 99], "storm", "Thunderstorm"],
];

export function describeWeather(code: number): { kind: WeatherKind; label: string } {
  const row = TABLE.find(([codes]) => codes.includes(code));
  return row ? { kind: row[1], label: row[2] } : { kind: "cloudy", label: "Cloudy" };
}

export type Weather = {
  temp: number;
  high: number;
  low: number;
  code: number;
  isDay: boolean;
};

export async function fetchWeather(lat: number, lon: number, signal?: AbortSignal): Promise<Weather> {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    "&current=temperature_2m,weather_code,is_day&daily=temperature_2m_max,temperature_2m_min&forecast_days=1&timezone=auto";
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`Open-Meteo ${res.status}`);
  const d = await res.json();
  return {
    temp: Math.round(d.current.temperature_2m),
    code: d.current.weather_code,
    isDay: d.current.is_day === 1,
    high: Math.round(d.daily.temperature_2m_max[0]),
    low: Math.round(d.daily.temperature_2m_min[0]),
  };
}
