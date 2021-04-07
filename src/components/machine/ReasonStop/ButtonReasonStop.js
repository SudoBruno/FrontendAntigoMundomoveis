import React, { useContext } from 'react';
import { ReasonStopContext } from '../../../contexts/Machine/ReasonStopContext';
import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';

export function ButtonReasonStop() {
  const { openCreateReasonStopModal } = useContext(ReasonStopContext);
  return (
    <Button
      className="buttonGreen"
      style={{ marginRight: 5, marginTop: 3, fontSize: '13px' }}
      onClick={openCreateReasonStopModal}
    >
      <PlusOutlined />
      Nova motivo de parada
    </Button>
  );
}
