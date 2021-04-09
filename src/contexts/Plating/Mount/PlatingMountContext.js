import React, { createContext, useState } from 'react';
import { StopMachineModal } from '../../../components/Plating/StopMachine/StopMachineModal';

import api from '../../../services/api';

export const PlatingMountContext = createContext({});

export function PlatingMountProvider({ children, ...rest }) {
  const [isStopMachineModalOpen, setIsStopMachineModalOpen] = useState(false);

  const [reasonStopMachineId, setReasonStopMachineId] = useState(1);
  const [description, setDescription] = useState('');
  const [id, setID] = useState(0);
  const [machineId, setMachineId] = useState(1);
  const [sectorId, setSectorId] = useState(1);

  const [isSelectMachineModalOpen, setIsSelectMachineModalOpen] = useState(
    true
  );

  const [mounts, setMounts] = useState([{}]);

  function closeStopMachineModal() {
    setIsStopMachineModalOpen(false);
  }

  async function createStopMachine() {
    console.log(machineId, reasonStopMachineId, description);
    // try {
    //   const response = await api.post('machine-stop', {
    //     description,
    //     factorySectorId: sector,
    //   });
    //   closeCreateMachineModal();
    //   Notification(
    //     'success',
    //     'sucesso ao cadastrar',
    //     'Sucesso ao cadastrar maquina'
    //   );
    //   setRefreshKey((refreshKey) => refreshKey + 1);
    // } catch (error) {
    //   Notification(
    //     'error',
    //     'erro ao cadastrar',
    //     'Ocorreu um erro ao cadastrar maquina'
    //   );
    // }
  }

  const handleSelectMachine = async (e) => {
    console.log(e);
    // setRefreshKey((refreshKey) => refreshKey + 1);
    setMachineId(e);
    const response = await api.get(`machine/${e}`);
    setSectorId(response.data.factory_sector_id);
    const responseMounts = await api.get(
      `plating/mount/sector/${response.data.factory_sector_id}`
    );
    setMounts(responseMounts.data);
    // console.log(e);
    setIsSelectMachineModalOpen(false);
  };

  return (
    <PlatingMountContext.Provider
      value={{
        closeStopMachineModal,
        setDescription,
        setReasonStopMachineId,
        createStopMachine,
        setMachineId,
        description,
        reasonStopMachineId,
        machineId,
        setIsStopMachineModalOpen,
        handleSelectMachine,
        isSelectMachineModalOpen,
        mounts,
        sectorId,
      }}
    >
      {children}
      {isStopMachineModalOpen && <StopMachineModal />},
    </PlatingMountContext.Provider>
  );
}
