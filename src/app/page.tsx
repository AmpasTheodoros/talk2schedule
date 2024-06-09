import Navbar from "@/components/global/navbar";
import { BackgroundGradientAnimation } from "@/components/aceternity/background-gradient-animation";
import { FlipWords } from "@/components/aceternity/flip-words";
import Link from "next/link";

const Home = () => {
    const words = ["Cal", "Notion", "Slack", "Sync"];

    return (
        <main className="flex items-center justify-center flex-col">
            <Navbar />
            <section className="h-screen w-full bg-neutral-950 rounded-md !overflow-visible relative flex flex-col items-center antialiased">
                <BackgroundGradientAnimation>
                    <div className="absolute z-50 inset-0 flex items-center justify-center text-white font-bold px-4 text-3xl text-center md:text-4xl lg:text-7xl">
                        Vo<FlipWords words={words} />
                        <Link
                            href="/dashboard"
                            className="flex items-center justify-center bg-blue-400 hover:bg-blue-500 rounded-full w-20 h-20 focus:outline-none ml-4 pointer-events-auto"
                        >
                            <svg
                                viewBox="0 0 256 256"
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-12 h-12 text-white"
                            >
                                <path
                                    fill="currentColor"
                                    d="M128 176a48.05 48.05 0 0 0 48-48V64a48 48 0 0 0-96 0v64a48.05 48.05 0 0 0 48 48ZM96 64a32 32 0 0 1 64 0v64a32 32 0 0 1-64 0Zm40 143.6V232a8 8 0 0 1-16 0v-24.4A80.11 80.11 0 0 1 48 128a8 8 0 0 1 16 0a64 64 0 0 0 128 0a8 8 0 0 1 16 0a80.11 80.11 0 0 1-72 79.6Z"
                                />
                            </svg>
                        </Link>
                    </div>
                </BackgroundGradientAnimation>
            </section>
        </main>
    );
};

export default Home;
