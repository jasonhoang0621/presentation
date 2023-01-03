import React, { useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { useParams } from "react-router-dom";
import { answerQuestion } from "src/socket/emit";
import { listenAnswer } from "src/socket/listen";
import { offAnswer } from "src/socket/off";

const MultipleChoice = ({ data, isPublic = false, socket = null }) => {
  const [activeAnswer, setActiveAnswer] = React.useState(null);
  const [slideData, setSlideData] = React.useState(data);
  const [showStatistic, setShowStatistic] = React.useState(false);

  const { presentationId } = useParams();

  const onSubmit = () => {
    answerQuestion(socket, presentationId, data.index, activeAnswer);
    setShowStatistic(true);
  };

  const onPublicSubmit = () => {
    const username = localStorage.getItem("username");
    const guestId = localStorage.getItem("guestId");
    answerQuestion(
      socket,
      presentationId,
      data.index,
      activeAnswer,
      username,
      guestId
    );
    setShowStatistic(true);
  };

  useEffect(() => {
    setActiveAnswer(null);
    setShowStatistic(false);
  }, [data]);

  useEffect(() => {
    if (!socket) return;
    listenAnswer(socket, presentationId, data.index, (response) => {
      setSlideData(response.data.slide[data.index]);
    });

    return () => {
      offAnswer(socket, presentationId, data.index);
    };
  }, [socket, presentationId, data.index]);

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: slideData?.name,
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
    labels: slideData ? slideData?.answer.map((item) => item.value) : [],
    datasets: [
      {
        data: slideData ? slideData?.answer.map((item) => item.amount) : [],
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
    scaleShowLabels: false,
  };

  return (
    <div>
      <p className="text-center text-[40px] mt-10">{data?.question}</p>

      {showStatistic ? (
        <div className="mt-5">
          <Bar options={options} data={chartData} />
          <p className="text-xl text-center mt-5">
            Wait for the host to change the slide
          </p>
        </div>
      ) : (
        <>
          <div className="mt-10 flex flex-wrap gap-2">
            {slideData &&
              slideData?.answer.map((answer, index) => (
                <div
                  key={index}
                  className={`app-input text-center w-[32%] cursor-pointer ${
                    activeAnswer === index
                      ? "bg-[#495e54] text-white"
                      : "bg-white"
                  }`}
                  onClick={
                    showStatistic ? () => {} : () => setActiveAnswer(index)
                  }
                >
                  {answer?.value}
                </div>
              ))}
          </div>
          <div className="flex items-center justify-center mt-5">
            <button
              onClick={isPublic ? onPublicSubmit : onSubmit}
              className="button !py-2"
            >
              <span className="text-[14px]">Submit</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MultipleChoice;
