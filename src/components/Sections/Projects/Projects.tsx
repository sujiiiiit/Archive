import React, { useState } from "react";
import { motion } from "framer-motion";

const projects = [
  {
    name: "RecipeRover",
    time: "May 2024",
    description:
      "RecipeRover is a web app that helps users discover and explore new recipes based on their dietary preferences, ingredients, and nutritional requirements. Step-by-step instructions and nutritional info included.",
    categories: ["Web"],
    tech_stack: ["React", "Node.js", "MongoDB"],
  },
  {
    name: "FitTrack",
    time: "June 2024",
    description:
      "FitTrack is a mobile fitness tracking app for setting and achieving health goals. Track activities, calories burned, and workouts. Provides personalized plans, progress tracking, and social features.",
    categories: ["Mobile"],
    tech_stack: ["Swift", "UIKit", "Firebase"],
  },
  {
    name: "HealthGuard",
    time: "June 2024",
    description:
      "HealthGuard is an AI-powered health monitoring system analyzing health metrics from wearable devices. Provides personalized insights and alerts for potential health risks.",
    categories: ["AI & ML"],
    tech_stack: ["TensorFlow", "Flask", "AWS"],
  },
  {
    name: "TravelExplorer",
    time: "June 2024",
    description:
      "TravelExplorer is a website for discovering and planning travel adventures. Browse destinations, find tips, book accommodations, and create personalized itineraries.",
    categories: ["Web"],
    tech_stack: ["React", "Node.js", "Express.js", "MongoDB"],
  },
  {
    name: "BudgetBuddy",
    time: "June 2024",
    description:
      "BudgetBuddy is a mobile app for managing finances and tracking expenses. Set budgets, categorize transactions, and visualize spending patterns.",
    categories: ["Mobile"],
    tech_stack: ["Kotlin", "Android Jetpack", "Firebase"],
  },
  {
    name: "StockPredictor",
    time: "June 2024",
    description:
      "StockPredictor is a ML model forecasting stock prices based on historical data and market trends. Analyzes company performance, economic indicators, and news sentiment.",
    categories: ["AI & ML"],
    tech_stack: ["Python", "Flask", "Google Cloud Platform"],
  },
];

const techStack = [
  {
    name: "React",
    light_color: "#80DEEA",
    dark_color: "#00838F",
  },
  {
    name: "Node.js",
    light_color: "#81C784",
    dark_color: "#388E3C",
  },
  {
    name: "MongoDB",
    light_color: "#81C784",
    dark_color: "#388E3C",
  },
  {
    name: "Swift",
    light_color: "#FFAB91",
    dark_color: "#E64A19",
  },
  {
    name: "UIKit",
    light_color: "#B3E5FC",
    dark_color: "#01579B",
  },
  {
    name: "Firebase",
    light_color: "#FFE082",
    dark_color: "#FFA000",
  },
  {
    name: "TensorFlow",
    light_color: "#FFCC80",
    dark_color: "#EF6C00",
  },
  {
    name: "Flask",
    light_color: "#C5E1A5",
    dark_color: "#33691E",
  },
  {
    name: "AWS",
    light_color: "#FFCC80",
    dark_color: "#FF9800",
  },
  {
    name: "Express.js",
    light_color: "#C5E1A5",
    dark_color: "#33691E",
  },
  {
    name: "Kotlin",
    light_color: "#80CBC4",
    dark_color: "#00796B",
  },
  {
    name: "Android Jetpack",
    light_color: "#A5D6A7",
    dark_color: "#4CAF50",
  },
  {
    name: "Python",
    light_color: "#82B1FF",
    dark_color: "#2962FF",
  },
  {
    name: "Google Cloud Platform",
    light_color: "#E57373",
    dark_color: "#D32F2F",
  },
];

interface ReadMoreProps {
  children: string;
}

const ReadMore: React.FC<ReadMoreProps> = ({ children }) => {
  const text = children;
  const [isReadMore, setIsReadMore] = useState(true);
  const [limit, setLimit] = useState(window.innerWidth >= 768 ? 200 : 80);

  const handleResize = () => {
    setLimit(window.innerWidth >= 768 ? 200 : 80);
  };

  // Update the limit when the window is resized
  React.useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };

  return (
    <div>
      <p className="text">
        {isReadMore ? text.slice(0, limit) : text}
        {text.length > limit && (
          <span
            onClick={toggleReadMore}
            className="read-or-hide text-textPrimary cursor-[url(Move.cur),_pointer]"
          >
            {isReadMore ? "....Read More" : " Show Less"}
          </span>
        )}
      </p>
    </div>
  );
};

const ProjectList: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filterProjects = (category: string) => {
    setSelectedCategory(category);
  };

  const isProjectInCategory = (projectCategories: string[]) => {
    return (
      selectedCategory === "All" || projectCategories.includes(selectedCategory)
    );
  };

  const getProjectCountForCategory = (category: string) => {
    if (category === "All") {
      return projects.length;
    }
    return projects.filter((project) => project.categories.includes(category))
      .length;
  };

  return (
    <section  className="mt-20 xs:mt-16">
      <h2 className="font-bold text-3xl">
        Here is <span className="underlineText text-textPrimary">mine.</span>
      </h2>

      {/* Filter buttons */}
      <div className=" flex text-base xs:text-sm my-6 xs:my-3 flex-row items-center justify-start xs:justify-around [perspective:1000px] relative overflow-auto sm:overflow-visible no-visible-scrollbar max-w-full w-full ">
        {["All", "Web", "Mobile", "AI & ML"].map((category) => (
          <button
            key={category}
            onClick={() => filterProjects(category)}
            className={`relative flex flex-row cursor-pointer px-3 py-1 rounded-full ${
              selectedCategory === category
                ? "text-textPrimary"
                : "text-textSecondary"
            }`}
            style={{
              transformStyle: "preserve-3d",
            }}
          >
            {selectedCategory === category && (
              <motion.div
                layoutId="clickedbutton"
                transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                className="absolute inset-0 bg-gray-200 dark:bg-zinc-800 rounded-full"
              />
            )}
            <span className="relative gap-1 flex whitespace-nowrap">
              {category} ({getProjectCountForCategory(category)})
            </span>
          </button>
        ))}
      </div>

      {/* List of projects */}
      {projects
        .filter((project) => isProjectInCategory(project.categories))
        .map((project, index) => (
          <div className="projectGroup flex mt-6 xs:mt-0" key={index}>
            <div className="period  flex mt-3 mr-3 text-sm xs:text-xs uppercase text-nowrap xs:text-wrap ">
              {project.time}
            </div>
            <div className="projectItems flex-grow">
              <div className="projectDivider after:content-[''] after:flex-grow after:h-px	after:bg-[#5b5b5b42] w-full  flex h-11 items-center"></div>
              <div className="projectHeading grid gap-2 items-center text-textPrimary text-3xl xs:text-xl">
                <div className="project font-bold underlineText w-fit mr-4">
                  {project.name}
                </div>

                <div className="prjectTechStack flex flex-wrap">
                  {project.tech_stack.map((tech, index) => (
                    <React.Fragment key={index}>
                      {index !== 0 && <span className="mx-2">&#183;</span>}
                      <code
                        className="font-GeistMono flex items-center text-base xs:text-sm"
                        style={{
                          color: techStack.find((item) => item.name === tech)
                            ?.light_color,
                        }}
                      >
                        {tech}
                      </code>
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="projectDescription font-Geist text-textSecondary text-lg xs:text-base mt-4 xs:mt-2">
                <ReadMore>{project.description}</ReadMore>
              </div>
            </div>
          </div>
        ))}
    </section>
  );
};

export default ProjectList;
