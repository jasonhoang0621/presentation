import { Select } from "antd";
import { useContext, useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { useParams } from "react-router-dom";
import { useDetailPresentation } from "src/api/presentation";
import { SocketContext } from "src/socket/context";
import { changeSlide } from "src/socket/emit";

const Present = () => {
  const { socket } = useContext(SocketContext);
  const { presentationId } = useParams();
  const [currentSlide, setCurrentSlide] = useState(0);

  const { data } = useDetailPresentation(presentationId);

  const handleChangeSlide = (index) => {
    setCurrentSlide(index);
    changeSlide(socket, presentationId, index);
  };

  useEffect(() => {
    if (!socket) return;
    // createPresentation(socket, presentationId);
  }, [socket, presentationId]);

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
    labels: data
      ? data.data.slide[currentSlide]?.answer.map((item) => item.value)
      : [],
    datasets: [
      {
        data: data
          ? data.data.slide[currentSlide]?.answer.map((item) => item.count)
          : [],
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
    scaleShowLabels: false,
  };

  return (
    <div style={{ height: "calc(100vh - 64px)" }} className="p-2">
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-x-2 w-[15%]">
          <Select
            className="app-select"
            style={{ width: "100%" }}
            onChange={(value) => setCurrentSlide(value)}
            value={currentSlide}
          >
            {Array.isArray(data?.data?.slide) &&
              data?.data?.slide.map((item, index) => (
                <Select.Option key={index} value={index}>
                  {index + 1}. {item?.question}
                </Select.Option>
              ))}
          </Select>
        </div>
        <button
          onClick={() => handleChangeSlide(currentSlide + 1)}
          className="button !py-2 !min-w-[120px]"
        >
          <span className="!text-[14px]">Next</span>
        </button>
      </div>
      <div className="w-full flex items-center justify-center">
        <div
          className={`h-[600px] w-[90%] p-5 transition-all duration-300 flex flex-col items-center justify-between cursor-pointer overflow-hidden`}
        >
          <p className="break-all">
            {data?.data?.slide[currentSlide]?.question}
          </p>
          <Bar options={options} data={chartData} />
        </div>
      </div>
    </div>
  );
};

export default Present;
