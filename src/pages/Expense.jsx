import React, { useState, useEffect } from "react";
import CountUp from "../components/CountUp";
import API from "../services/authService";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
} from "../features/expenseSlice";

function Expense() {
  const [categoryData, setCategoryData] = useState({
    Produksi: 0,
    Operasional: 0,
    Marketing: 0,
  });
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.expense);
  const [searchQuery, setSearchQuery] = useState("");

  // Get data category perbulan
  useEffect(() => {
    const fetchData = async () => {
      const now = new Date();
      const currentMonth = now.getMonth() + 1;
      const currentYear = now.getFullYear();

      try {
        const res = await API.get(
          `/expenses/summary/category?month=${currentMonth}&year=${currentYear}`
        );

        // Buat objek kosong default
        const updatedData = {
          Produksi: 0,
          Operasional: 0,
          Marketing: 0,
        };

        res.data.forEach((item) => {
          const category = item.category;
          updatedData[category] = Number(item.total);
        });

        setCategoryData(updatedData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  // Ambil Data Seluruh Expenses
  useEffect(() => {
    dispatch(fetchExpenses());
  }, [dispatch]);

  return (
    <div>
      <div className="p-0 lg:p-6">
        <h2 className="text-2xl font-bold mb-4">Pengeluaran</h2>
        {/* Stats on Progress TODO: */}
        <div className="w-full pb-7 grid grid-cols-3 text-center lg:text-sm text-xs">
          <div className="border-r-2 border-r-slate-300">
            <div className="">Produksi</div>
            <div className="stat-value lg:text-4xl text-lg">
              <span>Rp. </span>
              <CountUp
                from={0}
                // to={Number(data.incomeToday)}
                to={categoryData.Produksi}
                separator="."
                duration={0.1}
                className="inline"
              />
            </div>
          </div>
          <div className="border-r-2 border-r-slate-300">
            <div className="">Operasional</div>
            <div className="stat-value lg:text-4xl text-lg">
              <span>Rp. </span>
              <CountUp
                from={0}
                // to={Number(data.incomeToday)}
                to={categoryData.Operasional}
                separator="."
                duration={0.1}
                className="inline"
              />
            </div>
          </div>
          <div className="">
            <div className="">Marketing</div>
            <div className="stat-value lg:text-4xl text-lg">
              <span>Rp. </span>
              <CountUp
                from={0}
                // to={Number(data.incomeToday)}
                to={categoryData.Marketing}
                separator="."
                duration={0.1}
                className="inline"
              />
            </div>
          </div>
        </div>

        {/* STATS */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-1 lg:gap-4 mb-8 lg:text-lg text-4xl">
          <div className="stat bg-green-300 my-1 lg:my-0 rounded-lg shadow-md">
            <div className="stat-title">Produksi</div>
            <div className="stat-value">
              <span>Rp. </span>
              <CountUp
                from={0}
                // to={Number(data.incomeToday)}
                to={categoryData.Produksi}
                separator="."
                duration={0.1}
                className="inline"
              />
            </div>
          </div>
          <div className="stat bg-green-300 my-1 lg:my-0 rounded-lg shadow-md">
            <div className="stat-title">Operasional</div>
            <div className="stat-value">
              <span>Rp. </span>
              <CountUp
                from={0}
                // to={Number(data.incomeMonth)}
                to={categoryData.Operasional}
                separator="."
                duration={0.1}
                className="inline"
              />
            </div>
          </div>
          <div className=" flex flex-col lg:flex-row">
            <div className="stat bg-green-300 my-1 lg:my-0 rounded-lg shadow-md">
              <div className="stat-title">Marketing</div>
              <div className="stat-value">
                <span>Rp. </span>
                <CountUp
                  from={0}
                  // to={Number(data.expenseToday)}
                  to={categoryData.Marketing}
                  separator="."
                  duration={0.1}
                  className="inline"
                />
              </div>
            </div>
          </div>
        </div> */}

        {/* TABEL */}
        <div className="h-[723px] overflow-x-auto">
          {loading ? (
            <span className="h-full flex items-center justify-center text-center loading loading-spinner loading-xl"></span>
          ) : error ? (
            <p className="w-full h-full flex items-center justify-center text-center text-red-500">
              Error: {error}
            </p>
          ) : (
            <table className="table table-sm table-pin-rows">
              <thead>
                <tr>
                  <th></th>
                  <th>Nama Barang</th>
                  <th>Kategori</th>
                  <th className="text-center">Tanggal Pengeluaran</th>
                  <th>Total Harga</th>
                  <th>Keterangan</th>
                  <th className="text-center">Tanggal Ditambahkan</th>
                  <th className="text-center">Ditambahkan Oleh</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {data
                  .filter((item) =>
                    item.item_name
                      ?.toLowerCase()
                      .includes(searchQuery.toLowerCase())
                  )
                  .map((item, key) => (
                    <tr key={item.id || `temp-${key}`}>
                      <th> {key + 1} </th>
                      <td> {item.item_name} </td>
                      <td> {item.category} </td>
                      <td className="text-center">
                        {" "}
                        {new Date(item.expense_date).toLocaleString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}{" "}
                      </td>
                      <td>
                        Rp.{" "}
                        {item.total_price &&
                          Number(item.total_price).toLocaleString("id-ID", {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          })}
                      </td>
                      <td> {item.notes} </td>
                      <td className="text-center">
                        {" "}
                        {new Date(item.created_at).toLocaleString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}{" "}
                      </td>
                      <td> {item.notes} </td>

                      <td className="flex justify-center">
                        <button
                          // onClick={() => handleEdit(item)}
                          className="btn btn-square btn-success"
                        >
                          <svg
                            className="size-[22px]"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M10.779 17.779 4.36 19.918 6.5 13.5m4.279 4.279 8.364-8.643a3.027 3.027 0 0 0-2.14-5.165 3.03 3.03 0 0 0-2.14.886L6.5 13.5m4.279 4.279L6.499 13.5m2.14 2.14 6.213-6.504M12.75 7.04 17 11.28"
                            />
                          </svg>
                        </button>
                        <button
                          // onClick={() => {
                          //   setDeleteId(item.id); // simpan id yang akan dihapus
                          //   document.getElementById("modal_delete").showModal();
                          // }}
                          className="btn btn-square btn-error lg:ml-2 ml-1"
                        >
                          <svg
                            className="size-[20px]"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>
        {/* END TABEL */}
      </div>
    </div>
  );
}

export default Expense;
