import {  Computer, CopyCheck, Calendar, LayoutDashboard, List, Settings, WalletCards } from "lucide-react";


export const InterviewType=[
    {
        name:'Technical',
        icon:Computer,
    },
    {
        name:'HR',
        icon:CopyCheck,
    },
]

export const QUESTIONS_PROMPT=`You are an expert technical interviewer.
Based on the following inputs, generate a well-structured list of high-quality interview questions including candidate introduction, salary negotiation, and closing questions.

Job Title: {{jobPosition}}

Job Description:{{jobDescription}}

Interview Duration: {{duration}}

Interview Type: {{type}}

📝 Your task:

Analyze the job description to identify key responsibilities, required skills, and expected experience.

Generate a list of interview questions depends on interview duration

Adjust the number and depth of questions to match the interview duration or more.

Ensure the questions match the tone and structure of a real-life {{type}} interview.

🧩 Format your response in JSON format with array list of questions.
format: interviewQuestions=[
{
 question:'',
 type:'Candidate selfIntroduction about education background, work experience/Candidate home and working locations/worked previous and current working company/Why Should we hire you/Present salary negotiation/Technical/Behavioral/Experience/Problem Solving/Leadership'
},{
...
}]

🎯 The goal is to create a structured, relevant, and time-optimized interview plan for a {{jobPosition}} role.`

export const FEEDBACK_PROMPT=`{{conversation}}

Depends on this Interview Conversation between assitant and user, 

Give me feedback for user interview. Give me rating out of 10 for technical Skills, 

Communication, Problem Solving, Experience. Also give me summery in 3 lines 

about the interview and one line to let me know whether is recommended 

for hire or not with message very strictly. Give me response in JSON format

{

    feedback:{

        rating:{

            TechnicalSkills:5,

            Communication:6,

            ProblemSolving:4,

            Experience:7,

            Behavioral:8,

            Analysis:9



        },

        summery:<in 3 Line>,

        Recommendation:'',

        Recommendation Message:''



    }

}

`