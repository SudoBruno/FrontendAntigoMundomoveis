import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { useContext } from 'react';
import { MachineStopContext } from '../../../contexts/Machine/MachineStopContext';

export function FinishStopMachineButton() {
  const { openFinishStopMachineModal } = useContext(MachineStopContext);

  return (
    <Button
      icon={<ExclamationCircleOutlined size={'18'} />}
      className="buttonYellow"
      onClick={openFinishStopMachineModal}
    >
      Finalizar Parada de maquina
    </Button>
  );
}
