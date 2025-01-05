'use server'
import { auth } from '@clerk/nextjs/server';
import { del, list } from '@vercel/blob';
import { adminDb } from '@/firebaseAdmin';
import { indexName } from '@/lib/langchain';
import pineconeClient from '@/lib/pinecone';
import { revalidatePath } from 'next/cache';
export async function deleteDocument(docId: string) {
    auth.protect();
    const { userId } = await auth();
    try {
        await adminDb
            .collection("users")
            .doc(userId!)
            .collection("files")
            .doc(docId)
            .delete();

    } catch (err) {
        console.log(err);
     }

    deletedDocumentFromStorage(userId!, docId);

    const index = await pineconeClient.index(indexName);
    try {
        await index.namespace(docId).deleteAll();
    } catch (error) {
        
    }
    

    revalidatePath("/dashboard");
}
const deletedDocumentFromStorage = async (userId: string, docId: string) => {

    const listOfBlobs = await list({
        prefix: `users/${userId}/files`
    });

    const blobs = listOfBlobs.blobs;
    const urlToDelete = blobs.filter(blob => blob.pathname == `users/${userId}/files/${docId}.pdf`)[0].url;

    try {
        await del(urlToDelete)
    } catch (err) {
        console.log(err);
    }
}