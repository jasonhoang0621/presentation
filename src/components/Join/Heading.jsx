import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Reaction } from 'src/helpers/slide';
import { answerQuestion } from 'src/socket/emit';
import { listenAnswer } from 'src/socket/listen';
import { offAnswer } from 'src/socket/off';
import { useTranslation } from 'react-i18next';
const Heading = ({ data, isPublic, socket = null }) => {
  const [activeAnswer, setActiveAnswer] = React.useState(null);
  const [slideData, setSlideData] = React.useState(data);
  const [showStatistic, setShowStatistic] = React.useState(false);
  const { presentationId } = useParams();
  const { t, i18n } = useTranslation();

  const onSubmit = () => {
    answerQuestion(socket, presentationId, data.index, activeAnswer);
    setShowStatistic(true);
  };

  const onPublicSubmit = () => {
    const username = localStorage.getItem('username');
    const guestId = localStorage.getItem('guestId');
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
      setSlideData(response.data.slide[data.index]);
    });

    return () => {
      offAnswer(socket, presentationId, data.index);
    };
  }, [socket, presentationId, data.index]);

  useEffect(() => {
    if (!data) return;
    setSlideData(data);
  }, [data]);

  return (
    <div className={`flex flex-col items-center justify-center h-full`}>
      <p className='break-all text-[40px]'>{slideData?.question}</p>
      <p className='break-all mt-2 text-[25px]'>{slideData?.paragraph}</p>
      <div className='flex items-center justify-center mt-10'>
        {slideData.answer.map(({ type }, index) => {
          const Icon = Reaction.find((item) => item.type === type)?.Icon;
          return (
            <div
              onClick={showStatistic ? () => {} : () => setActiveAnswer(index)}
              key={index}
              className={`flex items-center justify-center w-[50px] h-[50px] drop-shadow-md rounded-full mr-3 transition-all duration-200 relative ${
                activeAnswer === index ? 'bg-[#495e54] text-white' : 'bg-white text-[#495e54]'
              }`}
            >
              <Icon
                className={`text-[20px] ${
                  activeAnswer === index ? 'text-white' : 'text-[#495e54]'
                }`}
              />
              {showStatistic && (
                <div
                  className={`absolute -top-3 -right-3 rounded-full w-7 px-1 h-7 flex items-center justify-center drop-shadow-md text-[10px] ${
                    activeAnswer === index ? 'bg-white text-[#495e54]' : 'bg-[#495e54] text-white'
                  }`}
                >
                  {slideData?.answer?.find((item) => item?.type === type)?.amount}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {showStatistic ? (
        <div className='bg-[#F0F2F5] mt-10'>
          <p className='text-xl text-center'>{t('Wait for the host to change the slide')}</p>
        </div>
      ) : (
        <div className='flex items-center justify-center mt-10'>
          <button onClick={isPublic ? onPublicSubmit : onSubmit} className='button !py-2'>
            <span className='text-[14px]'>{t('Submit')}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Heading;
