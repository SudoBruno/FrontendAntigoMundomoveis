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
        <p>________ - </p>
        <p>________ =</p>
        <p>________</p>
      </>
    );
  }

  return (
    <>
      <div className="wmsTags">
        <span style={{ background: 'white' }}>
          <div className="logo">
            <Row>
              <Col span={12} align={'left'}>
                <img src={logo} style={{ height: '30px' }} />
              </Col>

              <Col span={12}></Col>
            </Row>
          </div>
          <Divider style={{ margin: '0px' }} />
          <div className="wmsTagBody">
            <div className="firstColum">
              <b>Almoxarifado</b>
              <p>pedro</p>
              <b>Insumo</b>
              <p>Nome</p>
            </div>
            <div className="secondColum">
              <b>Posição</b>
              <p>pedro</p>
              <b>Posição</b>
              <p>Quantidade</p>
            </div>
          </div>
          <Divider style={{ margin: '0px' }} />

          <div className="operations">
            <p>QTDE ATUAL</p>
            <p>QTDE SAÍDA</p>
            <p>RESULTADO</p>

            {content}
          </div>
          <Divider style={{ marginTop: '8px' }} />

          <div className="wmsTagBarCode">
            <BarCode value={'12abhhf'} width={1} height={30} fontSize={20} />
          </div>
        </span>
        <span style={{ background: 'white' }}>
          <div className="logo">
            <Row>
              <Col span={12} align={'left'}>
                <img src={logo} style={{ height: '30px' }} />
              </Col>

              <Col span={12}></Col>
            </Row>
          </div>
          <Divider style={{ margin: '0px' }} />
          <div className="wmsTagBody">
            <div className="firstColum">
              <b>Almoxarifado</b>
              <p>pedro</p>
              <b>Insumo</b>
              <p>Nome</p>
            </div>
            <div className="secondColum">
              <b>Posição</b>
              <p>pedro</p>
              <b>Quantidade</b>
              <p>Quantidade</p>
            </div>
          </div>
          <Divider style={{ margin: '0px' }} />

          <div className="operations">
            <p>QTDE ATUAL</p>
            <p>QTDE SAÍDA</p>
            <p>RESULTADO</p>

            {content}
          </div>
          <Divider style={{ marginTop: '8px' }} />

          <div className="wmsTagBarCode">
            <BarCode value={'12abhhf'} width={1} height={30} fontSize={20} />
          </div>
        </span>
      </div>
    </>
  );
}

export default Barcode;
