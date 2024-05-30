import ResumeBtn from "@/components/ui/ResumeBtn";

const Intro = () => {
  return (
    <>
      <section>
        <ResumeBtn />

        <div className=" relative  	text-6xl mt-8 xs:mt-4	xs:text-4xl">
          <div className="flex relative items-start">
            <svg
              className="w-[82px]"
              height="30"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 23.102C7.79 23.102 28.248 2.129 19.499 2c-8.75-.128-7.85 25.862-7.85 25.862s.387-12.223 7.464-12.223c7.076 0-1.158 11.966 5.018 12.352 6.175.386 15.053-11.709 8.62-11.966-6.433-.257-6.305 11.323 2.316 11.709 8.62.386 18.528-24.318 10.937-24.833-7.592-.515-6.176 24.19 1.544 24.704 7.72.515 18.914-24.447 11.065-24.833-7.849-.386-6.948 24.704 1.158 24.833 5.147-.257 3.474-12.095 10.165-11.837 3.73.257 5.275 3.088 5.146 2.959-.129-.129 1.158 8.75-5.661 8.75-6.82 0-6.047-11.967.515-11.71 5.918.515 5.146 5.662 5.275 4.247 0 .128 4.246-1.287 4.89-4.118"
                className="stroke-[var(--text-secondary)]"
                strokeWidth="2.75"
                fill="none"
                fillRule="evenodd"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
            <span className="font-bold inline text-3xl	">
              ,I'm
            </span>
          </div>
          <span className="font-bold underlineMain absolute z-[1] text-textPrimary">
            <mark className="text-textPrimary">Sujit Dwivedi</mark>
          </span>
          <p className="text-xl	mt-20 	xs:text-lg	">
            I'm a{" "}<span className="text-textPrimary underlineText">B.Tech</span>
            {" "}student passionate about{" "}
            <span className="text-textPrimary underlineText">
              website and app development
            </span>
            , as well as{" "}
            <span className="text-textPrimary underlineText">AI and ML</span>
            {" "}projects. I enjoy exploring cutting-edge technologies and bringing
            innovative ideas to life through coding.
          </p>
          <p className="mt-5 text-xl		xs:text-lg	">
            I've explored{" "}
            <span className="text-textPrimary underlineText">
              C, C++, Java, and Python
            </span>
            , but my problem-solving prowess
            <span className="text-textPrimary">{" "}shines</span> brightest in{" "}
            <span className="text-[#F7DF1E] underlineText">JavaScript</span>.
            Its dynamic capabilities fuel my
            <span className="text-textPrimary">
            {" "}creativity and effectiveness{" "}
            </span>
            in finding solutions, making it my preferred language for
            development tasks.
          </p>
        </div>
      </section>
    </>
  );
};
export default Intro;
