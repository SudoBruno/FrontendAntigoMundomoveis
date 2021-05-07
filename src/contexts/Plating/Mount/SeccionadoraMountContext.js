import React, { createContext, useContext, useState } from 'react';
import { Notification } from '../../../components/Notification';
import { CreateMountModal } from '../../../components/Plating/CreateMountModal';
import { SeccionadoraNextSectorMountModal } from '../../../components/Plating/Seccionadora/SeccionadoraNextSectorMountModal';
import api from '../../../services/api';
import { PlatingMountContext } from './PlatingMountContext';

export const SeccionadoraMountContext = createContext({});

export function SeccionadoraMountProvider({ children }) {
  const { sectorId } = useContext(PlatingMountContext);
  const [showNextSector, setShowNextSector] = useState(false);
  const [isCreateMountModalOpen, setIsCreatMountModalOpen] = useState(false);
  const [mount, setMount] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(1);

  async function finishMount(data) {
    setMount({
      factoryEmployeeId: localStorage.getItem('userId'),
      productionPlanControlId: data.pcpId,
      subProducts: [
        {
          subProductId: data.subProductId,
          subProductName: data.subProductName,
          amount: data.amountInput,
        },
      ],
      previousPlatingMountId: data.id,
      productId: data.productId,
      color: data.color,
    });

    setShowNextSector(true);
  }

  const createMounts = async (data) => {
    setIsLoading(true);
    try {
      await api.post('plating/seccionadora/mount', data);
      Notification(
        'success',
        'Monte criados com sucesso',
        'Os montes foram criados com sucesso!'
      );

      setRefreshKey(refreshKey + 1);
    } catch (error) {
      Notification(
        'error',
        'Erro ao criar o monte',
        'Erro ao criar um monte, procure o suporte'
      );
    }
    setIsCreatMountModalOpen(false);
    setIsLoading(false);
  };

  return (
    <SeccionadoraMountContext.Provider
      value={{
        finishMount,
        setMount,
        setShowNextSector,
        setIsCreatMountModalOpen,
        mount,
        sectorId,
        createMounts,
        isLoading,
        refreshKey,
      }}
    >
      {children}
      {showNextSector && <SeccionadoraNextSectorMountModal />}

      {isCreateMountModalOpen && <CreateMountModal />}
    </SeccionadoraMountContext.Provider>
  );
}
