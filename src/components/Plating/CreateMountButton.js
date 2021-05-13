import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { useContext } from 'react';
import { SeccionadoraMountContext } from '../../contexts/Plating/Mount/SeccionadoraMountContext';

function CreateMountButton({ sectorName }) {
  const { setIsCreatMountModalOpen } = useContext(SeccionadoraMountContext);
  return (
    <Button
      className="buttonGreen"
      icon={<PlusOutlined />}
      style={{ marginRight: 5, fontSize: '14px' }}
      onClick={(e) => setIsCreatMountModalOpen(true)}
    >
      {sectorName}
    </Button>
  );
}

export { CreateMountButton };
