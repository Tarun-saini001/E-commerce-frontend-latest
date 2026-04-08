
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'


type PaginationProps = {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
};

const Pagination = ({ page, totalPages, onPageChange }: PaginationProps) => {

    if (totalPages <= 1) return null;
    return (

        <div className="flex justify-center gap-2 mt-6">
            <button
                onClick={() => onPageChange(Math.max(page - 1, 1))}
                disabled={page === 1}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
                <IoIosArrowBack />
            </button>

            {[...Array(totalPages)].map((_, i) => (
                <button
                    key={i}
                    onClick={() => onPageChange(i + 1)}
                    className={`px-3 py-1 rounded ${page === i + 1
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200"
                        }`}
                >
                    {i + 1}
                </button>
            ))}

            <button
                onClick={() => onPageChange(Math.min(page + 1, totalPages))}
                disabled={page === totalPages}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
                <IoIosArrowForward />
            </button>
        </div>
    )
}

export default Pagination
