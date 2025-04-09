import signup from '../../assets/auth/signup2.avif';
import logo from '../../assets/commonPages/logo.png'

const LeftSection = () => {
  return (
      <div className="lg:w-1/2 relative w-full h-screen flex flex-col items-center justify-center bg-white">
      <div className='absolute top-4 left-4'>
      <img src={logo} alt="logo" className='w-auto h-16' />
      </div>
        <img src={signup} alt="signup" className="w-11/12 h-3/4 lg:w-[600px] object-cover" />
      </div>
  )
}

export default LeftSection


// import signup from '../../assets/auth/signup2.avif';
// import logo from '../../assets/commonPages/logo.png';

// const LeftSection = () => {
//   return (
//     <div className="hidden sm:block lg:w-1/2 relative w-full min-h-screen overflow-hidden bg-gradient-to-br from-green-50 to-green-100">
//       {/* Logo */}
//       <div className="absolute top-6 left-6 z-10">
//         <img src={logo} alt="logo" className="w-auto h-12 sm:h-16" />
//       </div>
      
//       {/* Decorative elements */}
//       <div className="absolute top-0 right-0 w-32 h-32 bg-green-400 rounded-bl-full opacity-20"></div>
//       <div className="absolute bottom-0 left-0 w-48 h-48 bg-green-500 rounded-tr-full opacity-10"></div>
      
//       {/* Content area */}
//       <div className="flex flex-col items-center justify-center h-full py-16 px-8">
//         {/* Heading text */}
//         <div className="mb-8 text-center">
//           <h2 className="text-2xl sm:text-3xl font-bold text-green-800 mb-3">Welcome Back!</h2>
//           <p className="text-sm sm:text-base text-green-700 max-w-md">
//             Continue your learning journey with access to thousands of courses.
//           </p>
//         </div>
        
//         {/* Main image with shadow and border */}
//         <div className="relative w-full max-w-md">
//           <div className="absolute inset-0 bg-green-200 rounded-lg transform rotate-3 scale-105"></div>
//           <div className="relative overflow-hidden rounded-lg shadow-xl border-4 border-white">
//             <img 
//               src={signup} 
//               alt="Learning platform" 
//               className="w-full h-auto object-cover" 
//             />
//           </div>
//         </div>
        
//         {/* Feature points */}
//         <div className="mt-10 flex flex-col sm:flex-row justify-center gap-6 text-center max-w-lg">
//           <div className="flex flex-col items-center">
//             <div className="bg-green-100 p-3 rounded-full mb-2">
//               <svg className="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
//               </svg>
//             </div>
//             <h3 className="font-semibold text-green-800">Learn Anytime</h3>
//           </div>
//           <div className="flex flex-col items-center">
//             <div className="bg-green-100 p-3 rounded-full mb-2">
//               <svg className="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"></path>
//               </svg>
//             </div>
//             <h3 className="font-semibold text-green-800">Track Progress</h3>
//           </div>
//           <div className="flex flex-col items-center">
//             <div className="bg-green-100 p-3 rounded-full mb-2">
//               <svg className="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
//               </svg>
//             </div>
//             <h3 className="font-semibold text-green-800">Join Community</h3>
//           </div>
//         </div>
//       </div>
      
//       {/* Bottom design element */}
//       <div className="absolute bottom-4 left-0 right-0 text-center text-sm text-green-700 font-medium">
//         Trusted by thousands of students worldwide
//       </div>
//     </div>
//   );
// };

// export default LeftSection;