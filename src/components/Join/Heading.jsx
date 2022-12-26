import React from "react";
import { useEffect } from "react";
import { Reaction } from "src/helpers/slide";

const Heading = ({ data, isPublic }) => {
  const [activeAnswer, setActiveAnswer] = React.useState(null);
  const [showStatistic, setShowStatistic] = React.useState(false);
  const onSubmit = () => {
    setShowStatistic(true);
  };

  const onPublicSubmit = () => {};

  useEffect(() => {
    setActiveAnswer(null);
    setShowStatistic(false);
  }, [data]);

  return (
    <div className={`flex flex-col items-center justify-center h-full`}>
      <p className="break-all text-[40px]">{data?.question}</p>
      <p className="break-all mt-2 text-[25px]">{data?.paragraph}</p>
      <div className="flex items-center justify-center mt-10">
        {data.icon.map(({ type }) => {
          const Icon = Reaction.find((item) => item.type === type)?.Icon;
          return (
            <div
              onClick={showStatistic ? () => {} : () => setActiveAnswer(type)}
              key={type}
              className={`flex items-center justify-center w-[50px] h-[50px] drop-shadow-md rounded-full mr-3 transition-all duration-200 relative ${
                activeAnswer === type
                  ? "bg-[#495e54] text-white"
                  : "bg-white text-[#495e54]"
              }`}
            >
              <Icon
                className={`text-[20px] ${
                  activeAnswer === type ? "text-white" : "text-[#495e54]"
                }`}
              />
              {showStatistic && (
                <div
                  className={`absolute -top-3 -right-3 rounded-full w-7 px-1 h-7 flex items-center justify-center drop-shadow-md text-[10px] ${
                    activeAnswer === type
                      ? "bg-white text-[#495e54]"
                      : "bg-[#495e54] text-white"
                  }`}
                >
                  {data?.icon?.find((item) => item?.type === type)?.amount}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {showStatistic ? (
        <p className="text-xl text-center mt-5">
          Wait for the host to change the slide
        </p>
      ) : (
        <div className="flex items-center justify-center mt-10">
          <button
            onClick={isPublic ? onPublicSubmit : onSubmit}
            className="button !py-2"
          >
            <span className="text-[14px]">Submit</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Heading;
