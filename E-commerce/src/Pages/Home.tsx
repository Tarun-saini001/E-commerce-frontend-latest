const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="relative w-full h-[70vh] flex items-center justify-center overflow-hidden">
        <img
          src="/e-commerce.avif"
          alt="TS Mart Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-opacity-40 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg">
            Welcome to TS Mart
          </h1>
          <p className="mt-4 text-lg md:text-2xl text-white drop-shadow-md">
            Find the best products at amazing prices
          </p>
          <button
            className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg shadow-lg transition"
          >
            Shop Now
          </button>
        </div>
      </div>

     
    </div>
  );
};

export default Home;
