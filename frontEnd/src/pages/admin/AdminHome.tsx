import React, { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { format } from "date-fns";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { IPayment } from "../../types/IPayment";
import { CLIENT_API } from "../../utilities/axios/Axios";


const AdminHome: React.FC = () => {
  const [payments, setPayments] = useState<IPayment[]>([]);
  const [totalSales, setTotalSales] = useState<number>(0);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await CLIENT_API.get("/admin/salesReport");
      setPayments(response.data.payments);

      const total = response.data.payments.reduce((sum: number, payment: IPayment) => sum +( payment.amount ??0 ), 0);
      setTotalSales(total);
    } catch (error) {
      console.error("Error fetching payments", error);
    }
  };

  // Data for Recharts
  const chartData = payments.map((payment) => ({
    name: payment?.courseId?.title,
    Sales: payment.amount,
  }));

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Sales Report</h2>
      <div className="flex justify-between items-center mb-4">
        <span className="text-lg font-bold">Total Sales: ₹{totalSales.toFixed(2)}</span>
        <CSVLink
          data={payments.map((p) => ({
            Date: format(new Date(p.createdAt? p.createdAt:''), "yyyy-MM-dd"),
            User: p?.userId?.userName,
            Email: p?.userId?.email,
            Course: p?.courseId?.title,
            Amount: `₹${p.amount}`,
            Status: p.status,
          }))}
          filename="sales_report.csv"
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Export CSV
        </CSVLink>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Date</th>
              <th className="border p-2">User</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Course</th>
              <th className="border p-2">Amount</th>
              <th className="border p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment._id} className="text-center border-t">
                <td className="border p-2">{payment.createdAt ?format(new Date(payment.createdAt), "yyyy-MM-dd"): 'N/A'}</td>
                <td className="border p-2">{payment.userId?.userName}</td>
                <td className="border p-2">{payment?.userId?.email}</td>
                <td className="border p-2">{payment?.courseId?.title}</td>
                <td className="border p-2">₹{payment.amount}</td>
                <td className={`border p-2 ${payment.status === "completed" ? "text-green-500" : "text-red-500"}`}>
                  {payment.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sales Chart */}
      <h3 className="text-lg font-semibold mt-6">Sales Chart</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Sales" fill="#4A90E2" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AdminHome;

// import React, { useEffect, useState } from "react";
// import { CSVLink } from "react-csv";
// import { format } from "date-fns";
// import {
//   XAxis, YAxis, Tooltip,  ResponsiveContainer,
//   PieChart, Pie, Cell,  CartesianGrid, Area, AreaChart
// } from "recharts";
// import { IPayment } from "../../types/IPayment";
// import { CLIENT_API } from "../../utilities/axios/Axios";

// const AdminHome: React.FC = () => {
//   const [payments, setPayments] = useState<IPayment[]>([]);
//   const [totalSales, setTotalSales] = useState<number>(0);
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const [periodFilter, setPeriodFilter] = useState<string>("all");
//   const [statCards, setStatCards] = useState({
//     totalCourses: 0,
//     totalStudents: 0,
//     averageRating: 0,
//     completionRate: 0
//   });

//   // Colors for charts
//   const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#4BC0C0"];

//   useEffect(() => {
//     fetchDashboardData();
//   }, [periodFilter]);

//   const fetchDashboardData = async () => {
//     setIsLoading(true);
//     try {
//       // Fetch sales data
//       const response = await CLIENT_API.get(`/admin/salesReport?period=${periodFilter}`);
//       setPayments(response.data.payments);

//       const total = response.data.payments.reduce(
//         (sum: number, payment: IPayment) => sum + (payment.amount ?? 0),
//         0
//       );
//       setTotalSales(total);

//       // Fetch additional dashboard stats (this would be a separate endpoint in a real app)
//       // Here we're just using mock data for demonstration
//       setStatCards({
//         totalCourses: response.data.totalCourses || 24,
//         totalStudents: response.data.totalStudents || 358,
//         averageRating: response.data.averageRating || 4.7,
//         completionRate: response.data.completionRate || 78
//       });
//     } catch (error) {
//       console.error("Error fetching dashboard data", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Data for course revenue chart
//   const courseRevenueData = React.useMemo(() => {
//     const courseMap = new Map();
    
//     payments.forEach(payment => {
//       if (payment?.courseId?.title) {
//         const courseTitle = payment.courseId.title;
//         const currentAmount = courseMap.get(courseTitle) || 0;
//         courseMap.set(courseTitle, currentAmount + (payment.amount || 0));
//       }
//     });
    
//     return Array.from(courseMap.entries()).map(([name, value]) => ({ name, value }));
//   }, [payments]);

//   // Data for monthly revenue trend
//   const monthlyRevenueData = React.useMemo(() => {
//     const monthlyMap = new Map();
    
//     payments.forEach(payment => {
//       if (payment.createdAt) {
//         const month = format(new Date(payment.createdAt), "MMM yyyy");
//         const currentAmount = monthlyMap.get(month) || 0;
//         monthlyMap.set(month, currentAmount + (payment.amount || 0));
//       }
//     });
    
//     return Array.from(monthlyMap.entries())
//       .map(([month, amount]) => ({ month, amount }))
//       .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
//   }, [payments]);

//   // Format number as currency
//   const formatCurrency = (value: number) => {
//     return `₹${value.toFixed(2)}`;
//   };

//   // Handle period filter change
//   const handlePeriodChange = (period: string) => {
//     setPeriodFilter(period);
//   };

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-screen bg-gray-50">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-gray-50 min-h-screen">
//       <div className="p-6">
//         {/* Page Header */}
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
//             <p className="text-gray-600">Welcome to your admin dashboard</p>
//           </div>
//           <div className="mt-4 md:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
//             <div className="flex space-x-1 bg-white rounded-md shadow-sm p-1">
//               <button
//                 onClick={() => handlePeriodChange("week")}
//                 className={`px-3 py-1 text-sm rounded-md ${
//                   periodFilter === "week"
//                     ? "bg-blue-500 text-white"
//                     : "bg-white text-gray-600 hover:bg-gray-100"
//                 }`}
//               >
//                 Week
//               </button>
//               <button
//                 onClick={() => handlePeriodChange("month")}
//                 className={`px-3 py-1 text-sm rounded-md ${
//                   periodFilter === "month"
//                     ? "bg-blue-500 text-white"
//                     : "bg-white text-gray-600 hover:bg-gray-100"
//                 }`}
//               >
//                 Month
//               </button>
//               <button
//                 onClick={() => handlePeriodChange("year")}
//                 className={`px-3 py-1 text-sm rounded-md ${
//                   periodFilter === "year"
//                     ? "bg-blue-500 text-white"
//                     : "bg-white text-gray-600 hover:bg-gray-100"
//                 }`}
//               >
//                 Year
//               </button>
//               <button
//                 onClick={() => handlePeriodChange("all")}
//                 className={`px-3 py-1 text-sm rounded-md ${
//                   periodFilter === "all"
//                     ? "bg-blue-500 text-white"
//                     : "bg-white text-gray-600 hover:bg-gray-100"
//                 }`}
//               >
//                 All
//               </button>
//             </div>
//             <CSVLink
//               data={payments.map((p) => ({
//                 Date: format(new Date(p.createdAt ? p.createdAt : ""), "yyyy-MM-dd"),
//                 User: p?.userId?.userName,
//                 Email: p?.userId?.email,
//                 Course: p?.courseId?.title,
//                 Amount: `₹${p.amount}`,
//                 Status: p.status,
//               }))}
//               filename="sales_report.csv"
//               className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 transition-colors"
//             >
//               <svg
//                 className="w-4 h-4 mr-2"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
//                 />
//               </svg>
//               Export Report
//             </CSVLink>
//           </div>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
//           <div className="bg-white rounded-lg shadow-sm p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-500">Total Sales</p>
//                 <p className="text-2xl font-bold text-gray-800">{formatCurrency(totalSales)}</p>
//               </div>
//               <div className="bg-blue-100 p-3 rounded-full">
//                 <svg
//                   className="w-6 h-6 text-blue-600"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                   />
//                 </svg>
//               </div>
//             </div>
//             <div className="mt-4">
//               <div className="flex items-center">
//                 <span className="text-green-500 text-sm font-medium flex items-center">
//                   <svg
//                     className="w-3 h-3 mr-1"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M5 10l7-7m0 0l7 7m-7-7v18"
//                     />
//                   </svg>
//                   8.2%
//                 </span>
//                 <span className="text-gray-500 text-sm ml-2">from previous period</span>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow-sm p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-500">Total Courses</p>
//                 <p className="text-2xl font-bold text-gray-800">{statCards.totalCourses}</p>
//               </div>
//               <div className="bg-yellow-100 p-3 rounded-full">
//                 <svg
//                   className="w-6 h-6 text-yellow-600"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
//                   />
//                 </svg>
//               </div>
//             </div>
//             <div className="mt-4">
//               <div className="flex items-center">
//                 <span className="text-green-500 text-sm font-medium flex items-center">
//                   <svg
//                     className="w-3 h-3 mr-1"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M5 10l7-7m0 0l7 7m-7-7v18"
//                     />
//                   </svg>
//                   4.5%
//                 </span>
//                 <span className="text-gray-500 text-sm ml-2">new courses this month</span>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow-sm p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-500">Total Students</p>
//                 <p className="text-2xl font-bold text-gray-800">{statCards.totalStudents}</p>
//               </div>
//               <div className="bg-green-100 p-3 rounded-full">
//                 <svg
//                   className="w-6 h-6 text-green-600"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
//                   />
//                 </svg>
//               </div>
//             </div>
//             <div className="mt-4">
//               <div className="flex items-center">
//                 <span className="text-green-500 text-sm font-medium flex items-center">
//                   <svg
//                     className="w-3 h-3 mr-1"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M5 10l7-7m0 0l7 7m-7-7v18"
//                     />
//                   </svg>
//                   12.3%
//                 </span>
//                 <span className="text-gray-500 text-sm ml-2">growth rate</span>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow-sm p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-500">Avg. Course Rating</p>
//                 <p className="text-2xl font-bold text-gray-800">{statCards.averageRating}/5</p>
//               </div>
//               <div className="bg-purple-100 p-3 rounded-full">
//                 <svg
//                   className="w-6 h-6 text-purple-600"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
//                   />
//                 </svg>
//               </div>
//             </div>
//             <div className="mt-4">
//               <div className="flex items-center">
//                 <span className="text-green-500 text-sm font-medium flex items-center">
//                   <svg
//                     className="w-3 h-3 mr-1"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M5 10l7-7m0 0l7 7m-7-7v18"
//                     />
//                   </svg>
//                   0.2
//                 </span>
//                 <span className="text-gray-500 text-sm ml-2">from last month</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Charts Section */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
//           {/* Revenue Trend Chart */}
//           <div className="bg-white p-6 rounded-lg shadow-sm">
//             <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
//             <ResponsiveContainer width="100%" height={300}>
//               <AreaChart data={monthlyRevenueData}>
//                 <defs>
//                   <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="5%" stopColor="#4A90E2" stopOpacity={0.8} />
//                     <stop offset="95%" stopColor="#4A90E2" stopOpacity={0.1} />
//                   </linearGradient>
//                 </defs>
//                 <XAxis dataKey="month" />
//                 <YAxis tickFormatter={(value) => `₹${value}`} />
//                 <CartesianGrid strokeDasharray="3 3" vertical={false} />
//                 <Tooltip formatter={(value) => [`₹${value}`, "Revenue"]} />
//                 <Area
//                   type="monotone"
//                   dataKey="amount"
//                   stroke="#4A90E2"
//                   fillOpacity={1}
//                   fill="url(#colorRevenue)"
//                 />
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Course Revenue Distribution */}
//           <div className="bg-white p-6 rounded-lg shadow-sm">
//             <h3 className="text-lg font-semibold mb-4">Course Revenue Distribution</h3>
//             <ResponsiveContainer width="100%" height={300}>
//               <PieChart>
//                 <Pie
//                   data={courseRevenueData}
//                   cx="50%"
//                   cy="50%"
//                   labelLine={false}
//                   label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
//                   outerRadius={100}
//                   fill="#8884d8"
//                   dataKey="value"
//                 >
//                   {courseRevenueData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip formatter={(value) => [`₹${value}`, "Revenue"]} />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Sales Report Section */}
//         <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
//           <div className="flex justify-between items-center mb-6">
//             <h3 className="text-lg font-semibold">Sales Report</h3>
//             <div className="flex items-center space-x-2">
//               <span className="text-gray-500">Show</span>
//               <select className="border p-1 rounded">
//                 <option>10</option>
//                 <option>25</option>
//                 <option>50</option>
//               </select>
//               <span className="text-gray-500">entries</span>
//             </div>
//           </div>

//           <div className="overflow-x-auto">
//             <table className="w-full text-sm text-left">
//               <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
//                 <tr>
//                   <th className="px-6 py-3 font-medium tracking-wider">Date</th>
//                   <th className="px-6 py-3 font-medium tracking-wider">User</th>
//                   <th className="px-6 py-3 font-medium tracking-wider">Email</th>
//                   <th className="px-6 py-3 font-medium tracking-wider">Course</th>
//                   <th className="px-6 py-3 font-medium tracking-wider text-right">Amount</th>
//                   <th className="px-6 py-3 font-medium tracking-wider text-center">Status</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {payments.map((payment) => (
//                   <tr key={payment._id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {payment.createdAt
//                         ? format(new Date(payment.createdAt), "dd MMM yyyy")
//                         : "N/A"}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <div className="h-8 w-8 flex-shrink-0 mr-3">
//                           <div className="h-full w-full rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
//                             {payment?.userId?.userName?.charAt(0) || "?"}
//                           </div>
//                         </div>
//                         <div>
//                           <div className="font-medium text-gray-900">
//                             {payment.userId?.userName}
//                           </div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">{payment?.userId?.email}</td>
//                     <td className="px-6 py-4">
//                       <div className="line-clamp-1">{payment?.courseId?.title}</div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
//                       ₹{payment.amount}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-center">
//                       <span
//                         className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                           payment.status === "completed"
//                             ? "bg-green-100 text-green-800"
//                             : "bg-red-100 text-red-800"
//                         }`}
//                       >
//                         {payment.status}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           <div className="flex items-center justify-between mt-6">
//             <div className="text-sm text-gray-500">
//               Showing <span className="font-medium">1</span> to{" "}
//               <span className="font-medium">{payments.length}</span> of{" "}
//               <span className="font-medium">{payments.length}</span> entries
//             </div>
//             <div className="flex space-x-1">
//               <button className="px-3 py-1 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200">
//                 Previous
//               </button>
//               <button className="px-3 py-1 rounded-md bg-blue-500 text-white hover:bg-blue-600">
//                 1
//               </button>
//               <button className="px-3 py-1 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200">
//                 Next
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminHome;