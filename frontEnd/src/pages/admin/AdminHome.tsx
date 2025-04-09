import React, { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { format } from "date-fns";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { IPayment } from "../../types/IPayment";
import { CLIENT_API } from "../../utilities/axios/Axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; 

const AdminHome: React.FC = () => {
  const [payments, setPayments] = useState<IPayment[]>([]);
  const [totalSales, setTotalSales] = useState<number>(0);

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Sales Report", 14, 10);
  
    const tableData = payments.map((p) => [
      format(new Date(p.createdAt || ""), "yyyy-MM-dd"),
      p?.userId?.userName || 'N/A',
      p?.userId?.email || 'N/A',
      p?.courseId?.title || 'N/A',
      `${p.amount}`,
      p.status || 'N/A',
    ]);
  
    autoTable(doc,{
      head: [["Date", "User", "Email", "Course", "Amount", "Status"]],
      body: tableData,
      startY: 20,
    });
  
    doc.save("sales_report.pdf");
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await CLIENT_API.get("/admin/salesReport");
      setPayments(response.data.payments);
      const total = response.data.payments.reduce((sum: number, payment: IPayment) => sum + (payment.amount ?? 0), 0);
      setTotalSales(total);
    } catch (error) {
      console.error("Error fetching payments", error);
    }
  };

  const aggregatedData = payments.reduce((acc, payment) => {
    const courseTitle = payment?.courseId?.title || "Unknown";
    if (!acc[courseTitle]) {
      acc[courseTitle] = 0;
    }
    acc[courseTitle] += payment.amount ?? 0;
    return acc;
  }, {} as { [key: string]: number });

  const chartData = Object.keys(aggregatedData).map((courseTitle) => ({
    name: courseTitle,
    Sales: aggregatedData[courseTitle],
  }));

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4">Sales Report</h2>
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <span className="text-base sm:text-lg font-bold">Total Sales: ₹{totalSales.toFixed(2)}</span>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <CSVLink
            data={payments.map((p) => ({
              Date: format(new Date(p.createdAt || ''), "yyyy-MM-dd"),
              User: p?.userId?.userName,
              Email: p?.userId?.email,
              Course: p?.courseId?.title,
              Amount: `₹${p.amount}`,
              Status: p.status,
            }))}
            filename="sales_report.csv"
            className="px-4 py-2 bg-blue-500 text-white rounded-md text-center w-full sm:w-auto"
          >
            Export CSV
          </CSVLink>
          <button
            onClick={exportToPDF}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors w-full sm:w-auto"
          >
            Export to PDF
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 text-sm sm:text-base">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Date</th>
              <th className="border p-2 text-left hidden sm:table-cell">User</th>
              <th className="border p-2 text-left hidden md:table-cell">Email</th>
              <th className="border p-2 text-left">Course</th>
              <th className="border p-2 text-left">Amount</th>
              <th className="border p-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment._id} className="border-t">
                <td className="border p-2">
                  {payment.createdAt ? format(new Date(payment.createdAt), "yyyy-MM-dd") : 'N/A'}
                </td>
                <td className="border p-2 hidden sm:table-cell">{payment.userId?.userName || 'N/A'}</td>
                <td className="border p-2 hidden md:table-cell">{payment?.userId?.email || 'N/A'}</td>
                <td className="border p-2">{payment?.courseId?.title || 'N/A'}</td>
                <td className="border p-2">₹{payment.amount}</td>
                <td className={`border p-2 ${payment.status === "completed" ? "text-green-500" : "text-red-500"}`}>
                  {payment.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Chart Section */}
      <h3 className="text-lg sm:text-xl font-semibold mt-6 mb-4">Sales Chart</h3>
      <div className="w-full h-[300px] sm:h-[400px]">
        <ResponsiveContainer>
          <BarChart data={chartData}>
            <XAxis 
              dataKey="name" 
              angle={-45} 
              textAnchor="end" 
              height={60}
              interval={0}
              tick={{ fontSize: 12 }}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="Sales" fill="#4A90E2" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminHome;