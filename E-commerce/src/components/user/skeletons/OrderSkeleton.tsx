const OrdersSkeleton = () => {
    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
      
            <div className="h-7 w-48 bg-gray-200 rounded mb-6 animate-pulse" />

            <div className="space-y-6">
                {Array.from({ length: 3 }).map((_, index) => (
                    <div
                        key={index}
                        className="border rounded-lg shadow-sm p-6 animate-pulse"
                    >
                    
                        <div className="flex justify-between mb-4">
                            <div className="h-4 w-40 bg-gray-200 rounded" />
                            <div className="h-5 w-20 bg-gray-200 rounded-full" />
                        </div>

                     
                        <div className="mb-4 space-y-2">
                            <div className="h-3 w-52 bg-gray-200 rounded" />
                            <div className="h-3 w-64 bg-gray-200 rounded" />
                        </div>
\
                        <div className="space-y-3">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="flex justify-between items-center"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-200 rounded" />
                                        <div className="h-3 w-40 bg-gray-200 rounded" />
                                    </div>
                                    <div className="h-3 w-16 bg-gray-200 rounded" />
                                </div>
                            ))}
                        </div>

                        
                        <div className="border-t mt-4 pt-3 flex justify-between">
                            <div className="h-4 w-20 bg-gray-200 rounded" />
                            <div className="h-4 w-24 bg-gray-200 rounded" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrdersSkeleton;