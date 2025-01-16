import ReactApexChart from 'react-apexcharts';
import { useState, useEffect } from 'react';
import { firestore } from "../../config/firebase-config";
import { collection, query, onSnapshot } from "firebase/firestore";

const PieChart = () => {
  const [fundClusters, setFundClusters] = useState({});
  const [selectedYear, setSelectedYear] = useState("");

  const [pieOptions, setPieOptions] = useState({
    series: [],
    options: {
      chart: {
        type: 'pie',
      },
      labels: [],
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    },
  });

  useEffect(() => {
    const q = query(collection(firestore, 'NumberOfRecords'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fundClustersCount = snapshot.docs.reduce((acc, doc) => {
        acc[doc.id] = { ...doc.data() };
        return acc;
      }, {});

      setFundClusters(fundClustersCount);
      const firstYear = Object.keys(fundClustersCount)[0];
      setSelectedYear(firstYear);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (selectedYear && fundClusters[selectedYear]) {
      const data = fundClusters[selectedYear];

      setPieOptions({
        series: Object.values(data),
        options: {
          chart: {
            type: 'pie',
          },
          labels: Object.keys(data),
          responsive: [
            {
              breakpoint: 480,
              options: {
                legend: {
                  position: 'right',
                },
              },
            },
          ],
        },
      });
    }
  }, [selectedYear, fundClusters]);

  return (
    <div className="h-full">
      <select
        value={selectedYear}
        onChange={(e) => setSelectedYear(e.target.value)}
      >
        {Object.keys(fundClusters).map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>

      <ReactApexChart
        options={pieOptions.options}
        series={pieOptions.series}
        type="pie"
        height="100%"
        width="100%"
      />
    </div>
  );
};

export default PieChart;
