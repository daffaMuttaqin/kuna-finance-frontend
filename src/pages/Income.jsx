import React, { useEffect, useState } from "react";
import API from "../services/authService";

function Income() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("/incomes");
        setData(res.data);
      } catch (error) {
        console.error("Gagal mengambil data", error);
      }
    };

    fetchData();
  }, []);
  return (
    <div className="w-full h-full">
      <div className="p-0 lg:p-6">
        <div className="flex justify-between">
          <h2 className="text-2xl font-bold mb-4">Pemasukan</h2>
          <div className="flex">
            {/* Input Search */}
            <div className="lg:block hidden">
              <label className="input">
                <svg
                  className="h-[1em] opacity-50"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <g
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="2.5"
                    fill="none"
                    stroke="currentColor"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.3-4.3"></path>
                  </g>
                </svg>
                <input type="search" required placeholder="Cari nama" />
              </label>
            </div>
            {/* Tambah income */}
            <button
              className="btn btn-info ml-2"
              onClick={() =>
                document.getElementById("modal_tambah_barang").showModal()
              }
            >
              Tambah
            </button>
          </div>
        </div>

        {/* TABEL */}
        <div className="h-[723px] overflow-x-auto">
          <table className="table table-sm table-pin-rows">
            <thead>
              <tr>
                <th></th>
                <th>Nama Barang</th>
                <th>Nama Customer</th>
                <th>Total Harga</th>
                <th className="text-center">Tanggal Pembelian</th>
                <th className="text-center">Tanggal Ditambahkan</th>
                <th>Keterangan</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, key) => (
                <tr key={item.id}>
                  <th> {key + 1} </th>
                  <td> {item.item_name} </td>
                  <td> {item.customer_name} </td>
                  <td>
                    Rp.{" "}
                    {Number(item.total_price).toLocaleString("id-ID", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}
                  </td>
                  <td className="text-center">
                    {" "}
                    {new Date(item.purchase_date).toLocaleString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}{" "}
                  </td>
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
                    <button className="btn btn-square btn-success">
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
                    <button className="btn btn-square btn-error lg:ml-2 ml-1">
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
        </div>
      </div>
      {/* MODAL TAMBAH BARANG */}
      <dialog id="modal_tambah_barang" className="modal">
        <div className="modal-box">
          <fieldset className="fieldset bg-base-200 border-slate-200 rounded-box w-full border p-4">
            <legend className="fieldset-legend text-lg">
              Tambah Pemasukan
            </legend>

            <label className="label">Nama Barang</label>
            <input type="text" className="input" placeholder="ex: Cheescake" />

            <label className="label">Pelanggan</label>
            <label className="select">
              <span className="label">Nama</span>
              <select>
                <option>Daffa</option>
                <option>Ariq</option>
              </select>
            </label>

            <label className="label">Tanggal Pembelian</label>
            <label className="input">
              <span className="label">Pilih Tanggal</span>
              <input type="date" />
            </label>

            <label className="label">Total Harga</label>
            <label className="input">
              <span className="label">Rp.</span>
              <input type="text" placeholder="50000" />
            </label>

            <button className="btn btn-info mt-4">Tambah</button>
          </fieldset>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}

export default Income;
