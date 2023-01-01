import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import Slide from "src/components/Slide";
import { SocketContext } from "src/socket/context";
import { answerQuestion } from "src/socket/emit";
import { listenAnswer } from "src/socket/listen";
import { offAnswer } from "src/socket/off";

const MultipleChoice = ({ data, isPublic = false }) => {
  const [activeAnswer, setActiveAnswer] = React.useState(null);
  const [slideData, setSlideData] = React.useState(data);
  const [showStatistic, setShowStatistic] = React.useState(false);

  const { socket } = useContext(SocketContext);
  const { presentationId } = useParams();

  const onSubmit = () => {
    answerQuestion(socket, presentationId, data.index, activeAnswer);
    setShowStatistic(true);
  };

  const onPublicSubmit = () => {
    const username = localStorage.getItem("username");
    const guestId = localStorage.getItem("guestId");
    answerQuestion(socket, presentationId, data.index, activeAnswer, username, guestId);
    setShowStatistic(true);
  };

  useEffect(() => {
    setActiveAnswer(null);
    setShowStatistic(false);
  }, [data]);

  useEffect(() => {
    if (!socket) return;
    listenAnswer(socket, presentationId, data.index, (response) => {
      console.log("response", response);
      setSlideData(response.data.slide[data.index]);
    });

    return () => {
      offAnswer(socket, presentationId, data.index);
    };
  }, [socket, presentationId, data.index]);
  console.log('isPublic', isPublic)
  return (
    <div>
      <p className="text-center text-[40px] mt-10">{data?.question}</p>

      {showStatistic ? (
        <div className="mt-5">
          <Slide noQuestion noBorder data={slideData} isLabel={true} />
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
