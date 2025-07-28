import { Button } from "@heroui/react";
import { BsMailbox } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

const AnswerRequestsNotThings = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex justify-center flex-col my-10 gap-y-1 mt-20 w-11/12 mx-auto">
        <BsMailbox className="w-24 h-24 text-content4 mx-auto" />
        <div className="mx-auto font-bold text-lg text-content4">
          Yêu cầu trả lời
        </div>
        <div className="mx-auto text-md text-light text-center opacity-50">
          Yêu cầu người khác trả lời bằng cách nhấn Yêu cầu trả lời trên câu
          hỏi. Những yêu cầu bạn nhận được sẽ hiển thị tại đây.
        </div>
        <Button
          color="primary"
          radius="full"
          className="w-fit mx-auto mt-4 font-semibold"
          onClick={() => navigate("/answer")}
        >
          Xem các câu hỏi nổi bật
        </Button>
      </div>
    </div>
  );
};

export default AnswerRequestsNotThings;
