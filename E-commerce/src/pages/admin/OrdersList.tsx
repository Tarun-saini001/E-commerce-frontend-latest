import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import { fetchAllOrders } from "../../redux/slices/orderSlice";
import { useSearchParams } from "react-router-dom";
import Pagination from "../../components/common/Pagination";

const OrdersList = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { allOrders, loading, totalPages } = useSelector(
    (state: RootState) => state.order
  );
  const [searchParams, setSearchParams] = useSearchParams();
  // const [page, setPage] = useState(1);
  const page = Number(searchParams.get("page")) || 1;

  const updatePage = (newPage: number) => {
    setSearchParams({ page: newPage.toString() });
  };

  // const [page, setPage] = useState(
  //   Number(localStorage.getItem("orderPage")) || 1
  // );

  // const [totalPages, setTotalPages] = useState(1);

  // useEffect(() => {
  //   localStorage.setItem("orderPage", page.toString());
  // }, [page]);

  useEffect(() => {
    dispatch(fetchAllOrders({ page, limit: 6 }))
  }, [dispatch, page]);

  return (
    <div className="p-6">


      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Orders List</h1>
      </div>


      <div className="bg-white rounded-xl shadow overflow-hidden">


        <div className="grid grid-cols-5 p-4 font-semibold bg-gray-100 border-b">
          <p>Order ID</p>
          <p>User</p>
          <p>Total</p>
          <p>Shipping</p>
          <p>Status</p>
        </div>


        {loading ? (
          <div
            className="flex justify-center items-center min-h-[70vh] text-blue-500 text-xl font-bold">
            Loading...
          </div>
        ) : allOrders?.length === 0 ? (
          <div className="p-6 text-center">No Orders Found</div>
        ) : (
          allOrders.map((order) => (
            <div
              key={order._id}
              className="grid grid-cols-5 items-center p-4 border-b hover:bg-gray-100"
            >
              <p className="font-medium">
                #{order._id.slice(-6)}
              </p>

              <p>{order.billingDetails.email}</p>

              <p>₹{order.total}</p>

              <p className="capitalize">
                {order.shippingMethod}
              </p>

              <p>
                <span className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
                  {order.orderStatus}
                </span>
              </p>
            </div>
          ))
        )}
      </div>

      {/* pagination */}

      <Pagination
      page={page}
      totalPages={totalPages}
      onPageChange={updatePage}
      />
      {/* <div className="flex justify-center gap-2 mt-6">
        <button
          onClick={() => updatePage(Math.max(page - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
         <IoIosArrowBack />
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => updatePage(i + 1)}
            className={`px-3 py-1 rounded ${page === i + 1
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
              }`}
          >
            {i + 1}
          </button>
        ))}

        <button
        onClick={() => updatePage(Math.min(page + 1, totalPages))}
          disabled={page === totalPages}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
        <IoIosArrowForward />
        </button>
      </div> */}
    </div>
  );
};

export default OrdersList;