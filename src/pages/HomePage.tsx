import HomeReel from "../components/Home/HomeReel";
import HomeLayout from "../layouts/HomeLayout";
import TopicTab from "../components/PostManage/Question/Topic/TopicTab";

const HomePage = () => {
  return (
    <HomeLayout>
      <div className="flex flex-row mt-5 ">
        <div className="basis-1/4 flex justify-end h-[60vh] ">
          <div className="w-3/4 mx-auto -mt-4">
            <TopicTab />
          </div>
        </div>
        <div className="basis-2/5">
          <HomeReel />
        </div>
      </div>
    </HomeLayout>
  );
};

export default HomePage;
