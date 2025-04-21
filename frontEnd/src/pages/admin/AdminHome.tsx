import React, { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { format, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from "date-fns";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid
} from "recharts";
import { IPayment } from "../../types/IPayment";
import { CLIENT_API } from "../../utilities/axios/Axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Debounce hook
const useDebounce = (value: string, delay: number): string => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const AdminHome: React.FC = () => {
  const [payments, setPayments] = useState<IPayment[]>([]);
  const [totalSales, setTotalSales] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'table' | 'charts'>('table');
  const [search, setSearch] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalPayments, setTotalPayments] = useState<number>(0);
  const limit = 3; // Payments per page
  const debouncedSearch = useDebounce(search, 500);
  const [courseRevenue, setCourseRevenue] = useState<{ name: string; fullName: string; Sales: number }[]>([]);

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
  
    autoTable(doc, {
      head: [["Date", "User", "Email", "Course", "Amount", "Status"]],
      body: tableData,
      startY: 20,
    });
  
    doc.save("sales_report.pdf");
  };

  // Fetch course-wise revenue and total stats
  const fetchCourseRevenue = async () => {
    try {
      const response = await CLIENT_API.get("/admin/courseRevenue");
      const { courseRevenue, totalSales, totalPayments } = response.data;

      const formattedData = courseRevenue
        .map((item: { courseTitle: string; revenue: number }) => ({
          name: item.courseTitle.length > 15 ? `${item.courseTitle.substring(0, 15)}...` : item.courseTitle,
          fullName: item.courseTitle,
          Sales: item.revenue,
        }))
        .sort((a: { Sales: number }, b: { Sales: number }) => b.Sales - a.Sales)
        .slice(0, 10); // Limit to top 10 courses

      setCourseRevenue(formattedData);
      setTotalSales(totalSales);
      setTotalPayments(totalPayments);
    } catch (error) {
      console.error("Error fetching course revenue", error);
    }
  };

  useEffect(() => {
    fetchPayments();
    fetchCourseRevenue()
  }, [currentPage, debouncedSearch]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const response = await CLIENT_API.get("/admin/salesReport", {
        params: { page: currentPage, limit, search: debouncedSearch },
      });
      setPayments(response.data.payments);
      // setTotalPayments(response.data.totalPayments);
      setTotalPages(response.data.totalPages);
      // const total = response.data.payments.reduce((sum: number, payment: IPayment) => sum + (payment.amount ?? 0), 0);
      // setTotalSales(total);
    } catch (error) {
      console.error("Error fetching payments", error);
    } finally {
      setLoading(false);
    }
  };

  // Prepare data for course sales bar chart
  const aggregatedData = payments.reduce((acc, payment) => {
    const courseTitle = payment?.courseId?.title || "Unknown";
    if (!acc[courseTitle]) {
      acc[courseTitle] = 0;
    }
    acc[courseTitle] += payment.amount ?? 0;
    return acc;
  }, {} as { [key: string]: number });

  const courseSalesData = Object.keys(aggregatedData).map((courseTitle) => ({
    name: courseTitle.length > 15 ? `${courseTitle.substring(0, 15)}...` : courseTitle,
    fullName: courseTitle,
    Sales: aggregatedData[courseTitle],
  }));

  // Prepare data for monthly sales trend line chart
  const getMonthlyData = () => {
    if (payments.length === 0) return [];
    
    const today = new Date();
    const sixMonthsAgo = subMonths(today, 5);
    
    const monthsArray = eachMonthOfInterval({
      start: startOfMonth(sixMonthsAgo),
      end: endOfMonth(today)
    });
    
    const monthlyData = monthsArray.map(month => ({
      month: format(month, 'MMM yyyy'),
      date: month,
      value: 0
    }));
    
    payments.forEach(payment => {
      if (!payment.createdAt) return;
      
      const paymentDate = new Date(payment.createdAt);
      const monthIdx = monthlyData.findIndex(m => 
        paymentDate >= startOfMonth(m.date) && 
        paymentDate <= endOfMonth(m.date)
      );
      
      if (monthIdx >= 0) {
        monthlyData[monthIdx].value += payment.amount ?? 0;
      }
    });
    
    return monthlyData;
  };
  
  const monthlySalesData = getMonthlyData();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 shadow-md rounded">
          <p className="font-semibold">{payload[0].payload.fullName || label}</p>
          <p className="text-blue-600">Sales: ₹{payload[0].value.toFixed(2)}</p>
        </div>
      );
    }
    return null;
  };

  // Pagination handlers
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Sales Dashboard</h2>
      
      {/* Header Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg shadow border border-blue-100">
          <p className="text-sm text-blue-600 font-medium">Total Revenue</p>
          <p className="text-2xl font-bold text-gray-800">₹{totalSales.toFixed(2)}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg shadow border border-green-100">
          <p className="text-sm text-green-600 font-medium">Total Transactions</p>
          <p className="text-2xl font-bold text-gray-800">{totalPayments}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg shadow border border-purple-100">
          <p className="text-sm text-purple-600 font-medium">Average Sale</p>
          <p className="text-2xl font-bold text-gray-800">
            ₹{totalPayments ? (totalSales / totalPayments).toFixed(2) : "0.00"}
          </p>
        </div>
      </div>
      
      {/* Export buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
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
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Export CSV</span>
        </CSVLink>
        <button
          onClick={exportToPDF}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center space-x-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Export PDF</span>
        </button>
      </div>

      {/* Toggle tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button 
          className={`py-2 px-4 font-medium ${activeTab === 'table' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('table')}
        >
          Transaction Details
        </button>
        <button 
          className={`py-2 px-4 font-medium ${activeTab === 'charts' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('charts')}
        >
          Analytics
        </button>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'table' ? (
        <div className="space-y-4">
          {/* Search Input */}
          <div className="flex justify-between items-center">
            <input
              type="text"
              placeholder="Search by user, email, or course..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
              className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            />
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="text-center py-10">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-600">Loading transactions...</p>
              </div>
            ) : payments.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-600">No transaction data available</p>
              </div>
            ) : (
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
                    <tr key={payment._id} className="hover:bg-gray-50">
                      <td className="border p-2">
                        {payment.createdAt ? format(new Date(payment.createdAt), "yyyy-MM-dd") : 'N/A'}
                      </td>
                      <td className="border p-2 hidden sm:table-cell">{payment.userId?.userName || 'N/A'}</td>
                      <td className="border p-2 hidden md:table-cell">{payment?.userId?.email || 'N/A'}</td>
                      <td className="border p-2">{payment?.courseId?.title || 'N/A'}</td>
                      <td className="border p-2 font-medium">₹{payment.amount}</td>
                      <td className="border p-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          payment.status === "completed" 
                            ? "bg-green-100 text-green-700" 
                            : "bg-yellow-100 text-yellow-700"
                        }`}>
                          {payment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4 text-sm sm:text-base">
              <div>
                <p className="text-gray-600">
                  Showing {(currentPage - 1) * limit + 1} to {Math.min(currentPage * limit, totalPayments)} of {totalPayments} transactions
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50 hover:bg-gray-300"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, index) => index + 1)
                  .filter(page => {
                    if (totalPages <= 5) return true;
                    if (page === 1 || page === totalPages) return true;
                    if (page >= currentPage - 1 && page <= currentPage + 1) return true;
                    return false;
                  })
                  .map(page => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50 hover:bg-gray-300"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-8">


          {/* Top 10 Course-Wise Revenue Table */}
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Top 10 Courses by Revenue</h3>
            <div className="overflow-x-auto">
              {loading ? (
                <div className="text-center py-10">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="mt-2 text-gray-600">Loading course revenue...</p>
                </div>
              ) : courseRevenue.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-600">No course revenue data available</p>
                </div>
              ) : (
                <table className="w-full border-collapse border border-gray-300 text-sm sm:text-base">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2 text-left">Course</th>
                      <th className="border p-2 text-left">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courseRevenue.map((course) => (
                      <tr key={course.fullName} className="hover:bg-gray-50">
                        <td className="border p-2">{course.fullName}</td>
                        <td className="border p-2 font-medium">₹{course.Sales.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
          
          {/* Monthly Sales Trend Line Chart */}
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Monthly Sales Trend</h3>
            <div className="w-full h-64">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : monthlySalesData.length > 0 ? (
                <ResponsiveContainer>
                  <LineChart data={monthlySalesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      formatter={(value: number) => [`₹${value.toFixed(2)}`, 'Sales']}
                      labelFormatter={(label) => `Month: ${label}`}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      name="Monthly Sales" 
                      stroke="#8884d8" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p>No monthly data available</p>
                </div>
              )}
            </div>
          </div>

          {/* Course Sales Bar Chart */}
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Sales by Course</h3>
            <div className="w-full h-80">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : courseSalesData.length > 0 ? (
                <ResponsiveContainer>
                  <BarChart data={courseSalesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45} 
                      textAnchor="end" 
                      height={80}
                      interval={0}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="Sales" name="Course Sales" fill="#4A90E2" barSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p>No course sales data available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHome;