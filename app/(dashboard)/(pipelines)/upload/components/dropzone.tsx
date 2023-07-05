"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useStepStore } from "@/lib/store";
import { cn, formatBytes } from "@/lib/utils";
import { useCallback, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { UploadInfo } from "types";
import { HelpPopover } from "@/components/ui/help-popover";
import { motion } from "framer-motion";

interface DropzoneProps extends React.HTMLAttributes<HTMLDivElement> {
  updateUploadInfos: (uploadInfos: UploadInfo) => void;
}

type SettledResult = {
  status: "fulfilled" | "rejected";
  value?: {
    message: {
      filename: string;
      id: string;
    };
    reason?: any;
  };
};

export function Dropzone({ className, updateUploadInfos }: DropzoneProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [rejectedFiles, setRejectedFiles] = useState<FileRejection[]>([]);
  const [isBulkProcessing, setBulkProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasUploadFailed, setUploadFailed] = useState(false);

  async function uploadFile(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (res.status !== 201) {
      throw new Error(data.message);
    }

    return data;
  }

  async function uploadFiles(files: File[]) {
    setUploadFailed(false);

    setIsLoading(true);
    const results = await Promise.allSettled([
      ...files.map(uploadFile),
      new Promise((resolve) => setTimeout(resolve, 500)),
    ]);

    const success = results.filter(
      (result) => result.status === "fulfilled"
    ) as SettledResult[];

    const failed = results.filter(
      (result) => result.status === "rejected"
    ) as SettledResult[];

    setIsLoading(false);

    updateUploadInfos({
      nbFiles: files.length,
      success: success
        .filter((result) => result.value)
        .map((result) => [
          result.value!.message.filename,
          result.value!.message.id,
        ]),
    });

    if (failed.length) {
      setUploadFailed(true);
    } else {
      useStepStore.setState({ status: "complete" });
    }
  }

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (acceptedFiles.length) {
        setFiles(acceptedFiles);
      }
      setRejectedFiles(rejectedFiles);
    },
    []
  );

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "application/octet-stream": [".pdf"],
    },
    maxFiles: isBulkProcessing ? 10 : 1,
    multiple: isBulkProcessing,
    maxSize: 5 * 1024 * 1024, // 5MB
    onDrop,
  });

  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(className, "flex flex-col items-center justify-center")}
    >
      <div className="flex items-center gap-2 mb-4">
        <Switch
          id="bulk-processing"
          onCheckedChange={() =>
            setBulkProcessing((previousState) => !previousState)
          }
          checked={isBulkProcessing}
        />
        <Label htmlFor="bulk-processing">Bulk Processing</Label>
        <HelpPopover contentClassName="w-[500px] overflow-scroll">
          <div className="flex items-center gap-2 mb-2">
            <Icons.help width={20} height={20} />
            <h3 className="font-semibold">Bulk Processing</h3>
          </div>

          <p className="mb-2 text-slate-700 text-sm">
            Bulk processing allows you to upload multiple files at once. The
            current limit allows you to upload up to 10 files at once.
          </p>
          <p className="text-slate-700 text-sm">
            Bulk processing automatically triggers the structuring of all
            uploaded PDF files. Each structuring process will stop at its
            current pipeline if it encounters an error. Structured files will be
            waiting for a verification in the corresponding pipeline.
          </p>
        </HelpPopover>
      </div>
      <div
        className="border border-dashed	rounded-xl border-slate-300 bg-slate-50 px-24 py-16 2xl:px-32 2xl:py-20 text-slate-600 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-400"
        {...getRootProps()}
      >
        <input {...getInputProps({ name: "file" })} />
        <div>
          <Icons.upload
            width={40}
            height={40}
            strokeWidth={1.5}
            className="mx-auto text-slate-400"
          />
          <div className="text-center">
            <p>
              Drag & drop or <span className="font-semibold">browse files</span>
            </p>
            <em className="text-xs text-slate-500">
              {isBulkProcessing ? (
                <>PDF files only (max 10), </>
              ) : (
                <>One PDF file only, </>
              )}
              up to 5MB
            </em>
          </div>
        </div>
      </div>
      {rejectedFiles.length > 0 && (
        <section className="mt-2 w-full flex items-center gap-1">
          <h4 className="font-medium text-red-500 text-sm">Rejected files</h4>
          <HelpPopover
            iconClassName="w-3.5 text-red-500 hover:text-red-700"
            contentClassName="w-full"
          >
            {rejectedFiles.map(({ file, errors }) => (
              <div key={file.name}>
                <div className="flex items-center gap-1 text-slate-600 text-xs w-[402px] 2xl:w-[466px]">
                  <Icons.file className="flex-none" width={12} height={12} />
                  <span className="font-medium truncate overflow-hidden grow">
                    {file.name}
                  </span>
                  <span className="flex-none">({formatBytes(file.size)})</span>
                </div>
                <span className="flex-none flex items-center mb-2 text-red-500">
                  {errors.map((e) => (
                    <span key={e.code} className="text-xs">
                      {(e.code === "file-invalid-type" && (
                        <>Invalid file type. Only PDF files are allowed.</>
                      )) ||
                        e.message}
                    </span>
                  ))}
                </span>
              </div>
            ))}
          </HelpPopover>
        </section>
      )}
      {files.length > 0 && (
        <section className="mt-2 w-full">
          {files.map((file, index) => (
            <div
              title={file.name}
              key={file.name}
              className="flex items-center gap-1 text-slate-600 text-xs mb-0.5 w-[402px] 2xl:w-[466px]"
            >
              <Icons.file className="flex-none" width={12} height={12} />
              <span className="font-medium truncate overflow-hidden grow">
                {file.name}
              </span>
              <span className="flex-none flex items-center gap-0.5">
                ({formatBytes(file.size)})
                <Icons.close
                  onClick={() => {
                    setFiles((previousState) => {
                      const newState = [...previousState];
                      newState.splice(index, 1);
                      return newState;
                    });
                  }}
                  width={12}
                  height={12}
                  className="cursor-pointer hover:text-red-500"
                />
              </span>
            </div>
          ))}
          <Button
            disabled={isLoading}
            className="mt-3 w-full"
            onClick={() => uploadFiles(files)}
          >
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Upload
          </Button>
          {hasUploadFailed && (
            <p className="mt-2 text-red-500 text-xs">
              The upload failed. Please try again.
            </p>
          )}
        </section>
      )}
    </motion.div>
  );
}
