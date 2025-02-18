
const ProfileUpdate = () => {
  return (
    <div className="w-xl lg:w-5/6 shadow-lg p-6 mx-3 border my-8">
      <h2 className="text-2xl font-semibold mb-4">Generals</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input type="text" placeholder="First name" className="p-2 border rounded-lg w-full" />
        <input type="text" placeholder="Last name" className="p-2 border rounded-lg w-full" />
        <input type="email" placeholder="Email" className="p-2 border rounded-lg w-full" />
        <input type="tel" placeholder="Phone no." className="p-2 border rounded-lg w-full" />
        <input type="text" placeholder="Expertise" className="p-2 border rounded-lg w-full" />
        <input type="text" placeholder="User name" className="p-2 border rounded-lg w-full" />
        <input type="password" placeholder="Password" className="p-2 border rounded-lg w-full" />
        <input type="password" placeholder="Confirm Password" className="p-2 border rounded-lg w-full" />
      </div>
      
      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-4">Other Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <input type="text" placeholder="Phone no." className="p-2 border rounded-lg w-full" />
          <input type="email" placeholder="Email" className="p-2 border rounded-lg w-full" />
          <input type="text" placeholder="Pincode" className="p-2 border rounded-lg w-full" />
          <input type="text" placeholder="Address" className="p-2 border rounded-lg w-full col-span-2" />
          <input type="text" placeholder="City" className="p-2 border rounded-lg w-full" />
          <input type="text" placeholder="Country" className="p-2 border rounded-lg w-full" />
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-4">About Info</h2>
        <textarea className="w-full p-2 border rounded-lg"  placeholder="Write about yourself..."></textarea>
      </div>

      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-4">Online Presence</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <input type="text" placeholder="Personal Website" className="p-2 border rounded-lg w-full" />
          <input type="text" placeholder="Personal Website" className="p-2 border rounded-lg w-full" />
          <input type="text" placeholder="Address" className="p-2 border rounded-lg w-full" />
          <input type="text" placeholder="City" className="p-2 border rounded-lg w-full" />
          <input type="text" placeholder="Country" className="p-2 border rounded-lg w-full" />
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button className="px-4 py-2 bg-green-800 text-white rounded-lg">Save Changes</button>
      </div>
    </div>
  );
};

export default ProfileUpdate;
