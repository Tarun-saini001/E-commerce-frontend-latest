interface UserLayoutSkeletonProps {
    isAuthPage?: boolean;
}

const UserLayoutSkeleton = ({
    isAuthPage = false,
}: UserLayoutSkeletonProps) => {
    if (isAuthPage) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md animate-pulse">
                    <div className="h-8 bg-gray-300 rounded mb-6"></div>

                    <div className="space-y-4">
                        <div className="h-12 bg-gray-300 rounded"></div>
                        <div className="h-12 bg-gray-300 rounded"></div>
                        <div className="h-12 bg-gray-300 rounded"></div>
                        <div className="h-12 bg-gray-300 rounded"></div>
                    </div>

                    <div className="h-12 bg-gray-300 rounded mt-6"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 animate-pulse">
            {/* navbar */}
            <div className="bg-white p-4 rounded-xl shadow">
                <div className="h-20 bg-gray-300 border-b"></div>
            </div>

            {/* top menu */}
            <div className="bg-white p-4 rounded-xl shadow">
                <div className="h-12 bg-gray-300 border-b"></div>
            </div>

            {/* main content */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div
                        key={item}
                        className="bg-white p-4 rounded-xl shadow"
                    >
                        <div className="h-40 bg-gray-300 rounded mb-4"></div>
                        <div className="h-5 bg-gray-300 rounded mb-2"></div>
                        <div className="h-4 bg-gray-300 rounded mb-4"></div>
                        <div className="h-10 bg-gray-300 rounded"></div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserLayoutSkeleton;
