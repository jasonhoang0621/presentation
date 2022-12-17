import { Bar } from "react-chartjs-2";
import { Reaction, SlideType } from "src/helpers/slide";

const Slide = ({ data, onClick, noBorder = false, isLabel = false }) => {
  if (data.type === SlideType.MULTIPLE_CHOICE) {
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
  }

  if (data.type === SlideType.HEADING || data.type === SlideType.PARAGRAPH) {
    return (
      <div
        className={`h-full min-h-[30vh] w-full p-2 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer ${
          noBorder
            ? ""
            : "bg-white shadow-lg rounded-[8px] hover:shadow-[#13241d] hover:shadow-lg"
        }`}
        onClick={onClick}
      >
        <p className="break-all text-xl">{data?.question}</p>
        <p className="break-all mt-2">{data?.paragraph}</p>
        {isLabel && (
          <div className="flex items-center justify-center mt-5">
            {data.icon.map(({ type }) => {
              const Icon = Reaction.find((item) => item.type === type)?.Icon;
              return (
                <div
                  key={type}
                  className={
                    "flex items-center justify-center w-10 h-10 bg-[#495e54] drop-shadow-md rounded-full mr-3 transition-all duration-200 relative"
                  }
                >
                  <Icon className="text-white" />
                  {data?.icon?.find((item) => item?.type === type)?.amount >
                    0 && (
                    <div className="absolute -top-1 -right-1 rounded-full min-w-4 px-1 h-4 flex items-center justify-center bg-white text-[#495e54] text-[10px] drop-shadow-md">
                      {data?.icon?.find((item) => item?.type === type)?.amount}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }
};

export default Slide;
