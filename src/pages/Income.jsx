import React, { useEffect, useState } from "react";
import API from "../services/authService";
import Select from "react-select";

function Income() {
  const [data, setData] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [purchaseDate, setPurchaseDate] = useState("");
  const [totalPrice, setTotalPrice] = useState("");
  const [notes, setNotes] = useState("");

  // List manual barang
  const items = [
    {
      value: "Burnt Cheese Cake Brownies",
      label: "Burnt Cheese Cake Brownies",
    },
    { value: "Cheesetart Brule", label: "Cheesetart Brule" },
  ];

  // Ambil Data Seluruh Incomes
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

  // Ambil data customers
  useEffect(() => {
    API.get("/customers")
      .then((res) => {
        const options = res.data.map((customer) => ({
          value: customer.id,
          label: customer.name,
        }));
        setCustomers(options);
      })
      .catch((err) => {
        console.error("Gagal mengambil data pelanggan", err);
      });
  }, []);

  // Handle Submit
  const handleSubmit = async () => {
    if (!selectedItem || !selectedCustomer || !purchaseDate || !totalPrice) {
      alert("Harap isi semua Field");
      return;
    }

    const payload = {
      item_name: selectedItem.value,
      customer_id: selectedCustomer.value,
      purchase_date: purchaseDate,
      total_price: parseInt(totalPrice),
      notes: notes,
    };

    try {
      const res = await API.post("/incomes", payload);

      // Normalisasi data untuk menghindari error NaN dan Invalid Date
      const now = new Date().toISOString();
      // Tambah data baru ke dalam state `data` (tanpa fetch ulang)
      const newIncome = {
        ...res.data,
        customer_name: selectedCustomer.label,
        item_name: selectedItem.value,
        notes: notes,
        total_price: Number(res.data.total_price) || parseInt(totalPrice),
        purchase_date: res.data.purchase_date || purchaseDate || now,
        created_at: res.data.created_at || now,
      };

      // Tambahkan data baru ke state
      setData((prev) => [...prev, newIncome]);

      // Reset form
      setSelectedItem(null);
      setSelectedCustomer(null);
      setPurchaseDate("");
      setTotalPrice("");
      setNotes("");

      // Tutup modal
      document.getElementById("modal_tambah_barang").close();

      // Tampilkan toast sukses
      const toast = document.getElementById("toast-success");
      toast.classList.remove("hidden");
      setTimeout(() => {
        toast.classList.add("hidden");
      }, 3000);
    } catch (err) {
      console.error(err);
      alert("Gagal mengirim data");
    }
  };

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
                <tr key={item.id || `temp-${key}`}>
                  <th> {key + 1} </th>
                  <td> {item.item_name} </td>
                  <td> {item.customer_name} </td>
                  <td>
                    Rp.{" "}
                    {item.total_price &&
                      Number(item.total_price).toLocaleString("id-ID", {
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

            {/* Nama Barang */}
            <label className="label">Nama Barang</label>
            <label className="">
              <Select
                options={items}
                value={selectedItem}
                onChange={setSelectedItem}
                placeholder="Pilih barang.."
                isSearchable
              />
            </label>

            {/* Customer */}
            <label className="label">Pelanggan</label>
            <label className="">
              <Select
                options={customers}
                value={selectedCustomer}
                onChange={setSelectedCustomer}
                placeholder="Pilih pelanggan.."
                isSearchable
              />
            </label>

            {/* Tanggal Pembelian */}
            <label className="label">Tanggal Pembelian</label>
            <label className="input">
              <span className="label">Pilih Tanggal</span>
              <input
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
              />
            </label>

            {/* Total Harga */}
            <label className="label">Total Harga</label>
            <label className="input">
              <span className="label">Rp.</span>
              <input
                type="number"
                value={totalPrice}
                onChange={(e) => setTotalPrice(e.target.value)}
                placeholder="50000"
              />
            </label>

            {/* Catatan */}
            <label className="label">Catatan</label>
            <textarea
              className="textarea textarea-bordered w-full"
              placeholder="Catatan tambahan..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            ></textarea>

            {/* Tombol Submit */}
            <button onClick={handleSubmit} className="btn btn-info mt-4">
              Tambah
            </button>
          </fieldset>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      {/* TOAST SUCCESS */}
      <div
        id="toast-success"
        className="hidden fixed bottom-5 right-5 flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow-sm  z-50"
        role="alert"
      >
        <div className="inline-flex items-center justify-center shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg ">
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
          </svg>
          <span className="sr-only">Check icon</span>
        </div>
        <div className="ms-3 text-sm font-normal">
          Data berhasil ditambahkan.
        </div>
        <button
          type="button"
          className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 "
          onClick={() =>
            document.getElementById("toast-success").classList.add("hidden")
          }
          aria-label="Close"
        >
          <span className="sr-only">Close</span>
          <svg
            className="w-3 h-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default Income;
