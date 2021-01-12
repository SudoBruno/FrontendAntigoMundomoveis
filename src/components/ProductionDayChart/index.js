import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import api from '../../services/api';

export default function ProductionDayChart() {
  const [productionDay, setProductionDay] = useState();
  const [productionDayTotal, setProductionDayTotal] = useState();
  useEffect(() => {
    api.get('production/day', {}).then((response) => {
      const totalProduction = response.data.days;

      setProductionDay({
        series: [response.data.totalProduction],
        options: {
          chart: {
            height: 350,
            type: 'bar',
          },
          plotOptions: {
            bar: {
              dataLabels: {
                position: 'top', // top, center, bottom
              },
            },
          },
          dataLabels: {
            enabled: true,

            offsetY: -20,
            style: {
              fontSize: '12px',
              colors: ['#304758'],
            },
          },

          xaxis: {
            categories: response.data.days,
            position: 'top',
            axisBorder: {
              show: false,
            },
            axisTicks: {
              show: false,
            },
            crosshairs: {
              fill: {
                type: 'gradient',
                gradient: {
                  colorFrom: '#D8E3F0',
                  colorTo: '#BED1E6',
                  stops: [0, 100],
                  opacityFrom: 0.4,
                  opacityTo: 0.5,
                },
              },
            },
            tooltip: {
              enabled: true,
            },
          },
          yaxis: {
            axisBorder: {
              show: false,
            },
            axisTicks: {
              show: false,
            },
            labels: {
              show: false,
            },
          },
        },
      });

      setProductionDayTotal(response.data.total);
    });
  }, []);
  return (
    <>
      {productionDay != undefined && (
        <li className="charts" style={{ marginBottom: 14 }}>
          <h2>Produção por Dia </h2>
          <h3>Total: {productionDayTotal}</h3>

          <Chart
            options={productionDay.options}
            series={productionDay.series}
            type="bar"
            height={200}
          />
        </li>
      )}
    </>
  );
}
