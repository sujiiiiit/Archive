
interface TotalSubmission {
    difficulty: string;
    count: number;
    submissions: number;
  }
  
  interface RecentSubmission {
    title: string;
    titleSlug: string;
    timestamp: string;
    statusDisplay: string;
    lang: string;
  }
  
  interface MatchedUserStats {
    acSubmissionNum: TotalSubmission[];
    totalSubmissionNum: TotalSubmission[];
  }
  
  interface LeetCodeStats {
    totalSolved: number;
    totalSubmissions: TotalSubmission[];
    totalQuestions: number;
    easySolved: number;
    totalEasy: number;
    mediumSolved: number;
    totalMedium: number;
    hardSolved: number;
    totalHard: number;
    ranking: number;
    contributionPoint: number;
    reputation: number;
    submissionCalendar: { [key: string]: number };
    recentSubmissions: RecentSubmission[];
    matchedUserStats: MatchedUserStats;
  }
  
  export interface TransformedData {
    label: string;
    solved: number;
    total: number;
  }
  
  export const fetchData = async (username:string) => {
    try {
      const response = await fetch(`https://leetcode-api-faisalshohag.vercel.app/${username}`);
      const data: LeetCodeStats = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  };
  
  export const transformLeetCodeData = (stats: LeetCodeStats): TransformedData[] => {
    if (!stats) return [];
    const transformedData: TransformedData[] = [
      { label: "Easy", solved: stats.easySolved, total: stats.totalEasy },
      { label: "Medium", solved: stats.mediumSolved, total: stats.totalMedium },
      { label: "Hard", solved: stats.hardSolved, total: stats.totalHard },
    ];
    return transformedData;
  };
  
  export const transformCalendarData = (submissionCalendar: string): { [key: string]: number } => {
    if (!submissionCalendar) return {};
    const initialSubmissionData = JSON.parse(submissionCalendar);
    const counts: { [key: string]: number } = {};
    for (const [timestamp, count] of Object.entries(initialSubmissionData)) {
      const date = new Date(Number(timestamp) * 1000);
      const dateString = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
      counts[dateString] = count as number;
    }
    return counts;
  };
  