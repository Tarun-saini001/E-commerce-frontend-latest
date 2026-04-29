const WishlistSkeleton = () => {
    return (
        <div className="max-w-6xl mx-auto py-12 px-4">
            <div className="h-8 w-64 bg-gray-200 rounded mb-8 animate-pulse" />

            <div className="grid grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-lg shadow p-4 animate-pulse flex flex-col"
                    >
                        <div className="bg-gray-200 rounded-lg h-40 w-full mb-4" />
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />

                        <div className="h-3 bg-gray-200 rounded w-1/2 mb-3" />

                        <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />

                        <div className="space-y-2 mt-auto">
                            <div className="h-8 bg-gray-200 rounded w-full" />
                            <div className="h-8 bg-gray-200 rounded w-full" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WishlistSkeleton;