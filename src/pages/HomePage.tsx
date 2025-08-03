import CompactFilter from "../components/Common/Filter/CompactFilter";
import HomeReel from "../components/Home/HomeReel";
import TopicTab from "../components/Topic/TopicTab";
import HomeLayout from "../layouts/HomeLayout";

const HomePage = () => {
  return (
    <HomeLayout>
      <div className="flex md:flex-row flex-col-reverse mt-5 gap-x-2 relative px-4">
        <div className=" md:basis-1/4 flex justify-end min-h-[60vh] h-fit w-full sticky top-[60px]">
          <div className="w-full md:!max-w-xs mx-auto -mt-4 mr-0">
            <TopicTab className="ml-0" />
          </div>
        </div>
        <div className="w-full md:basis-2/5 md:max-w-[40%] relative">
          <HomeReel />
        </div>
        <CompactFilter
          tag
          sort
          search
          className="!max-w-full md:!basis-1/4 md:max-w-[30%] w-full h-fit"
        />
      </div>
    </HomeLayout>
  );
};

export default HomePage;
