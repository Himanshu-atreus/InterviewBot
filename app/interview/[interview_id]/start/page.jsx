"use client";

import { InterviewDataContext } from "@/context/InterviewDataContext";
import { Phone, Timer } from "lucide-react";
import Image from "next/image";
import React, { useContext, useEffect, useState, useRef } from "react";
import Vapi from "@vapi-ai/web";
import AlertConfirmation from "./_components/AlertConfirmation";
import axios from "axios";
import TimmerComponent from "./_components/TimmerComponent";
import { getVapiClient } from "@/lib/vapiconfig";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

function StartInterview() {
  const { interviewInfo } = useContext(InterviewDataContext);
  const vapi = getVapiClient();
  const [activeUser, setActiveUser] = useState(false);
  const [start, setStart] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);
  const [userProfile, setUserProfile] = useState({
    picture: null,
    name: interviewInfo?.candidate_name || "Candidate",
  });

  const conversation = useRef(null);
  const { interview_id } = useParams();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && !userProfile.name) {
      const googleProfile = localStorage.getItem("googleProfile");
      if (googleProfile) {
        const { picture, name } = JSON.parse(googleProfile);
        setUserProfile({ picture, name });
      }
    }

    if (interviewInfo?.jobPosition && vapi && !start) {
      setStart(true);
      startCall();
    }
  }, [interviewInfo, vapi]);

  const startCall = async () => {
    const jobPosition = interviewInfo?.jobPosition || "Unknown Position";
    const questionList =
      (interviewInfo?.questionList?.interviewQuestions || []).map((q) => q?.question);

    const assistantOptions = {
      name: "AI Recruiter",
      firstMessage: `Hi ${interviewInfo?.candidate_name}, how are you? Ready for your interview on ${jobPosition}?`,
      transcriber: {
        provider: "deepgram",
        model: "nova-3",
        language: "en-US",
      },
      voice: {
        provider: "vapi",
        voiceId: "Neha",
      },
      model: {
        provider: "openai",
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `
You are an AI voice assistant conducting interviews.
Ask the candidate the following one-by-one: ${questionList}
Begin with a friendly greeting and short intro.
After 5-7 questions, thank the candidate and end the call.
Keep responses short, engaging, and React-focused.
`.trim(),
          },
        ],
      },
    };

    vapi.start(assistantOptions);
  };

  useEffect(() => {
    if (!vapi) return;

    const handleMessage = (message) => {
      if (message?.conversation) {
        const filtered = message.conversation.filter((msg) => msg.role !== "system");
        conversation.current = JSON.stringify(filtered, null, 2);
      }
    };

    vapi.on("message", handleMessage);
    vapi.on("call-start", () => setStart(true));
    vapi.on("speech-start", () => {
      setIsSpeaking(true);
      setActiveUser(false);
    });
    vapi.on("speech-end", () => {
      setIsSpeaking(false);
      setActiveUser(true);
    });
    vapi.on("call-end", () => {
      setIsGeneratingFeedback(true);
      GenerateFeedback();
    });

    return () => {
      vapi.off("message", handleMessage);
      vapi.off("call-start", () => {});
      vapi.off("speech-start", () => {});
      vapi.off("speech-end", () => {});
      vapi.off("call-end", () => {});
    };
  }, [vapi]);

  const GenerateFeedback = async () => {
    try {
      const result = await axios.post("/api/ai-feedback", {
        conversation: conversation.current,
      });
      const content = result.data.content.replace(/```json|```/g, "");
      if (!content) throw new Error();
      localStorage.setItem("interview-feedback", content);
      router.replace(`/interview/${interview_id}/completed`);
    } catch {
      toast.error("Failed to generate feedback");
    } finally {
      setIsGeneratingFeedback(false);
    }
  };

  const stopInterview = () => vapi.stop();

  return (
    <div className="min-h-screen bg-gray-900 p-6 text-gray-100">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">{interviewInfo?.jobPosition || "AI"} Interview Round</h1>
            <p className="text-gray-400">Recooty</p>
          </div>

          {/* Circular Stopwatch Timer */}
          <div className="relative w-35 h-35">
            <svg className="absolute inset-0" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
              <circle
                cx="50" cy="50" r="48"
                stroke="url(#grad)"
                strokeWidth="4"
                fill="none"
              />
            </svg>
            <div className="absolute inset-2 bg-gray-800 rounded-full flex items-center justify-center">
              <span className="font-mono text-2xl font-semibold">
                <TimmerComponent start={start} />
              </span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* AI Panel */}
          <div className={`bg-gray-800 rounded-2xl p-8 shadow-lg border transition-all ${isSpeaking ? "border-indigo-500 ring-4 ring-indigo-300" : "border-gray-700"}`}>
            <div className="flex flex-col items-center space-y-6">
              <div className="relative">
                {isSpeaking && <div className="absolute inset-0 rounded-lg bg-indigo-500/30 animate-ping"></div>}
                <div className="w-24 h-24 rounded-lg overflow-hidden shadow-2xl bg-indigo-600 flex items-center justify-center">
                  <Image src="/rico.png" alt="AI Recruiter" width={96} height={96} priority />
                </div>
              </div>
              <div className="text-center">
                <h2 className="text-xl font-semibold">Rico AI</h2>
                <p className="text-sm text-gray-400">Technical Round</p>
              </div>
            </div>
          </div>

          {/* Candidate Panel */}
          <div className={`bg-gray-800 rounded-2xl p-8 shadow-lg border transition-all ${activeUser ? "border-purple-500 ring-4 ring-purple-300" : "border-gray-700"}`}>
            <div className="flex flex-col items-center space-y-6">
              <div className="relative">
                {activeUser && <div className="absolute inset-0 rounded-lg bg-purple-500/30 animate-ping"></div>}
                <div className="w-24 h-24 rounded-lg overflow-hidden shadow-2xl bg-gray-700 flex items-center justify-center">
                  {userProfile.picture ? (
                    <Image src={userProfile.picture} alt={userProfile.name} width={96} height={96} className="object-cover" priority />
                  ) : (
                    <span className="text-3xl font-bold text-gray-400">{userProfile.name.charAt(0).toUpperCase()}</span>
                  )}
                </div>
              </div>
              <div className="text-center">
                <h2 className="text-xl font-semibold">{userProfile.name}</h2>
                <p className="text-sm text-gray-400">Candidate</p>
              </div>
            </div>
          </div>
        </div>

        {/* Control Panel */}
        <div className="bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700">
          <div className="flex flex-col items-center">
            <AlertConfirmation stopInterview={stopInterview}>
              <button className="p-4 rounded-full bg-red-700 text-red-200 hover:bg-red-600 shadow-xl flex items-center gap-3">
                <Phone size={24} />
                <span className="text-lg font-semibold">End Interview</span>
              </button>
            </AlertConfirmation>
            <p className="mt-4 text-sm text-gray-400">{activeUser ? "Please respond..." : "AI is speaking..."}</p>
          </div>
        </div>
      </div>

      {isGeneratingFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-400 mx-auto mb-4"></div>
            <h2 className="text-xl font-bold mb-2">Generating Feedback</h2>
            <p className="text-gray-400">Please wait while we analyze your interview...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default StartInterview;
