// import React from "react";

// const BookForm = ({ bookForm, onChange, onSubmit, onCancel, editingId }) => {
//   const fields = [
//     {
//       label: "Book Name",
//       name: "BookName",
//       placeholder: "Enter the name of the book",
//     },
//     {
//       label: "Author Name",
//       name: "Author",
//       placeholder: "Enter the name of the author",
//     },
//     {
//       label: "Price",
//       name: "Price",
//       placeholder: "Enter the price of the book",
//     },
//     {
//       label: "Category",
//       name: "Category",
//       placeholder: "Enter the category of the book",
//     },
//   ];

//   return (
//     <div className="bg-gray-50 p-10">
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//         {fields.map((field) => (
//           <div key={field.name} className="flex flex-col">
//             <label className="font-medium text-gray-700">{field.label}</label>
//             <input
//               type="text"
//               name={field.name}
//               value={bookForm[field.name]}
//               onChange={onChange}
//               placeholder={field.placeholder}
//               className="border-2 border-gray-300 rounded-sm p-1 focus:border-blue-500 outline-none"
//             />
//             {/* <div className="flex flex-col"> */}
//               <label className="font-medium">Book Cover</label>
//               <input
//                 type="file"
//                 name="BookImage"
//                 accept="image/*"
//                 onChange={onChange}
//               />
//             {/* </div> */}
//           </div>
//         ))}
//       </div>

//       <div className="flex justify-end mt-6 gap-3">
//         <button
//           onClick={onSubmit}
//           className="bg-gray-800 text-white px-6 py-2 rounded-sm hover:bg-black transition-all"
//         >
//           {editingId ? "Update Book" : "Add Book"}
//         </button>
//         {editingId && (
//           <button
//             onClick={onCancel}
//             className="bg-gray-400 text-white px-6 py-2 rounded-sm"
//           >
//             Cancel
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default BookForm;


import React from "react";

const BookForm = ({ bookForm, onChange, onSubmit, onCancel, editingId }) => {
  const fields = [
    { label: "Book Name", name: "BookName", placeholder: "Enter book name" },
    { label: "Author Name", name: "Author", placeholder: "Enter author name" },
    { label: "Price", name: "Price", placeholder: "Enter price" },
    { label: "Category", name: "Category", placeholder: "Enter category" },
  ];

  return (
    <div className="bg-gray-50 p-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {fields.map((field) => (
          <div key={field.name} className="flex flex-col">
            <label className="font-medium text-gray-700">{field.label}</label>

            <input
              type="text"
              name={field.name}
              value={bookForm[field.name] || ""}
              onChange={onChange}
              placeholder={field.placeholder}
              className="border-2 border-gray-300 rounded-sm p-1 focus:border-blue-500 outline-none"
            />
          </div>
        ))}

        {/* ✅ IMAGE INPUT (ONLY ONCE) */}
        <div className="flex flex-col">
          <label className="font-medium text-gray-700">Book Cover</label>

          <input
            className="bg-stone-200/50 rounded-full p-2"
            type="file"
            name="BookImage"
            accept="image/*"
            onChange={onChange}
          />
        </div>
      </div>

      <div className="flex justify-end mt-6 gap-3">
        <button
          onClick={onSubmit}
          className="bg-gray-800 text-white px-6 py-2 rounded-sm hover:bg-black"
        >
          {editingId ? "Update Book" : "Add Book"}
        </button>

        {editingId && (
          <button
            onClick={onCancel}
            className="bg-gray-400 text-white px-6 py-2 rounded-sm"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

export default BookForm;