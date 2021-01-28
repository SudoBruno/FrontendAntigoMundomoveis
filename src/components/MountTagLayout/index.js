import React, { useState, useEffect } from 'react';

import { useParams } from 'react-router-dom';

import api from '../../services/api';
import './style.css';
import BarCode from 'react-barcode';

function TagLayout() {
  const { barCode, sectorId, mountId } = useParams();

  const [barCodes, setBarCodes] = useState([
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
    api
      .get(`plating/mount/tag/${barCode}/sector/${sectorId}`, {})
      .then((response) => {
        if (response.data != '') {
          setBarCodes([response.data]);
        }
      });
  }, [barCode]);
  useEffect(() => {
    api.get(`plating/mount/tag/${mountId}`, {}).then((response) => {
      if (response.data.length > 0) {
        setBarCodes(response.data);
      }
    });
  }, [barCode]);

  return (
    <>
      <div className="amountTag">
        {barCodes.map((item) => {
          return (
            <>
              <span>
                <div className="mountTitles">
                  <h2>Produto: {item.productName.toUpperCase()}</h2>
                  <h2>
                    Sub-Produto:
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
                <div className="text">
                  <b style={{ fontSize: 16 }}>Quantidade:_________</b>
                  <b style={{ fontSize: 16 }}>Quantidade:_________</b>
                  <b style={{ fontSize: 16 }}>Quantidade:_________</b>
                  <b style={{ fontSize: 16 }}>Quantidade:_________</b>
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
            </>
          );
        })}
      </div>
    </>
  );
}

export default TagLayout;
