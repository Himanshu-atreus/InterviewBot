import { Button } from "@/components/ui/button";
import { ArrowRight, Copy, Send } from "lucide-react";
import moment from "moment";
import React from "react";
import { toast } from "sonner";
import Link from "next/link";

function InterviewCard({ interview, viewDetail = false }) {
  const copyLink = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_HOST_URL.replace(/\/$/, "");
      const url = `${baseUrl}/interview/${interview?.interview_id}`;
      await navigator.clipboard.writeText(url);
      toast.success("Interview link copied!");
    } catch (err) {
      toast.error("Failed to copy link");
      console.error("Failed to copy: ", err);
    }
  };

  const onSend = () => {
    window.location.href =
      "mailto:Sujeethkumararjun@gmail.com?subject=AI Recruiter Interview Link&body=Hi, I would like to schedule an interview with you. Please find the link below:\n\n" +
      `${process.env.NEXT_PUBLIC_HOST_URL}/interview/${interview?.interview_id}`;
    toast.success("Email sent!");
  };

  return (
    <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 w-full dark:bg-gray-800 dark:border-gray-700">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 md:h-4 md:w-4 bg-blue-500 rounded-full mt-1 flex-shrink-0 dark:bg-blue-400" />
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {interview?.jobPosition}
            </h2>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
              <span className="text-sm text-gray-500 dark:text-gray-300">
                {moment(interview?.created_at).format("DD MMM YYYY")}
              </span>
              <span className="text-gray-300 dark:text-gray-500">•</span>
              <span className="text-sm text-gray-500 dark:text-gray-300">
                {interview?.duration}
              </span>
              <span className="text-sm bg-gray-100 px-2 py-0.5 rounded-full text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                {interview['interview-feedback']?.length || 0} candidate{interview['interview-feedback']?.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
        <span className="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-600 rounded-full whitespace-nowrap dark:bg-blue-900 dark:text-blue-200">
          Scheduled
        </span>
      </div>

      {!viewDetail ? (
        <div className="flex gap-3 mt-6">
          <Button
            variant="outline"
            className="flex-1 flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            onClick={copyLink}
          >
            <Copy size={16} className="text-gray-600 dark:text-gray-300" />
            <span>Copy Link</span>
          </Button>
          <Button
            className="flex-1 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
            onClick={onSend}
          >
            <Send size={16} className="text-white" />
            <span>Send</span>
          </Button>
        </div>
      ) : (
        <Link href={`/scheduled-interview/${interview?.interview_id}/details`} passHref legacyBehavior>
          <Button as="a" className="mt-5 w-full gap-2 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700" variant="outline">
            View Details
            <ArrowRight className="h-4 w-4 dark:text-gray-300" />
          </Button>
        </Link>
      )}
    </div>
  );
}

export default InterviewCard;