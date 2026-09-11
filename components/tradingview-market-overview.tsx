"use client";

import { useEffect, useRef } from "react";

const FOREX_SYMBOLS = [
  { s: "FX_IDC:USDNGN", d: "USD/NGN" },
  { s: "FX:EURUSD", d: "EUR/USD" },
  { s: "FX:GBPUSD", d: "GBP/USD" },
  { s: "FX:USDJPY", d: "USD/JPY" },
  { s: "FX:USDCHF", d: "USD/CHF" },
  { s: "FX:AUDUSD", d: "AUD/USD" },
  { s: "FX:USDCAD", d: "USD/CAD" },
  { s: "FX:NZDUSD", d: "NZD/USD" },
  { s: "FX:USDCNH", d: "USD/CNH" },
  { s: "FX:USDZAR", d: "USD/ZAR" },
];

export function TradingViewMarketOverview() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = container.current;
    if (!el) return;
    el.innerHTML = '<div class="tradingview-widget-container__widget" style="height:100%;width:100%"></div>';

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      colorTheme: "dark",
      dateRange: "1D",
      showChart: true,
      locale: "en",
      largeChartUrl: "",
      isTransparent: true,
      showSymbolLogo: true,
      showFloatingTooltip: false,
      width: "100%",
      height: "100%",
      plotLineColorGrowing: "rgba(46, 208, 137, 1)",
      plotLineColorFalling: "rgba(230, 57, 70, 1)",
      gridLineColor: "rgba(255, 255, 255, 0.06)",
      scaleFontColor: "rgba(246, 245, 240, 0.6)",
      belowLineFillColorGrowing: "rgba(46, 208, 137, 0.12)",
      belowLineFillColorFalling: "rgba(230, 57, 70, 0.12)",
      symbolActiveColor: "rgba(47, 111, 237, 0.2)",
      tabs: [
        {
          title: "World FX",
          symbols: FOREX_SYMBOLS,
          originalTitle: "Forex",
        },
      ],
    });
    el.appendChild(script);

    return () => {
      el.innerHTML = "";
    };
  }, []);

  return <div className="tradingview-widget-container h-[420px] w-full" ref={container} />;
}
