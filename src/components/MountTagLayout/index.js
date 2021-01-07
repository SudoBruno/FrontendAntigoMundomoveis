import React, { useState, useEffect } from 'react';

import { useParams } from 'react-router-dom';

import api from '../../services/api';
import './style.css';
import BarCode from 'react-barcode';

function TagLayout() {
  const { id } = useParams();
  const [barCode, setBarCode] = useState({
    productName: '',
    subProductName: '',
    id: 0,
    pcp: '',
    amount: 0,
    sectorName: '',
    sectorId: 0,
    nextSectorName: '',
    nextSectorId: '',
  });

  useEffect(() => {
    api.get(`plating/mount/tag/${id}`, {}).then((response) => {
      setBarCode(response.data);
      console.log(response.data);
    });
  }, [id]);

  return (
    <>
      <div class="tags">
        {console.log(barCode)}
        <span>
          <div className="mountTitles">
            <h2>
              Produto: {''} {barCode.productName.toUpperCase()}
            </h2>
            <h2>
              Sub-Produto: {''}
              {barCode.subProductName.toUpperCase()}
            </h2>
          </div>
          <div className="text">
            <p>
              PCP:
              {barCode.pcp.toUpperCase()}
            </p>
            <p>
              Quantidade:
              {barCode.amount}
            </p>
          </div>

          <div className="mountSectorBarCode">
            <p className="mountSectorName">
              Setor Anterior:<b> {barCode.sectorName.toUpperCase()}</b>
            </p>
            <p className="mountSectorName">
              Proximo setor: <b>{barCode.nextSectorName.toUpperCase()}</b>
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
              value={`${barCode.id}`}
              width={1}
              height={28}
              fontSize={12}
              className="barCode"
            />
          </div>
        </span>
      </div>
    </>
  );
}

export default TagLayout;
