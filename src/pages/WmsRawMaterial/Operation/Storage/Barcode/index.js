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
      <tr>
        <td>_______________ - </td>
        <td>_______________ =</td>
        <td>_____________</td>
      </tr>
    );
  }

  return (
    <>
      <div class="pdf-page">
        <div class="row">
          <div class="col-50">
            {informations.map((item) => {
              return (
                <>
                  <div id="card">
                    <div className="logo">
                      <Row>
                        <Col span={12}>
                          <img src={logo} style={{ height: '45px' }} />
                        </Col>

                        <Col span={12}>
                          <h4>Entrada realizada em:</h4>
                          <h3>{item.date_entry}</h3>
                        </Col>
                      </Row>
                    </div>

                    <Divider style={{ marginTop: '30px' }} />

                    <div className="table-header">
                      <table width="90%" style={{ marginLeft: '5%' }}>
                        <tr>
                          <th>Almoxarifado</th>
                          <th>Posição</th>
                        </tr>
                        <tr>
                          <td>{item.warehouse}</td>
                          <td>{item.street}</td>
                        </tr>
                      </table>
                    </div>

                    <div className="table-header">
                      <table
                        width="90%"
                        style={{ marginLeft: '5%', marginTop: '10px' }}
                      >
                        <tr>
                          <th>Insumo</th>
                          <th>Quantidade</th>
                        </tr>
                        <tr>
                          <td>{item.ins_name}</td>
                          <td>{item.quantity}</td>
                        </tr>
                      </table>
                    </div>
                    <div className="ins">
                      <h3 style={{ marginTop: '15px' }}>{item.ins}</h3>
                    </div>

                    <Divider style={{ marginTop: '5px' }} />

                    <div className="content-table">
                      <table width="90%" style={{ margin: '0' }}>
                        <tr>
                          <th>QTDE ATUAL</th>
                          <th>QTDE SAÍDA</th>
                          <th>RESULTADO</th>
                        </tr>
                        {content}
                      </table>
                    </div>

                    <Divider style={{ marginTop: '8px' }} />

                    <div className="barcode">
                      <BarCode
                        value={item.barcode}
                        width={1.2}
                        height={40}
                        fontSize={20}
                      />
                      {console.log(item.barcode)}
                    </div>
                  </div>
                </>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default Barcode;
