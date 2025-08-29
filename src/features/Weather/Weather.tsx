import React, { useEffect, useState } from "react";

type CurrentWeather = {
  name: string;
  main: { temp: number; humidity: number };
  weather: { description: string; icon: string }[];
  coord: { lat: number; lon: number };
};

type DailyItem = {
  dt: number;
  temp: { day: number; min: number; max: number };
  weather: { description: string; icon: string }[];
};

const API_KEY = import.meta.env.VITE_WEATHER_KEY as string;
if (!API_KEY) console.warn("VITE_OPENWEATHER_KEY is not set!");

const formatDateShort = (ts: number) => {
  const d = new Date(ts * 1000);
  return d.toLocaleDateString("ru-RU", { weekday: "short", day: "numeric" });
};

export const Weather: React.FC = () => {
  const [input, setInput] = useState("");
  const [cities, setCities] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("weather:cities") || "[]");
    } catch {
      return [];
    }
  });
  const [active, setActive] = useState<string | null>(() => {
    return localStorage.getItem("weather:active") || (cities[0] ?? null);
  });
  const [current, setCurrent] = useState<CurrentWeather | null>(null);
  const [daily, setDaily] = useState<DailyItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem("weather:cities", JSON.stringify(cities));
  }, [cities]);

  useEffect(() => {
    if (active) localStorage.setItem("weather:active", active);
    if (!active) {
      setCurrent(null);
      setDaily([]);
      setError(null);
      return;
    }
    fetchCityWeather(active);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const addCity = () => {
    const cityTrim = input.trim();
    if (!cityTrim) return;
    if (cities.includes(cityTrim)) {
      setActive(cityTrim);
      setInput("");
      return;
    }
    setCities((s) => [...s, cityTrim]);
    setActive(cityTrim);
    setInput("");
  };

  const removeCity = (c: string) => {
    setCities((prev) => prev.filter((p) => p !== c));
    if (active === c) {
      const others = cities.filter((x) => x !== c);
      setActive(others[0] ?? null);
    }
  };

  async function fetchCityWeather(cityName: string) {
    setLoading(true);
    setError(null);
    setCurrent(null);
    setDaily([]);
    try {
      // 1) Получаем current weather (чтобы взять координаты)
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          cityName
        )}&appid=${API_KEY}&units=metric&lang=ru`
      );
      if (!res.ok) {
        if (res.status === 404) throw new Error("Город не найден");
        throw new Error("Ошибка при запросе погоды");
      }
      const data: CurrentWeather = await res.json();
      setCurrent(data);

      // 2) Пытаемся получить прогноз на дни через One Call (нужны lat/lon)
      // если OneCall недоступен — просто оставляем current.
      try {
        const oc = await fetch(
          `https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&exclude=minutely,hourly,alerts&units=metric&appid=${API_KEY}&lang=ru`
        );
        if (oc.ok) {
          const ocJson = await oc.json();
          // daily — массив с 7-8 элементами (первые — сегодняшний)
          const days: DailyItem[] = (ocJson.daily || []).slice(0, 7).map((d: any) => ({
            dt: d.dt,
            temp: d.temp,
            weather: d.weather,
          }));
          setDaily(days);
        } else {
          // fallback: ничего не делаем (у нас уже есть current)
        }
      } catch (e) {
        // network / other: ignore onecall errors silently
        console.warn("onecall failed", e);
      }
    } catch (e: any) {
      setError(e.message || "Произошла ошибка");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center p-4 w-full h-full">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold">Weather Widget</h3>
          <div className="text-xs text-gray-500">React + Vite</div>
        </div>

        {/* Input */}
        <div className="flex gap-2 mb-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCity()}
            placeholder="Добавить город (например: Москва)"
            className="flex-1 border rounded-lg px-3 py-2 text-sm"
          />
          <button
            onClick={addCity}
            className="px-3 py-2 bg-blue-500 text-white rounded-lg text-sm"
          >
            Добавить
          </button>
        </div>

        {/* Cities pills */}
        <div className="flex gap-2 mb-4 overflow-x-auto">
          {cities.length === 0 ? (
            <div className="text-xs text-gray-500">Добавь город — появится карточка</div>
          ) : (
            <div className="inline-flex items-center">
              {cities.map((c, i) => {
                const isFirst = i === 0;
                const isLast = i === cities.length - 1;
                return (
                  <div
                    key={c}
                    className={`flex items-center whitespace-nowrap border px-3 py-1 mr-1 text-sm ${
                      active === c ? "bg-blue-50 border-blue-300" : "bg-white border-gray-200"
                    } ${isFirst ? "rounded-l-xl" : ""} ${isLast ? "rounded-r-xl" : ""}`}
                  >
                    <button
                      onClick={() => setActive(c)}
                      className="pr-2 focus:outline-none"
                    >
                      {c}
                    </button>
                    <button
                      onClick={() => removeCity(c)}
                      className="text-gray-400 hover:text-gray-600 text-xs p-1"
                      title="Удалить город"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Card */}
        <div className="w-full bg-white border rounded-2xl p-4 shadow-sm">
          {loading ? (
            <div className="text-center py-8">Загрузка...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-6">{error}</div>
          ) : current ? (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-semibold">{current.name}</div>
                  <div className="text-xs text-gray-500">Сейчас</div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold">{Math.round(current.main.temp)}°</div>
                  <div className="text-sm capitalize">{current.weather[0].description}</div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                <div>Влажность: {current.main.humidity}%</div>
                <div>
                  <img
                    src={`https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`}
                    alt="icon"
                    className="w-12 h-12 inline-block"
                  />
                </div>
              </div>

              {/* Horizontal daily list with rounding on first & last */}
              {daily.length > 0 && (
                <div className="mt-4">
                  <div className="text-xs text-gray-500 mb-2">Прогноз на ближайшие дни</div>
                  <div className="flex overflow-x-auto">
                    {daily.map((d, idx) => {
                      const isFirst = idx === 0;
                      const isLast = idx === daily.length - 1;
                      return (
                        <div
                          key={d.dt}
                          className={`min-w-[84px] flex flex-col items-center p-2 border ${
                            isFirst ? "rounded-l-xl" : ""
                          } ${isLast ? "rounded-r-xl" : ""} ${
                            idx === 0 ? "bg-blue-50 border-blue-200" : "bg-white border-gray-100"
                          } text-xs mr-1`}
                        >
                          <div className="text-[12px]">{formatDateShort(d.dt)}</div>
                          <img
                            className="w-10 h-10"
                            src={`https://openweathermap.org/img/wn/${d.weather[0].icon}@2x.png`}
                            alt={d.weather[0].description}
                          />
                          <div className="text-sm font-medium">{Math.round(d.temp.day)}°</div>
                          <div className="text-[11px] text-gray-500">
                            {Math.round(d.temp.min)}° / {Math.round(d.temp.max)}°
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">Выберите город или добавьте новый</div>
          )}
        </div>
      </div>
    </div>
  );
};
