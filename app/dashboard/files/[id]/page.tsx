import { auth } from '@clerk/nextjs/server'
import { adminDb } from "@/firebaseAdmin";
import PdfView from "@/components/PdfView";
import Chat from "@/components/Chat";
async function ChatToFilePage({params}:{params:Promise<{id:string}>}) {
auth.protect();
    const { userId } = await auth();
    const {id} = await params;
    const ref = await adminDb
        .collection("users")
        .doc(userId!)
        .collection("files")
        .doc(id)
        .get();

    const url = ref.data()?.downloadUrl;

    return (
        <div className="grid lg:grid-cols-5 h-full overflow-hidden">
       
            
            <div className="col-span-5 lg:col-span-2 overflow-y-auto lg:order-1">
                <Chat id={id}/>
            </div>
            <div className="col-span-5 lg:col-span-3 bg-gray-100 border-r-2 lg:border-indigo-600  overflow-auto">
                <PdfView url={url}/>
            </div>
            
        </div>
    )
}
export default ChatToFilePage