import { cn } from "@/utils/cn";
import GridPattern from "@/components/ui/GridPattern";
import Header from "@/components/Header/Header";
import Intro from "@/components/Sections/Intro/Intro";
import TechStack from "@/components/Sections/TechStack/techStack";

const App = () => {
  return (
    <>
      <GridPattern
        width={40}
        height={40}
        x={-1}
        y={-1}
        strokeDasharray={5}
        className={cn(
          "[mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)] "
        )}
      />
      <Header />
      <div className="innerbody mx-auto max-w-5xl min-w-64 px-4 text-textSecondary">
        <div className="m-10 my-0 xs:m-0">
        <Intro />
<TechStack/>
        </div>
      </div>
    </>
  );
};

export default App;
