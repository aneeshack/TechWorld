
// // import { CreditCard, Calendar, AlertCircle, CheckCircle, XCircle, DollarSign } from 'lucide-react';
// import { Calendar} from 'lucide-react';
// import { IPayment } from '../../types/IPayment';
// import { useEffect, useState } from 'react';
// import { CLIENT_API } from '../../utilities/axios/Axios';
// import { useSelector } from 'react-redux';
// import { RootState } from '../../redux/store';

// const PurchaseHistory = () => {

//   const user = useSelector((state: RootState) => state.auth.data);
//   const [purchaseHistory, setPurchaseHistory] = useState<IPayment[]>([]);

//  useEffect(() => {
//     const fetchInstructorData = async () => {
//       try {
//         const response = await CLIENT_API.get(`/student/payment/${user?._id}`);
//         console.log('Fetched student Data:', response.data.data);
//         setPurchaseHistory(response.data.data);
//       } catch (err) {
//         console.error('Error fetching student data:', err);
//       }
//     };

//     fetchInstructorData();
//   }, [user?._id]);

//   return (
//     <div className="lg:w-5/6 max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md my-10">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <h1 className="text-3xl font-bold text-gray-800">Purchase History</h1>
//         <div className="flex items-center gap-2 text-gray-600">
//           <Calendar size={20} />
//           <span>{new Date().toLocaleDateString()}</span>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto">
//         <table className="w-full table-auto border-collapse">
//           <thead>
//             <tr className="bg-gray-100 text-gray-700 text-left">
//               <th className="px-4 py-3 font-semibold">Course</th>
//               {/* <th className="px-4 py-3 font-semibold">Payment Method</th> */}
//               <th className="px-4 py-3 font-semibold">Status</th>
//               {/* <th className="px-4 py-3 font-semibold">Type</th> */}
//               <th className="px-4 py-3 font-semibold">Amount</th>
//               <th className="px-4 py-3 font-semibold">Date</th>
//             </tr>
//           </thead>
//           <tbody>
//             {purchaseHistory &&  purchaseHistory.length === 0 ? (
//               <tr>
//                 <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
//                   No purchase history available.
//                 </td>
//               </tr>
//             ) : (
//              purchaseHistory.map((purchase) => (
//                 <tr key={purchase?.courseId?._id} className="border-b hover:bg-gray-50">
//                   <td className="px-4 py-4">{purchase.courseId?.title}</td>
//                   {/* <td className="px-4 py-4 flex items-center gap-2">
//                     <CreditCard size={18} className="text-gray-500" />
//                     {purchase.method}
//                   </td> */}
//                   <td className="px-4 py-4 flex items-center gap-2 ">
//                     <span className="capitalize">{purchase?.status}</span>
//                   </td> 
//                   {/* <td className="px-4 py-4 capitalize">{purchase.type}</td> */}
//                   <td className="px-4 py-4">₹{purchase?.amount?.toFixed(2) || 'Not specified'}</td>
//                   <td className="px-4 py-4">{purchase.createdAt ? new Date(purchase?.createdAt).toDateString().slice(4) : 'N/A'}</td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//     </div>
//   );
// };

// export default PurchaseHistory;

import { CreditCard, Calendar, AlertCircle, CheckCircle, XCircle, DollarSign } from 'lucide-react';
import { IPayment } from '../../types/IPayment';
import { useEffect, useState } from 'react';
import { CLIENT_API } from '../../utilities/axios/Axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

const PurchaseHistory = () => {
  const user = useSelector((state: RootState) => state.auth.data);
  const [purchaseHistory, setPurchaseHistory] = useState<IPayment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInstructorData = async () => {
      setIsLoading(true);
      try {
        const response = await CLIENT_API.get(`/student/payment/${user?._id}`);
        console.log('Fetched student Data:', response.data.data);
        setPurchaseHistory(response.data.data);
      } catch (err) {
        console.error('Error fetching student data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInstructorData();
  }, [user?._id]);

  // Function to determine status display properties
  const getStatusProps = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'success':
        return {
          icon: <CheckCircle size={16} className="text-green-500" />,
          bgColor: 'bg-green-50',
          textColor: 'text-green-700'
        };
      case 'pending':
        return {
          icon: <AlertCircle size={16} className="text-yellow-500" />,
          bgColor: 'bg-yellow-50',
          textColor: 'text-yellow-700'
        };
      case 'failed':
      case 'cancelled':
        return {
          icon: <XCircle size={16} className="text-red-500" />,
          bgColor: 'bg-red-50',
          textColor: 'text-red-700'
        };
      default:
        return {
          icon: <AlertCircle size={16} className="text-gray-500" />,
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-700'
        };
    }
  };

  // Calculate total amount spent
  const totalSpent = purchaseHistory
    .filter(p => p?.status?.toLowerCase() === 'completed' || p?.status?.toLowerCase() === 'success')
    .reduce((sum, purchase) => sum + (purchase?.amount || 0), 0);

  return (
    <div className="lg:w-5/6 max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md my-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Purchase History</h1>
          <p className="text-gray-500 mt-1">Track all your course purchases</p>
        </div>
        <div className="flex items-center gap-2 text-gray-600 mt-4 sm:mt-0 bg-gray-50 px-3 py-2 rounded-md">
          <Calendar size={18} />
          <span>{new Date().toLocaleDateString()}</span>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-blue-800 font-medium">Total Purchases</h3>
            <CreditCard size={20} className="text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-blue-900">{purchaseHistory.length}</p>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-green-800 font-medium">Total Amount</h3>
            <DollarSign size={20} className="text-green-500" />
          </div>
          <p className="text-2xl font-bold text-green-900">₹{totalSpent.toFixed(2)}</p>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-purple-800 font-medium">Recent Purchase</h3>
            <Calendar size={20} className="text-purple-500" />
          </div>
          <p className="text-lg font-semibold text-purple-900 truncate">
            {purchaseHistory.length > 0 && purchaseHistory[0]?.createdAt
              ? new Date(purchaseHistory[0].createdAt).toLocaleDateString()
              : 'N/A'}
          </p>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        /* Table Section */
        <div className="bg-gray-50 p-5 rounded-lg">
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse bg-white rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-100 text-gray-700 text-left">
                  <th className="px-6 py-3 font-semibold">Course</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold">Amount</th>
                  <th className="px-6 py-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {purchaseHistory && purchaseHistory.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <CreditCard size={40} className="text-gray-300 mb-2" />
                        <p className="text-lg font-medium">No purchase history available</p>
                        <p className="text-sm text-gray-400 mt-1">Your purchased courses will appear here</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  purchaseHistory.map((purchase) => {
                    const { icon, bgColor, textColor } = getStatusProps(purchase?.status || '');
                    return (
                      <tr key={purchase?.courseId?._id} className="border-b hover:bg-blue-50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-800">{purchase.courseId?.title}</p>
                            <p className="text-xs text-gray-500 mt-1">ID: {purchase.courseId?._id?.substring(0, 8) || 'N/A'}...</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${bgColor} ${textColor}`}>
                            {icon}
                            <span className="text-sm font-medium capitalize">{purchase?.status}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium">₹{purchase?.amount?.toFixed(2) || 'Not specified'}</td>
                        <td className="px-6 py-4">
                          <div className="text-gray-700">{purchase.createdAt ? new Date(purchase?.createdAt).toDateString().slice(4) : 'N/A'}</div>
                          <div className="text-xs text-gray-500">
                            {purchase.createdAt ? new Date(purchase?.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Footer with totals - Only show if we have purchases */}
      {!isLoading && purchaseHistory.length > 0 && (
        <div className="mt-6 flex justify-end">
          <div className="bg-gray-50 rounded-lg px-6 py-4 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="text-gray-600">Total Amount:</span>
              <span className="text-xl font-bold text-gray-800">₹{totalSpent.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseHistory;