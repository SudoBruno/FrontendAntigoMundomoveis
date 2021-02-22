import React, { useState, useEffect } from 'react';

import { useParams } from 'react-router-dom';

import api from '../../services/api';
import './style.css';
import BarCode from 'react-barcode';

function TagLayout() {
  const { id } = useParams();
  const [barCodes, setBarCodes] = useState([]);

  useEffect(() => {
    api.get(`bar-code/${id}`, {}).then((response) => {
      setBarCodes(response.data);
    });
  }, [id]);

  return (
    <>
      <div className="tags">
        {barCodes.map((barCode, index) => {
          return (
            <span>
              {typeof barCode.sector != 'string' && (
                <div className="tag">
                  <div className="titles">
                    <h2 style={{ margin: 0 }}>
                      {barCode.product.toUpperCase()}
                    </h2>
                  </div>
                  <div className="text">
                    <p>PCP: {barCode.PCP.toUpperCase()}</p>
                    <p>Volume: {barCode.volume.toUpperCase()}</p>
                  </div>
                  <>
                    {barCode.sector.map((sectorBarCode, i) => {
                      return (
                        <div className="sectorBarCode">
                          <div style={{ height: 95 }}>
                            <p className="sectorName" style={{ height: 40 }}>
                              {sectorBarCode.toUpperCase()}
                            </p>
                            <div style={{ marginLeft: 20 }}>
                              <BarCode
                                value={barCode.code[i]}
                                width={1}
                                height={28}
                                fontSize={12}
                              />
                            </div>
                            {/* <div style={{ minWidth: '190px' }}>
                              <svg
                                className="barCode"
                                id={`c${barCode.code[i]}`}
                              ></svg>
                              <p className="code">
                                {barCode.code[i].toUpperCase()}
                              </p>
                            </div> */}
                          </div>
                          <div
                            style={{
                              paddingLeft: 20,
                              fontSize: 12,
                              paddingTop: 40,
                            }}
                          >
                            ETIQUETA DO FUNCIONÁRIO
                          </div>
                        </div>
                      );
                    })}
                  </>
                </div>
              )}
              {typeof barCode.sector == 'string' && (
                <div className="tag-one">
                  <div className="titles">
                    <h2 style={{ margin: 0 }}>
                      {barCode.product.toUpperCase()}
                      {/* {barCode.color.toUpperCase()} */}
                    </h2>
                  </div>
                  <p className="text">PCP: {barCode.PCP.toUpperCase()}</p>
                  <p className="text">Volume: {barCode.volume.toUpperCase()}</p>
                  <>
                    <div className="sectorBarCode">
                      <p className="sectorName">
                        {barCode.sector.toUpperCase()}
                      </p>
                      <div style={{ marginLeft: 20 }}>
                        <BarCode
                          value={barCode.code}
                          width={1}
                          height={20}
                          fontSize={10}
                        />
                      </div>
                      {/* <div style={{ minWidth: '190px' }}>
                        <svg className="barCode" id={`c${barCode.code}`}></svg>
                        <p className="code">{barCode.code.toUpperCase()}</p>
                      </div> */}
                    </div>
                  </>
                </div>
              )}
            </span>
          );
        })}
      </div>
    </>
  );
}

export default TagLayout;
