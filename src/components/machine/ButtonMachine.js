import React, { useContext } from 'react';
import { MachineContext } from '../../contexts/Machine/MachineContext';
import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';

export function ButtonMachine() {
  const { openCreateMachineModal } = useContext(MachineContext);
  return (
    <Button
      className="buttonGreen"
      style={{ marginRight: 5, marginTop: 3, fontSize: '13px' }}
      onClick={openCreateMachineModal}
    >
      <PlusOutlined />
      Nova maquina
    </Button>
  );
}
