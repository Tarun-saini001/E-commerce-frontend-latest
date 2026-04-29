const ProductSkeleton = () => {
    return (
        <div className="grid grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, index) => (
                <div
                    key={index}
                    className="bg-white rounded-lg shadow p-4 animate-pulse"
                >
                   
                    <div className="bg-gray-200 h-40 w-full rounded-lg mb-4" />

                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                   
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-3" />                
                    <div className="h-3 bg-gray-200 rounded w-1/4 mb-4" />
                    <div className="flex justify-between items-center mb-4">
                        <div className="h-4 bg-gray-200 rounded w-1/3" />
                        <div className="h-6 w-6 bg-gray-200 rounded-full" />
                    </div>

                
                    <div className="space-y-2">
                        <div className="h-8 bg-gray-200 rounded w-full" />
                        <div className="h-8 bg-gray-200 rounded w-full" />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductSkeleton;