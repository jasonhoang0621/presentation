import { Bar } from "react-chartjs-2";

const Slide = ({ data, onClick, noBorder = false }) => {
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
    <div
      className={`h-full min-h-[30vh] w-full mb-5 p-2 transition-all duration-300 flex flex-col items-center justify-between cursor-pointer ${
        noBorder
          ? ""
          : "bg-white shadow-lg rounded-[8px] hover:shadow-[#13241d] hover:shadow-lg"
      }`}
      onClick={onClick}
    >
      <p>hello</p>
      <Bar options={options} data={chartData} />
    </div>
  );
};

export default Slide;
