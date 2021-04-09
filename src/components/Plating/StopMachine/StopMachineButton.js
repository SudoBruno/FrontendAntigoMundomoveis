import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { useState, useEffect, useContext } from 'react';
import { PlatingMountContext } from '../../../contexts/Plating/Mount/PlatingMountContext';
import api from '../../../services/api';

export function StopMachineButton() {
  const { setIsStopMachineModalOpen } = useContext(PlatingMountContext);

  return (
    <Button
      icon={<ExclamationCircleOutlined size={'18'} />}
      className="buttonRed"
      onClick={(e) => {
        setIsStopMachineModalOpen(true);
      }}
    >
      Acionar Parada de maquina
    </Button>
  );
}
