import { Connect } from "@/library/components/connect";
import { Connected } from "@/library/components/connected";
import { Providers } from "@/library/components/providers";
import Component from "../library/components/component";

export default function Page() {
  return (
    <Providers>
      <Connect />
      <Connected>
        <Component />
      </Connected>
    </Providers>
  );
}
