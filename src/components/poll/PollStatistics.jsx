import React, { useState, useEffect } from "react";

const PollStatistics = () => {
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Sample data for different question types
  const questionData = {
    1: {
      title: "Bạn có giới thiệu cho bạn bè không?",
      type: "single",
      options: [
        {
          name: "Chắc chắn có",
          percentage: 65.9,
          votes: 189,
          color: "bg-red-500",
        },
        { name: "Có thể", percentage: 23.3, votes: 67, color: "bg-yellow-400" },
        {
          name: "Không chắc",
          percentage: 7.3,
          votes: 21,
          color: "bg-blue-500",
        },
        { name: "Không", percentage: 3.5, votes: 10, color: "bg-purple-500" },
      ],
    },
    2: {
      title: "Mức độ hài lòng tổng thể?",
      type: "single",
      options: [
        {
          name: "Rất hài lòng",
          percentage: 49.5,
          votes: 142,
          color: "bg-red-500",
        },
        {
          name: "Hài lòng",
          percentage: 34.1,
          votes: 98,
          color: "bg-yellow-400",
        },
        {
          name: "Trung bình",
          percentage: 11.1,
          votes: 32,
          color: "bg-blue-500",
        },
        { name: "Kém", percentage: 5.2, votes: 15, color: "bg-purple-500" },
      ],
    },
    3: {
      title: "Đánh giá chất lượng diễn giả?",
      type: "rating",
      score: 4.3,
      maxScore: 5,
      responses: 287,
    },
    4: {
      title: "Thời gian tổ chức phù hợp?",
      type: "yesno",
      yes: { percentage: 78.4, votes: 225 },
      no: { percentage: 21.6, votes: 62 },
    },
    5: {
      title: "Sẽ tham gia sự kiện tương tự?",
      type: "yesno",
      yes: { percentage: 84.3, votes: 242 },
      no: { percentage: 15.7, votes: 45 },
    },
    6: {
      title: "Chủ đề nào bạn quan tâm nhất?",
      type: "multiple",
      options: [
        { name: "Công nghệ AI", count: 156 },
        { name: "Blockchain", count: 89 },
        { name: "IoT", count: 134 },
        { name: "Cloud Computing", count: 98 },
        { name: "Cybersecurity", count: 167 },
      ],
    },
  };

  const questions = [
    {
      id: 1,
      title: "Bạn có giới thiệu cho bạn bè không?",
      meta: "Lựa chọn đơn • 287 phản hồi",
    },
    {
      id: 2,
      title: "Mức độ hài lòng tổng thể?",
      meta: "Lựa chọn đơn • 287 phản hồi",
    },
    {
      id: 3,
      title: "Đánh giá chất lượng diễn giả?",
      meta: "Thang điểm • 287 phản hồi",
    },
    {
      id: 4,
      title: "Thời gian tổ chức phù hợp?",
      meta: "Có/Không • 287 phản hồi",
    },
    {
      id: 5,
      title: "Sẽ tham gia sự kiện tương tự?",
      meta: "Có/Không • 287 phản hồi",
    },
    {
      id: 6,
      title: "Chủ đề nào bạn quan tâm nhất?",
      meta: "Đa lựa chọn • 287 phản hồi",
    },
  ];

  const participants = [
    {
      name: "Nguyễn Văn An",
      email: "an.nguyen@email.com",
      votes: 5,
      avatar: "AN",
    },
    {
      name: "Trần Thị Bình",
      email: "binh.tran@email.com",
      votes: 4,
      avatar: "BH",
    },
    {
      name: "Lê Hoàng Cường",
      email: "cuong.le@email.com",
      votes: 5,
      avatar: "CL",
    },
    {
      name: "Phạm Thị Diệu",
      email: "dieu.pham@email.com",
      votes: 3,
      avatar: "DN",
    },
    {
      name: "Võ Minh Tuấn",
      email: "tuan.vo@email.com",
      votes: 5,
      avatar: "ET",
    },
    { name: "Đỗ Thị Lan", email: "lan.do@email.com", votes: 2, avatar: "FL" },
    {
      name: "Nguyễn Thanh Hải",
      email: "hai.nguyen@email.com",
      votes: 4,
      avatar: "GH",
    },
  ];

  const [progressBars, setProgressBars] = useState({});

  useEffect(() => {
    // Animate progress bars on load
    const timer = setTimeout(() => {
      setProgressBars({ animate: true });
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const selectQuestion = (id) => {
    setSelectedQuestion(questionData[id]);
    setIsPopupOpen(false);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const ProgressBar = ({ percentage, color, animated = true }) => (
    <div className="mb-3 h-2 overflow-hidden rounded-full bg-gray-200">
      <div
        className={`h-full ${color} transition-all duration-700 ease-out`}
        style={{
          width: animated && progressBars.animate ? `${percentage}%` : "0%",
        }}
      />
    </div>
  );

  const SingleChoiceResult = ({ data }) => (
    <div className="animate-fade-in w-full">
      <div className="mb-8 border-b-2 border-gray-100 pb-5 text-center">
        <div className="mb-2 text-xl font-semibold text-gray-800">
          {data.title}
        </div>
        <div className="text-sm text-gray-600">
          Lựa chọn đơn • {data.options.reduce((sum, opt) => sum + opt.votes, 0)}{" "}
          phản hồi
        </div>
      </div>
      <div className="space-y-4">
        {data.options.map((option, index) => (
          <div key={index}>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-gray-700">{option.name}</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-800">
                  {option.percentage}%
                </span>
                <span className="text-sm text-gray-500">
                  {option.votes} votes
                </span>
              </div>
            </div>
            <ProgressBar percentage={option.percentage} color={option.color} />
          </div>
        ))}
      </div>
    </div>
  );

  const RatingResult = ({ data }) => (
    <div className="animate-fade-in w-full py-10 text-center">
      <div className="mb-8 border-b-2 border-gray-100 pb-5 text-center">
        <div className="mb-2 text-xl font-semibold text-gray-800">
          {data.title}
        </div>
        <div className="text-sm text-gray-600">
          Thang điểm • {data.responses} phản hồi
        </div>
      </div>
      <div className="mb-4 text-6xl font-bold text-red-500">{data.score}</div>
      <div className="mb-5 text-2xl text-yellow-400">
        {"★".repeat(Math.floor(data.score))}
        {"☆".repeat(data.maxScore - Math.floor(data.score))}
      </div>
      <div className="text-lg text-gray-600">trên {data.maxScore} điểm</div>
    </div>
  );

  const YesNoResult = ({ data }) => (
    <div className="animate-fade-in w-full">
      <div className="mb-8 border-b-2 border-gray-100 pb-5 text-center">
        <div className="mb-2 text-xl font-semibold text-gray-800">
          {data.title}
        </div>
        <div className="text-sm text-gray-600">
          Có/Không • {data.yes.votes + data.no.votes} phản hồi
        </div>
      </div>
      <div className="flex items-center justify-center gap-8 py-10">
        <div className="max-w-48 flex-1 rounded-2xl bg-gray-50 p-8 text-center">
          <div className="mb-2 text-4xl font-bold text-green-500">
            {data.yes.percentage}%
          </div>
          <div className="text-lg font-medium text-gray-600">Có</div>
        </div>
        <div className="max-w-48 flex-1 rounded-2xl bg-gray-50 p-8 text-center">
          <div className="mb-2 text-4xl font-bold text-red-500">
            {data.no.percentage}%
          </div>
          <div className="text-lg font-medium text-gray-600">Không</div>
        </div>
      </div>
    </div>
  );

  const MultipleChoiceResult = ({ data }) => (
    <div className="animate-fade-in w-full">
      <div className="mb-8 border-b-2 border-gray-100 pb-5 text-center">
        <div className="mb-2 text-xl font-semibold text-gray-800">
          {data.title}
        </div>
        <div className="text-sm text-gray-600">
          Đa lựa chọn • {data.options.reduce((sum, opt) => sum + opt.count, 0)}{" "}
          lượt chọn
        </div>
      </div>
      <div className="space-y-4 py-5">
        {data.options.map((option, index) => (
          <div
            key={index}
            className="flex items-center justify-between border-b border-gray-100 py-4 last:border-b-0"
          >
            <div className="font-medium text-gray-700">{option.name}</div>
            <div className="font-semibold text-blue-600">
              {option.count} lượt
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderQuestionResult = () => {
    if (!selectedQuestion) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-gray-500">
          <div className="mb-5 text-6xl opacity-50">📊</div>
          <div className="text-lg">Chọn câu hỏi để xem thống kê chi tiết</div>
        </div>
      );
    }

    switch (selectedQuestion.type) {
      case "single":
        return <SingleChoiceResult data={selectedQuestion} />;
      case "rating":
        return <RatingResult data={selectedQuestion} />;
      case "yesno":
        return <YesNoResult data={selectedQuestion} />;
      case "multiple":
        return <MultipleChoiceResult data={selectedQuestion} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header */}
      <header className="animate-slide-down sticky top-0 z-50 bg-white shadow-lg">
        <div className="mx-auto max-w-6xl px-5">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <div className="hidden h-8 w-32 rounded bg-gradient-to-r from-red-500 to-blue-500 md:block"></div>
              <div className="h-8 w-12 rounded bg-gradient-to-r from-red-500 to-blue-500 md:hidden"></div>
            </div>
            <button
              className="rounded-full bg-blue-500 px-6 py-2 text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-600 hover:shadow-lg"
              onClick={() => window.history.back()}
            >
              ← Quay lại
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8">
        <div className="mx-auto max-w-6xl px-5">
          <h1 className="mb-8 text-center text-4xl font-bold text-red-500">
            Thống kê bình chọn sự kiện
          </h1>

          {/* Event Banner */}
          <div className="mb-8 rounded-2xl bg-gradient-to-r from-red-500 to-red-400 p-8 text-white shadow-xl">
            <div className="grid items-center gap-5 md:grid-cols-2">
              <div>
                <h2 className="mb-3 text-2xl font-bold">
                  Hội thảo Công nghệ 2024
                </h2>
                <div className="flex flex-wrap gap-5 text-sm opacity-90">
                  <span>📅 15/12/2024 - 16/12/2024</span>
                  <span>📍 Trung tâm Hội nghị Quốc gia</span>
                  <span>👥 Tối đa 500 người</span>
                </div>
              </div>
              <div className="flex justify-center gap-8 md:justify-end">
                <div className="rounded-xl bg-white/20 p-4 text-center backdrop-blur-sm">
                  <div className="text-2xl font-bold">287</div>
                  <div className="text-sm opacity-90">Người tham gia</div>
                </div>
                <div className="rounded-xl bg-white/20 p-4 text-center backdrop-blur-sm">
                  <div className="text-2xl font-bold">5</div>
                  <div className="text-sm opacity-90">Cuộc bình chọn</div>
                </div>
                <div className="rounded-xl bg-white/20 p-4 text-center backdrop-blur-sm">
                  <div className="text-2xl font-bold">673</div>
                  <div className="text-sm opacity-90">Tổng lượt vote</div>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Overview */}
          <div className="mb-8 grid grid-cols-2 gap-5 md:grid-cols-4">
            <div className="rounded-xl bg-white p-6 text-center shadow-lg transition-all duration-300 hover:-translate-y-1 hover:transform">
              <div className="text-3xl font-bold text-red-500">673</div>
              <div className="text-sm text-gray-600">Tổng lượt bình chọn</div>
            </div>
            <div className="rounded-xl bg-white p-6 text-center shadow-lg transition-all duration-300 hover:-translate-y-1 hover:transform">
              <div className="text-3xl font-bold text-blue-500">287</div>
              <div className="text-sm text-gray-600">Người tham gia</div>
            </div>
            <div className="rounded-xl bg-white p-6 text-center shadow-lg transition-all duration-300 hover:-translate-y-1 hover:transform">
              <div className="text-3xl font-bold text-yellow-500">76%</div>
              <div className="text-sm text-gray-600">Tỷ lệ tham gia</div>
            </div>
            <div className="rounded-xl bg-white p-6 text-center shadow-lg transition-all duration-300 hover:-translate-y-1 hover:transform">
              <div className="text-3xl font-bold text-green-500">5</div>
              <div className="text-sm text-gray-600">Cuộc bình chọn</div>
            </div>
          </div>

          {/* Main Dashboard */}
          <div className="mb-8 grid gap-8 lg:grid-cols-3">
            {/* Poll Results */}
            <div className="rounded-2xl bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:transform lg:col-span-2">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-xl font-semibold">
                  Kết quả bình chọn chi tiết
                </h3>
                <span className="rounded-full bg-yellow-400 px-3 py-1 text-sm font-medium text-gray-800">
                  Đang diễn ra
                </span>
              </div>

              {/* Poll Item 1 */}
              <div className="mb-6 rounded-xl border-l-4 border-blue-500 bg-gray-50 p-5">
                <div className="mb-3 text-lg font-semibold">
                  Bạn có giới thiệu cho bạn bè không?
                </div>
                <div className="mb-4 text-sm text-gray-600">
                  Lựa chọn đơn • 287 phản hồi
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="mb-1 flex justify-between">
                      <span>Chắc chắn có</span>
                      <div className="text-right">
                        <span className="font-semibold">65.9%</span>
                        <span className="ml-2 text-sm text-gray-500">
                          189 votes
                        </span>
                      </div>
                    </div>
                    <ProgressBar percentage={65.9} color="bg-red-500" />
                  </div>

                  <div>
                    <div className="mb-1 flex justify-between">
                      <span>Có thể</span>
                      <div className="text-right">
                        <span className="font-semibold">23.3%</span>
                        <span className="ml-2 text-sm text-gray-500">
                          67 votes
                        </span>
                      </div>
                    </div>
                    <ProgressBar percentage={23.3} color="bg-yellow-400" />
                  </div>

                  <div>
                    <div className="mb-1 flex justify-between">
                      <span>Không chắc</span>
                      <div className="text-right">
                        <span className="font-semibold">7.3%</span>
                        <span className="ml-2 text-sm text-gray-500">
                          21 votes
                        </span>
                      </div>
                    </div>
                    <ProgressBar percentage={7.3} color="bg-blue-500" />
                  </div>

                  <div>
                    <div className="mb-1 flex justify-between">
                      <span>Không</span>
                      <div className="text-right">
                        <span className="font-semibold">3.5%</span>
                        <span className="ml-2 text-sm text-gray-500">
                          10 votes
                        </span>
                      </div>
                    </div>
                    <ProgressBar percentage={3.5} color="bg-purple-500" />
                  </div>
                </div>
              </div>

              {/* Poll Item 2 */}
              <div className="rounded-xl border-l-4 border-blue-500 bg-gray-50 p-5">
                <div className="mb-3 text-lg font-semibold">
                  Mức độ hài lòng tổng thể?
                </div>
                <div className="mb-4 text-sm text-gray-600">
                  Lựa chọn đơn • 287 phản hồi
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="mb-1 flex justify-between">
                      <span>Rất hài lòng</span>
                      <div className="text-right">
                        <span className="font-semibold">49.5%</span>
                        <span className="ml-2 text-sm text-gray-500">
                          142 votes
                        </span>
                      </div>
                    </div>
                    <ProgressBar percentage={49.5} color="bg-red-500" />
                  </div>

                  <div>
                    <div className="mb-1 flex justify-between">
                      <span>Hài lòng</span>
                      <div className="text-right">
                        <span className="font-semibold">34.1%</span>
                        <span className="ml-2 text-sm text-gray-500">
                          98 votes
                        </span>
                      </div>
                    </div>
                    <ProgressBar percentage={34.1} color="bg-yellow-400" />
                  </div>

                  <div>
                    <div className="mb-1 flex justify-between">
                      <span>Trung bình</span>
                      <div className="text-right">
                        <span className="font-semibold">11.1%</span>
                        <span className="ml-2 text-sm text-gray-500">
                          32 votes
                        </span>
                      </div>
                    </div>
                    <ProgressBar percentage={11.1} color="bg-blue-500" />
                  </div>

                  <div>
                    <div className="mb-1 flex justify-between">
                      <span>Kém</span>
                      <div className="text-right">
                        <span className="font-semibold">5.2%</span>
                        <span className="ml-2 text-sm text-gray-500">
                          15 votes
                        </span>
                      </div>
                    </div>
                    <ProgressBar percentage={5.2} color="bg-purple-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* Participants List */}
            <div className="rounded-2xl bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:transform">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-xl font-semibold">
                  Danh sách người tham gia
                </h3>
                <span className="rounded-full bg-gray-200 px-3 py-1 text-sm font-medium text-gray-800">
                  287 người
                </span>
              </div>

              <div className="space-y-3">
                {participants.map((participant, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 rounded-lg p-3 transition-all duration-200 hover:translate-x-1 hover:transform hover:bg-gray-50"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-red-500 text-sm font-semibold text-white">
                      {participant.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">
                        {participant.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {participant.email}
                      </div>
                    </div>
                    <div className="rounded-xl bg-red-500 px-2 py-1 text-xs font-medium text-white">
                      {participant.votes} votes
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Question Selector */}
          <div className="rounded-2xl bg-white p-6 shadow-lg">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-semibold">Thống kê theo câu hỏi</h3>
              <button
                className="rounded-lg bg-blue-500 px-5 py-2 text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-600"
                onClick={() => setIsPopupOpen(true)}
              >
                Chọn câu hỏi
              </button>
            </div>

            <div className="flex min-h-48 items-center justify-center">
              {renderQuestionResult()}
            </div>
          </div>

          {/* Question Selector Popup */}
          {isPopupOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <div className="animate-slide-up max-h-4/5 w-11/12 max-w-2xl overflow-hidden rounded-2xl bg-white">
                <div className="flex items-center justify-between border-b bg-gray-50 p-6">
                  <h3 className="text-xl font-semibold">
                    Chọn câu hỏi thống kê
                  </h3>
                  <button
                    className="flex h-10 w-10 items-center justify-center rounded-full text-2xl text-gray-600 transition-colors hover:bg-gray-200 hover:text-red-500"
                    onClick={closePopup}
                  >
                    ×
                  </button>
                </div>

                <div className="max-h-96 overflow-y-auto p-5">
                  {questions.map((question) => (
                    <div
                      key={question.id}
                      className="flex cursor-pointer items-center border-b p-5 transition-all duration-200 last:border-b-0 hover:translate-x-1 hover:transform hover:bg-gray-50"
                      onClick={() => selectQuestion(question.id)}
                    >
                      <div className="flex-1">
                        <div className="mb-1 text-lg font-medium text-gray-800">
                          {question.title}
                        </div>
                        <div className="text-sm text-gray-600">
                          {question.meta}
                        </div>
                      </div>
                      <div className="text-xl font-bold text-blue-500 transition-transform group-hover:translate-x-1">
                        →
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <style jsx>{`
        @keyframes slide-down {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes fade-in {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes slide-up {
          from {
            transform: translateY(30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-slide-down {
          animation: slide-down 0.6s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default PollStatistics;
