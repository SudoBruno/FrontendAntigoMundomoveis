import React, { useState, useEffect } from 'react';

import { useParams } from 'react-router-dom';

import api from '../../services/api';
import './style.css';
import BarCode from 'react-barcode';

function TagLayout() {
  const { id } = useParams();

  const [barCode, setBarCode] = useState([
    {
      productName: '',
      subProductName: '',
      id: 0,
      pcp: '',
      amount: 0,
      sectorName: '',
      sectorId: 0,
      nextSectorName: '',
      nextSectorId: '',
    },
  ]);

  useEffect(() => {
    api.get(`plating/mount/tag/${id}`, {}).then((response) => {
      console.log(response.data);
      if (response.data != '') {
        setBarCode([response.data]);
      }
    });
  }, [id]);
  useEffect(() => {
    api.get(`plating/all/mounts/tags/${id}`, {}).then((response) => {
      if (response.data.length > 0) {
        setBarCode(response.data);
      }
    });
  }, [id]);

  return (
    <>
      <div class="amountTag">
        {barCode.map((item) => {
          return (
            <span>
              <div className="mountTitles">
                <h2>
                  Produto: {''} {item.productName.toUpperCase()}
                </h2>
                <h2>
                  Sub-Produto: {''}
                  {item.subProductName.toUpperCase()}
                </h2>
              </div>
              <div className="text">
                <p>
                  PCP:
                  {item.pcp.toUpperCase()}
                </p>
                <p>
                  Quantidade:
                  {item.amount}
                </p>
              </div>

              <div className="mountSectorBarCode">
                <p className="mountSectorName">
                  Setor Anterior:<b> {item.sectorName.toUpperCase()}</b>
                </p>
                <p className="mountSectorName">
                  Proximo setor: <b>{item.nextSectorName.toUpperCase()}</b>
                </p>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <BarCode
                  value={`${item.barCode}`}
                  width={1}
                  height={28}
                  fontSize={12}
                  className="barCode"
                />
              </div>
            </span>
          );
        })}
      </div>
    </>
  );
}

export default TagLayout;
