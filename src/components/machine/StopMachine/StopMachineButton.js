import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { useContext } from 'react';
import { MachineStopContext } from '../../../contexts/Machine/MachineStopContext';

import api from '../../../services/api';

export function StopMachineButton() {
  const { openCreateStopMachineModal } = useContext(MachineStopContext);

  return (
    <Button
      icon={<ExclamationCircleOutlined size={'18'} />}
      className="buttonRed"
      onClick={openCreateStopMachineModal}
    >
      Acionar Parada de maquina
    </Button>
  );
}
