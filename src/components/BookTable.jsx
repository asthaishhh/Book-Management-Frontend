import React from "react";
import { MdDelete } from "react-icons/md";
import { FaPen } from "react-icons/fa";

const BookTable = ({ list, onEdit, onDelete }) => {
  return (
    <div className="mt-10 overflow-x-auto">
      
      <table className="w-full bg-white divide-y divide-gray-200 shadow-sm border">
        <thead className="bg-gray-100">
          <tr>
            {["Book Name", "Author", "Price", "Category", "Actions"].map((head) => (
              <th key={head} className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {list.map((book) => (
            <tr key={book._id} className="hover:bg-stone-50 transition-colors">
              <td className="px-6 py-4">{book.BookName}</td>
              <td className="px-6 py-4">{book.Author}</td>
              <td className="px-6 py-4">{book.Price}</td>
              <td className="px-6 py-4">{book.Category}</td>
              <td className="px-6 py-4 flex gap-4">
                <button onClick={() => onEdit(book)} className="text-blue-500 hover:text-blue-700">
                  <FaPen size={18} />
                </button>
                <button onClick={() => onDelete(book._id)} className="text-red-500 hover:text-red-700">
                  <MdDelete size={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookTable;
