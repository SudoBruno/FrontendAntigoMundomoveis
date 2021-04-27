import React, { createContext, useEffect, useState } from 'react';
import api from '../../../services/api';

export const SeccionadoraMountContext = createContext({});

export function SeccionadoraMountProvider({ children }) {
  const [mounts, setMounts] = useState([{}]);
  const [productionPlanControlId, setProductionPlanControlId] = useState(0);
  const [productId, setProductId] = useState(0);
  const [color, setColor] = useState('');
  const [sectorId, setSectorId] = useState(0);

  const [selectedSubProducts, setSelectSubProducts] = useState([
    { subProductId: '', subProductName: '', amount: 0 },
  ]);
  const [subProducts, setSubProducts] = useState([
    { subProductId: '', subProductName: '', amount: 0 },
  ]);

  const [previousPlatingMountId, setPreviousPlatingMountId] = useState(0);
  const [showNextSector, setShowNextSector] = useState(false);

  useEffect(() => {
    api.get(`plating/mount/seccionadora/${sectorId}`, {}).then((response) => {
      setMounts(response.data);
    });
  }, []);

  const finishMount = async (e, data) => {
    e.preventDefault();

    setProductId(data.productId);

    setProductionPlanControlId(data.pcpId);

    setColor(data.color);
    setSelectSubProducts([
      {
        subProductId: data.subProductId,
        subProductName: data.subProductName,
        amount: data.amountInput,
      },
    ]);
    setSubProducts([
      {
        id: data.subProductId,
        name: data.subProductName,
        amount: data.amountInput,
      },
    ]);
    setPreviousPlatingMountId(data.id);

    setShowNextSector(true);
  };
  return (
    <SeccionadoraMountContext.Provider
      value={{
        finishMount,
        mounts,
      }}
    >
      {children}
    </SeccionadoraMountContext.Provider>
  );
}
