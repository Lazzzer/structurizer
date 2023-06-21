import React, { useCallback, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { HelpTooltip } from "./ui/help-tooltip";
import Balancer from "react-wrap-balancer";
import { cn, formatBytes } from "@/lib/utils";
import { Icons } from "./icons";
import { Button } from "./ui/button";

export function Dropzone({ className }: { className?: string }) {
  const [files, setFiles] = useState<File[]>([]);
  const [rejected, setRejected] = useState<FileRejection[]>([]);
  const [isBulkProcessing, setBulkProcessing] = React.useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (acceptedFiles.length) {
        setFiles(acceptedFiles);
      }
      setRejected(rejectedFiles);

      console.log(rejectedFiles);
    },
    []
  );

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "application/octet-stream": [".pdf"],
    },
    maxFiles: isBulkProcessing ? 10 : 1,
    multiple: isBulkProcessing,
    maxSize: 5242880, // 5MB
    onDrop,
  });

  return (
    <form
      className={cn(className, "flex flex-col items-center justify-center")}
    >
      <div className="flex items-center gap-2 mb-4">
        <Switch
          id="bulk-processing"
          disabled
          onCheckedChange={() =>
            setBulkProcessing((previousState) => !previousState)
          }
          checked={isBulkProcessing}
        />
        <Label htmlFor="bulk-processing">Bulk Processing</Label>
        <HelpTooltip
          classNameTrigger="h-6 w-6 p-1"
          classNameContent="w-72 px-6 py-4 text-slate-600 text-center"
        >
          <Balancer>
            <p className="mb-4">
              Bulk processing allows you to upload multiple files at once.
            </p>
            <p>
              It will automatically process the files and stop at its current
              pipeline when it encounters an error.
            </p>
          </Balancer>
        </HelpTooltip>
      </div>
      <div
        className="border border-dashed	rounded-xl border-slate-300 bg-slate-50 px-16 py-10 text-slate-600 cursor-pointer"
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
      {rejected.length > 0 && (
        <section className="mt-2 w-full">
          <h4 className="font-medium text-red-500 text-xs mb-1">
            Rejected files
          </h4>
          {rejected.map(({ file, errors }) => (
            <div
              key={file.name}
              className="flex items-center gap-1 text-red-400 text-xs"
            >
              <Icons.file width={12} height={12} />
              <span className="font-medium">{file.name}</span>
              <span>({formatBytes(file.size)})</span>
              <HelpTooltip
                classNameTrigger="h-5 w-5 p-1"
                classNameContent="px-2 py-1 text-slate-600"
              >
                <ul className="list-disc list-inside">
                  {errors.map((e) => (
                    <span key={e.code} className="text-xs">
                      {(e.code === "file-invalid-type" && (
                        <>Invalid file type. Only PDF files are allowed.</>
                      )) ||
                        e.message}
                    </span>
                  ))}
                </ul>
              </HelpTooltip>
            </div>
          ))}
        </section>
      )}
      {files.length > 0 && (
        <section className="mt-2 w-full">
          {files.map((file, index) => (
            <div
              key={file.name}
              className="flex items-center gap-1 text-slate-700 text-xs mb-1"
            >
              <Icons.file width={12} height={12} />
              <span className="font-medium">{file.name}</span>
              <span>({formatBytes(file.size)})</span>
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
            </div>
          ))}
          <Button className="mt-3 w-full">Upload</Button>
        </section>
      )}
    </form>
  );
}
