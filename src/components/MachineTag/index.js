import React, { useState, useEffect } from 'react';

import { useParams } from 'react-router-dom';
import { useBarcode } from '@createnextapp/react-barcode';

import api from '../../services/api';
import './style.css';

function MachineTag() {
  const { id } = useParams();

  const [machine, setMachine] = useState({});

  useEffect(() => {
    api.get(`machine/${id}`, {}).then((response) => {
      setMachine(response.data);
    });
  }, [id]);

  const { inputRef } = useBarcode({
    value: id,
    options: {
      background: '#fff',
      width: 2,
      height: 50,
    },
  });

  return (
    <>
      <div className="machineTag">
        <h1 className="machineName">{machine.name}</h1>
        <svg ref={inputRef} className="machineCode" />
      </div>
    </>
  );
}

export { MachineTag };
