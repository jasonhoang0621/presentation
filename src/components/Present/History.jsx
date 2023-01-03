import moment from 'moment';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { listenHistory } from 'src/socket/listen';
import { offHistory } from 'src/socket/off';

const History = ({ data, socket = null }) => {
  const [history, setHistory] = React.useState([]);
  const { presentationId } = useParams();
  console.log('socket', socket);

  useEffect(() => {
    if (!socket) return;
    listenHistory(socket, presentationId, (response) => {
      if (!response.errorCode) {
        setHistory([...response.data]);
      }
    });

    return () => {
      offHistory(socket, presentationId);
    };
  }, [socket, presentationId, history]);
  useEffect(() => {
    if (!data) return;
    setHistory((history) => [...history, ...data.data]);
  }, [data]);

  return (
    <div className='m-2'>
      {data &&
        history.map((item, index) => (
          <div key={index}>
            <p className='text-center border-b border-[#495e54] border-dashed mt-3 text-[16px]'>
              <span className='font-bold text-[#495e54]'>
                {moment(item._id).format('DD/MM/YYYY')}
              </span>
            </p>
            {item.answer.map((record) => (
              <p key={record.id} className='text-[15px] mt-2  transition-all duration-200'>
                <span className='font-bold text-[#495e54]'>
                  {moment(record.createdAt).format('HH:mm')}:{' '}
                </span>
                <span className='font-bold text-[#495e54]'>{record.name} </span>
                <span className='text-[#495e54]'>choose </span>
                <span className='font-bold text-[#495e54]'>"{record.answer}"</span>
                <span className='text-[#495e54]'> for the question </span>
                <span className='font-bold text-[#495e54]'>"{record.question}"</span>
              </p>
            ))}
          </div>
        ))}
    </div>
  );
};

export default History;
