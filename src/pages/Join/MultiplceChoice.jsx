import React, { useContext } from "react";
import { useEffect } from "react";
import Slide from "src/components/Slide";
import { listenAnswer } from "src/socket/listen";
import { offAnswer } from "src/socket/off";
import { SocketContext } from "src/socket/context";
import { useParams } from "react-router-dom";
import { answerQuestion } from "src/socket/emit";

const MultipleChoice = ({ data }) => {
  const [activeAnswer, setActiveAnswer] = React.useState(null);
  const [slideData, setSlideData] = React.useState(data);
  const [showStatistic, setShowStatistic] = React.useState(false);
  const onSubmit = () => {
    answerQuestion(socket, presentationId, data.index, activeAnswer);
    let temp = slideData;
    temp.answer[activeAnswer].amount = temp?.answer[activeAnswer].amount + 1;
    setSlideData(temp);
    setShowStatistic(true);
  };
  const { socket } = useContext(SocketContext);
  const { presentationId } = useParams();

  useEffect(() => {
    setActiveAnswer(null);
    setShowStatistic(false);
  }, [data]);

  useEffect(() => {
    if (!socket) return;
    listenAnswer(socket, presentationId, (response) => {
      setSlideData(response.slide[data.index]);
    });

    return () => {
      offAnswer(socket, presentationId);
    };
  }, [socket, presentationId, data.index]);

  return (
    <div>
      <p className="text-center text-[40px] mt-10">{data?.question}</p>

      {showStatistic ? (
        <div className="mt-5">
          <Slide noQuestion noBorder data={data} isLabel={true} />
        </div>
      ) : (
        <>
          <div className="mt-10 flex flex-wrap">
            {data &&
              data?.answer.map((answer, index) => (
                <div
                  key={index}
                  className={`app-input text-center w-[32%] mx-auto cursor-pointer ${
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
            <button onClick={onSubmit} className="button !py-2">
              <span className="text-[14px]">Submit</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MultipleChoice;
