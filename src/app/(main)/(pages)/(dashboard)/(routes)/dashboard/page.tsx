import Navbar from "@/components/global/navbar";
import Conversation from "@/components/main/Conversation/ConversationComponent";

const DashbaordPage = () => {
    return (
        <main className="flex items-center justify-center flex-col mt-20">
            <Navbar/>
            <Conversation/>
        </main>
    );
}

export default DashbaordPage;