import React, { useState } from "react";
import { motion } from "framer-motion";
import WebIcon from "@/assets/web";
import GithubIcon from "@/assets/github";
import { link } from "fs";

const projects = [
  {
    name: "Identify",
    time: "May 2023",
    description:
      "QR-Based Verification System: A project that generates and sends bulk certificates. Each certificate includes a QR code for easy verification. Ideal for ensuring authenticity and efficiency in certificate distribution.",
    categories: ["Web"],
    tech_stack: ["php", "Mysql"],
    link: "https://sujitstream.000webhostapp.com/",
    githubLink: "https://github.com/sujiiiiit/qr_based_verfication_system",
  },
  {
    name: "Gemini App",
    time: "April 2024",
    description:
      "AI Chat App: A React Native application using Google Gemini for AI-powered chatting. It offers intelligent, real-time conversations with advanced language understanding. Designed for smooth and engaging user interactions.",
    categories: ["Mobile","AI & ML"],
    tech_stack: ["React Native", "Google Gemini"],
    githubLink: "https://github.com/sujiiiiit/qr_based_verfication_system",
  },
  {
    name: "Archive",
    time: "May 2024",
    description:
      "My Portfolio: Welcome to my personal portfolio! Explore my coding and design projects, showcasing my skills and creativity. Enjoy browsing through my work and get to know my professional journey.",
    categories: ["Web"],
    tech_stack: ["React", "Node.js","Tailwind CSS"],
    link: "https://sujiiit.vercel.app/",
    githubLink: "https://github.com/sujiiiiit/qr_based_verfication_system",
  },
  {
    name: "DramaTube",
    time: "June 2024",
    description:
      "A website project designed to stream movies and drama videos in a YouTube-like interface. Enjoy a seamless browsing experience with easy navigation, personalized recommendations, and high-quality streaming. Your favorite films and series are just a click away!",
    categories: ["Web"],
    tech_stack: ["React", "Node.js","Cloudflare Workers","Tailwind CSS"],
    link: "https://youtube-7ax.pages.dev/",
    githubLink: "https://github.com/sujiiiiit/youtube",
  },
];

const techStack = [
  {
    name: "React",
    light_color: "#80DEEA",
    dark_color: "#00838F",
  },
  {
    name: "Tailwind CSS",
    light_color: "#06B6D4",
    dark_color: "#06B6D4",
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
    name: "Mysql",
    light_color: "#4479A1",
    dark_color: "#4479A1",
  },
  {
    name: "Google Cloud Platform",
    light_color: "#E57373",
    dark_color: "#D32F2F",
  },
  {
    name: "Cloudflare Workers",
    light_color: "#FF6633",
    dark_color: "#F8902A",
  },
  {
    name: "php",
    light_color: "#777BB4",
    dark_color: "#777BB4",
  },
  {
    name: "Google Gemini",
    light_color: "#8E75B2",
    dark_color: "#8E75B2",
  },
  {
    name: "React Native",
    light_color: "#61DAFB",
    dark_color: "#61DAFB",
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
            className="read-or-hide text-textPrimary cursor-pointer"
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
    <section className="mt-20 xs:mt-16">
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
                <div className="project flex justify-between items-center">
                  <span className="font-bold underlineText w-fit mr-4">
                    {project.name}
                  </span>
                  <span className="flex justify-center items-center gap-4 xs:gap-3">
                    {project.link && (
                    <a href={project.link} target="_blank">
                      <WebIcon className="fill-textSecondary hover:fill-textPrimary cursor-pointer w-7 h-7 xs:w-6 xs:h-6" />
                    </a>
                    )}
                    {project.githubLink && (
                    <a href={project.githubLink} target="_blank">
                      <GithubIcon className="fill-textSecondary hover:fill-textPrimary cursor-pointer w-7 h-7 xs:w-6 xs:h-6" />
                    </a>
                    )}
                  </span>
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
