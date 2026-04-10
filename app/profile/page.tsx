export default function Profile() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-2xl shadow w-80 text-center">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>

        <p className="mb-2">Name: Sample User</p>
        <p>Email: user@email.com</p>
      </div>
    </div>
  );
}