import React, { createContext, useContext, useState } from 'react';
import { Notification } from '../../../components/Notification';

import api from '../../../services/api';
import { MachineStopContext } from '../../Machine/MachineStopContext';

export const PlatingMountContext = createContext({});

export function PlatingMountProvider({ children, ...rest }) {
  const [isStopMachine, setIsStopMachine] = useState(false);
  const [machineId, setMachineId] = useState(1);
  const [sectorId, setSectorId] = useState(1);

  const [isSelectMachineModalOpen, setIsSelectMachineModalOpen] = useState(
    true
  );

  const [mounts, setMounts] = useState([{}]);

  const handleSelectMachine = async (e) => {
    setMachineId(e);
    const isStop = await api.get(`machine-stop/machine/${e}`);

    if (isStop.data) {
      Notification(
        'error',
        'Maquina parada',
        'essa maquina esta parada, mas continuar finalize a manutenção'
      );
      setIsStopMachine(true);
    } else {
      const response = await api.get(`machine/${e}`);
      setSectorId(response.data.factory_sector_id);
      const responseMounts = await api.get(
        `plating/mount/sector/${response.data.factory_sector_id}`
      );
      setMounts(responseMounts.data);
    }
    setIsSelectMachineModalOpen(false);
  };

  return (
    <PlatingMountContext.Provider
      value={{
        setMachineId,
        handleSelectMachine,
        machineId,
        isSelectMachineModalOpen,
        mounts,
        sectorId,
        isStopMachine,
        setMounts,
      }}
    >
      {children}
    </PlatingMountContext.Provider>
  );
}
