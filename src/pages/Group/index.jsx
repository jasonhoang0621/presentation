import { Table } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useDetailGroup } from 'src/api/group';
import { useGetListPresentation } from 'src/api/presentation';
import CreatePresentationModal from 'src/components/CreatePresentaionModal';
import EditGroupModal from 'src/components/EditGroupModal';
import { useTranslation } from 'react-i18next';
const Group = () => {
  const auth = useSelector((state) => state.auth);
  const { id } = useParams();
  const navigate = useNavigate();
  const [editGroupModal, setEditGroupModal] = React.useState(false);
  const [createPresentationModal, setCreatePresentationModal] = React.useState(false);
  const [user, setUser] = useState({
    role: 'member'
  });
  const { t, i18n } = useTranslation();

  const { data } = useGetListPresentation(id);
  const { data: groupDetailData = null, isFetching: loadingGroup } = useDetailGroup(id);

  useEffect(() => {
    if (!loadingGroup) {
      if (groupDetailData) {
        const temp = groupDetailData.data.user.filter((item) => item?.id === auth?.user?.id);
        if (temp && temp.length > 0) {
          setUser({
            role: temp[0]?.role ?? 'member'
          });
          return;
        }
      }
      navigate('/');
    }
  }, [auth, groupDetailData, navigate, id, loadingGroup]);

  const columns = [
    {
      title: t('Name'),
      dataIndex: 'name',
      key: 'name',
      width: '30%'
    },
    {
      title: t('Number of slides'),
      dataIndex: 'slide',
      key: 'slide',
      render: (slide) => (
        <div className='text-center'>
          <span>{slide.length}</span>
        </div>
      ),
      width: '20%'
    },
    {
      title: t('Created date'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt) => (
        <div className='text-center'>
          <span>{moment(createdAt).format('DD/MM/YYYY HH:mm')}</span>
        </div>
      ),
      width: '25%'
    },
    {
      title: t('Last update'),
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (updatedAt) => (
        <div className='text-center'>
          <span>{moment(updatedAt).format('DD/MM/YYYY HH:mm')}</span>
        </div>
      ),
      width: '25%'
    }
  ];

  return (
    <div>
      <div className='flex items-center justify-end mb-3'>
        <>
          <button
            className='button button-danger !py-2 !min-w-[120px]'
            onClick={() => setEditGroupModal(true)}
          >
            <span className='!text-[12px]'>
              {user?.role === 'owner' ? t(`Edit Group`) : t('View Group')}
            </span>
          </button>
          {user?.role === 'owner' && (
            <button
              className='button !py-2 !min-w-[200px]'
              onClick={() => setCreatePresentationModal(true)}
            >
              <span className='!text-[12px]'>{t('Create Presentation')}</span>
            </button>
          )}
        </>
      </div>
      <div className='w-full'>
        <Table
          rowKey={(record) => record._id}
          columns={columns}
          dataSource={data?.data}
          pagination={false}
          onRow={(record) => {
            return {
              onClick: () => navigate(`/group/${id}/presentation/${record.id}`)
            };
          }}
          className='presentation-table'
          rowClassName='cursor-pointer'
        />
      </div>
      <EditGroupModal
        visible={editGroupModal}
        setVisible={setEditGroupModal}
        groupDetailData={groupDetailData}
        loadingGroup={loadingGroup}
        user={user}
      />
      <CreatePresentationModal
        visible={createPresentationModal}
        setVisible={setCreatePresentationModal}
      />
    </div>
  );
};

export default Group;
