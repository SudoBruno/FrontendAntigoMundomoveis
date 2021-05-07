import React, { createContext, useContext, useState } from 'react';
import { CreateMountModal } from '../../../components/Plating/CreateMountModal';
import { SeccionadoraNextSectorMountModal } from '../../../components/Plating/Seccionadora/SeccionadoraNextSectorMountModal';
import { PlatingMountContext } from './PlatingMountContext';

export const SeccionadoraMountContext = createContext({});

export function SeccionadoraMountProvider({ children }) {
  const { sectorId } = useContext(PlatingMountContext);
  const [showNextSector, setShowNextSector] = useState(false);
  const [isCreateMountModalOpen, setIsCreatMountModalOpen] = useState(false);
  const [mount, setMount] = useState({});

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

  return (
    <SeccionadoraMountContext.Provider
      value={{
        finishMount,
        setMount,
        setShowNextSector,
        setIsCreatMountModalOpen,
        mount,
        sectorId,
      }}
    >
      {children}
      {showNextSector && <SeccionadoraNextSectorMountModal />}

      {isCreateMountModalOpen && <CreateMountModal />}
    </SeccionadoraMountContext.Provider>
  );
}
