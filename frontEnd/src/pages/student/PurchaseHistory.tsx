import React, { useState, useEffect } from 'react';
import { Calendar, CreditCard, Filter, ChevronDown, ChevronUp, DollarSign, Book, CheckCircle, AlertCircle, Clock, RotateCw } from 'lucide-react';
import { IEnrollment } from '../../types/IEnrollment';

// TypeScript interfaces based on your Mongoose models
interface User {
  _id: string;
  userName: string;
}

interface Course {
  _id: string;
  title: string;
  thumbnail?: string;
  price: number;
}

interface Payment {
  _id: string;
  userId: string;
  courseId: string;
  method?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  type?: 'credit' | 'debit';
  amount: number;
  createdAt: string;
  updatedAt: string;
  course?: Course; // For populated data
}

interface Enrollment {
  _id: string;
  userId: string;
  courseId: string;
  enrolledAt: string;
  completionStatus: 'enrolled' | 'in-progress' | 'completed';
  progress: {
    completedLessons: string[];
    completedAssessments: string[];
    overallCompletionPercentage: number;
  };
  course?: Course; // For populated data
}

const PurchaseHistory: React.FC = () => {
  // State for payments and enrollments
  const [payments, setPayments] = useState<Payment[]>([]);
  const [enrollments, setEnrollments] = useState<IEnrollment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'payments' | 'enrollments'>('payments');
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'last-week' | 'last-month' | 'last-year'>('all');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Sample data - replace with actual API calls
  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      const samplePayments: Payment[] = [
        {
          _id: '1',
          userId: 'user1',
          courseId: 'course1',
          method: 'Credit Card',
          status: 'completed',
          type: 'debit',
          amount: 49.99,
          createdAt: '2025-02-15T10:30:00Z',
          updatedAt: '2025-02-15T10:35:00Z',
          course: {
            _id: 'course1',
            title: 'Advanced JavaScript Masterclass',
            thumbnail: '/api/placeholder/80/45',
            price: 49.99
          }
        },
        {
          _id: '2',
          userId: 'user1',
          courseId: 'course2',
          method: 'PayPal',
          status: 'completed',
          type: 'debit',
          amount: 29.99,
          createdAt: '2025-02-01T14:22:00Z',
          updatedAt: '2025-02-01T14:25:00Z',
          course: {
            _id: 'course2',
            title: 'React for Beginners',
            thumbnail: '/api/placeholder/80/45',
            price: 29.99
          }
        },
        {
          _id: '3',
          userId: 'user1',
          courseId: 'course3',
          method: 'Credit Card',
          status: 'refunded',
          type: 'credit',
          amount: 59.99,
          createdAt: '2025-01-20T09:15:00Z',
          updatedAt: '2025-01-25T11:40:00Z',
          course: {
            _id: 'course3',
            title: 'Complete Python Bootcamp',
            thumbnail: '/api/placeholder/80/45',
            price: 59.99
          }
        },
        {
          _id: '4',
          userId: 'user1',
          courseId: 'course4',
          method: 'Bank Transfer',
          status: 'pending',
          type: 'debit',
          amount: 79.99,
          createdAt: '2025-02-28T16:45:00Z',
          updatedAt: '2025-02-28T16:45:00Z',
          course: {
            _id: 'course4',
            title: 'Data Science Fundamentals',
            thumbnail: '/api/placeholder/80/45',
            price: 79.99
          }
        }
      ];

      const sampleEnrollments: Enrollment[] = [
        {
          _id: '1',
          userId: 'user1',
          courseId: 'course1',
          enrolledAt: '2025-02-15T10:35:00Z',
          completionStatus: 'in-progress',
          progress: {
            completedLessons: ['lesson1', 'lesson2', 'lesson3'],
            completedAssessments: ['assessment1'],
            overallCompletionPercentage: 45
          },
          course: {
            _id: 'course1',
            title: 'Advanced JavaScript Masterclass',
            thumbnail: '/api/placeholder/80/45',
            price: 49.99
          }
        },
        {
          _id: '2',
          userId: 'user1',
          courseId: 'course2',
          enrolledAt: '2025-02-01T14:25:00Z',
          completionStatus: 'completed',
          progress: {
            completedLessons: ['lesson1', 'lesson2', 'lesson3', 'lesson4', 'lesson5'],
            completedAssessments: ['assessment1', 'assessment2'],
            overallCompletionPercentage: 100
          },
          course: {
            _id: 'course2',
            title: 'React for Beginners',
            thumbnail: '/api/placeholder/80/45',
            price: 29.99
          }
        },
        {
          _id: '3',
          userId: 'user1',
          courseId: 'course4',
          enrolledAt: '2025-02-28T16:45:00Z',
          completionStatus: 'enrolled',
          progress: {
            completedLessons: [],
            completedAssessments: [],
            overallCompletionPercentage: 0
          },
          course: {
            _id: 'course4',
            title: 'Data Science Fundamentals',
            thumbnail: '/api/placeholder/80/45',
            price: 79.99
          }
        }
      ];
      
      setPayments(samplePayments);
      setEnrollments(sampleEnrollments);
      setLoading(false);
    }, 1000);
  }, []);
  
  // Filter payments based on filters
  const filteredPayments = payments.filter(payment => {
    // Status filter
    if (statusFilter !== 'all' && payment.status !== statusFilter) {
      return false;
    }
    
    // Date filter
    if (dateFilter !== 'all') {
      const paymentDate = new Date(payment.createdAt);
      const now = new Date();
      
      if (dateFilter === 'last-week') {
        const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        if (paymentDate < lastWeek) return false;
      } else if (dateFilter === 'last-month') {
        const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        if (paymentDate < lastMonth) return false;
      } else if (dateFilter === 'last-year') {
        const lastYear = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        if (paymentDate < lastYear) return false;
      }
    }
    
    return true;
  }).sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
  });
  
  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };
  
  // Helper for payment status badge
  const PaymentStatusBadge: React.FC<{ status: Payment['status'] }> = ({ status }) => {
    switch (status) {
      case 'completed':
        return (
          <span className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
            <CheckCircle size={12} />
            Completed
          </span>
        );
      case 'pending':
        return (
          <span className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
            <Clock size={12} />
            Pending
          </span>
        );
      case 'failed':
        return (
          <span className="flex items-center gap-1 bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
            <AlertCircle size={12} />
            Failed
          </span>
        );
      case 'refunded':
        return (
          <span className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
            <RotateCw size={12} />
            Refunded
          </span>
        );
      default:
        return null;
    }
  };
  
  // Helper for enrollment status badge
  const EnrollmentStatusBadge: React.FC<{ status: Enrollment['completionStatus'] }> = ({ status }) => {
    switch (status) {
      case 'completed':
        return (
          <span className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
            <CheckCircle size={12} />
            Completed
          </span>
        );
      case 'in-progress':
        return (
          <span className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
            <Clock size={12} />
            In Progress
          </span>
        );
      case 'enrolled':
        return (
          <span className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
            <Book size={12} />
            Enrolled
          </span>
        );
      default:
        return null;
    }
  };
  
  // Progress bar component
  const ProgressBar: React.FC<{ percentage: number }> = ({ percentage }) => {
    return (
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-green-600 h-2 rounded-full" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-green-600 p-6 text-white">
          <h1 className="text-2xl font-bold">Purchase History</h1>
          <p className="text-green-100 mt-1">View your course purchases and enrollment progress</p>
          
          <div className="flex gap-2 mt-4">
            <button 
              className={`px-4 py-2 rounded-t-lg font-medium transition ${activeTab === 'payments' ? 'bg-white text-green-600' : 'bg-green-700 text-white hover:bg-green-800'}`}
              onClick={() => setActiveTab('payments')}
            >
              Payments
            </button>
            <button 
              className={`px-4 py-2 rounded-t-lg font-medium transition ${activeTab === 'enrollments' ? 'bg-white text-green-600' : 'bg-green-700 text-white hover:bg-green-800'}`}
              onClick={() => setActiveTab('enrollments')}
            >
              Enrollments
            </button>
          </div>
        </div>
        
        {/* Filter Section */}
        {activeTab === 'payments' && (
          <div className="p-4 bg-green-50 border-b border-green-100">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center">
                <Filter size={16} className="text-green-600 mr-2" />
                <span className="text-green-800 font-medium">Filters:</span>
              </div>
              
              <div className="flex items-center gap-2">
                <select 
                  className="px-3 py-1 bg-white border border-green-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <select 
                  className="px-3 py-1 bg-white border border-green-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value as any)}
                >
                  <option value="all">All Time</option>
                  <option value="last-week">Last Week</option>
                  <option value="last-month">Last Month</option>
                  <option value="last-year">Last Year</option>
                </select>
              </div>
              
              <button 
                className="flex items-center gap-1 px-3 py-1 bg-white border border-green-200 rounded-md text-sm hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-400 ml-auto"
                onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
              >
                <span>Sort by Date</span>
                {sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>
          </div>
        )}
        
        {/* Payments Content */}
        {activeTab === 'payments' && (
          <div className="p-4 sm:p-6">
            {filteredPayments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-green-50 text-green-800">
                    <tr>
                      <th className="px-4 py-2 text-left">Course</th>
                      <th className="px-4 py-2 text-left">Date</th>
                      <th className="px-4 py-2 text-left">Method</th>
                      <th className="px-4 py-2 text-left">Amount</th>
                      <th className="px-4 py-2 text-left">Status</th>
                      <th className="px-4 py-2 text-left">Type</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredPayments.map((payment) => (
                      <tr key={payment._id} className="hover:bg-green-50/50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img 
                              src={payment.course?.thumbnail} 
                              alt={payment.course?.title} 
                              className="w-12 h-8 rounded object-cover" 
                            />
                            <div className="font-medium text-gray-800">{payment.course?.title}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar size={14} className="text-gray-400" />
                            {formatDate(payment.createdAt)}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          <div className="flex items-center gap-1">
                            <CreditCard size={14} className="text-gray-400" />
                            {payment.method || "N/A"}
                          </div>
                        </td>
                        <td className="px-4 py-3 font-medium">
                          <div className="flex items-center gap-1">
                            <DollarSign size={14} className="text-gray-400" />
                            {payment.amount.toFixed(2)}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <PaymentStatusBadge status={payment.status} />
                        </td>
                        <td className="px-4 py-3 text-gray-600 capitalize">
                          {payment.type || "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <div className="flex justify-center mb-4">
                  <CreditCard size={48} className="text-gray-300" />
                </div>
                <h3 className="text-lg font-medium mb-1">No payments found</h3>
                <p>Try adjusting your filters or check back later.</p>
              </div>
            )}
          </div>
        )}
        
        {/* Enrollments Content */}
        {activeTab === 'enrollments' && (
          <div className="p-4 sm:p-6">
            {enrollments.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
                {enrollments.map((enrollment) => (
                  <div key={enrollment._id} className="bg-white border border-green-100 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition">
                    <div className="flex items-center p-4 border-b border-green-100">
                      <img 
                        src={enrollment.course?.thumbnail} 
                        alt={enrollment.course?.title} 
                        className="w-20 h-12 object-cover rounded mr-4" 
                      />
                      <div>
                        <h3 className="font-medium text-gray-900">{enrollment.course?.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <EnrollmentStatusBadge status={enrollment.completionStatus} />
                          <span className="text-xs text-gray-500">
                            Enrolled on {formatDate(enrollment.enrolledAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-600">Progress</span>
                        <span className="text-sm font-medium">{enrollment.progress.overallCompletionPercentage}%</span>
                      </div>
                      <ProgressBar percentage={enrollment.progress.overallCompletionPercentage} />
                      
                      <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                        <div>
                          <div className="text-gray-500">Completed Lessons</div>
                          <div className="font-medium">{enrollment.progress.completedLessons.length}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Completed Assessments</div>
                          <div className="font-medium">{enrollment.progress.completedAssessments.length}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 p-3 flex justify-between items-center">
                      <span className="text-green-600 font-medium">${enrollment.course?.price.toFixed(2)}</span>
                      <button className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition">
                        Continue Learning
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <div className="flex justify-center mb-4">
                  <Book size={48} className="text-gray-300" />
                </div>
                <h3 className="text-lg font-medium mb-1">No enrollments found</h3>
                <p>You haven't enrolled in any courses yet.</p>
              </div>
            )}
          </div>
        )}
        
        {/* Summary Footer */}
        <div className="bg-green-50 p-4 border-t border-green-100">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <p className="text-green-800">Showing {activeTab === 'payments' ? filteredPayments.length : enrollments.length} {activeTab}</p>
              {activeTab === 'payments' && (
                <p className="text-sm text-green-600 mt-1">
                  Total spent: ${filteredPayments.reduce((total, payment) => 
                    payment.status === 'completed' && payment.type === 'debit' ? total + payment.amount : total, 0).toFixed(2)}
                </p>
              )}
            </div>
            
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
              Download History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseHistory;