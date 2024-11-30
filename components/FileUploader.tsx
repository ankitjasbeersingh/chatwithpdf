"use client"
import { useDropzone } from "react-dropzone";
import {useCallback} from "react";
function FileUploader() {
    const onDrop = useCallback((acceptedFiles:File[])=>{},[]);
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});
  return (
    <div>FileUploader</div>
  )
}
export default FileUploader