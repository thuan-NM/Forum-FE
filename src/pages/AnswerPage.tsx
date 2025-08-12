import CompactFilter from "../components/Common/Filter/CompactFilter";
import QuestionTab from "../components/Question/QuestionTab/QuestionTab";
import TopicTab from "../components/Topic/TopicTab";
import AnswerLayout from "../layouts/AnswerLayout";
import { Outlet, useLocation } from "react-router-dom";

const AnswerPage = () => {
  const { pathname } = useLocation();
 

  const isRequestsPage = pathname.startsWith("/answer/requests");
  const isAnswerRoot = pathname === "/answer";

  return (
    <AnswerLayout>
      <div className="flex flex-row mt-6 relative">
        <div className="basis-1/4 max-w-[25%] flex flex-col items-end justify-end sticky top-[60px] h-fit">
          <QuestionTab />
          <CompactFilter
            {...(isRequestsPage ? { tag: true } : {})}
            {...(isAnswerRoot ? { topic: true } : {})}
            sort
            search
            className="!max-w-full w-3/4 h-fit mr-6 mt-3"
            listClassName="max-h-[200px] w-full overflow-x-hidden "
          />
        </div>
        <div className="basis-2/5">
          <Outlet />
        </div>
        <div className="w-full !max-w-xs flex flex-col justify-start sticky top-[60px] h-fit">
          <TopicTab />
        </div>
      </div>
    </AnswerLayout>
  );
};

export default AnswerPage;
