import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { clearFilters } from "../../../store/slices/filterSlice"; // chỉnh lại path nếu khác

const QuestionTab = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = {
    home: { path: "/answer", name: "Danh sách câu hỏi " },
    following: { path: "/answer/requests", name: "Các câu trả lời" },
  };

  const handleNavigate = (path: string) => {
    if (location.pathname === path) return; // tránh clear nếu đang ở đúng path
    dispatch(clearFilters());
    navigate(path);
  };

  return (
    <div className="w-3/4 mr-6 mt-4">
      <div className="font-semibold border-b border-content4 w-full pb-2 pl-3">
        Các câu hỏi
      </div>
      <div className="flex flex-col w-full mt-2 gap-y-2">
        {Object.values(navItems).map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.name}
              onClick={() => handleNavigate(item.path)}
              className={`flex items-center text-left w-full ${
                isActive
                  ? "bg-red-500/15 text-red-600 px-4 py-1 text-sm font-medium rounded-sm"
                  : "px-4 py-1 text-sm"
              }`}
            >
              {item.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionTab;
