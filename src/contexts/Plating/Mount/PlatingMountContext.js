import React, { createContext, useState } from 'react';

import api from '../../../services/api';

export const PlatingMountContext = createContext({});

export function PlatingMountProvider({ children, ...rest }) {
  const [isCreateMachineModalOpen, setIsCreateMachineModalOpen] = useState(
    false
  );

  return (
    <MachineContext.Provider value={{}}>
      {children}
      {isCreateMachineModalOpen && <CreateMachineModal />}
    </MachineContext.Provider>
  );
}
