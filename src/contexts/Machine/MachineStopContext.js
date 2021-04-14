import React, { createContext, useContext, useState } from 'react';
import { Notification } from '../../components/Notification';
import { StopMachineModal } from '../../components/Plating/StopMachine/StopMachineModal';
import api from '../../services/api';
import { PlatingMountContext } from '../Plating/Mount/PlatingMountContext';
export const MachineStopContext = createContext({});

export function MachineStopProvider({ children, ...rest }) {
  const { machineId, isStopMachine, setMounts } = useContext(
    PlatingMountContext
  );
  const [isCreateMachineModalOpen, setIsCreateMachineModalOpen] = useState(
    false
  );
  const [isStop, setIsStop] = useState(isStopMachine);
  const [reasonStopMachineId, setReasonStopMachineId] = useState(1);
  const [description, setDescription] = useState(1);
  async function createStopMachine() {
    try {
      const response = await api.post('machine-stop', {
        reasonStopMachineId,
        description,
        machineId,
      });

      Notification(
        'success',
        'Parada de maquina acionada com sucesso',
        'Essa maquina esta parada para manutenção'
      );
      setMounts([{}]);
      setIsStop(true);
      setIsCreateMachineModalOpen(false);
    } catch (error) {
      Notification(
        'error',
        'Erro ao acionar parada de maquina',
        error.response.data.message == undefined
          ? 'Ocorreu um erro ao acionar parada de maquina, tente novamente'
          : error.response.data.message
      );
    }
  }

  function handleStopMachine() {
    setIsStop(true);
  }

  function openCreateStopMachineModal() {
    setIsCreateMachineModalOpen(true);
  }

  function closeCreateStopMachineModal() {
    setIsCreateMachineModalOpen(false);
  }

  return (
    <MachineStopContext.Provider
      value={{
        openCreateStopMachineModal,
        closeCreateStopMachineModal,
        isCreateMachineModalOpen,
        setReasonStopMachineId,
        reasonStopMachineId,
        createStopMachine,
        description,
        setDescription,
        handleStopMachine,
        isStop,
      }}
    >
      {children}
      {isCreateMachineModalOpen && <StopMachineModal />}
    </MachineStopContext.Provider>
  );
}
