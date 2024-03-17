const WrapAround = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex w-screen h-screen p-20">
      {/* Frame */}
      <div className="w-20 left-0 top-0 bottom-0 absolute border-r-2 border-solid border-[#484E62]"></div>
      <div className="w-20 right-0 top-0 bottom-0 absolute border-l-2 border-solid border-[#484E62]"></div>
      <div className="flex items-center justify-center h-20 left-0 right-0 top-0 absolute border-b-2 border-solid border-[#484E62]">
        <p className="font-atyp italic text-[36px]">TikSwap</p>
      </div>
      <div className="h-20 left-0 right-0 bottom-0 absolute border-t-2 border-solid border-[#484E62]"></div>

      {/* Asterisks */}
      <div className="flex items-center justify-center w-20 h-20 left-0 top-0 absolute">
        <img src="/Asterisks.svg" alt="Asterisks Spinner" />
      </div>
      <div className="flex items-center justify-center w-20 h-20 right-0 top-0 absolute">
        <img src="/Asterisks.svg" alt="Asterisks Spinner" />
      </div>
      <div className="flex items-center justify-center w-20 h-20 right-0 bottom-0 absolute">
        <img src="/Asterisks.svg" alt="Asterisks Spinner" />
      </div>
      <div className="flex items-center justify-center w-20 h-20 left-0 bottom-0 absolute">
        <img src="/Asterisks.svg" alt="Asterisks Spinner" />
      </div>

      <>{children}</>
    </div>
  );
};

export default WrapAround;
