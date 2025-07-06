import QuestionTab from "../components/Question/QuestionTab/QuestionTab";
import TopicTab from "../components/Topic/TopicTab";
import AnswerLayout from "../layouts/AnswerLayout";
import { Outlet } from "react-router-dom";

const AnswerPage = () => {
  return (
    <AnswerLayout>
      <div className="flex flex-row mt-6">
        <div className="basis-1/4 flex justify-end">
          <QuestionTab />
        </div>
        <div className="basis-2/5">
          <Outlet />
        </div>
        <div className="w-full !max-w-xs flex justify-start">
          <TopicTab />
        </div>
      </div>
    </AnswerLayout>
  );
};

export default AnswerPage;
