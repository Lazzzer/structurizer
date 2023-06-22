"use client";

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

export default function PdfViewer({
  url,
  scaleValue = 1,
}: {
  url: string;
  scaleValue?: number;
}) {
  const [numPages, setNumPages] = useState(0);
  const [scale, setScale] = useState(scaleValue);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  return (
    <div className="bg-red-600">
      <div className="">
        <button onClick={() => setScale(scale + 0.2)} disabled={scale >= 3}>
          Zoom +
        </button>
        <button onClick={() => setScale(scale - 0.2)} disabled={scale <= 0.3}>
          Zoom -
        </button>
      </div>
      <div
        style={{ width: "384px", height: "540px" }}
        className="bg-slate-50 border  border-slate-200 rounded-lg overflow-scroll overscroll-contain"
      >
        <Document
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
          className="gap-2 flex flex-col"
        >
          {Array.from(new Array(numPages), (el, index) => (
            <Page
              key={`page_${index + 1}`}
              height={540}
              pageNumber={index + 1}
              scale={scale}
              className="border border-slate-200"
            />
          ))}
        </Document>
      </div>
    </div>
  );
}
