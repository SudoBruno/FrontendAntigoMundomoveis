import React, { useState, useEffect } from 'react';
// import { useHistory } from 'react-router-dom';
import GaugeChart from '../../components/index';

import api from '../../services/api';
import './style.css';
import Chart from 'react-apexcharts';
import { Row, Col } from 'antd';

import DefectChart from '../../components/DefectChart';
import ProductionDayChart from '../../components/ProductionDayChart';

const chartStyle = {
  height: 250,
  width: 400,
  margin: 0,
};

export default function Profile() {
  // let state = 0;
  const [production, setProduction] = useState([]);
  const [productionHour, setProductionHour] = useState([{}]);
  const [productionHourChart, setProductionHourChart] = useState({});

  const [totalProduction, setTotalProduction] = useState({});

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    api.get('production', {}).then((response) => {
      setProduction(response.data);
    });
  }, [userId]);

  useEffect(() => {
    api.get('production/hour', {}).then((response) => {
      setProductionHour(response.data);
    });
  }, [userId]);

  useEffect(() => {
    api.get('production/total', {}).then((response) => {
      setTotalProduction(response.data);
    });
  }, [userId]);

  useEffect(() => {
    api.get('hour', {}).then((response) => {
      if (response.data.categories.length > 0) {
        setProductionHourChart({
          options: {
            chart: {
              type: 'bar',
              height: 350,
              stacked: true,
              toolbar: {
                show: true,
              },
              zoom: {
                enabled: true,
              },
            },
            responsive: [
              {
                breakpoint: 480,
                options: {
                  legend: {
                    position: 'bottom',
                    offsetX: -10,
                    offsetY: 0,
                  },
                },
              },
            ],
            plotOptions: {
              bar: {
                horizontal: false,
              },
            },
            xaxis: {
              type: 'time',
              categories: response.data.categories,
            },
            legend: {
              position: 'right',
              offsetY: 40,
            },
            fill: {
              opacity: 1,
            },
          },
        });
      }
    });
  }, [userId]);

  return (
    <div className="profile-container">
      <ProductionDayChart />
      <ul>
        <li className="charts">
          {productionHour.production !== undefined &&
            productionHourChart.options !== undefined && (
              <>
                <h2>Produção por hora </h2>
                <Chart
                  options={productionHourChart.options}
                  series={productionHour.production}
                  type="bar"
                  height={200}
                />
              </>
            )}
        </li>

        <li span={12} className="charts">
          <DefectChart />
        </li>
      </ul>
      <ul className="totalProduction">
        <li>
          <p>Produção Total:</p>
          <h2>{totalProduction.total}</h2>
        </li>
      </ul>
      <ul>
        {production.map((productionLine) => (
          <>
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
            <li>
              <GaugeChart
                style={chartStyle}
                id={'gauge-chart2' + productionLine.id}
                nrOfLevels={0}
                arcsLength={[0.3, 0.5, 0.2]}
                colors={['#EA4228', '#F5CD19', '#5BE12C']}
                percent={productionLine.previsionPercent}
                hideText
                arcWidth={0.1}
                marginInPercent={0.15}
                arcPadding={0.0}
              />
              <p className="LineName">
                {productionLine.linha} projeção: {productionLine.prevision}
              </p>
            </li>
          </>
        ))}
      </ul>
    </div>
  );
}
