import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import API from "../services/authService";
import {
  fetchIncomes,
  addIncome,
  updateIncome,
  deleteIncome,
} from "../features/incomeSlice";

function Income() {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.income);

  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [purchaseDate, setPurchaseDate] = useState("");
  const [totalPrice, setTotalPrice] = useState("");
  const [notes, setNotes] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const items = [
    {
      value: "Burnt Cheese Cake Brownies",
      label: "Burnt Cheese Cake Brownies",
    },
    { value: "Cheesetart Brule", label: "Cheesetart Brule" },
  ];

  // Fetch data incomes dari Redux
  useEffect(() => {
    dispatch(fetchIncomes());
  }, [dispatch]);

  // Fetch customers (masih manual API langsung, karena tidak ada slice-nya)
  useEffect(() => {
    API.get("/customers")
      .then((res) => {
        const options = res.data.map((c) => ({
          value: c.id,
          label: c.name,
        }));
        setCustomers(options);
      })
      .catch((err) => console.error("Gagal mengambil data pelanggan", err));
  }, []);

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
      notes,
    };

    try {
      if (isEditing && editingId) {
        const res = await API.put(`/incomes/${editingId}`, payload);
        const now = new Date().toISOString();

        // Ambil data lama dari store
        const oldData = data.find((i) => i.id === editingId);

        const updatedIncome = {
          ...oldData, // merge dengan data lama supaya field lain tidak hilang
          ...res.data,
          id: Number(editingId), // pastikan tipe sama
          item_name: selectedItem.value,
          customer_name: selectedCustomer.label,
          notes,
          total_price: parseInt(totalPrice),
          purchase_date: res.data.purchase_date || purchaseDate || now,
          created_at: res.data.created_at || now,
        };
        dispatch(updateIncome(updatedIncome));
        setToastMessage("Data telah berhasil diedit");
      } else {
        const res = await API.post("/incomes", payload);
        const now = new Date().toISOString();
        const newIncome = {
          ...res.data,
          customer_name: selectedCustomer.label,
          item_name: selectedItem.value,
          notes,
          total_price: Number(res.data.total_price) || parseInt(totalPrice),
          purchase_date: res.data.purchase_date || purchaseDate || now,
          created_at: res.data.created_at || now,
        };
        dispatch(addIncome(newIncome));
        setToastMessage("Data telah berhasil ditambah");
      }

      resetForm();
      document.getElementById("modal_tambah_barang").close();
      showToast();
    } catch (err) {
      console.error(err);
      alert("Gagal mengirim data");
    }
  };

  const handleDelete = async () => {
    try {
      await API.delete(`/incomes/${deleteId}`);
      dispatch(deleteIncome(deleteId));
      document.getElementById("modal_delete").close();
      setToastMessage("Data berhasil dihapus");
      showToast();
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus data");
    }
  };

  const handleEdit = (item) => {
    setIsEditing(true);
    setEditingId(item.id);
    setSelectedItem({ label: item.item_name, value: item.item_name });
    setSelectedCustomer({ label: item.customer_name, value: item.customer_id });
    setPurchaseDate(parseDateToLocalInput(item.purchase_date));
    setTotalPrice(item.total_price);
    setNotes(item.notes || "");
    document.getElementById("modal_tambah_barang").showModal();
  };

  const resetForm = () => {
    setSelectedItem(null);
    setSelectedCustomer(null);
    setPurchaseDate("");
    setTotalPrice("");
    setNotes("");
    setIsEditing(false);
    setEditingId(null);
  };

  const parseDateToLocalInput = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const showToast = () => {
    const toast = document.getElementById("toast-success");
    toast.classList.remove("hidden");
    setTimeout(() => toast.classList.add("hidden"), 3000);
  };

  return (
    <div className="w-full h-full">
      <div className="p-0 lg:p-6">
        <div className="flex justify-between">
          <h2 className="text-2xl font-bold mb-4">Pemasukan</h2>
          <div className="flex">
            {/* Input Search */}
            <div className="lg:block ">
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
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  required
                  placeholder="Cari nama"
                />
              </label>
            </div>
            {/* End Search */}

            {/* Tambah income */}
            <button
              className="btn btn-info ml-2"
              onClick={() => {
                resetForm();
                document.getElementById("modal_tambah_barang").showModal();
              }}
            >
              Tambah
            </button>
          </div>
        </div>

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
                  <th>Nama Customer</th>
                  <th>Total Harga</th>
                  <th className="text-center">Tanggal Pembelian</th>
                  <th className="text-center">Tanggal Ditambahkan</th>
                  <th>Keterangan</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {data
                  .filter((item) =>
                    item.customer_name
                      ?.toLowerCase()
                      .includes(searchQuery.toLowerCase())
                  )
                  .map((item, key) => (
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
                        <button
                          onClick={() => handleEdit(item)}
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
                          onClick={() => {
                            setDeleteId(item.id); // simpan id yang akan dihapus
                            document.getElementById("modal_delete").showModal();
                          }}
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

      {/* MODAL */}

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
              Submit
            </button>
          </fieldset>
        </div>
        <form method="dialog" className="modal-backdrop" onClick={resetForm}>
          <button>close</button>
        </form>
      </dialog>

      {/* MODAL DELETE ITEM */}
      <dialog id="modal_delete" className="modal">
        <div className="modal-box">
          <div className="p-4 md:p-5 text-center">
            <svg
              className="mx-auto mb-4 text-gray-400 w-12 h-12 "
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            <h3 className="mb-5 text-lg font-normal ">
              Apakah kamu yakin ingin menghapus data ini?
            </h3>
            <button
              onClick={handleDelete}
              type="button"
              className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
            >
              Ya, Saya yakin
            </button>
            <button
              onClick={() => {
                setDeleteId(null);
                document.getElementById("modal_delete").close();
              }}
              type="button"
              className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100"
            >
              Tidak
            </button>
          </div>
        </div>
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
        <div className="ms-3 text-sm font-normal">{toastMessage}</div>
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
