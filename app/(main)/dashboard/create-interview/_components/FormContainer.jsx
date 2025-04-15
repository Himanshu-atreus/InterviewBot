import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { InterviewType } from '@/services/Constants';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';
import { ArrowRight } from 'lucide-react';

function FormContainer({ onHandleInputChange }) {
  const [interviewType, setInterviewType] = useState([]);

  useEffect(() => {
    if (interviewType.length) {
      onHandleInputChange('type', interviewType);
    }
  }, [interviewType]);

  return (
    <div className="p-5 bg-white rounded-xl shadow-md">
      <div>
        <h2 className="text-sm font-medium">Job Position</h2>
        <Input
          placeholder="e.g. Software Engineer"
          className="mt-2"
          onChange={(event) =>
            onHandleInputChange('jobposition', event.target.value)
          }
        />
      </div>
      <div className="mt-4">
        <h2 className="text-sm font-medium">Job Description</h2>
        <Textarea
          placeholder="Enter detailed job description"
          className="h-[200px] mt-2"
          onChange={(event) =>
            onHandleInputChange('jobDescription', event.target.value)
          }
        />
      </div>
      <div className="mt-4">
        <h2 className="text-sm font-medium">Interview Duration</h2>
        <Select onValueChange={(value) => onHandleInputChange('duration', value)}>
          <SelectTrigger className="w-full mt-2">
            <SelectValue placeholder="Select Duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5 Min">5 Min</SelectItem>
            <SelectItem value="15 Min">15 Min</SelectItem>
            <SelectItem value="30 Min">30 Min</SelectItem>
            <SelectItem value="45 Min">45 Min</SelectItem>
            <SelectItem value="60 Min">60 Min</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="mt-4">
        <h2 className="text-sm font-medium">Interview Type</h2>
        <div className="flex gap-3 flex-wrap mt-2">
          {InterviewType.map((type, index) => (
            <div
              key={index}
              className={`cursor-pointer flex items-center gap-2 p-1 px-2
                border border-gray-300 rounded-2xl shadow-sm
                ${interviewType.includes(type.name) ? 'bg-gray-200' : 'bg-white'}
                hover:bg-gray-100`}
              onClick={() =>
                setInterviewType((prev) =>
                  prev.includes(type.name)
                    ? prev.filter((t) => t !== type.name)
                    : [...prev, type.name]
                )
              }
            >
              <type.icon className="h-4 w-4" />
              <span className="text-sm">{type.name}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-7 flex justify-end">
        <Button>
          Generate Question <ArrowRight className="ml-2" />
        </Button>
      </div>
    </div>
  );
}

export default FormContainer;
