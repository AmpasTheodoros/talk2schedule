import Navbar from "@/components/global/navbar";
import { BackgroundGradientAnimation } from "@/components/global/aceternity/background-gradient-animation";
import { FlipWords } from "@/components/global/aceternity/flip-words";

export default function Home() {
  const words = ["Sync", "Schedule", "Organise", "Add Tasks"];

  return (
    <main className="flex items-center justify-center flex-col">
      <Navbar/>
      <section className="h-screen w-full  bg-neutral-950 rounded-md  !overflow-visible relative flex flex-col items-center  antialiased">
        <BackgroundGradientAnimation>
          <div className="absolute z-50 inset-0 flex items-center justify-center text-white font-bold px-4 pointer-events-none text-3xl text-center md:text-4xl lg:text-7xl ">
              Talk 2 <FlipWords words={words} />
          </div>
      </BackgroundGradientAnimation>
      </section>
    </main>
  );
}
