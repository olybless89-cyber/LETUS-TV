"use client";

import { useEffect, useRef } from "react";

export function TradingViewAdvancedChart({
  defaultSymbol = "FX_IDC:USDNGN",
}: {
  defaultSymbol?: string;
}) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = container.current;
    if (!el) return;
    el.innerHTML = '<div class="tradingview-widget-container__widget" style="height:100%;width:100%"></div>';

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: defaultSymbol,
      interval: "60",
      timezone: "Africa/Lagos",
      theme: "dark",
      style: "1",
      locale: "en",
      backgroundColor: "rgba(11, 18, 32, 1)",
      gridColor: "rgba(255, 255, 255, 0.06)",
      hide_top_toolbar: false,
      hide_legend: false,
      allow_symbol_change: true,
      support_host: "https://www.tradingview.com",
    });
    el.appendChild(script);

    return () => {
      el.innerHTML = "";
    };
  }, [defaultSymbol]);

  return (
    <div className="tradingview-widget-container aspect-[16/10] w-full sm:aspect-[16/8]" ref={container} />
  );
}
