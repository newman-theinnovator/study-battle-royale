export default function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-linear-to-br from-purple-900 to-indigo-900 flex items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white"></div>
    </div>
  );
}