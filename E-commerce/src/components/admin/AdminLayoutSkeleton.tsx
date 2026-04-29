const AdminLayoutSkeleton = () => {
    return (
        <div className="flex min-h-screen bg-gray-100 animate-pulse">

            <div className="w-64 bg-white  p-4 space-y-4">
                <div className="h-6 w-32 bg-gray-200 rounded" />

                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-4 w-full bg-gray-200 rounded" />
                ))}
            </div>


            <div className="flex-1 flex flex-col">

               
                <div className="h-16 bg-white px-6 flex items-center justify-between">
                    <div className="h-4 w-40 bg-gray-200 rounded" />
                    <div className="h-8 w-8 bg-gray-200 rounded-full" />
                </div>

              
                <div className="p-6 space-y-4">

                    <div className="h-6 w-48 bg-gray-200 rounded" />

                    <div className="grid grid-cols-3 gap-4">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div
                                key={i}
                                className="h-24 bg-gray-200 rounded"
                            />
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AdminLayoutSkeleton;