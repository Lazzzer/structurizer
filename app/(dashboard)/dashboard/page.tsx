import { TopMainContent } from "@/components/top-main-content";
import { DataTable } from "@/components/ui/data-table";
import prisma from "@/lib/prisma";
import { Status } from "@prisma/client";
import {
  Extraction,
  categories,
  columns,
  columnsWithoutStatus,
  statuses,
} from "./columns";
import { getUser } from "@/lib/session";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Main page to view current and processed extractions",
};

async function getExtractions() {
  const user = await getUser();
  const currentExtractions = await prisma.extraction.findMany({
    orderBy: {
      updatedAt: "desc",
    },
    where: {
      user: {
        id: user!.id,
      },
      NOT: {
        status: Status.PROCESSED,
      },
    },
  });

  const finishedExtractions = await prisma.extraction.findMany({
    orderBy: {
      updatedAt: "desc",
    },
    where: {
      user: {
        id: user!.id,
      },
      status: Status.PROCESSED,
    },
    include: {
      receipt: {
        select: {
          id: true,
        },
      },
      invoice: {
        select: {
          id: true,
        },
      },
      cardStatement: {
        select: {
          id: true,
        },
      },
    },
  });

  return {
    currentExtractions,
    finishedExtractions,
  };
}

export default async function DashboardPage() {
  const { currentExtractions, finishedExtractions } = await getExtractions();
  return (
    <div className="flex flex-col h-full">
      <TopMainContent title="Dashboard" displayUploadButton />
      <div className="m-8 flex flex-col flex-grow space-y-10 2xl:space-y-6">
        <DataTable
          title="Documents in Pipelines"
          emptyMessage="No documents in Pipelines"
          filterColumn={{
            columnId: "filename",
            placeholder: "Filter by file name",
          }}
          columns={columns}
          categories={categories}
          statuses={statuses}
          data={currentExtractions as Extraction[]}
        />
        <DataTable
          title="Latest Data Extractions"
          emptyMessage="No data extractions"
          filterColumn={{
            columnId: "filename",
            placeholder: "Filter by file name",
          }}
          columns={columnsWithoutStatus}
          categories={categories}
          data={finishedExtractions as Extraction[]}
        />
      </div>
    </div>
  );
}
