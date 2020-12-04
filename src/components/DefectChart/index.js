import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import api from '../../services/api';

export default function DefectChart() {
  const [productionDefect, setProductionDefect] = useState();
  const state = useEffect(() => {
    api.get('production/defect', {}).then((response) => {
      setProductionDefect({
        series: response.data.series,
        options: {
          labels: response.data.label,
          chart: {
            type: 'donut',
            height: '150px',
          },
          responsive: [
            {
              breakpoint: 480,
              options: {
                chart: {
                  width: 200,
                  height: 200,
                },
                legend: {
                  position: 'bottom',
                },
              },
            },
          ],
        },
      });
    });
  }, []);

  return (
    <>
      {productionDefect != undefined && (
        <>
          {productionDefect.series !== undefined &&
            productionDefect.options !== undefined && (
              <>
                <h2>Defeito por linha</h2>
                <div id="chart" style={{ width: 400 }}>
                  <Chart
                    options={productionDefect.options}
                    series={productionDefect.series}
                    type="donut"
                  />
                </div>
              </>
            )}
        </>
      )}
    </>
  );
}
