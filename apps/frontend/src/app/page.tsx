export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-6">Homeo</h1>
          <p className="text-xl text-gray-600 mb-8">
            Professional Homeopathic Patient Management System
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="/login"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Sign In
            </a>
            <a
              href="/register"
              className="px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
            >
              Create Account
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
