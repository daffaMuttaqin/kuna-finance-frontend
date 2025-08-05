import React from "react";
import CountUp from "../components/CountUp";

function Expense() {
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
                to={100000}
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
                to={40000}
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
                  to={50000}
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
