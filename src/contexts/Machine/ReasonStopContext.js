import React, { createContext, useState } from 'react';

import { CreateReasonStopModal } from '../../components/machine/ReasonStop/CreateReasonStopModal';
import { EditReasonStopModal } from '../../components/machine/ReasonStop/EditReasonStopModal';
import { Notification } from '../../components/Notification';
import api from '../../services/api';

export const ReasonStopContext = createContext({});

export function ReasonStopProvider({ children, ...rest }) {
  const [
    isCreateReasonStopModalOpen,
    setIsCreateReasonStopModalOpen,
  ] = useState(false);
  const [isEditReasonStopModalOpen, setIsEditReasonStopModalOpen] = useState(
    false
  );

  const [refreshKey, setRefreshKey] = useState(0);

  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [id, setID] = useState(0);

  function closeCreateReasonStopModal() {
    setIsCreateReasonStopModalOpen(false);
  }

  function openCreateReasonStopModal() {
    setName('');
    setDescription('');
    setID(0);
    setIsCreateReasonStopModalOpen(true);
  }

  function closeEditReasonStopModal() {
    setIsEditReasonStopModalOpen(false);
  }

  function openEditReasonStopModal() {
    setName('');
    setDescription('');
    setID(0);
    setIsEditReasonStopModalOpen(true);
  }

  async function createReasonStop(name, description) {
    try {
      const response = await api.post('reason-stop', {
        name,
        description,
      });
      closeCreateReasonStopModal();
      Notification(
        'success',
        'sucesso ao cadastrar',
        'Sucesso ao cadastrar motivo de parada'
      );
      setRefreshKey((refreshKey) => refreshKey + 1);
    } catch (error) {
      Notification(
        'error',
        'erro ao cadastrar',
        'Ocorreu um erro ao cadastrar motivo de parada'
      );
    }
  }
  async function getReasonStop(id) {
    const response = await api.get(`reason-stop/${id}`);
    setName(response.data.name);
    setDescription(response.data.description);
    console.log(response.data);
    setIsEditReasonStopModalOpen(true);

    setID(id);
  }
  async function editReasonStop(name, description) {
    try {
      const response = await api.put('reason-stop', {
        name,
        description,
        id,
      });
      closeEditReasonStopModal();
      Notification(
        'success',
        'sucesso ao cadastrar',
        'Sucesso ao cadastrar motivo de parada'
      );
      setRefreshKey((refreshKey) => refreshKey + 1);
    } catch (error) {
      Notification(
        'error',
        'erro ao cadastrar',
        'Ocorreu um erro ao cadastrar motivo de parada'
      );
    }
  }

  async function deleteReasonStop(id) {
    try {
      const response = await api.delete(`reason-stop/${id}`);
      closeCreateReasonStopModal();
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
    <ReasonStopContext.Provider
      value={{
        closeCreateReasonStopModal,
        openCreateReasonStopModal,
        createReasonStop,

        setDescription,
        setName,
        refreshKey,
        description,
        name,
        closeEditReasonStopModal,
        openEditReasonStopModal,
        getReasonStop,
        deleteReasonStop,
        editReasonStop,
      }}
    >
      {children}
      {isCreateReasonStopModalOpen && <CreateReasonStopModal />}
      {isEditReasonStopModalOpen && <EditReasonStopModal />}
    </ReasonStopContext.Provider>
  );
}
