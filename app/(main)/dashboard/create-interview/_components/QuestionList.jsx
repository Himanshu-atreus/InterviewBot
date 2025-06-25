"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Loader2Icon, PlusIcon, Trash2Icon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

function QuestionList({ formData, onCreateLink }) {
  const [loading, setLoading] = useState(true);
  const [questionList, setQuestionList] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [newQuestionType, setNewQuestionType] = useState("behavioral");
  const hasCalled = useRef(false);

  useEffect(() => {
    if (formData && !hasCalled.current) {
      GenerateQuestionList();
    }
  }, [formData]);

  const GenerateQuestionList = async () => {
    setLoading(true);
    hasCalled.current = true;
    try {
      const result = await axios.post("/api/ai-model", {
        ...formData,
      });

      const rawContent = result?.data?.content || result?.data?.Content;

      if (!rawContent) {
        toast("Invalid response format");
        return;
      }

      const match = rawContent.match(/```json\s*([\s\S]*?)\s*```/);

      if (!match || !match[1]) {
        toast("Failed to extract question list");
        return;
      }

      const parsedData = JSON.parse(match[1].trim());
      setQuestionList(parsedData);
    } catch (e) {
      toast("Server Error, Try Again");
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = () => {
    if (!newQuestion.trim()) {
      toast("Please enter a question");
      return;
    }

    setQuestionList(prev => ({
      ...prev,
      interviewQuestions: [...prev.interviewQuestions, { question: newQuestion, type: newQuestionType }]
    }));

    setNewQuestion("");
    setNewQuestionType("behavioral");
    toast("Question added successfully");
  };

  const handleDeleteQuestion = (index) => {
    setQuestionList(prev => {
      const updated = [...prev.interviewQuestions];
      updated.splice(index, 1);
      return {
        ...prev,
        interviewQuestions: updated
      };
    });

    toast("Question deleted successfully");
  };

  const onFinish = async () => {
    setSaveLoading(true);
    const interview_id = uuidv4();

    try {
      // Here you would save questionList and formData to your own backend or file, if needed.
      console.log("Final payload to save:", {
        interview_id,
        formData,
        questionList
      });

      // Simulate success
      toast("Interview saved successfully!");
      onCreateLink(interview_id);
    } catch (e) {
      toast("Error saving interview");
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div>
      {loading && (
        <div className="flex flex-col items-center gap-4 mt-10">
          <Loader2Icon className="animate-spin w-6 h-6 text-blue-500" />
          <div className="p-5 bg-blue-50 rounded-xl border border-gray-100 flex flex-col gap-2 items-center text-center">
            <h2 className="font-semibold text-lg">Generating Interview Questions</h2>
            <p className="text-sm text-gray-600">
              Our AI is crafting personalized questions based on your job position
            </p>
          </div>
        </div>
      )}

      {!loading && questionList && questionList.interviewQuestions && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Generated Questions
          </h2>

          {/* Add Question */}
          <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="font-medium mb-3">Add Custom Question</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="Enter your question"
                className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              <select
                value={newQuestionType}
                onChange={(e) => setNewQuestionType(e.target.value)}
                className="p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="behavioral">Behavioral</option>
                <option value="technical">Technical</option>
                <option value="situational">Situational</option>
                <option value="cultural">Cultural Fit</option>
              </select>
              <Button 
                onClick={handleAddQuestion}
                className="flex items-center gap-1"
              >
                <PlusIcon className="w-4 h-4" />
                Add Question
              </Button>
            </div>
          </div>

          {/* Questions List */}
          <div className="space-y-4">
            {questionList.interviewQuestions.map((item, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg bg-white shadow-sm flex justify-between items-start"
              >
                <div>
                  <p className="font-medium">{index + 1}. {item.question}</p>
                  <p className="text-sm text-primary">Type: {item.type}</p>
                </div>
                <button
                  onClick={() => handleDeleteQuestion(index)}
                  className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                  aria-label="Delete question"
                >
                  <Trash2Icon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-end mt-10">
            <Button onClick={onFinish} disabled={saveLoading}>
              {saveLoading ? (
                <>
                  <Loader2Icon className="animate-spin w-4 h-4 mr-2" />
                  Saving...
                </>
              ) : (
                "Create Interview Link & Finish"
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuestionList;
