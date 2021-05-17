import React, { createContext, useEffect, useState } from 'react';
import BarcodeReader from 'react-barcode-reader';
import { Notification } from '../../../components/Notification';
import { DifferentAmountModal } from '../../../components/Plating/DifferentAmountModal';
import { StartMountModal } from '../../../components/Plating/StartMountModal';
import { NextSectorMountModal } from '../../../components/Plating/NextSectorMountModal';
import api from '../../../services/api';
import { StartMountInOtherSectorModal } from '../../../components/Plating/StartMountInOtherSectorModal';
import { AlterMountPathModal } from '../../../components/Plating/AlterMountPathModal';

export const PlatingMountContext = createContext({});

export function PlatingMountProvider({ children, ...rest }) {
  const [isStartMountModalOpen, setIsStartMountModalOpen] = useState(false);
  const [isReasonModalOpen, setIsReasonModalOpen] = useState(false);
  const [isNextSectorMountModalOpen, setIsNextSectorMountModalOpen] =
    useState(false);

  const [isStopMachine, setIsStopMachine] = useState(false);
  const [machineId, setMachineId] = useState(1);
  const [sectorId, setSectorId] = useState(1);

  const [isSelectMachineModalOpen, setIsSelectMachineModalOpen] =
    useState(true);

  const [barCode, setBarCode] = useState('');
  const [showAlterMountRoute, setShowAlterMountRoute] = useState(false);
  const [isAlterPathModalOpen, setIsAlterPathModalOpen] = useState(false);
  const [color, setColor] = useState('');
  const [productName, setProductName] = useState('');
  const [productionPlanControlName, setProductionPlanControlName] =
    useState('');
  const [subProductName, setSubProductName] = useState('');
  const [amount, setAmount] = useState(0);
  const [newAmount, setNewAmount] = useState(0);

  const [movement, setMovement] = useState('');
  const [mountId, setMountId] = useState(0);

  const [machine, setMachine] = useState({});

  useEffect(() => {
    api.get(`machine/${machineId}`).then((response) => {
      setMachine(response.data);
    });
  }, [machineId]);

  const handleSelectMachine = async (e) => {
    setMachineId(e);
    const isStop = await api.get(`machine-stop/machine/${e}`);

    if (isStop.data) {
      Notification(
        'error',
        'Maquina parada',
        'essa maquina esta parada, para continuar finalize a manutenção'
      );
      setIsStopMachine(true);
    } else {
      const response = await api.get(`machine/${e}`);
      setSectorId(response.data.factory_sector_id);

      setIsStopMachine(false);
    }
    setIsSelectMachineModalOpen(false);
  };

  const handleScan = async (e) => {
    if (isStopMachine) {
      Notification(
        'error',
        'Maquina parada',
        'Essa maquina se encontra parada, finalize a manutenção para continuar utilizando'
      );
    } else {
      const response = await api.get(
        `plating/mount/tag/${e}/sector/${sectorId}`
      );

      setBarCode(e);

      if (response.data.finish == null) {
        if (response.data.showSector == 0) {
          Notification('error', 'setor errado', 'Setor errado!');
          setIsAlterPathModalOpen(true);
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
    }
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
          machineId,
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
          machineId,
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
        setIsStopMachine,
        handleScan,
        setIsStartMountModalOpen,
        startMount,
        setNewAmount,
        setAmount,
        setIsReasonModalOpen,
        setMovement,
        setIsNextSectorMountModalOpen,
        startMountOtherSector,
        setShowAlterMountRoute,
        setIsAlterPathModalOpen,
        machineId,
        isSelectMachineModalOpen,
        sectorId,
        isStopMachine,
        isStartMountModalOpen,
        productName,
        productionPlanControlName,
        color,
        subProductName,
        newAmount,
        amount,
        mountId,
        movement,
        barCode,
        machine,
      }}
    >
      <h1>{machine.name}</h1>
      {children}
      <BarcodeReader onScan={handleScan} onError={handleScan} />
      {isStartMountModalOpen && <StartMountModal />}
      {isReasonModalOpen && <DifferentAmountModal />}

      {isNextSectorMountModalOpen && <NextSectorMountModal />}

      {showAlterMountRoute && <StartMountInOtherSectorModal />}
      {isAlterPathModalOpen && <AlterMountPathModal />}
    </PlatingMountContext.Provider>
  );
}
