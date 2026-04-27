export default function SecondPage() {
  return (
    <div className="h-dvh w-dvw">
      <div className="flex flex-row w-full h-full">
        <div className="w-1/2 h-full bg-gray-200 flex items-center justify-center">
          <h2 className="text-4xl font-bold">Welcome to the Second Page</h2>
        </div>
        <div className="w-1/2 h-full bg-gray-300 flex items-center justify-center">
          <p className="text-xl">
            This is the second page of our layout. You can add more content here
            as needed.
          </p>
        </div>
      </div>
    </div>
  );
}
