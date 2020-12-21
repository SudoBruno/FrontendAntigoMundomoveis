import React, { useState } from 'react';
import * as XLSX from 'xlsx';

import api from '../../services/api';
export default function Xlsx(params) {
  const [employee, setEmployee] = useState([]);

  const handleUpload = (e) => {
    e.preventDefault();

    var files = e.target.files,
      f = files[0];
    var reader = new FileReader();
    reader.onload = async function (e) {
      var data = e.target.result;
      let readedData = XLSX.read(data, { type: 'binary' });
      const wsname = readedData.SheetNames[0];
      const ws = readedData.Sheets[wsname];

      /* Convert array to json*/
      const dataParse = XLSX.utils.sheet_to_json(ws, { header: 1 });
      setEmployee(dataParse);
    };
    reader.readAsBinaryString(f);
  };

  const Send = async () => {
    const response = await api.post('/call/employee/xlsx', employee);
  };
  return (
    <>
      <h2>Ola</h2>
      <input type="file" onChange={(e) => handleUpload(e)} />
      <button onClick={Send}>Enviar</button>
    </>
  );
}
