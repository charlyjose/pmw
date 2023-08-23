"use client";

const PAGE_TYPE = "STUDENT";
const UNAUTHORISED_REDIRECTION_LINK = "/signin?callbackUrl=/protected/server";

import React from "react";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import axios from "axios";

import { InboxOutlined } from "@ant-design/icons";
import { Form, Select, Upload, message, Input } from "antd";
const { Option } = Select;

import { Button as ShadcnButton } from "@/registry/new-york/ui/button";

import { CheckCircle2Icon } from "lucide-react";
import { Icons } from "@/components/icons";

import { toast } from "@/registry/new-york/ui/use-toast";
import { toast as hotToast } from "react-hot-toast";

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

export function NewMonthlyReport() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  useEffect(() => {
    // Validating client-side session
    if (!session && session?.user?.role != PAGE_TYPE) {
      router.push(UNAUTHORISED_REDIRECTION_LINK);
    }
  }, []);

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

    const reportData = {
      title: data.title,
      month: data.month,
      report: data.report[0],
    };

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
      title: reportData.title,
      month: reportData.month,
      report: {
        name: reportData.report.name,
        size: `${formatBytes(reportData.report.size)}`,
        type: acceptedFileTypesAliases[reportData.report.type],
      },
    };

    const API_URI = process.env.NEXT_PUBLIC_API_URL as string;
    var token = session?.token;
    const config = {
      headers: {
        "Content-Type": `multipart/form-data`,
        Authorization: `Bearer ${token}`,
      },
    };

    const formData = new FormData();
    formData.append("report", reportData.report.originFileObj);

    axios
      .post(
        `${API_URI}/api/student/placement/reports?title=${reportData.title}&month=${reportData.month}&file_type=${file_details.report.type}`,
        formData,
        config
      )
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
          router.push("/student/placement/reports/new");
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
    <>
      <div className="space-y-8">
        <Form
          name="validate_other"
          // {...formItemLayout}
          onFinish={onFinish}
          initialValues={{}}
          style={{ alignSelf: "left", alignContent: "left" }}
          layout="vertical"
        >
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-9">
              <Form.Item
                name="title"
                label="Title"
                hasFeedback
                className="font-medium p-0"
                rules={[
                  {
                    required: true,
                    message: "Report title is required",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </div>

            <div className="col-span-3">
              <Form.Item
                name="month"
                label="Month"
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Please a month for the report you are submitting",
                  },
                ]}
              >
                <Select placeholder="Please select a month">
                  <Option value="MONTH_1">Month 1</Option>
                  <Option value="MONTH_2">Month 2</Option>
                  <Option value="MONTH_3">Month 3</Option>
                  <Option value="MONTH_4">Month 4</Option>
                  <Option value="MONTH_5">Month 5</Option>
                  <Option value="MONTH_6">Month 6</Option>
                  <Option value="MONTH_7">Month 7</Option>
                  <Option value="MONTH_8">Month 8</Option>
                  <Option value="MONTH_9">Month 9</Option>
                  <Option value="MONTH_10">Month 10</Option>
                  <Option value="MONTH_11">Month 11</Option>
                  <Option value="MONTH_12">Month 12</Option>
                </Select>
              </Form.Item>
            </div>
          </div>

          <Form.Item label="File" className="pt-3 font-medium">
            <Form.Item
              name="report"
              label="Report file"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              noStyle
              rules={[
                {
                  required: true,
                  message: "Report file is required",
                },
              ]}
            >
              <Upload.Dragger
                name="report"
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
                    Hang on! We are uploading your report...
                  </>
                )}
                {!isLoading && (
                  <>
                    <CheckCircle2Icon className="mr-2 h-4 w-4" />
                    Submit report
                  </>
                )}
              </ShadcnButton>
            </div>
          </Form.Item>
        </Form>
      </div>
    </>
  );
}
