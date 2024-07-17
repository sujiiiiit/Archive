import { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { fetchData, transformLeetCodeData, TransformedData } from "./api";
// anotherFile.js
import Constants from '@/assets/constant';

console.log(Constants.username); // Outputs: sujiiit

const SemiDoughnutChart = () => {
  const initialData: TransformedData[] = [
    { label: "Easy", solved: 794, total: 794 },
    { label: "Medium", solved: 1655, total: 1655 },
    { label: "Hard", solved: 702, total: 702 },
  ];
  const [data, setData] = useState<TransformedData[]>(initialData);

  useEffect(() => {
    const fetchDataAndTransform = async () => {
      try {
        const fetchedData = await fetchData(Constants.username);
        if (fetchedData) {
          const transformedData = transformLeetCodeData(fetchedData);
          setData(transformedData);
        }
      } catch (error) {
        console.error("Error fetching and transforming data:", error);
      }
    };

    fetchDataAndTransform();
  }, []);

  const solvedProblems = data.reduce((sum, item) => sum + item.solved, 0);
  const totalProblems = data.reduce((sum, item) => sum + item.total, 0);

  const opacityBackgroundColor = [
    "rgba(28, 186, 186, 0.4)",
    "rgba(255, 206, 86, 0.4)",
    "rgba(255, 99, 132, 0.4)",
  ];

  const backgroundColor = [
    "rgb(28, 186, 186)",
    "rgb(255, 206, 86)",
    "rgb(255, 99, 132)",
  ];

  const options = {
    chart: {
      type: "pie",
      backgroundColor: "transparent",
      spacing: [0, 0, 0, 0],
      width: 190,
      height: 190,
    },
    title: {
      text: "",
    },
    credits: {
      enabled: false,
    },
    tooltip: {
      enabled: false,
    },
    plotOptions: {
      pie: {
        innerSize: "90%",
        startAngle: -135,
        endAngle: 135,
        borderWidth: 0,
        borderColor: "transparent",
        borderRadius: 10,
        center: ["50%", "50%"],
        dataLabels: {
          enabled: false,
        },
        point: {
          events: {
            mouseOver: function () {},
            mouseOut: function () {},
          },
        },
        states: {
          hover: {
            enabled: true,
            halo: null,
            brightness: 0,
          },
        },
      },
    },
    series: [
      {
        name: "Solved vs Unsolved",
        data: data.flatMap((item, index) => [
          {
            name: `${item.label} Solved`,
            y: item.solved,
            color: backgroundColor[index],
            borderColor: "transparent",
          },
          {
            name: `${item.label} Unsolved`,
            y: item.total - item.solved,
            color: opacityBackgroundColor[index],
            borderColor: "transparent",
          },
        ]),
        size: "100%",
        innerSize: "90%",
        showInLegend: false,
      },
    ],
  };

  return (
    <div className="xs:w-full flex  xs:justify-between w-fit gap-3  rounded-lg font-Geist">
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "190px",
          height: "100%",
          maxHeight: "190px",
        }}
      >
        <div className="center-items absolute top-[50%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-textSecondary">
          <div className="flex flex-nowrap items-baseline ">
            <span className="text-2xl text-nowrap text-textPrimary">
              {solvedProblems}
            </span>
            <span>/{totalProblems}</span>
          </div>
          <div className="flex justify-center items-center gap-[2px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              fill="green"
              viewBox="0 0 256 256"
            >
              <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path>
            </svg>
            <span>Solved</span>
          </div>
        </div>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
      <div className="text-xs flex flex-col gap-3 items-center justify-center">
        {data.map((item, index) => (
          <div
            className={`w-full flex gap-1 text-center flex-col cursor-pointer  px-5 py-1 rounded `}
            key={index}
          >
            <div
              className="flex flex-nowrap gap-1 items-center justify-center"
              style={{ color: backgroundColor[index] }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: backgroundColor[index] }}
              ></span>
              <span>{item.label}</span>
            </div>
            <span className="text-textPrimary text-nowrap">
              {item.solved} / {item.total}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SemiDoughnutChart;
