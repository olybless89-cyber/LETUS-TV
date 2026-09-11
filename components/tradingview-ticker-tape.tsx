"use client";

import { useEffect, useRef } from "react";

const SYMBOLS = [
  { proName: "FX_IDC:USDNGN", title: "USD/NGN" },
  { proName: "FX:EURUSD", title: "EUR/USD" },
  { proName: "FX:GBPUSD", title: "GBP/USD" },
  { proName: "FX:USDJPY", title: "USD/JPY" },
  { proName: "TVC:GOLD", title: "Gold" },
  { proName: "TVC:UKOIL", title: "Brent Crude" },
];

export function TradingViewTickerTape() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = container.current;
    if (!el) return;
    el.innerHTML = '<div class="tradingview-widget-container__widget"></div>';

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: SYMBOLS,
      colorTheme: "dark",
      isTransparent: true,
      displayMode: "compact",
      locale: "en",
    });
    el.appendChild(script);

    return () => {
      el.innerHTML = "";
    };
  }, []);

  return <div className="tradingview-widget-container bg-blue-deep" ref={container} />;
}
