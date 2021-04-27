import React, { createContext, useState } from 'react';
import BarcodeReader from 'react-barcode-reader';
import { Notification } from '../../../components/Notification';
import { DifferentAmountModal } from '../../../components/Plating/DifferentAmountModal';
import { StartMountModal } from '../../../components/Plating/StartMountModal';
import { NextSectorMountModal } from '../../../components/Plating/NextSectorMountModal';
import api from '../../../services/api';
import { StartMountInOtherSectorModal } from '../../../components/Plating/StartMountInOtherSectorModal';

export const PlatingMountContext = createContext({});

export function PlatingMountProvider({ children, ...rest }) {
  const [isStartMountModalOpen, setIsStartMountModalOpen] = useState(false);
  const [isReasonModalOpen, setIsReasonModalOpen] = useState(false);
  const [isNextSectorMountModalOpen, setIsNextSectorMountModalOpen] = useState(
    false
  );

  const [isStopMachine, setIsStopMachine] = useState(false);
  const [machineId, setMachineId] = useState(1);
  const [sectorId, setSectorId] = useState(1);

  const [isSelectMachineModalOpen, setIsSelectMachineModalOpen] = useState(
    true
  );

  const [mounts, setMounts] = useState([{}]);

  const [barCode, setBarCode] = useState('');
  const [showAlterMountRoute, setShowAlterMountRoute] = useState(false);

  const [color, setColor] = useState('');
  const [productName, setProductName] = useState('');
  const [productionPlanControlName, setProductionPlanControlName] = useState(
    ''
  );
  const [subProductName, setSubProductName] = useState('');
  const [amount, setAmount] = useState(0);
  const [newAmount, setNewAmount] = useState(0);

  const [movement, setMovement] = useState('');
  const [mountId, setMountId] = useState(0);

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
      console.log(response.data.factory_sector_id);
      const responseMounts = await api.get(
        `plating/mount/sector/${response.data.factory_sector_id}`
      );
      setMounts(responseMounts.data);
      setIsStopMachine(false);
    }
    setIsSelectMachineModalOpen(false);
  };

  const handleScan = async (e) => {
    const response = await api.get(`plating/mount/tag/${e}/sector/${sectorId}`);

    setBarCode(e);
    console.log(response.data);

    if (response.data.finish == null) {
      if (response.data.showSector == 0) {
        Notification('error', 'setor errado', 'Setor errado!');
        setShowAlterMountRoute(true);
        console.log(showAlterMountRoute);
      } else {
        if (response.data.start == null) {
          setIsStartMountModalOpen(true);
        } else {
          setIsNextSectorMountModalOpen(true);
        }
      }
    } else {
      Notification(
        'error',
        'Monte ja finalizado',
        'Esse monte ja foi finalizado'
      );
    }

    setColor(response.data.color);
    setProductName(response.data.productName);
    setProductionPlanControlName(response.data.pcp);
    setSubProductName(response.data.subProductName);
    setAmount(response.data.amount);
    setNewAmount(response.data.amount);
    setMountId(response.data.id);
  };

  const startMountOtherSector = async () => {
    if (amount != newAmount) {
      setIsReasonModalOpen(true);
      setMovement('input');
    } else {
      try {
        await api.put('plating/mount/alter/start', {
          amountInput: newAmount,
          barCode,
          sectorId,
          employeeId: localStorage.getItem('userId'),
          // machineId,
        });

        Notification('success', 'Monte iniciado', 'Monte iniciado com sucesso');
        setShowAlterMountRoute(false);
      } catch (error) {
        Notification(
          'error',
          'Erro ao iniciar o monte',
          'Ocorreu um erro ao iniciar o monte'
        );
      }
    }
  };

  const startMount = async () => {
    if (amount != newAmount) {
      setIsReasonModalOpen(true);
      setMovement('input');
    } else {
      try {
        await api.put('plating/mount/alter/start', {
          amountInput: newAmount,
          barCode,
          sectorId,
          employeeId: localStorage.getItem('userId'),
          // machineId,
        });
        setIsStartMountModalOpen(false);
        Notification('success', 'Monte iniciado', 'Monte iniciado com sucesso');
      } catch (error) {
        Notification(
          'error',
          'Erro ao iniciar o monte',
          'Ocorreu um erro ao iniciar o monte'
        );
      }
    }
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
        setIsStopMachine,
        handleScan,
        isStartMountModalOpen,
        setIsStartMountModalOpen,
        startMount,
        productName,
        productionPlanControlName,
        color,
        subProductName,
        newAmount,
        setNewAmount,
        amount,
        setAmount,
        setIsReasonModalOpen,
        mountId,
        movement,
        setMovement,
        barCode,
        setIsNextSectorMountModalOpen,
        startMountOtherSector,
        setShowAlterMountRoute,
      }}
    >
      {children}
      <BarcodeReader onScan={handleScan} onError={handleScan} />
      {isStartMountModalOpen && <StartMountModal />}
      {isReasonModalOpen && <DifferentAmountModal />}

      {isNextSectorMountModalOpen && <NextSectorMountModal />}

      {showAlterMountRoute && <StartMountInOtherSectorModal />}
    </PlatingMountContext.Provider>
  );
}
