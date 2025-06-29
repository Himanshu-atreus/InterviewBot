"use client";
import React, { useEffect, useState, useContext } from 'react';
import Image from 'next/image';
import { Clock, Video, CheckCircle, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { InterviewDataContext } from '@/context/InterviewDataContext';
import { motion } from 'framer-motion';

function Interview() {
  const params = useParams();
  const interview_id = params?.interview_id;
  const [interviewData, setInterviewData] = useState(null);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { interviewInfo, setInterviewInfo } = useContext(InterviewDataContext);
  const router = useRouter();

  useEffect(() => {
    if (interview_id) {
      const sample = {
        jobPosition: 'Software Developer',
        jobDescription: 'Build beautiful and responsive UI components.',
        duration: '30 min',
        type: 'Technical',
        questionList: [
          { question: 'What is React memoization?', type: 'technical' },
          { question: 'Describe a time you handled feedback.', type: 'behavioral' }
        ]
      };
      setInterviewData(sample);
    }
  }, [interview_id]);

  const validateJoin = () => {
    if (!userName.trim()) {
      toast.warning("Full name is required");
      return false;
    }
    if (userName.trim().split(" ").length < 2) {
      toast.warning("Please provide your full name (e.g., First Last)");
      return false;
    }
    const emailRegex = /^[^\s@]+@domain\.com$/;
    if (!emailRegex.test(userEmail)) {
      toast.warning("Valid email required (e.g., user@domain.com)");
      return false;
    }
    return true;
  };

  const onJoinInterview = async () => {
    if (!validateJoin()) return;

    try {
      setInterviewInfo({
        ...interviewInfo,
        candidate_name: userName,
        jobPosition: interviewData?.jobPosition,
        jobDescription: interviewData?.jobDescription,
        duration: interviewData?.duration,
        userEmail: userEmail,
        type: interviewData?.type,
        questionList: interviewData?.questionList,
        interview_id: interview_id,
      });

      toast.success("Creating your interview session...");
      await new Promise((resolve) => setTimeout(resolve, 1500));
      router.push(`/interview/${interview_id}/start`);
    } catch (error) {
      toast.error("Connection failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >


        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#800000] to-violet-500 text-center mb-8">
          AI Interview Portal
        </h1>

        <motion.div whileHover={{ y: -5 }} className="bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border border-gray-700">
          <div className="bg-gradient-to-r from-[#800000] to-violet-500 px-8 py-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {interviewData?.jobPosition || 'AI Interview'}
                </h2>
                <div className="flex items-center gap-2 mt-2 text-indigo-100">
                  <Clock className="h-4 w-4" />
                  <span>{interviewData?.duration || '30 min'}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-full">
                <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm text-white">Rico is waiting on the interview panel</span>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="flex items-center justify-center mb-10">
              <div className="relative w-full max-w-md">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-2 border-dashed border-gray-600" />
                </div>
                <div className="relative flex justify-between">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex flex-col items-center">
                      <div className="h-8 w-8 bg-indigo-100 border-2 border-indigo-500 flex items-center justify-center rounded-md">
                        <span className="text-sm font-medium text-indigo-700">{step}</span>
                      </div>
                      <span className="mt-2 text-xs text-gray-300">
                        {['Setup', 'Interview', 'Results'][step - 1]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Full Name */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <label className="block text-sm font-medium text-gray-300 mb-2">Your Full Name</label>
                <Input

                  

                  placeholder="Eg: James Bond"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="py-3 px-4 border-gray-600 bg-gray-900 text-white focus:ring-2 focus:ring-indigo-500"
                />
              </motion.div>

              {/* Email */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <label className="block text-sm font-medium text-gray-300 mb-2">Professional Email</label>
                <Input
                  type="email"



                  placeholder="Eg: yamraaj@domain.com"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="py-3 px-4 border-gray-600 bg-gray-900 text-white focus:ring-2 focus:ring-indigo-500"
                />
              </motion.div>

              {/* Checklist */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="bg-indigo-900/20 rounded-xl p-5 border border-indigo-600">
                <h4 className="font-medium text-indigo-300 mb-3 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                   Enable the following before joining:
                </h4>
                <ul className="space-y-3">
                  {[ 'Proper name & valid email address', 'Give access to your microphone', 'Ensure a stable internet connection', 'Enable camera permissions' ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="mt-0.5">
                        <div className="h-4 w-4 rounded-full bg-indigo-300 border border-indigo-500 flex items-center justify-center">
                          <div className="h-2 w-2 rounded-full bg-indigo-800" />
                        </div>
                      </div>
                      <span className="text-sm text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Join Button */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="pt-4">
                <Button
                  onClick={onJoinInterview}
                  className={`w-full py-4 rounded-xl text-lg font-medium transition-all bg-[#800000] hover:bg-[#660000] text-white ${!loading && 'hover:shadow-lg'}`}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Preparing...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-3">
                      <Video className="h-5 w-5" />
                      Start Interview
                      <ChevronRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="text-center text-sm text-gray-500 mt-12">
          Powered by AI interview technology • Secure and confidential
        </motion.p>
      </motion.div>
    </div>
  );
}

export default Interview;