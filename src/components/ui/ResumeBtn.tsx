import { cn } from "@/utils/cn";
// import TextShimmer from "@ui/animatedTxt";
import { CSSProperties, FC, ReactNode } from "react";

interface AnimatedShinyTextProps {
  children: ReactNode;
  className?: string;
  shimmerWidth?: number;
}

const AnimatedShinyText: FC<AnimatedShinyTextProps> = ({
  children,
  className,
  shimmerWidth = 100,
}) => {
  return (
    <p
      style={
        {
          "--shimmer-width": `${shimmerWidth}px`,
        } as CSSProperties
      }
      className={cn(
        "mx-auto max-w-md text-neutral-600/50 dark:text-neutral-400/50 ",

        // Shimmer effect
        "animate-shimmer bg-clip-text bg-no-repeat [background-position:0_0] [background-size:var(--shimmer-width)_100%] [transition:background-position_1s_cubic-bezier(.6,.6,0,1)_infinite]",

        // Shimmer gradient
        "bg-gradient-to-r from-transparent via-black/80 via-50% to-transparent  dark:via-white/80",

        className
      )}
    >
      {children}
    </p>
  );
};

export default function TextShimmerDemo() {
  return (
    <div className="z-10 flex p-8 xs:p-4	 items-center justify-center">
      <div
        className={cn(
          "group rounded-full border border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800"
        )}
      >
        <AnimatedShinyText className=" relative rounded-full inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
          <span className="flex items-center	gap-2 ">
            <span>
              ✨ <span className="xs:hidden	">Get to know my capabilities, </span>See My Resume!</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              id="Left-Arrow--Streamline-Guidance---Free"
              height={24}
              width={24}
              className="stroke-black	 dark:stroke-white transition-transform duration-300 ease-in-out group-hover:translate-x-0.5"
            >
              <desc>
                {"Left Arrow Streamline Icon: https://streamlinehq.com"}
              </desc>
              <path
              
                stroke="inherit"
                d="M15.7632 5.4144C15.7632 6.1125 16.4528 7.1549 17.1509 8.0298C18.0484 9.1588 19.1209 10.1438 20.3505 10.8955C21.2725 11.459 22.3902 12 23.2896 12M23.2896 12C22.3902 12 21.2716 12.541 20.3505 13.1045C19.1209 13.8571 18.0484 14.8422 17.1509 15.9692C16.4528 16.8451 15.7632 17.8894 15.7632 18.5856M23.2896 12H0.7104"
                strokeWidth={1}
              />
            </svg>
          </span>
        </AnimatedShinyText>
      </div>
    </div>
  );
}

