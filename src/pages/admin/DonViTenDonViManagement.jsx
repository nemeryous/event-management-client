// import React, { useMemo, useState } from "react";
// import { FiSettings, FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
// import ActionButtons from "@/components/features/admin/ActionButtons";
// import DataTable from "@/components/features/admin/DataTable";
// import {
//   useGetAllDonViQuery,
//   useCreateDonViMutation,
//   useUpdateDonViMutation,
//   useDeleteDonViMutation,
// } from "@/api/unitApi";

// const DON_VI_OPTIONS = [
//   { value: "CAN_BO_NHAN_VIEN", label: "Cán bộ nhân viên" },
//   { value: "SINH_VIEN", label: "Sinh viên" },
//   { value: "DON_VI_NGOAI", label: "Đơn vị ngoài" },
// ];

// function getDonViLabel(value) {
//   return DON_VI_OPTIONS.find((o) => o.value === value)?.label || value || "";
// }

// export default function DonViTenDonViManagement() {
//   const {
//     data: allDonVis = [],
//     isLoading,
//     error,
//     refetch,
//   } = useGetAllDonViQuery();
//   const [createDonVi, { isLoading: isCreating }] = useCreateDonViMutation();
//   const [updateDonVi, { isLoading: isUpdating }] = useUpdateDonViMutation();
//   const [deleteDonVi, { isLoading: isDeleting }] = useDeleteDonViMutation();

//   const [selectedDonVi, setSelectedDonVi] = useState("CAN_BO_NHAN_VIEN");
//   const [newTenDonVi, setNewTenDonVi] = useState("");
//   const [editingId, setEditingId] = useState(null);
//   const [editingTen, setEditingTen] = useState("");
//   const [message, setMessage] = useState("");
//   const [messageType, setMessageType] = useState("");

//   const items = useMemo(() => {
//     const list = Array.isArray(allDonVis)
//       ? allDonVis
//       : allDonVis?.content || [];
//     return list
//       .filter((d) => d?.donVi === selectedDonVi)
//       .map((d) => ({ id: d.id, donVi: d.donVi, tenDonVi: d.tenDonVi }));
//   }, [allDonVis, selectedDonVi]);

//   async function handleCreate(e) {
//     e.preventDefault();
//     if (!newTenDonVi.trim()) return;
//     try {
//       await createDonVi({
//         donVi: selectedDonVi,
//         tenDonVi: newTenDonVi.trim(),
//       }).unwrap();
//       setNewTenDonVi("");
//       setMessage("Đã thêm tên đơn vị");
//       setMessageType("success");
//       refetch();
//     } catch (err) {
//       setMessage(err?.data?.message || "Thêm thất bại");
//       setMessageType("error");
//     } finally {
//       setTimeout(() => setMessage(""), 2000);
//     }
//   }

//   async function handleSaveEdit(row) {
//     try {
//       await updateDonVi({
//         id: row.id,
//         donVi: selectedDonVi,
//         tenDonVi: editingTen.trim(),
//       }).unwrap();
//       setEditingId(null);
//       setEditingTen("");
//       setMessage("Đã cập nhật tên đơn vị");
//       setMessageType("success");
//       refetch();
//     } catch (err) {
//       setMessage(err?.data?.message || "Cập nhật thất bại");
//       setMessageType("error");
//     } finally {
//       setTimeout(() => setMessage(""), 2000);
//     }
//   }

//   async function handleDelete(row) {
//     try {
//       await deleteDonVi(row.id).unwrap();
//       setMessage("Đã xóa tên đơn vị");
//       setMessageType("success");
//       refetch();
//     } catch (err) {
//       setMessage(err?.data?.message || "Xóa thất bại");
//       setMessageType("error");
//     } finally {
//       setTimeout(() => setMessage(""), 2000);
//     }
//   }

//   return (
//     <div className="p-4 md:p-8">
//       <h1 className="mb-6 flex items-center gap-2 text-2xl font-bold text-[#223b73]">
//         <FiSettings className="text-[#c52032]" /> Quản lý Tên đơn vị theo Đơn vị
//       </h1>

//       {message && (
//         <div
//           className={`mb-4 rounded px-4 py-2 ${messageType === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
//         >
//           {message}
//         </div>
//       )}

//       <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end">
//         <div className="flex-1">
//           <label className="mb-1 block text-sm font-medium text-gray-600">
//             Đơn vị
//           </label>
//           <select
//             className="w-full rounded-lg border border-gray-300 px-3 py-2"
//             value={selectedDonVi}
//             onChange={(e) => setSelectedDonVi(e.target.value)}
//           >
//             {DON_VI_OPTIONS.map((o) => (
//               <option key={o.value} value={o.value}>
//                 {o.label}
//               </option>
//             ))}
//           </select>
//         </div>

//         <form className="flex-1" onSubmit={handleCreate}>
//           <label className="mb-1 block text-sm font-medium text-gray-600">
//             Thêm tên đơn vị
//           </label>
//           <div className="flex gap-2">
//             <input
//               className="flex-1 rounded-lg border border-gray-300 px-3 py-2"
//               placeholder="Nhập tên đơn vị mới"
//               value={newTenDonVi}
//               onChange={(e) => setNewTenDonVi(e.target.value)}
//             />
//             <button
//               type="submit"
//               disabled={isCreating || !newTenDonVi.trim()}
//               className="flex items-center gap-2 rounded-lg bg-[#c52032] px-4 py-2 font-semibold text-white disabled:opacity-60"
//             >
//               <FiPlus /> Thêm
//             </button>
//           </div>
//         </form>
//       </div>

//       {isLoading ? (
//         <div className="p-8 text-center text-gray-500">Đang tải dữ liệu...</div>
//       ) : error ? (
//         <div className="p-8 text-center text-red-500">Lỗi tải dữ liệu</div>
//       ) : (
//         <div>
//           <div className="hidden md:block">
//             <DataTable
//               data={items}
//               columns={[
//                 { key: "stt", label: "STT", render: (_r, idx) => idx + 1 },
//                 {
//                   key: "donVi",
//                   label: "Đơn vị",
//                   render: (r) => getDonViLabel(r.donVi),
//                 },
//                 {
//                   key: "tenDonVi",
//                   label: "Tên đơn vị",
//                   render: (row) =>
//                     editingId === row.id ? (
//                       <input
//                         className="w-full rounded border border-gray-300 px-2 py-1"
//                         value={editingTen}
//                         onChange={(e) => setEditingTen(e.target.value)}
//                       />
//                     ) : (
//                       row.tenDonVi
//                     ),
//                 },
//                 {
//                   key: "actions",
//                   label: "",
//                   render: (row) =>
//                     editingId === row.id ? (
//                       <ActionButtons
//                         actions={[
//                           {
//                             label: "Lưu",
//                             color: "text-[#223b73]",
//                             onClick: () => handleSaveEdit(row),
//                           },
//                           {
//                             label: "Hủy",
//                             color: "text-gray-500",
//                             onClick: () => {
//                               setEditingId(null);
//                               setEditingTen("");
//                             },
//                           },
//                         ]}
//                       />
//                     ) : (
//                       <ActionButtons
//                         actions={[
//                           {
//                             label: "Sửa",
//                             icon: <FiEdit2 />,
//                             color: "text-[#223b73]",
//                             onClick: () => {
//                               setEditingId(row.id);
//                               setEditingTen(row.tenDonVi);
//                             },
//                           },
//                           {
//                             label: "Xóa",
//                             icon: <FiTrash2 />,
//                             color: "text-[#c52032]",
//                             onClick: () => handleDelete(row),
//                           },
//                         ]}
//                       />
//                     ),
//                 },
//               ]}
//             />
//           </div>

//           <div className="space-y-3 md:hidden">
//             {items.map((row, idx) => (
//               <div key={row.id} className="rounded-xl bg-white p-4 shadow">
//                 <div className="mb-1 text-xs text-gray-400">#{idx + 1}</div>
//                 <div className="text-sm">
//                   <span className="font-semibold">Đơn vị:</span>{" "}
//                   {getDonViLabel(row.donVi)}
//                 </div>
//                 <div className="text-sm">
//                   <span className="font-semibold">Tên đơn vị:</span>{" "}
//                   {editingId === row.id ? (
//                     <input
//                       className="mt-1 w-full rounded border border-gray-300 px-2 py-1"
//                       value={editingTen}
//                       onChange={(e) => setEditingTen(e.target.value)}
//                     />
//                   ) : (
//                     row.tenDonVi
//                   )}
//                 </div>
//                 <div className="mt-2">
//                   {editingId === row.id ? (
//                     <div className="flex gap-2">
//                       <button
//                         className="rounded bg-[#223b73] px-3 py-1 text-white"
//                         onClick={() => handleSaveEdit(row)}
//                       >
//                         Lưu
//                       </button>
//                       <button
//                         className="rounded bg-gray-200 px-3 py-1"
//                         onClick={() => {
//                           setEditingId(null);
//                           setEditingTen("");
//                         }}
//                       >
//                         Hủy
//                       </button>
//                     </div>
//                   ) : (
//                     <div className="flex gap-2">
//                       <button
//                         className="rounded bg-[#223b73] px-3 py-1 text-white"
//                         onClick={() => {
//                           setEditingId(row.id);
//                           setEditingTen(row.tenDonVi);
//                         }}
//                       >
//                         Sửa
//                       </button>
//                       <button
//                         className="rounded bg-[#c52032] px-3 py-1 text-white"
//                         onClick={() => handleDelete(row)}
//                       >
//                         Xóa
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ))}
//             {items.length === 0 && (
//               <div className="py-8 text-center text-gray-400">
//                 Chưa có tên đơn vị
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
