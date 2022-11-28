import React from "react";
import { Bar } from "react-chartjs-2";

const Slide = ({ data }) => {
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
        display: false,
      },
    },
  };
  const labels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
  ];

  const chartData = {
    labels,
    datasets: [
      {
        label: "Dataset 1",
        data: labels.map(() => Math.round(Math.random() * 100)),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
    scaleShowLabels: false,
  };

  return (
    <div className="h-full min-h-[30vh] w-full bg-white shadow-lg mb-5 p-2 transition-all duration-300 rounded-[8px] flex flex-col items-center justify-between hover:shadow-[#13241d] hover:shadow-lg">
      <p>hello</p>
      <Bar options={options} data={chartData} />
    </div>
  );
};

export default Slide;
