

const Loading = () => {
  return (
    <div className="flex items-center justify-center py-12 h-screen">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-300">Chargement des données...</span>
     </div>
  );
}
export default Loading;