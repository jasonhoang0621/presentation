import React from "react";
import { Bar } from "react-chartjs-2";

const MainSlide = ({ data }) => {
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: data?.name,
      },
    },
    tooltips: {
      display: false,
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  const chartData = {
    labels: data?.answer.map((item) => item.value),
    datasets: [
      {
        data: data?.answer.map((item) => item.amount),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
    scaleShowLabels: false,
  };

  return (
    <div
      className={`h-full min-h-[30vh w-full mb-5 p-2 transition-all duration-300 flex flex-col items-center justify-between cursor-pointer overflow-hidden`}
    >
      <p className="break-all">{data?.question}</p>
      <Bar options={options} data={chartData} />
    </div>
  );
};

export default React.memo(MainSlide);
