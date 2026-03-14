const DeactiveUsers = () => {
  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">D e a c t i v e U s e r s</h1>
        <p className="text-slate-500 text-sm">Manage and view details for D e a c t i v e U s e r s.</p>
      </div>
      
      <div className="card p-6">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-300 mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold">D e a c t i v e U s e r s Page</h2>
          <p className="text-slate-500 max-w-xs mx-auto mt-2">
            This module is currently under development. Please check back later for full functionality.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DeactiveUsers;
