import React, { useState, useEffect } from "react";
import CountUp from "../components/CountUp";
import API from "../services/authService";

function Expense() {
  const [categoryData, setCategoryData] = useState({
    Produksi: 0,
    Operasional: 0,
    Marketing: 0,
  });

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
  return (
    <div>
      <div className="p-0 lg:p-6">
        <h2 className="text-2xl font-bold mb-4">Pengeluaran</h2>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1 lg:gap-4 mb-8 lg:text-lg text-4xl">
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
        </div>
      </div>
    </div>
  );
}

export default Expense;
