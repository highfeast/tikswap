import Component from "@/library/components/test/component";
import { Connect } from "@/library/components/test/connect";
import { Connected } from "@/library/components/test/connected";
import { Providers } from "@/library/components/test/providers";
import { ToastContainer } from 'react-toastify';

const page = () => {
  return (
    <div>
      <Providers>
        <Connect />
        <Connected>
          <Component />
        </Connected>
      </Providers>
      <ToastContainer />
    </div>
  );
};

export default page;
