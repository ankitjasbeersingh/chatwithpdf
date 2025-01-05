"use client"
import { useDropzone } from "react-dropzone";
import { useCallback, useEffect, useState } from "react";
import { CheckCircleIcon, CircleArrowDown, HammerIcon, ImageOff, RocketIcon, SaveIcon } from "lucide-react";

import useUpload, { StatusText } from "@/hooks/useUpload";
import { useRouter } from "next/navigation";

function FileUploader() {
    const router = useRouter();
    const { progress, status, fileId, handleUpload } = useUpload();
    const maxSize = 2097152;
    const [isFileTooLarge, setIsFileTooLarge] = useState(false);
    useEffect(() => {
        if (fileId) {
            router.push(`/dashboard/files/${fileId}`);
        }
    }, [fileId, router]);
    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            await handleUpload(file);
        } else {

        }
    }, [handleUpload]);
    const statusIcons: {
        [key in StatusText]: JSX.Element
    } = {
        [StatusText.UPLOADING]: (<RocketIcon className="h-20! w-20! text-indigo-600" />),
        [StatusText.UPLOADED]: (<CheckCircleIcon className="h-20! w-20! text-indigo-600" />),
        [StatusText.SAVING]: (<SaveIcon className="h-20! w-20! text-indigo-600" />),
        [StatusText.GENETATING]: (<HammerIcon className="h-20! w-20! text-indigo-600" />),
    }
    const proMember = false;
    let dropzoneSettings;
    if(proMember){
        dropzoneSettings = {
            onDrop,
            maxFiles: 1,
            accept: {
                "application/pdf": [".pdf"]
            },
            minSize: 0
        }
    } else {
        dropzoneSettings = {
            onDrop,
            maxFiles: 1,
            accept: {
                "application/pdf": [".pdf"]
            },
            minSize: 0,
            maxSize: maxSize
        }
    }
    const { getRootProps, getInputProps, isDragActive, isFocused, isDragAccept, isDragReject, fileRejections } = useDropzone(dropzoneSettings);

    const uploadInProgress = progress != null && progress >= 0 && progress <= 100;
    
    useEffect(() => {
        setIsFileTooLarge(fileRejections.length > 0 && fileRejections[0].file.size > maxSize);
    } ,[fileRejections]);
    useEffect(() => {
        setTimeout(() => {
            if(isFileTooLarge){
                setIsFileTooLarge(false);
            }
        },2500);
        
    } ,[isFileTooLarge])
    return (
        <div className="flex flex-col gap-4 items-center max-w-7xl mx-auto">
            {uploadInProgress && (
                <div className="mt-32 flex flex-col justify-center items-center gap-5">
                    <div
                        className={`radial-progress bg-indigo-300 text-white border-indigo-600 border-4 ${progress === 100 && "hidden"}`}
                        role="progressbar"
                        style={{
                            // @ts-expect-error : Should expect string
                            "--value": progress,
                            "--size": "12rem",
                            "--thickness": "1.3rem"
                        }}
                    >{progress} %</div>
                    {
                        // @ts-expect-error: Should expect string
                        statusIcons[status!]
                    }
                    {/* @ts-expect-error : Should expect string */}
                    <p className="text-indigo-600 animate-pulse">{status}</p>
                </div>
            )}
            {!uploadInProgress && (<div {...getRootProps()} className={`p-10 border-2 border-dashed mt-10 w-[90%] ${isFileTooLarge ? "border-red-600": "border-indigo-600" }  text-indigo-600 rounded-lg h-96 flex items-center justify-center ${isFocused || (isDragAccept && !isFileTooLarge) ? "bg-indigo-300" : isFileTooLarge ? "bg-red-200": "bg-indigo-300" } : "bg-indigo-100"}`}>
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center">
                    {
                        isDragActive && !isDragReject ?
                            (
                                <>
                                    <RocketIcon className="!h-20 !w-20 animate-ping" />
                                    <p>Drop the files here ...</p>
                                </>
                            ) : !isFileTooLarge &&
                            (
                                <>
                                    <CircleArrowDown className="h-20 w-20 animate-bounce" />
                                    <p>Drag n drop some files here, or click to select files</p>
                                </>
                            )
                    }
                    {isFileTooLarge && (
                        <>
                        <ImageOff className="!h-10 !w-10 animate-ping text-red-600" />
                        <p className="text-red-400 mt-9">
                            File is large than 2 MB. Try with file smaller in size
                        </p>
                        </>
                    )}

                </div>
            </div>)}
        </div>
    );
}
export default FileUploader