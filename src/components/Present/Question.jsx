import {
  ArrowUpOutlined,
  PlusOutlined,
  QuestionOutlined,
  CheckOutlined,
  CloseOutlined
} from '@ant-design/icons';
import { Input, Popover } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useGetListQuestion } from 'src/api/question';
import { SocketContext } from 'src/socket/context';
import { postQuestion, updateQuestion } from 'src/socket/emit';
import { listenQuestion, listenUpdateQuestion } from 'src/socket/listen';
import { offQuestion, offUpdateQuestion } from 'src/socket/off';

const Question = ({ presentationId, role }) => {
  const auth = useSelector((state) => state.auth);
  const [questionLength, setQuestionLength] = useState(0);
  const [openAddQuestion, setOpenAddQuestion] = useState(false);
  const [question, setQuestion] = useState('');
  const [answeringQuestion, setAnsweringQuestion] = useState(null);
  const [confirmMark, setConfirmMark] = useState(null);
  const [answerContent, setAnswerContent] = useState('');

  const { socket } = useContext(SocketContext);

  const { data } = useGetListQuestion(presentationId, questionLength, questionLength > 20 ? 5 : 20);
  const [questionData, setQuestionData] = useState([]);

  const handleUpVote = (e, questionId) => {
    e.stopPropagation();
    const question = questionData.find((item) => item.id === questionId);
    let temp = null;
    if (question?.upVote?.includes(auth?.user?.id)) {
      const newQuestionData = questionData.map((item) => {
        if (item.id === questionId) {
          temp = item;
          temp.upVote = item.upVote.filter((item) => item !== auth?.user?.id);
          return {
            ...temp
          };
        }
        return item;
      });
      setQuestionData(newQuestionData);
      delete temp._id;
      updateQuestion(socket, presentationId, questionId, temp);
      return;
    }
    const newQuestionData = questionData.map((item) => {
      if (item.id === questionId) {
        temp = item;
        temp.upVote = [...item.upVote, auth?.user?.id];
        return {
          ...temp
        };
      }
      return item;
    });
    delete temp._id;
    updateQuestion(socket, presentationId, questionId, temp);
    setQuestionData(newQuestionData);
  };

  const handleAddQuestion = () => {
    if (!question) return;
    postQuestion(socket, presentationId, question);
    setQuestion('');
    setOpenAddQuestion(false);
  };

  const handleAnswerQuestion = (questionId) => {
    if (!answerContent) return;
    let temp = null;
    const newQuestionData = questionData.map((item) => {
      if (item.id === questionId) {
        temp = item;
        temp.answer = [
          ...item.answer,
          {
            id: item.answer.length + 1,
            name: auth?.user?.name,
            content: answerContent
          }
        ];
        delete temp._id;
        return {
          ...temp
        };
      }
      return item;
    });

    updateQuestion(socket, presentationId, questionId, temp);
    setQuestionData(newQuestionData);
    setAnsweringQuestion(null);
    setAnswerContent('');
  };

  const handleMarkAsAnswered = (e, questionId) => {
    e.stopPropagation();
    setConfirmMark(null);
    let temp = null;
    const newQuestionData = questionData.map((item) => {
      if (item.id === questionId) {
        temp = item;
        temp.isLock = true;
        delete temp._id;
        return {
          ...temp
        };
      }
      return item;
    });
    updateQuestion(socket, presentationId, questionId, temp);
    setQuestionData(newQuestionData);
  };

  useEffect(() => {
    if (!data) return;
    setQuestionData([...questionData, ...data.data]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (!socket) return;
    listenQuestion(socket, presentationId, (response) => {
      if (!response?.errorCode) {
        setQuestionData([response.data, ...questionData]);
        setQuestionLength(questionLength + 1);
      }
    });
    listenUpdateQuestion(socket, presentationId, (response) => {
      if (!response?.errorCode) {
        let newQuestionData = [];
        questionData.forEach((item) => {
          if (item.id === response.data.id) {
            newQuestionData.push(response?.data);
          } else {
            newQuestionData.push(item);
          }
        });
        setQuestionData(newQuestionData);
      }
    });

    return () => {
      offQuestion(socket, presentationId);
      offUpdateQuestion(socket, presentationId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, presentationId, questionData]);

  return (
    <div className={`m-2 relative ${role === 'member' ? 'pt-10' : ''}`}>
      {role === 'member' && (
        <Popover
          open={openAddQuestion}
          onOpenChange={(visible) => setOpenAddQuestion(visible)}
          placement='bottomRight'
          trigger={['click']}
          content={
            <div className='w-[500px]'>
              <TextArea
                className='app-input w-full'
                placeholder='Add new question'
                rows={3}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
              <div className='flex justify-end mt-2'>
                <button onClick={handleAddQuestion} className='button !py-1 !min-w-[100px]'>
                  <span className='text-[14px]'>Post</span>
                </button>
              </div>
            </div>
          }
        >
          <div className='absolute top-0 right-4 hover:opacity-75 cursor-pointer'>
            <PlusOutlined className='text-2xl' />
          </div>
        </Popover>
      )}
      {questionData &&
        questionData.map((item, index) => (
          <div
            onClick={
              item?.isLock
                ? null
                : () => {
                    setAnsweringQuestion(index);
                    setAnswerContent('');
                  }
            }
            key={index}
            className={`rounded-lg shadow-2xl border border-[#cdcdcdc] p-4 mb-4 ${
              item?.isLock ? 'bg-[#495e5435]' : 'bg-white'
            }`}
          >
            {item?.isLock && (
              <div className='flex justify-end font-semibold mb-2'>
                <p>Answered</p>
              </div>
            )}
            <div className='flex justify-between'>
              <div className='flex mr-5'>
                {!item?.isLock ? (
                  <Popover
                    placement='bottomLeft'
                    trigger={['click']}
                    open={confirmMark === index}
                    onOpenChange={(visible) => setConfirmMark(visible ? index : null)}
                    overlayClassName='app-popover'
                    content={
                      <div>
                        <p className='text-[16px]'>Mark this question as answered?</p>
                        <div className='flex justify-end mt-2 gap-x-2'>
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              setConfirmMark(null);
                            }}
                            className='w-6 h-6 rounded-full bg-white border border-[#495e54] flex items-center justify-center hover:text-white hover:bg-[#495e54] transition-all duration-200 cursor-pointer'
                          >
                            <CloseOutlined />
                          </div>
                          <div
                            onClick={(e) => handleMarkAsAnswered(e, item?.id)}
                            className='w-6 h-6 rounded-full bg-white border border-[#495e54] flex items-center justify-center hover:text-white hover:bg-[#495e54] transition-all duration-200 cursor-pointer'
                          >
                            <CheckOutlined />
                          </div>
                        </div>
                      </div>
                    }
                  >
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className='w-10 h-10 rounded-full bg-[#495e54] flex items-center justify-center flex-none'
                    >
                      <span className='text-white font-bold text-xl flex items-center justify-center'>
                        <QuestionOutlined />
                      </span>
                    </div>
                  </Popover>
                ) : (
                  <div className='w-10 h-10 rounded-full bg-[#495e54] flex items-center justify-center flex-none'>
                    <span className='text-white font-bold text-xl flex items-center justify-center'>
                      <CheckOutlined />
                    </span>
                  </div>
                )}
                <div className='ml-4'>
                  <p className='text-[#495e54] font-bold'>{item?.name}</p>
                  <p className='text-[#495e54] text-sm'>{item?.question}</p>
                </div>
              </div>
              <div className='flex items-center'>
                <div
                  className={`w-7 h-7 rounded-full cursor-pointer flex items-center justify-center transition-all duration-200 ${
                    item?.upVote.includes(auth?.user?.id)
                      ? 'bg-[#495e54]'
                      : 'bg-white border-2 border-[#495e54] hover:opacity-75'
                  }`}
                >
                  <ArrowUpOutlined
                    className={`text-[16px] font-bold ${
                      item?.upVote.includes(auth?.user?.id) ? 'text-white' : 'text-[#495e54]'
                    }`}
                    onClick={(e) => handleUpVote(e, item?.id)}
                  />
                </div>
                <p className='text-[#495e54] font-bold ml-2'>{item?.upVote.length}</p>
              </div>
            </div>
            <div className='mt-4'>
              <p className='text-[#495e54] font-bold'>Answers</p>
              {item?.answer &&
                item.answer.map((record, i) => (
                  <div
                    key={i}
                    className={`flex items-center mt-3 border-t pt-2 border-[#495e54] border-dashed`}
                  >
                    <div>
                      <p className='text-[#495e54] font-bold'>{record?.name}</p>
                      <p className='text-[#495e54] text-sm break-all'>{record?.content}</p>
                    </div>
                  </div>
                ))}
            </div>
            <div
              className={`mt-3 overflow-hidden transition-all duration-500 ${
                role !== 'member' && answeringQuestion === index ? 'h-[130px]' : 'h-[0px]'
              }`}
            >
              <p className='text-[#495e54] font-bold mt-4'>Your Answer</p>
              <Input
                className='app-input mt-1'
                placeholder='Type your answer'
                value={answerContent}
                onChange={(e) => setAnswerContent(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAnswerQuestion(item?.id);
                  }
                }}
              />
              <div className='flex justify-end mt-2'>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAnswerQuestion(item?.id);
                  }}
                  className='button !py-1 !min-w-[100px]'
                >
                  <span className='text-[14px]'>Post</span>
                </button>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Question;
