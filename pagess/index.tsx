import { Connect } from "@/library/zcomponents/connect";
import { Connected } from "@/library/zcomponents/connected";
import { Providers } from "@/library/zcomponents/providers";
import Component from "../library/zcomponents/component";

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
