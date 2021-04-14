import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { useState, useEffect, useContext } from 'react';
import { MachineStopContext } from '../../../contexts/Machine/MachineStopContext';

import api from '../../../services/api';

export function FinishStopMachineButton() {
  const { openCreateStopMachineModal } = useContext(MachineStopContext);

  return (
    <Button
      icon={<ExclamationCircleOutlined size={'18'} />}
      className="buttonYellow"
      onClick={openCreateStopMachineModal}
    >
      Finalizar Parada de maquina
    </Button>
  );
}
