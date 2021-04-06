import React, { createContext, useState } from 'react';

import { CreateMachineModal } from '../../components/machine/CreateMachineModal';
import { EditMachineModal } from '../../components/machine/EditMachineModal';
import { Notification } from '../../components/Notification';
import api from '../../services/api';

export const MachineContext = createContext({});

export function MachineProvider({ children, ...rest }) {
  const [isCreateMachineModalOpen, setIsCreateMachineModalOpen] = useState(
    false
  );
  const [isEditMachineModalOpen, setIsEditMachineModalOpen] = useState(false);

  const [refreshKey, setRefreshKey] = useState(0);

  const [sector, setSector] = useState(1);
  const [name, setName] = useState('');
  const [id, setID] = useState(0);

  function closeCreateMachineModal() {
    setIsCreateMachineModalOpen(false);
  }

  function openCreateMachineModal() {
    setName('');
    setSector(1);
    setID(0);
    setIsCreateMachineModalOpen(true);
  }

  function closeEditMachineModal() {
    setIsEditMachineModalOpen(false);
  }

  function openEditMachineModal() {
    setName('');
    setSector(1);
    setID(0);
    setIsEditMachineModalOpen(true);
  }

  async function createMachine(name, sector) {
    try {
      const response = await api.post('machine', {
        name,
        factorySectorId: sector,
      });
      closeCreateMachineModal();
      Notification(
        'success',
        'sucesso ao cadastrar',
        'Sucesso ao cadastrar maquina'
      );
      setRefreshKey((refreshKey) => refreshKey + 1);
    } catch (error) {
      Notification(
        'error',
        'erro ao cadastrar',
        'Ocorreu um erro ao cadastrar maquina'
      );
    }
  }
  async function getMachine(id) {
    const response = await api.get(`machine/${id}`);
    setName(response.data.name);
    setSector(response.data.factory_sector_id);
    setIsEditMachineModalOpen(true);

    setID(id);
  }
  async function editMachine(name, sector) {
    try {
      const response = await api.put('machine', {
        name,
        factorySectorId: sector,
        id,
      });
      closeEditMachineModal();
      Notification(
        'success',
        'sucesso ao cadastrar',
        'Sucesso ao cadastrar maquina'
      );
      setRefreshKey((refreshKey) => refreshKey + 1);
    } catch (error) {
      Notification(
        'error',
        'erro ao cadastrar',
        'Ocorreu um erro ao cadastrar maquina'
      );
    }
  }

  async function deleteMachine(id) {
    console.log(id);
    try {
      const response = await api.delete(`machine/${id}`);
      closeCreateMachineModal();
      Notification(
        'success',
        'sucesso ao deletar',
        'Sucesso ao deletar maquina'
      );
      setRefreshKey((refreshKey) => refreshKey + 1);
    } catch (error) {
      Notification(
        'error',
        'erro ao deletar',
        'Ocorreu um erro ao deletar maquina'
      );
    }
  }

  return (
    <MachineContext.Provider
      value={{
        closeCreateMachineModal,
        openCreateMachineModal,
        createMachine,
        deleteMachine,
        setSector,
        setName,
        refreshKey,
        sector,
        name,
        closeEditMachineModal,
        openEditMachineModal,
        getMachine,
        editMachine,
      }}
    >
      {children}
      {isCreateMachineModalOpen && <CreateMachineModal />}
      {isEditMachineModalOpen && <EditMachineModal />}
    </MachineContext.Provider>
  );
}
