import TextInput from "@components/common/TextInput";
import PollOption from "@components/poll/PollOption";
import FormFieldUser from "@components/user/FormFieldUser";
import SelectInputUser from "@components/user/SelectInputUser";
import TextInputUser from "@components/user/TextInputUser";
import React from "react";

const CreatePoll = () => {
  const options = [
    { id: "1", name: "Option 1" },
    { id: "2", name: "Option 2" },
    { id: "3", name: "Option 3" },
  ];

  return (
    <div className="px-0 py-10">
      <div className="animate-fade-in-up mb-[30px] shadow-[0_10px_30px_rgba(0,0,0,0.1)]">
        <h1 className="mb-[10px] text-center text-[2.5rem] font-bold text-[#e53935] text-shadow-[2,2,4,rgba(0,0,0,0.1)]">
          Tạo bình chọn mới
        </h1>
        <p class="mb-10 text-center text-[1.1rem] text-[#666]">
          Tạo bình chọn tương tác và thu hút cho sự kiện của bạn
        </p>
        <div className="animate-fadeInUP mb-[30px] rounded-[20px] bg-white p-10 shadow-[0,10,30,rgba(0,0,0,0.1)]">
          <form>
            <div className="mb-5 grid grid-cols-2 gap-5">
              <FormFieldUser
                label={"Chọn sự kiện *"}
                Component={() => (
                  <SelectInputUser options={options} name={"event"} />
                )}
              />
              <FormFieldUser
                label={"Loại bình chọn *"}
                Component={() => (
                  <SelectInputUser options={options} name={"pollType"} />
                )}
              />
            </div>
            <div className="col-span-full mb-[25px]">
              <FormFieldUser
                label={"Tiêu đề bình chọn"}
                Component={() => (
                  <TextInputUser
                    name={"title"}
                    placeholder={"Nhập tiêu đề bình chọn của bạn"}
                    type={"text"}
                    value={""}
                  />
                )}
              />
            </div>
            <div className="mb-5 grid grid-cols-2 gap-5">
              <FormFieldUser
                label={"Thời gian bắt đầu *"}
                Component={() => (
                  <TextInputUser
                    name={"startTime"}
                    placeholder={"Nhập tiêu đề bình chọn của bạn"}
                    type={"datetime-local"}
                    value={""}
                  />
                )}
              />
              <FormFieldUser
                label={"Thời gian kết thúc *"}
                Component={() => (
                  <TextInputUser
                    name={"startEnd"}
                    placeholder={"Nhập tiêu đề bình chọn của bạn"}
                    type={"datetime-local"}
                    value={""}
                  />
                )}
              />
            </div>
            <div className="col-span-full mb-[25px]">
              <FormFieldUser
                label={"Tiêu đề bình chọn"}
                Component={() => (
                  <SelectInputUser options={options} name={"status"} />
                )}
              />
            </div>
            <div className="mt-[30px]">
              <h3 className="text-primary mb-5 flex items-center gap-[10px] text-[1.3rem] font-bold">
                🗳️ Các lựa chọn
              </h3>
              <div>
                <PollOption />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePoll;
