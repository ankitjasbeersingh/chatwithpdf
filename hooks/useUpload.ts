"use client";
import { generateEmbeddings } from "@/actions/generateEmbeddings";
import { db } from "@/firebase";
import { useUser } from "@clerk/nextjs";
import { upload } from "@vercel/blob/client";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {v4 as uuidv4} from "uuid";
export enum StatusText {
    UPLOADING = "Uploading file...",
    UPLOADED = "File uploaded successfully",
    SAVING ="Saving file to database...",
    GENETATING = "Genrating AI Embeddings, This will only take a few seconds...",
}
export type Status = StatusText[keyof StatusText];
function useUpload(){
 const [progress,setProgress] = useState<number | null>(null);
 const [fileId, setFileId] = useState<string | null>(null);
 const [status,setStatus] = useState<Status | null>(null);
 const {user} = useUser();
 const router = useRouter();
 const handleUpload = async (file:File) =>{
    if(!file || !user) return;

    const fileIdToUploadTo = uuidv4();
    const newBlob = await upload(`users/${user.id}/files/${fileIdToUploadTo}.pdf`, file, {
        access: 'public',
        handleUploadUrl: '/api/file/upload',
        onUploadProgress(e) {
            setStatus(StatusText.UPLOADING)
            setProgress(e.percentage);
        }
      });
      if(newBlob){
        setStatus(StatusText.UPLOADED);
        
      }
      const downloadUrl = newBlob.downloadUrl;
      await setDoc(doc(db,"users",user.id,"files",fileIdToUploadTo),{
        name:file.name,
        size:file.size,
        type:file.type,
        downloadUrl:downloadUrl,
        ref: newBlob.pathname,
        createdAt: new Date()
      })
      setStatus(StatusText.GENETATING);
      await generateEmbeddings(fileIdToUploadTo);
      setFileId(fileIdToUploadTo);
    
 }
 return {progress, status, fileId, handleUpload};
}
export default useUpload;