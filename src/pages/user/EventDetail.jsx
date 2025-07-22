import React from "react";

const EventDetail = () => {
  return (
    <div class="my-7.5 grid grid-cols-1 gap-7.5 md:grid-cols-[2fr_1fr]">
      <div class="overflow-hidden rounded-2xl bg-white shadow">
        <div className="relative h-[200px] overflow-hidden md:h-[300px]">
          <img
            src="https://sp-ao.shortpixel.ai/client/to_webp,q_glossy,ret_img/https://vku.udn.vn/wp-content/uploads/2025/04/Bia-CITA-2025.png"
            alt="banner"
            className="h-full w-full object-cover"
          />
          <div className="bg-accent absolute top-5 right-5 rounded-[20px] px-4 py-2 text-sm font-bold text-[#333]">
            Sắp diễn ra
          </div>
        </div>

        <div className="p-7">
          <h1 className="text-secondary mb-5 text-2xl font-bold md:text-3xl">
            Hội thảo Công nghệ AI 2024
          </h1>

          <div className="mb-7 grid grid-cols-1 gap-5 md:grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
            <div className="border-primary flex items-center gap-3 rounded-[10px] border border-l-4 bg-[#f8f9fa] p-4 duration-300 hover:translate-x-1 hover:bg-[#e9ecef]">
              <div className="bg-primary flex h-10 w-10 items-center justify-center rounded-full text-white">
                📅
              </div>
              <div>
                <h4 className="mb-1 font-bold text-[#333]">
                  Thời gian bắt đầu
                </h4>
                <p className="text-sm text-[#666]">15/12/2024 - 09:00</p>
              </div>
            </div>
            <div className="border-primary flex items-center gap-3 rounded-[10px] border border-l-4 bg-[#f8f9fa] p-4 duration-300 hover:translate-x-1 hover:bg-[#e9ecef]">
              <div className="bg-primary flex h-10 w-10 items-center justify-center rounded-full text-white">
                🏁
              </div>
              <div>
                <h4 className="mb-1 font-bold text-[#333]">
                  Thời gian kết thúc
                </h4>
                <p className="text-sm text-[#666]">15/12/2024 - 17:00</p>
              </div>
            </div>
            <div className="border-primary flex items-center gap-3 rounded-[10px] border border-l-4 bg-[#f8f9fa] p-4 duration-300 hover:translate-x-1 hover:bg-[#e9ecef]">
              <div className="bg-primary flex h-10 w-10 items-center justify-center rounded-full text-white">
                📍
              </div>
              <div>
                <h4 className="mb-1 font-bold text-[#333]">Địa điểm</h4>
                <p className="text-sm text-[#666]">
                  Hội trường A - Trường ĐH VKU
                </p>
              </div>
            </div>
            <div className="border-primary flex items-center gap-3 rounded-[10px] border border-l-4 bg-[#f8f9fa] p-4 duration-300 hover:translate-x-1 hover:bg-[#e9ecef]">
              <div className="bg-primary flex h-10 w-10 items-center justify-center rounded-full text-white">
                👥
              </div>
              <div>
                <h4 className="mb-1 font-bold text-[#333]">
                  Số lượng tham gia
                </h4>
                <p className="text-sm text-[#666]">10 / 100 người</p>
              </div>
            </div>
          </div>

          <div className="mb-7 rounded-[10px] bg-[#f8f9fa] p-6">
            <h3 className="text-secondary mb-4 text-xl font-bold">
              Mô tả sự kiện
            </h3>
            <p className="leading-[1.8] text-[#666]">
              Hội thảo Công nghệ AI 2024 là sự kiện quan trọng nhằm cập nhật
              những xu hướng mới nhất trong lĩnh vực trí tuệ nhân tạo. Chúng tôi
              sẽ có các chuyên gia hàng đầu trong ngành chia sẻ kinh nghiệm và
              kiến thức thực tiễn. Đây là cơ hội tuyệt vời để học hỏi, giao lưu
              và mở rộng mạng lưới quan hệ trong lĩnh vực công nghệ.
            </p>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="flex flex-col gap-6">
        <div className="rounded-2xl bg-white p-6 shadow">
          <h3 className="text-secondary mb-5 flex items-center gap-2 text-xl leading-1.5 font-bold">
            🎯 Đăng ký tham gia
          </h3>

          <button className="bg-primary group relative w-full cursor-pointer overflow-hidden rounded-full border-none p-4 text-sm font-bold text-white group-hover:translate-y-0.5 group-hover:opacity-40">
            <div className="absolute top-1/2 left-1/2 h-0 w-0 translate-1/2 rounded-full bg-black opacity-30 group-hover:h-full group-hover:w-full"></div>
            Đăng ký ngay
          </button>

          <p className="mt-4 text-center text-sm text-[#666]">
            Còn lại 55 suất tham gia
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <h3 className="text-secondary mb-5 flex items-center gap-2 text-xl leading-1.5 font-bold">
            👨‍💼 Người quản lý
          </h3>
          <div className="flex items-center gap-4 rounded-[10px] bg-[#f8f9fa] p-4">
            <img
              className="h-12 w-12 rounded-full object-cover"
              src="/avatar/6K0A0828.jpg"
              alt="avatar"
            />
            <div>
              <h4 className="mb-1 font-bold text-[#333]">
                TS. Nguyễn Văn Minh
              </h4>
              <p className="text-sm text-[#666]">Trưởng khoa CNTT</p>
              <p className="text-sm text-[#666]">📧 nv.minh@vku.udn.vn</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <h3 className="text-secondary mb-5 flex items-center gap-2 text-xl leading-1.5 font-bold">
            👥 Danh sách tham gia
          </h3>
          <div className="max-h-72 overflow-y-auto">
            <div className="flex items-center gap-3 border-b border-b-[#f0f0f0] p-2 hover:bg-[#f8f9fa]">
              <img
                className="h-12 w-12 rounded-full object-cover"
                src="/avatar/6K0A0828.jpg"
                alt="avatar"
              />
              <div className="participant-info">
                <h4 className="mb-0.5 text-sm font-bold text-[#333]">
                  Nguyễn Văn An
                </h4>
                <p className="text-[12px] text-[#666]">Đã đăng ký lúc 10:30</p>
              </div>
            </div>
            <div className="flex items-center gap-3 border-b border-b-[#f0f0f0] p-2 hover:bg-[#f8f9fa]">
              <img
                className="h-12 w-12 rounded-full object-cover"
                src="/avatar/6K0A0828.jpg"
                alt="avatar"
              />
              <div className="participant-info">
                <h4 className="mb-0.5 text-sm font-bold text-[#333]">
                  Lê Thị Bình
                </h4>
                <p className="text-[12px] text-[#666]">Đã đăng ký lúc 11:15</p>
              </div>
            </div>
            <div className="flex items-center gap-3 border-b border-b-[#f0f0f0] p-2 hover:bg-[#f8f9fa]">
              <img
                className="h-12 w-12 rounded-full object-cover"
                src="/avatar/6K0A0828.jpg"
                alt="avatar"
              />
              <div className="participant-info">
                <h4 className="mb-0.5 text-sm font-bold text-[#333]">
                  Trần Văn Cường
                </h4>
                <p className="text-[12px] text-[#666]">Đã đăng ký lúc 12:00</p>
              </div>
            </div>
            <div className="flex items-center gap-3 border-b border-b-[#f0f0f0] p-2 hover:bg-[#f8f9fa]">
              <img
                className="h-12 w-12 rounded-full object-cover"
                src="/avatar/6K0A0828.jpg"
                alt="avatar"
              />
              <div className="participant-info">
                <h4 className="mb-0.5 text-sm font-bold text-[#333]">
                  Hoàng Thị Dung
                </h4>
                <p className="text-[12px] text-[#666]">Đã đăng ký lúc 13:30</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <h3 className="text-secondary mb-5 flex items-center gap-2 text-xl leading-1.5 font-bold">
            📊 Tài liệu sự kiện
          </h3>
          <div className="mb-5">
            <div className="mb-7">
              <div className="hover:border-secondary mb-2 flex items-center gap-3 rounded-md border border-[#e9ecef] bg-white p-3 hover:translate-x-1 hover:bg-[#f8f9fa]">
                <div className="bg-accent flex h-9 w-9 items-center justify-center rounded-[5px] text-sm text-[#333]">
                  📄
                </div>
                <div>
                  <h4 className="font-bold">Chương trình chi tiết</h4>
                  <p className="text-sm">agenda_ai_2024.pdf</p>
                </div>
              </div>
              <div className="hover:border-secondary mb-2 flex items-center gap-3 rounded-md border border-[#e9ecef] bg-white p-3 hover:translate-x-1 hover:bg-[#f8f9fa]">
                <div className="bg-accent flex h-9 w-9 items-center justify-center rounded-[5px] text-sm text-[#333]">
                  📊
                </div>
                <div>
                  <h4 className="font-bold">Slide thuyết trình</h4>
                  <p className="text-sm">ai_presentation_2024.pptx</p>
                </div>
              </div>
              <div className="hover:border-secondary mb-2 flex items-center gap-3 rounded-md border border-[#e9ecef] bg-white p-3 hover:translate-x-1 hover:bg-[#f8f9fa]">
                <div className="bg-accent flex h-9 w-9 items-center justify-center rounded-[5px] text-sm text-[#333]">
                  📋
                </div>
                <div>
                  <h4 className="font-bold">Hướng dẫn tham gia</h4>
                  <p className="text-sm">participation_guide.pdf</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
