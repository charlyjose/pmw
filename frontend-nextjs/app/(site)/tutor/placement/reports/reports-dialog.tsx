import axios from "axios";
import { saveAs } from "file-saver";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/registry/new-york/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/registry/new-york/ui/badge";

import { BsFiletypeDocx } from "react-icons/bs";
import { BsFiletypeDoc } from "react-icons/bs";
import { BsFileEarmarkPdf } from "react-icons/bs";
import { DownloadIcon } from "lucide-react";

import { toast } from "@/registry/new-york/ui/use-toast";

export function ApplicationDialog({ student, axiosConfig }) {
  function downloadFile(report) {
    var config = axiosConfig;
    delete config.headers["Content-Type"];
    config.responseType = "blob";
    config.headers["accept"] = "application/json";

    var report_id = report.id;
    var report_name = report.report_name;

    axios
      .get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/student/placement/reports/download?report_id=${report_id}`,
        config
      )
      .then((e) => {
        saveAs(e.data, `${report_name}`);
        toast({
          variant: "default",
          title: "Placement reports",
          description: "Successfully downloaded the report",
        });
      })
      .catch((e) => {
        toast({
          variant: "destructive",
          title: "Placement reports",
          description: "Error downloading the report",
        });
      });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link">
          <ArrowUpRight className="mr-0 h-4 w-4" />
          <div className="text-right text-xs font-normal hover:underline">
            View
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>
            <div className="grid grid-cols-12 gap-1">
              <div className="col-span-12">
                <div className="pt-1 font-normal">
                  Reports of{" "}
                  <span className="font-bold">{student.studentName}</span>
                </div>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <DialogDescription>
          <ScrollArea className="rounded-md">
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
              {student.reports.map((report) => (
                <Card
                  className="transition-all hover:bg-accent hover:text-accent-foreground"
                  key={report.id}
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      <div className="text-sm font-normal">{report.title}</div>
                      <div className="text-sm font-bold pt-2">
                        <Badge variant="default">
                          {report.month.replace("_", " ")}
                        </Badge>
                      </div>
                    </CardTitle>
                    {report.file_type === "PDF" ? (
                      <BsFileEarmarkPdf className="mr-1 w-8 h-8 text-red-600" />
                    ) : (
                      <></>
                    )}
                    {report.file_type === "DOCX" ? (
                      <BsFiletypeDocx className="mr-1 w-8 h-8 text-red-600" />
                    ) : (
                      <></>
                    )}{" "}
                    {report.file_type === "DOC" ? (
                      <BsFiletypeDoc className="mr-1 w-8 h-8 text-red-600" />
                    ) : (
                      <></>
                    )}
                  </CardHeader>

                  <CardContent>
                    <div className="grid grid-cols-8 gap-2">
                      <div className="col-span-6">
                        <div className="grid gap-1">
                          <div className="text-xl font-bold">
                            {new Date(report.createdAt).toDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="col-span-2">
                        <div className="grid gap-1">
                          <div className="text-right text-xs font-medium hover:underline">
                            <Button
                              variant="link"
                              className="pl-0"
                              onClick={(e) => downloadFile(report)}
                            >
                              <DownloadIcon className="mr-1 h-4 w-4" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
