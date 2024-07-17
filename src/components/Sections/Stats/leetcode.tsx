import  { useEffect, useState } from 'react';
import LeetcodeCharts from "./charts";
import { getMonth } from "date-fns";
import SubmissionGraph from "./calendar";
import { fetchData } from './api';
import Constants from '@/assets/constant';

export default function LeetCode() {
  const [submissionCalendar, setSubmissionCalendar] = useState(
    JSON.stringify({ "1700870400": 2 })
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissionData = async () => {
      try {
        const data = await fetchData(Constants.username); // Await the fetchData promise
        if (data) {
          setSubmissionCalendar(JSON.stringify(data.submissionCalendar));
          setIsLoading(false); // Set loading to false once data is fetched
        }
      } catch (error) {
        console.error('Error fetching submission calendar data:', error);
      }
    };

    fetchSubmissionData();
  }, []);

  const currentMonthIndex = getMonth(new Date());
  
  const selectedMonths = [
    (currentMonthIndex - 4 + 12) % 12,
    (currentMonthIndex - 3 + 12) % 12,
    (currentMonthIndex - 2 + 12) % 12,
    (currentMonthIndex - 1 + 12) % 12,
    currentMonthIndex,
  ];

  const selectedYear = 2024;
  const monthData = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  return (
    <div className="p-4 xs:p-0 flex xs:flex-col overflow-hidden items-center">
      <LeetcodeCharts />
      <div className={`w-full overflow-auto ${isLoading ? 'animate-pulse' : ''}`} id="subGraph">
        <SubmissionGraph
          submissionCalendar={submissionCalendar}
          selectedMonths={selectedMonths}
          selectedYear={selectedYear}
          monthData={monthData}
        />
      </div>
    </div>
  );
}
