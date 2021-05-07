import React, { createContext, useContext, useEffect, useState } from 'react';
import { FinishStopMachineButton } from '../../components/machine/FinishStop/FinishStopMachineButton';
import { FinishStopMachineModal } from '../../components/machine/FinishStop/FinishStopMachineModal';
import { StopMachineButton } from '../../components/machine/StopMachine/StopMachineButton';
import { StopMachineModal } from '../../components/machine/StopMachine/StopMachineModal';
import { Notification } from '../../components/Notification';
import api from '../../services/api';
import { PlatingMountContext } from '../Plating/Mount/PlatingMountContext';
export const MachineStopContext = createContext({});

export function MachineStopProvider({ children, ...rest }) {
  const {
    machineId,
    isStopMachine,

    setIsStopMachine,
    handleSelectMachine,
  } = useContext(PlatingMountContext);
  const [
    isCreateStopMachineModalOpen,
    setIsCreateStopMachineModalOpen,
  ] = useState(false);

  const [
    isFinishStopMachineModalOpen,
    setIsFinishStopMachineModalOpen,
  ] = useState(false);
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

      setIsStopMachine(true);
      setIsStop(true);
      setIsCreateStopMachineModalOpen(false);
    } catch (error) {
      console.error(error);
      Notification(
        'error',
        'Erro ao acionar parada de maquina',
        error.response == undefined
          ? 'Ocorreu um erro ao acionar parada de maquina, tente novamente'
          : error.response.data.message
      );
    }
  }

  function handleStopMachine() {
    setIsStop(true);
  }

  function openCreateStopMachineModal() {
    setIsCreateStopMachineModalOpen(true);
  }

  function closeCreateStopMachineModal() {
    setIsCreateStopMachineModalOpen(false);
  }

  async function openFinishStopMachineModal() {
    setIsFinishStopMachineModalOpen(true);
    const response = await api.get(`machine-stop/machine/${machineId}`);
    setDescription(response.data.description);
    setReasonStopMachineId(response.data.reason_stop_machine_id);
  }

  function closeFinishStopMachineModal() {
    setIsFinishStopMachineModalOpen(false);
  }

  async function finishStopMachine() {
    try {
      const response = await api.put(`machine-stop/${machineId}`);
      Notification(
        'success',
        'Parada de maquina finalizada',
        'maquina funcionando normalmente'
      );

      setIsFinishStopMachineModalOpen(false);
      handleSelectMachine(machineId);
    } catch (error) {
      Notification(
        'error',
        'Erro ao finalizar parada de maquina',
        'Ocorreu um erro ao finalizar parada de maquina, tente novamente'
      );
    }
  }

  return (
    <MachineStopContext.Provider
      value={{
        openCreateStopMachineModal,
        closeCreateStopMachineModal,
        isCreateStopMachineModalOpen,
        setReasonStopMachineId,
        reasonStopMachineId,
        createStopMachine,
        description,
        setDescription,
        handleStopMachine,
        isStop,
        closeFinishStopMachineModal,
        openFinishStopMachineModal,
        finishStopMachine,
      }}
    >
      {children}
      {isCreateStopMachineModalOpen && <StopMachineModal />}
      {isFinishStopMachineModalOpen && <FinishStopMachineModal />}

      {!isStopMachine && <StopMachineButton />}
      {isStopMachine && <FinishStopMachineButton />}
    </MachineStopContext.Provider>
  );
}
