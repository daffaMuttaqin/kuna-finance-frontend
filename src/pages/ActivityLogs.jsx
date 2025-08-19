import React, { useEffect, useState } from "react";
import API from "../services/authService";

function ActivityLogs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await API.get("/activity");
        setData(res.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // helper untuk format tanggal
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div>
      <div className="w-full h-full">
        <div className="p-0 lg:p-6">
          <div className="flex justify-between">
            <h2 className="text-2xl font-bold mb-4">Log Aktivitas</h2>
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
            </div>
          </div>

          {/* TABEL */}
          <div className="h-[723px] overflow-x-auto">
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p className="text-red-500">Error: {error}</p>
            ) : (
              <table className="table table-sm table-pin-rows">
                <thead>
                  <tr>
                    <th></th>
                    <th>Timestamp</th>
                    <th>User</th>
                    <th>Tipe Aktivitas</th>
                    <th>Keterangan</th>
                  </tr>
                </thead>
                <tbody>
                  {data
                    .filter((item) =>
                      item.name
                        ?.toLowerCase()
                        .includes(searchQuery.toLowerCase())
                    )
                    .map((item, key) => (
                      <tr key={item.id || `temp-${key}`}>
                        <th> {key + 1} </th>
                        <td>{formatDate(item.timestamp)}</td>
                        <td> {item.name} </td>
                        <td> {item.activity_type} </td>
                        <td> {item.description} </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
          </div>
          {/* END TABEL */}
        </div>
      </div>
    </div>
  );
}

export default ActivityLogs;
