import React, { useState, useEffect } from 'react';
// import { useHistory } from 'react-router-dom';
import GaugeChart from '../../components/index';

import api from '../../services/api';
import './style.css';

const chartStyle = {
  height: 250,
  width: 400,
  margin: 0,
};

export default function Profile() {
  const [production, setProduction] = useState([]);

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    api.get('production', {}).then((response) => {
      setProduction(response.data);
    });
  }, [userId]);

  return (
    <div className="profile-container">
      <ul>
        {production.map((productionLine) => (
          <li key={productionLine.id}>
            <GaugeChart
              style={chartStyle}
              id={'gauge-chart' + productionLine.id}
              nrOfLevels={0}
              arcsLength={[0.3, 0.5, 0.2]}
              colors={['#EA4228', '#F5CD19', '#5BE12C']}
              percent={productionLine.percent}
              hideText
              arcWidth={0.1}
              marginInPercent={0.15}
              arcPadding={0.0}
            />
            <p className="LineName">
              {productionLine.linha}: {productionLine.total}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
