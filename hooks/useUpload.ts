"use client";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
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
    
 }
}
export default useUpload;