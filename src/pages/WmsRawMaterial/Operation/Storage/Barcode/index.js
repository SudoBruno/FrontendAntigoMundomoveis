import React, { useState, useEffect } from 'react';

import { useParams } from 'react-router-dom';
import BarCode from 'react-barcode';
import { Divider, Col, Row } from 'antd';
import api from '../../../../../services/api';
import logo from '../../../../../assets/logo.png';
import './style.css';

function Barcode() {
  const { id } = useParams();
  const [informations, setInformations] = useState([]);

  useEffect(() => {
    api.get(`/wmsrm/operation/storage/barcode/${id}`, {}).then((response) => {
      setInformations(response.data);
    });
  }, []);

  let content = [];
  for (let i = 0; i < 5; i++) {
    content.push(
      <>
        <p>____________ - </p>
        <p>____________ =</p>
        <p>________</p>
      </>
    );
  }

  return (
    <>
      <div className="wmsTags">
        {informations.map((item) => {
          return (
            <span>
              <img src={logo} style={{ height: '45px' }} />

              <Divider />
              <div className="wmsTagBody">
                <div className="firstColum">
                  <b>Almoxarifado</b>
                  <p>{item.warehouse}</p>
                  <b>Insumo</b>
                  <p>{item.ins_name}</p>
                </div>
                <div className="secondColum">
                  <b>Posição</b>
                  <p>{item.street}</p>
                  <b>quantidade</b>
                  <p>{item.quantity}</p>
                </div>
              </div>
              <Divider />

              <div className="operations">
                <p>QTDE ATUAL</p>
                <p>QTDE SAÍDA</p>
                <p>RESULTADO</p>

                {content}
              </div>
              <Divider />

              <div className="wmsTagBarCode">
                <BarCode
                  value={item.barcode}
                  width={1}
                  height={30}
                  fontSize={20}
                />
              </div>
            </span>
          );
        })}
      </div>
    </>
  );
}

export default Barcode;
