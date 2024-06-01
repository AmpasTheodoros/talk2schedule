import Navbar from "@/components/global/navbar";

const DashbaordPage = () => {
    return (
        <main className="flex items-center justify-center flex-col">
            <Navbar/>
            <section className="h-screen w-full  bg-neutral-950 rounded-md  !overflow-visible relative flex flex-col items-center  antialiased">
                <div className="absolute z-50 inset-0 flex items-center justify-center text-white font-bold px-4 pointer-events-none text-3xl text-center md:text-4xl lg:text-7xl ">
                    <h2>Dashboard</h2>
                </div>
            </section>
        </main>
    );
}

export default DashbaordPage;