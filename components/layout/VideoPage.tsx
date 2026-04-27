export default function VideoPage() {
  return (
    <div className="h-full bg-black w-full md:relative md:hidden block">
      <div
        className="p-4 md:absolute rounded md:bottom-24 md:right-24 z-50 flex md:h-[30dvh] w-full items-center
       justify-center bg-white/10 shadow-lg backdrop-blur-sm"
      >
        <div className="w-full h-full flex flex-row items-center capitalize p-4">
          <h3 className="md:text-xl text-base font-googlesansflex text-accent w-full">
            Watch a video about us
          </h3>
          <div className="w-full h-full rounded overflow-hidden">
            <video
              src="/examples/vid-1.mp4"
              controls
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
