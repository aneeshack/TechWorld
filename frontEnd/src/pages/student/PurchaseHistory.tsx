import { CreditCard, Calendar, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
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
          icon: <CheckCircle size={16} className="text-blue-500" />,
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-700'
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
    <div className="w-full max-w-6xl mx-auto p-3 sm:p-6 bg-white  my-4 sm:my-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-8 pb-4 sm:pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Purchase History</h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1">Track all your course purchases</p>
        </div>
        <div className="flex items-center gap-2 text-gray-600 mt-4 sm:mt-0 bg-gray-50 px-3 py-2 rounded-md text-sm">
          <Calendar size={16} className="sm:size-18" />
          <span>{new Date().toLocaleDateString()}</span>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-blue-50 rounded-lg p-3 sm:p-4 shadow-sm">
          <div className="flex justify-between items-center mb-1 sm:mb-2">
            <h3 className="text-sm sm:text-base text-blue-800 font-medium">Total Purchases</h3>
            <CreditCard size={18} className="text-blue-500" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-blue-900">{purchaseHistory.length}</p>
        </div>
        
        <div className="bg-green-50 rounded-lg p-3 sm:p-4 shadow-sm">
          <div className="flex justify-between items-center mb-1 sm:mb-2">
            <h3 className="text-sm sm:text-base text-green-800 font-medium">Total Amount</h3>
            <span className="text-green-500 text-lg">₹</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-green-900">₹{totalSpent.toFixed(2)}</p>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-3 sm:p-4 shadow-sm">
          <div className="flex justify-between items-center mb-1 sm:mb-2">
            <h3 className="text-sm sm:text-base text-purple-800 font-medium">Recent Purchase</h3>
            <Calendar size={18} className="text-purple-500" />
          </div>
          <p className="text-base sm:text-lg font-semibold text-purple-900 truncate">
            {purchaseHistory.length > 0 && purchaseHistory[0]?.createdAt
              ? new Date(purchaseHistory[0].createdAt).toLocaleDateString()
              : 'N/A'}
          </p>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center items-center py-10 sm:py-20">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        /* Table Section - Card view on mobile, table on larger screens */
        <div className="bg-gray-50 p-2 sm:p-5 rounded-lg">
          {/* Mobile Card View */}
          <div className="block md:hidden space-y-4">
            {purchaseHistory && purchaseHistory.length === 0 ? (
              <div className="bg-white rounded-lg p-6 text-center text-gray-500">
                <div className="flex flex-col items-center">
                  <CreditCard size={40} className="text-gray-300 mb-2" />
                  <p className="text-lg font-medium">No purchase history available</p>
                  <p className="text-sm text-gray-400 mt-1">Your purchased courses will appear here</p>
                </div>
              </div>
            ) : (
              purchaseHistory.map((purchase) => {
                const { icon, bgColor, textColor } = getStatusProps(purchase?.status || '');
                return (
                  <div key={purchase?.courseId?._id} className="bg-white rounded-lg shadow-sm p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-medium text-gray-800">{purchase.courseId?.title}</h3>
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${bgColor} ${textColor}`}>
                        {icon}
                        <span className="text-xs font-medium capitalize">{purchase?.status}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-500">Amount</p>
                        <p className="font-medium">₹{purchase?.amount?.toFixed(2) || 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Date</p>
                        <div>
                          <div className="text-gray-700">{purchase.createdAt ? new Date(purchase?.createdAt).toDateString().slice(4) : 'N/A'}</div>
                          <div className="text-xs text-gray-500">
                            {purchase.createdAt ? new Date(purchase?.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full table-auto border-collapse bg-white rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-100 text-gray-700 text-left">
                  <th className="px-4 lg:px-6 py-3 font-semibold">Course</th>
                  <th className="px-4 lg:px-6 py-3 font-semibold">Status</th>
                  <th className="px-4 lg:px-6 py-3 font-semibold">Amount</th>
                  <th className="px-4 lg:px-6 py-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {purchaseHistory && purchaseHistory.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 lg:px-6 py-8 text-center text-gray-500">
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
                        <td className="px-4 lg:px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-800">{purchase.courseId?.title}</p>
                          </div>
                        </td>
                        <td className="px-4 lg:px-6 py-4">
                          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${bgColor} ${textColor}`}>
                            {icon}
                            <span className="text-sm font-medium capitalize">{purchase?.status}</span>
                          </div>
                        </td>
                        <td className="px-4 lg:px-6 py-4 font-medium">₹{purchase?.amount?.toFixed(2) || 'Not specified'}</td>
                        <td className="px-4 lg:px-6 py-4">
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
        <div className="mt-4 sm:mt-6 flex justify-end">
          <div className="bg-gray-50 rounded-lg px-4 sm:px-6 py-3 sm:py-4 shadow-sm">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-sm sm:text-base text-gray-600">Total Amount:</span>
              <span className="text-lg sm:text-xl font-bold text-gray-800">₹{totalSpent.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseHistory;