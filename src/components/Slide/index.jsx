import { Bar } from 'react-chartjs-2';
import { Reaction, SlideType } from 'src/helpers/slide';
import { useTranslation } from 'react-i18next';
const Slide = ({ data, onClick, noBorder = false, noQuestion = false, isLabel = false }) => {
  const { t, i18n } = useTranslation();
  if (data?.type === SlideType.MULTIPLE_CHOICE) {
    const options = {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: data?.name
        }
      },
      tooltips: {
        display: false
      },
      scales: {
        x: {
          display: isLabel,
          grid: {
            display: false
          }
        },
        y: {
          grid: {
            display: false
          },
          ticks: {
            stepSize: 1
          }
        }
      }
    };

    const chartData = {
      labels: data?.answer ? data.answer.map((item) => item.value) : [],
      datasets: [
        {
          label: t('Amount'),
          data: data?.answer ? data.answer.map((item) => item.amount) : [],
          backgroundColor: 'rgba(255, 99, 132, 0.5)'
        }
      ],
      scaleShowLabels: false
    };

    return (
      <div
        className={`h-full min-h-[30vh] w-full p-2 transition-all duration-300 flex flex-col items-center justify-between cursor-pointer ${
          noBorder ? '' : 'bg-white shadow-lg rounded-[8px] hover:shadow-[#13241d] hover:shadow-lg'
        }`}
        onClick={onClick}
      >
        {!noQuestion && <p className='text-xl'>{data?.question}</p>}
        <Bar options={options} data={chartData} />
      </div>
    );
  }

  if (data?.type === SlideType.HEADING || data?.type === SlideType.PARAGRAPH) {
    return (
      <div
        className={`h-full min-h-[30vh] w-full p-5 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer ${
          noBorder ? '' : 'bg-white shadow-lg rounded-[8px] hover:shadow-[#13241d] hover:shadow-lg'
        }`}
        onClick={onClick}
      >
        <p className='break-all text-2xl'>{data?.question}</p>
        <p className='break-all text-[16px] mt-2'>{data?.paragraph}</p>
        {isLabel && (
          <div className='flex items-center justify-center mt-5'>
            {data.answer.map(({ type }) => {
              const Icon = Reaction.find((item) => item.type === type)?.Icon;
              return (
                <div
                  key={type}
                  className={
                    'flex items-center justify-center w-10 h-10 bg-[#495e54] drop-shadow-md rounded-full mr-3 transition-all duration-200 relative'
                  }
                >
                  <Icon className='text-white' />
                  {data?.answer?.find((item) => item?.type === type)?.amount > 0 && (
                    <div className='absolute -top-1.5 -right-2 rounded-full w-5 h-5 flex items-center justify-center bg-white text-[#495e54] text-[11px] drop-shadow-md'>
                      {data?.answer?.find((item) => item?.type === type)?.amount}
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
