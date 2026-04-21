import { useEffect, useState } from "react";
import { Droplets, Sun, Thermometer, Wind } from "lucide-react";
import { motion } from "framer-motion";
import { fetchWeather, type WeatherData } from "@/services/api";

const WeatherBanner = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadWeather = (lat?: number, lon?: number) => {
      fetchWeather(lat, lon)
        .then((w) => !cancelled && setWeather(w))
        .catch(() => {});
    };

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => loadWeather(pos.coords.latitude, pos.coords.longitude),
        (err) => {
          console.warn("Geolocation denied or failed:", err.message);
          loadWeather();
        }
      );
    } else {
      loadWeather();
    }

    return () => {
      cancelled = true;
    };
  }, []);

  if (!weather) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-2xl bg-gradient-warm border border-border/60 shadow-card"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 p-5">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-gradient-gold p-2.5 shadow-gold">
            <Sun className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <p className="font-display text-base font-semibold text-foreground">
              {weather.location} • {weather.condition}
            </p>
            <p className="text-xs text-muted-foreground">{weather.risk}</p>
          </div>
        </div>

        <div className="flex items-center gap-5 text-sm text-foreground/80">
          <span className="flex items-center gap-1.5">
            <Thermometer className="h-4 w-4 text-primary" />
            {weather.temp}°C
          </span>
          <span className="flex items-center gap-1.5">
            <Droplets className="h-4 w-4 text-sky" />
            {weather.humidity}%
          </span>
          <span className="flex items-center gap-1.5">
            <Wind className="h-4 w-4 text-muted-foreground" />
            {weather.wind} km/h
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default WeatherBanner;
