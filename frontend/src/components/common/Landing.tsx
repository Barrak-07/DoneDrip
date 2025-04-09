const Landing = () => {
  return (
    <div className="min-h-screen bg-drip-bg text-drip-contrast flex items-center justify-center flex-col font-drip px-4">
      <h1 className="text-6xl font-bold drop-shadow-drip">DoneDrip</h1>
      <p className="mt-4 text-lg text-drip-glow max-w-md text-center">
        Drip your tasks. Get it done — one drop at a time.
      </p>
      <a
        href="/user/signin"
        className="mt-8 bg-drip text-white px-6 py-3 rounded-xl hover:bg-drip-glow transition"
      >
        ✍️ Get Started
      </a>
    </div>
  );
};

export default Landing;
