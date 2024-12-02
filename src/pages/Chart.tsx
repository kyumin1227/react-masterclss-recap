import { useQuery } from "react-query";
import { fetchCoinHistory } from "../api";
import { useLocation } from "react-router-dom";
import ReactApexChart from "react-apexcharts";
import { useRecoilValue } from "recoil";
import { isDarkAtom } from "../atoms";

interface ICoinHistory {
  time_open: number;
  time_close: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  market_cap: number;
}

// function formatTimestamp(timestamp: number): string {
//   // 타임스탬프를 밀리초 단위로 변환
//   const date = new Date(timestamp * 1000);

//   // 날짜와 시간 구성 요소 추출
//   const year = date.getFullYear();
//   const month = (date.getMonth() + 1).toString().padStart(2, "0");
//   const day = date.getDate().toString().padStart(2, "0");
//   const hours = date.getHours().toString().padStart(2, "0");
//   const minutes = date.getMinutes().toString().padStart(2, "0");
//   const seconds = date.getSeconds().toString().padStart(2, "0");

//   // 원하는 형식으로 조합
//   return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
// }

const Chart = () => {
  const { state } = useLocation() as { state: { coinId: string } };
  const { isLoading, data } = useQuery<ICoinHistory[]>(["ohlcv", state.coinId], () => fetchCoinHistory(state.coinId));
  const isDarkMode = useRecoilValue(isDarkAtom);
  return (
    <div>
      {isLoading ? (
        "isLoading..."
      ) : (
        <ReactApexChart
          type="candlestick"
          series={[
            {
              data:
                data?.map((price) => ({
                  x: price.time_close,
                  y: [Number(price.open), Number(price.high), Number(price.low), Number(price.close)],
                })) || [],
            },
          ]}
          options={{
            theme: {
              mode: isDarkMode ? "dark" : "light",
            },
            chart: {
              height: 300,
              width: 500,
              toolbar: {
                show: false,
              },
              background: "transparent",
            },
            grid: {
              show: false,
            },
            stroke: {
              curve: "smooth",
              width: 4,
            },
            yaxis: {
              show: false,
            },
            xaxis: {
              axisTicks: { show: false },
              axisBorder: { show: false },
              labels: { show: false },
              type: "datetime",
              categories: data?.map((price) => price.time_close),
            },
            fill: {
              type: "gradient",
              gradient: { gradientToColors: ["#0be881"], stops: [0, 100] },
            },
            colors: ["#0fbcf9"],
            tooltip: {
              y: {
                formatter: (value) => `$${value.toFixed(2)}`,
              },
            },
          }}
        />
      )}
    </div>
  );
};

export default Chart;