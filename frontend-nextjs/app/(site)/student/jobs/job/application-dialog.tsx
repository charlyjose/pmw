import React from "react";

import { useRouter } from "next/navigation";

import axios from "axios";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { ArrowUpRight } from "lucide-react";
import { Button as ShadcnButton } from "@/registry/new-york/ui/button";

import { InboxOutlined } from "@ant-design/icons";
import { Form, Select, Upload, message, Input } from "antd";
const { Option } = Select;

import { CheckCircle2Icon } from "lucide-react";
import { Icons } from "@/components/icons";

import { toast } from "@/registry/new-york/ui/use-toast";
import { toast as hotToast } from "react-hot-toast";
import { a } from "drizzle-orm/column.d-b7dc3bdb";

const acceptedTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const acceptedFileTypesAliases = {
  "application/pdf": "PDF",
  "application/msword": "DOC",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "DOCX",
};

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

export function JobApplicationDialog({ job, axiosConfig }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  function validateUpload(file) {
    const validFileType = acceptedTypes.includes(file.type);

    if (!validFileType) {
      message.error(`${file.name} is not a supported file type`);
    }

    const isLt2M = file.size / 1024 / 1024 < 2;

    if (!isLt2M) {
      message.error("File size must be less than 2MB");
    }
    return (validFileType && isLt2M) || Upload.LIST_IGNORE;
  }

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const onFinish = (data: any) => {
    setIsLoading(true);

    var applicationData = {
      name: data.name,
      email: data.email,
      cv: data.cv[0],
    };

    if (data.cl) {
      applicationData.cl = data.cl[0];
    }

    function formatBytes(size) {
      var units = ["B", "KB", "MB", "GB", "TB"],
        bytes = size,
        i;

      for (i = 0; bytes >= 1024 && i < 4; i++) {
        bytes /= 1024;
      }
      return bytes.toFixed(2) + units[i];
    }

    var file_details = {
      name: applicationData.name,
      email: applicationData.email,
      cv: {
        name: applicationData.cv.name,
        size: `${formatBytes(applicationData.cv.size)}`,
        type: acceptedFileTypesAliases[applicationData.cv.type],
      },
    };

    if (data.cl) {
      file_details.cl = {
        name: applicationData.cl.name,
        size: `${formatBytes(applicationData.cl.size)}`,
        type: acceptedFileTypesAliases[applicationData.cl.type],
      };
    }

    const formData = new FormData();
    formData.append("cv", applicationData.cv.originFileObj);
    if (data.cl) {
      formData.append("cl", applicationData.cl.originFileObj);
    }

    axiosConfig.headers["Content-Type"] = "multipart/form-data";

    const API_URI = process.env.NEXT_PUBLIC_API_URL as string;
    var url = `${API_URI}/api/student/jobs/apply/job?id=${job.id}&name=${applicationData.name}&email=${applicationData.email}&cvFileType=${file_details.cv.type}`;
    if (data.cl) {
      url += `&clFileType=${file_details.cl.type}`;
    }
    axios
      .post(url, formData, axiosConfig)
      .then((response) => {
        toast({
          title: "File uploaded successfully",
          description: (
            <>
              <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                <code className="text-white">
                  {JSON.stringify(file_details, null, 2)}
                </code>
              </pre>
            </>
          ),
        });

        hotToast.success(response.data.message, {
          style: {
            background: "#4B5563",
            color: "#F3F4F6",
          },
        });

        setTimeout(() => {
          setIsLoading(false);
          // router.push("/student/placement/reports/new");
        }, 1000);
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          title: error.response.data.message,
        });

        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="text-right text-xs font-medium hover:underline">
          <Button className="hover:bg-lime-300 hover:text-black">
            <ArrowUpRight className="mr-0 h-4 w-4" />
            Apply
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>Job Application</DialogTitle>

          <DialogDescription className="pt-5">
            <Form
              name="validate_other"
              // {...formItemLayout}
              onFinish={onFinish}
              style={{ alignSelf: "left", alignContent: "left", width: "100%" }}
              layout="vertical"
            >
              <Form.Item
                name="name"
                label="Full Name"
                wrapperCol={{ span: 8 }}
                hasFeedback
                className="font-medium p-0"
                rules={[
                  {
                    required: true,
                    message: "Name is required",
                    type: "string",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                wrapperCol={{ span: 8 }}
                hasFeedback
                className="font-medium p-0"
                rules={[
                  {
                    required: true,
                    message: "Email is required",
                    type: "email",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item label="Resume/CV" className="pt-3 font-medium">
                <Form.Item
                  name="cv"
                  label="CV"
                  valuePropName="fileList"
                  getValueFromEvent={normFile}
                  noStyle
                  rules={[
                    {
                      required: true,
                      message: "CV is required",
                    },
                  ]}
                >
                  <Upload.Dragger
                    name="cv"
                    maxCount={1}
                    beforeUpload={validateUpload}
                    multiple={false}
                    showUploadList={true}
                    // accept=".pdf"
                  >
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">
                      Click or drag file to this area to upload
                    </p>
                  </Upload.Dragger>
                </Form.Item>
              </Form.Item>

              <Form.Item label="Cover Letter" className="pt-3 font-medium">
                <Form.Item
                  name="cl"
                  label="cl"
                  valuePropName="fileList"
                  getValueFromEvent={normFile}
                  noStyle
                  rules={[
                    {
                      required: false,
                    },
                  ]}
                >
                  <Upload.Dragger
                    name="cl"
                    maxCount={1}
                    beforeUpload={validateUpload}
                    multiple={false}
                    showUploadList={true}
                    // accept=".pdf"
                  >
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">
                      Click or drag file to this area to upload
                    </p>
                  </Upload.Dragger>
                </Form.Item>
              </Form.Item>

              <Form.Item className="pt-5">
                <div className="text-right text-xs font-medium hover:underline">
                  <ShadcnButton disabled={isLoading} type="submit">
                    {isLoading && (
                      <>
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        Hang on! We are uploading your application...
                      </>
                    )}
                    {!isLoading && (
                      <>
                        <CheckCircle2Icon className="mr-2 h-4 w-4" />
                        Submit application
                      </>
                    )}
                  </ShadcnButton>
                </div>
              </Form.Item>
            </Form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
