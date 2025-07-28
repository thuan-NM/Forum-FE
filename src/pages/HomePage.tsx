import HomeReel from "../components/Home/HomeReel";
import TopicTab from "../components/Topic/TopicTab";
import HomeLayout from "../layouts/HomeLayout";

const HomePage = () => {
  return (
    <HomeLayout>
      <div className="flex md:flex-row flex-col-reverse mt-5 gap-x-2 relative px-4">
        <div className=" md:basis-1/4 flex justify-end min-h-[60vh] h-fit w-full">
          <div className="w-full md:!max-w-xs mx-auto -mt-4 ">
            <TopicTab className="ml-0" />
          </div>
        </div>
        <div className="md:basis-2/5 relative ">
          <HomeReel />
        </div>
      </div>
    </HomeLayout>
  );
};

export default HomePage;
