import { Bar } from "react-chartjs-2";

const Slide = ({ data, onClick, noBorder = false, isLabel = false }) => {
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
        display: isLabel,
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
    //get the first key of the object in item inarray
    labels: data?.answer ? data.answer.map((item) => item.value) : [],
    datasets: [
      {
        label: "Dataset 1",
        data: data?.answer ? data.answer.map((item) => item.amount) : [],
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
    scaleShowLabels: false,
  };

  return (
    <div
      className={`h-full min-h-[30vh] w-full p-2 transition-all duration-300 flex flex-col items-center justify-between cursor-pointer ${
        noBorder
          ? ""
          : "bg-white shadow-lg rounded-[8px] hover:shadow-[#13241d] hover:shadow-lg"
      }`}
      onClick={onClick}
    >
      <p>{data?.question}</p>
      <Bar options={options} data={chartData} />
    </div>
  );
};

export default Slide;
