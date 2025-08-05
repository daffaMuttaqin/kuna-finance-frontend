import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/authService";
import CountUp from "../components/CountUp";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    incomeToday: 0,
    incomeMonth: 0,
    expenseToday: 0,
    expenseMonth: 0,
  });

  const [graphData, setGraphData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("/dashboard");

        setData(res.data);

        // Format data untuk Chart
        setGraphData([
          {
            name: "Hari ini",
            Pemasukan: res.data.incomeToday,
            Pengeluaran: res.data.expenseToday,
          },
          {
            name: "Bulan ini",
            Pemasukan: res.data.incomeMonth,
            Pengeluaran: res.data.expenseMonth,
          },
        ]);
      } catch (error) {
        console.error("Gagal mengambil data dashboard", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <div className="p-0 lg:p-6">
        <h2 className="text-2xl font-bold mb-4">Dashboard Keuangan</h2>

        {/* STAT BOX */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1 lg:gap-4 mb-8">
          <div className="flex flex-col lg:flex-row">
            <div className="stat bg-green-300 my-1 lg:my-0 rounded-lg lg:rounded-none lg:rounded-s-lg shadow-md">
              <div className="stat-title">Pemasukan Hari Ini</div>
              <div className="stat-value">
                <span>Rp. </span>
                <CountUp
                  from={0}
                  to={Number(data.incomeToday)}
                  separator="."
                  duration={0.1}
                  className="inline"
                />
              </div>
            </div>
            <div className="stat bg-green-300 my-1 lg:my-0 rounded-lg lg:rounded-none lg:rounded-e-lg shadow-md">
              <div className="stat-title">Pemasukan Bulan Ini</div>
              <div className="stat-value">
                <span>Rp. </span>
                <CountUp
                  from={0}
                  to={Number(data.incomeMonth)}
                  separator="."
                  duration={0.1}
                  className="inline"
                />
              </div>
            </div>
          </div>
          <div className=" flex flex-col lg:flex-row">
            <div className="stat bg-red-300 my-1 lg:my-0 rounded-lg lg:rounded-none lg:rounded-s-lg shadow-md">
              <div className="stat-title">Pemasukan Hari Ini</div>
              <div className="stat-value">
                <span>Rp. </span>
                <CountUp
                  from={0}
                  to={Number(data.expenseToday)}
                  separator="."
                  duration={0.1}
                  className="inline"
                />
              </div>
            </div>
            <div className="stat bg-red-300 my-1 lg:my-0 rounded-lg lg:rounded-none lg:rounded-e-lg shadow-md">
              <div className="stat-title">Pemasukan Bulan Ini</div>
              <div className="stat-value">
                <span>Rp. </span>
                <CountUp
                  from={0}
                  to={Number(data.expenseMonth)}
                  separator="."
                  duration={0.1}
                  className="inline"
                />
              </div>
            </div>
          </div>
        </div>

        {/* GRAFIK */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">
            Grafik Omzet & Pengeluaran
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={graphData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `Rp${value / 1000}k`} />
              <Tooltip
                formatter={(value) =>
                  `Rp. ${Number(value.toLocaleString("id-ID"))}`
                }
              />
              <Bar dataKey="Pemasukan" fill="#4ade80" />
              <Bar dataKey="Pengeluaran" fill="#f87171" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
