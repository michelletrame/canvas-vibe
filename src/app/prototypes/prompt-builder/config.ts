import type { LucideIcon } from "lucide-react"
import {
  PenLine,
  BarChart2,
  Users,
  Search,
  BookOpen,
  FileText,
  Rocket,
  Package,
  File,
  Megaphone,
  ClipboardList,
  Layers,
  List,
  Calendar,
  MessageSquare,
  UserX,
  CircleX,
  AlertTriangle,
  ClipboardX,
  Inbox,
  LayoutDashboard,
  RefreshCw,
  Lightbulb,
} from "lucide-react"

// ── Types ─────────────────────────────────────────────────────────────────────

export type FieldType =
  | "text"
  | "number"
  | "datetime-local"
  | "textarea"
  | "checkbox"
  | "select"
  | "term-select"
  | "course-select"
  | "file-upload"

export interface SelectOption {
  value: string
  label: string
}

export interface FieldConfig {
  name: string
  type: FieldType
  label: string
  placeholder?: string
  helpText?: string
  required?: boolean
  advanced?: boolean
  colSpan?: 1 | 2
  conditional?: { field: string; value: string | boolean }
  options?: SelectOption[]
  rows?: number
  min?: number
  max?: number
  accept?: string
  defaultValue?: string
  defaultChecked?: boolean
}

export interface TemplateRule {
  /** 'notEmpty' | 'true' | 'false' | <fieldName to check for truthiness> */
  condition: string
  /** Alternate field to check (overrides key) */
  field?: string
  /** Text fragment to insert; may contain {fieldName} references */
  template: string
}

export interface ActionConfig {
  id: string
  label: string
  description: string
  categoryId: string
  icon: LucideIcon
  fields: FieldConfig[]
  promptTemplate: string
  templateRules: Record<string, TemplateRule>
}

export interface CategoryConfig {
  id: string
  label: string
  description: string
  icon: LucideIcon
}

export const TERM_OPTIONS: SelectOption[] = [
  { value: "SPRING-2025", label: "Spring 2025" },
  { value: "FALL-2025", label: "Fall 2025" },
  { value: "SPRING-2026", label: "Spring 2026" },
  { value: "SUMMER-2026", label: "Summer 2026" },
  { value: "FALL-2026", label: "Fall 2026" },
]

export const COURSE_OPTIONS: SelectOption[] = [
  { value: "BIO-101",  label: "Biology 101" },
  { value: "BIO-201",  label: "Biology 201" },
  { value: "CHEM-101", label: "Chemistry 101" },
  { value: "PHYS-101", label: "Physics 101" },
  { value: "MATH-201", label: "Calculus II" },
]

// ── Categories ────────────────────────────────────────────────────────────────

export const CATEGORIES: CategoryConfig[] = [
  {
    id: "create",
    label: "Create in Canvas",
    description: "Generate Canvas content using course materials and data",
    icon: PenLine,
  },
  {
    id: "manage",
    label: "Manage & Report",
    description: "Retrieve and analyze Canvas data and perform batch changes",
    icon: BarChart2,
  },
  {
    id: "student-management",
    label: "Student Management",
    description: "Monitor student progress, engagement, and manage submissions",
    icon: Users,
  },
  {
    id: "course-analysis",
    label: "Course Analysis",
    description: "Evaluate course design and pedagogical effectiveness",
    icon: Search,
  },
]

// ── Actions ───────────────────────────────────────────────────────────────────

export const ACTIONS: ActionConfig[] = [
  // ── CREATE IN CANVAS ────────────────────────────────────────────────────────
  {
    id: "create-course",
    label: "Create Course",
    description: "Create a new course",
    categoryId: "create",
    icon: BookOpen,
    fields: [
      { name: "courseName", type: "text", label: "Course Name", required: true, colSpan: 2, placeholder: "e.g., Introduction to Psychology", defaultValue: "Advanced Web Development" },
      { name: "courseCode", type: "text", label: "Course Code", placeholder: "e.g., PSY-101", defaultValue: "CS-301" },
      { name: "term", type: "term-select", label: "Term", required: true, helpText: "Which term is this course for?", defaultValue: "SPRING-2026" },
      { name: "startDate", type: "datetime-local", label: "Start Date", advanced: true, defaultValue: "2026-01-15T00:00" },
      { name: "endDate", type: "datetime-local", label: "End Date", advanced: true, defaultValue: "2026-05-15T23:59" },
      { name: "description", type: "textarea", label: "Course Description", advanced: true, rows: 4, placeholder: "Brief description of the course...", defaultValue: "A comprehensive course covering modern web development frameworks, responsive design, and full-stack application development." },
      { name: "useTemplate", type: "checkbox", label: "Copy from Template/Blueprint", helpText: "Create this course from an existing template", advanced: true, defaultChecked: true },
      { name: "templateCourseName", type: "text", label: "Template Course Name", advanced: true, conditional: { field: "useTemplate", value: true }, placeholder: "e.g., Web Dev Master Template", defaultValue: "CS Master Template Spring 2026" },
      { name: "enrollmentLimit", type: "number", label: "Enrollment Limit (Optional)", advanced: true, placeholder: "e.g., 30", min: 1, max: 500 },
      { name: "publishImmediately", type: "checkbox", label: "Publish Immediately", helpText: "Make visible to students right away (otherwise saved as draft)", advanced: true, defaultChecked: false },
      { name: "additionalInstructions", type: "textarea", label: "Additional Instructions", rows: 2, placeholder: "Any other requirements?", defaultValue: "Add me as the primary instructor." },
    ],
    promptTemplate: 'Create a new course called "{courseName}"{courseCode} in the {termFormatted} term{startDate}{endDate}{description}{useTemplate}{enrollmentLimit}{publishImmediately}{additionalInstructions}',
    templateRules: {
      courseCode: { condition: "notEmpty", template: ' with course code "{courseCode}"' },
      startDate: { condition: "notEmpty", template: ", starting {startDate}" },
      endDate: { condition: "notEmpty", template: " and ending {endDate}" },
      description: { condition: "notEmpty", template: '. Course description: "{description}"' },
      useTemplate: { condition: "true", template: '. Copy content from the "{templateCourseName}" template course' },
      enrollmentLimit: { condition: "notEmpty", template: ". Set enrollment limit to {enrollmentLimit} students" },
      publishImmediately: { condition: "true", template: ". Publish the course immediately so students can access it" },
      additionalInstructions: { condition: "notEmpty", template: ". {additionalInstructions}" },
    },
  },
  {
    id: "create-assignment",
    label: "Create Assignment",
    description: "Create a new assignment in a course",
    categoryId: "create",
    icon: FileText,
    fields: [
      { name: "assignmentName", type: "text", label: "Assignment Name", required: true, colSpan: 2, placeholder: "e.g., Week 1 Assignment", defaultValue: "Week 1 Essay" },
      { name: "term", type: "term-select", label: "Term", helpText: "Select term to filter courses", defaultValue: "SPRING-2026" },
      { name: "courseName", type: "course-select", label: "Course Name", required: true, placeholder: "Type to search courses...", defaultValue: "Introduction to Philosophy" },
      { name: "dueDate", type: "datetime-local", label: "Due Date", defaultValue: "2026-02-28T23:59" },
      { name: "points", type: "number", label: "Points Possible", placeholder: "100", min: 0, defaultValue: "100" },
      { name: "submissionType", type: "select", label: "Submission Type", defaultValue: "online_text_entry", options: [
        { value: "", label: "Not specified" },
        { value: "online_text_entry", label: "Text Entry" },
        { value: "online_upload", label: "File Upload" },
        { value: "online_url", label: "Website URL" },
        { value: "external_tool", label: "External Tool" },
      ]},
      { name: "description", type: "textarea", label: "Assignment Description", rows: 4, placeholder: "Instructions for students", defaultValue: "Write a 3-5 page essay on the topic discussed in class. Include at least three academic sources and follow MLA format." },
      { name: "attachFiles", type: "checkbox", label: "Attach Files to Assignment", advanced: true, helpText: "Attach files like rubrics or templates", defaultChecked: false },
      { name: "files", type: "file-upload", label: "Files to Attach", advanced: true, conditional: { field: "attachFiles", value: true }, helpText: "Drag and drop or click to select files", accept: ".pdf,.doc,.docx,.txt" },
      { name: "assignmentGroup", type: "text", label: "Assignment Group", advanced: true, placeholder: "e.g., Homework, Quizzes, Projects", defaultValue: "Essays" },
      { name: "addToModule", type: "checkbox", label: "Add to Module", advanced: true, helpText: "Also add this assignment to a module", defaultChecked: true },
      { name: "moduleName", type: "text", label: "Module Name", advanced: true, conditional: { field: "addToModule", value: true }, placeholder: "e.g., Week 1", defaultValue: "Week 1: Introduction to Ethics" },
      { name: "publishImmediately", type: "checkbox", label: "Publish Immediately", advanced: true, helpText: "Make visible to students right away (otherwise saved as draft)", defaultChecked: false },
      { name: "additionalInstructions", type: "textarea", label: "Additional Instructions", rows: 2, placeholder: "Any other requirements?", defaultValue: "Send an announcement to students when this is created." },
    ],
    promptTemplate: 'Create an assignment called "{assignmentName}" in the {courseName} course{termInfo}{dueDate}{points}{submissionType}{description}{attachFiles}{assignmentGroup}{moduleName}{publishImmediately}{additionalInstructions}',
    templateRules: {
      termInfo: { field: "term", condition: "notEmpty", template: " in the {termFormatted} term" },
      dueDate: { condition: "notEmpty", template: ", due on {dueDate}" },
      points: { condition: "notEmpty", template: ", worth {points} points" },
      submissionType: { condition: "notEmpty", template: ", with submission type: {submissionType}" },
      description: { condition: "notEmpty", template: ', with the description: "{description}"' },
      attachFiles: { field: "files", condition: "notEmpty", template: ". Attach these files: {files}" },
      assignmentGroup: { condition: "notEmpty", template: ' in the "{assignmentGroup}" assignment group' },
      moduleName: { condition: "notEmpty", template: '. Also add this assignment to the "{moduleName}" module' },
      publishImmediately: { condition: "true", template: ". Publish immediately so students can see it" },
      additionalInstructions: { condition: "notEmpty", template: ". {additionalInstructions}" },
    },
  },
  {
    id: "create-quiz",
    label: "Create Quiz",
    description: "Create a new quiz (New Quizzes)",
    categoryId: "create",
    icon: Rocket,
    fields: [
      { name: "quizTitle", type: "text", label: "Quiz Title", required: true, colSpan: 2, placeholder: "e.g., Chapter 1 Quiz", defaultValue: "Chapter 3: Cell Biology Quiz" },
      { name: "term", type: "term-select", label: "Term", helpText: "Select term to filter courses", defaultValue: "SPRING-2026" },
      { name: "courseName", type: "course-select", label: "Course Name", required: true, placeholder: "Type to search courses...", defaultValue: "BIO-101-Spring 2026" },
      { name: "dueDate", type: "datetime-local", label: "Due Date", defaultValue: "2026-03-15T23:59" },
      { name: "points", type: "number", label: "Points Possible", placeholder: "100", min: 0, defaultValue: "50" },
      { name: "timeLimit", type: "number", label: "Time Limit (minutes)", min: 1, max: 300, defaultValue: "30" },
      { name: "attachMaterials", type: "checkbox", label: "Attach Reference Materials", advanced: true, helpText: "Attach files students can reference during quiz", defaultChecked: false },
      { name: "materials", type: "file-upload", label: "Materials to Attach", advanced: true, conditional: { field: "attachMaterials", value: true }, helpText: "Drag and drop or click to select reference materials", accept: ".pdf,.doc,.docx,.jpg,.png" },
      { name: "useQuestionBank", type: "checkbox", label: "Draw from Question Bank", advanced: true, helpText: "Create quiz that pulls questions from a question bank", defaultChecked: true },
      { name: "questionBankName", type: "text", label: "Question Bank Name", advanced: true, conditional: { field: "useQuestionBank", value: true }, defaultValue: "Chapter 3 Questions" },
      { name: "shuffleAnswers", type: "checkbox", label: "Shuffle Answers", advanced: true, defaultChecked: true },
      { name: "publishImmediately", type: "checkbox", label: "Publish Immediately", advanced: true, helpText: "Make visible to students right away (otherwise saved as draft)", defaultChecked: false },
      { name: "additionalInstructions", type: "textarea", label: "Additional Instructions", rows: 2, placeholder: "Any other requirements?", defaultValue: "Allow 2 attempts, keep highest score." },
    ],
    promptTemplate: 'Create a quiz titled "{quizTitle}" in the {courseName} course{termInfo}{dueDate}{points}{timeLimit}{attachMaterials}{questionBank}{shuffleAnswers}{publishImmediately}{additionalInstructions}',
    templateRules: {
      termInfo: { field: "term", condition: "notEmpty", template: " in the {termFormatted} term" },
      dueDate: { condition: "notEmpty", template: ", due on {dueDate}" },
      points: { condition: "notEmpty", template: ", worth {points} points" },
      timeLimit: { condition: "notEmpty", template: " with a {timeLimit} minute time limit" },
      attachMaterials: { field: "materials", condition: "notEmpty", template: ". Attach these reference materials: {materials}" },
      questionBank: { condition: "useQuestionBank", template: ' that draws questions from the "{questionBankName}" question bank' },
      shuffleAnswers: { condition: "true", template: ". Shuffle answers for each question" },
      publishImmediately: { condition: "true", template: ". Publish immediately so students can see it" },
      additionalInstructions: { condition: "notEmpty", template: ". {additionalInstructions}" },
    },
  },
  {
    id: "create-module",
    label: "Create Module",
    description: "Create a new module in a course",
    categoryId: "create",
    icon: Package,
    fields: [
      { name: "moduleName", type: "text", label: "Module Name", required: true, colSpan: 2, placeholder: "e.g., Week 1: Introduction", defaultValue: "Week 3: Advanced Topics" },
      { name: "term", type: "term-select", label: "Term", helpText: "Select term to filter courses", defaultValue: "FALL-2025" },
      { name: "courseName", type: "course-select", label: "Course Name", required: true, placeholder: "Type to search courses...", defaultValue: "Introduction to Linguistics" },
      { name: "position", type: "number", label: "Position", advanced: true, placeholder: "e.g., 1 for top of list", min: 1, helpText: "Where in the module list should this appear?", defaultValue: "3" },
      { name: "additionalInstructions", type: "textarea", label: "Additional Instructions", rows: 2, placeholder: "Any other requirements?", defaultValue: "Lock this module until Week 2 is completed." },
    ],
    promptTemplate: 'Create a new module called "{moduleName}" in the {courseName} course{termInfo}{position}{additionalInstructions}',
    templateRules: {
      termInfo: { field: "term", condition: "notEmpty", template: " in the {termFormatted} term" },
      position: { condition: "notEmpty", template: " at position {position}" },
      additionalInstructions: { condition: "notEmpty", template: ". {additionalInstructions}" },
    },
  },
  {
    id: "create-page",
    label: "Create Page",
    description: "Create a new page in a course",
    categoryId: "create",
    icon: File,
    fields: [
      { name: "pageTitle", type: "text", label: "Page Title", required: true, colSpan: 2, placeholder: "e.g., Course Policies", defaultValue: "Assignment Solutions" },
      { name: "term", type: "term-select", label: "Term", helpText: "Select term to filter courses", defaultValue: "SPRING-2026" },
      { name: "courseName", type: "course-select", label: "Course Name", required: true, placeholder: "Type to search courses...", defaultValue: "MATH-1010-020-Spring 2026" },
      { name: "content", type: "textarea", label: "Page Content", rows: 6, placeholder: "Content for the page...", defaultValue: "Here are the solutions to the homework assignments. Review these after submitting your work." },
      { name: "attachFiles", type: "checkbox", label: "Attach Files to Page", advanced: true, helpText: "Attach additional files to this page", defaultChecked: false },
      { name: "pageFiles", type: "file-upload", label: "Files to Attach", advanced: true, conditional: { field: "attachFiles", value: true }, helpText: "Drag and drop or click to select files", accept: ".pdf,.doc,.docx,.txt,.jpg,.png" },
      { name: "setAsFrontPage", type: "checkbox", label: "Set as Course Front Page", advanced: true, helpText: "Make this the course home page", defaultChecked: false },
      { name: "conditionalAccess", type: "checkbox", label: "Add Conditional Access", advanced: true, helpText: "Restrict access based on certain criteria", defaultChecked: true },
      { name: "accessCriteria", type: "textarea", label: "Access Criteria", advanced: true, conditional: { field: "conditionalAccess", value: true }, rows: 3, placeholder: "e.g., Only available to students who received a non-zero score on Assignment X", defaultValue: "Only available to students who received a non-zero score on Homework 1" },
      { name: "publishImmediately", type: "checkbox", label: "Publish Immediately", advanced: true, helpText: "Make visible to students right away (otherwise saved as draft)", defaultChecked: false },
      { name: "additionalInstructions", type: "textarea", label: "Additional Instructions", rows: 2, placeholder: "Any other requirements?", defaultValue: "Keep as draft until next week." },
    ],
    promptTemplate: 'Create a page titled "{pageTitle}" in the {courseName} course{termInfo}{content}{attachFiles}{frontPage}{conditionalAccess}{publishImmediately}{additionalInstructions}',
    templateRules: {
      termInfo: { field: "term", condition: "notEmpty", template: " in the {termFormatted} term" },
      content: { condition: "notEmpty", template: ' with the following content: "{content}"' },
      attachFiles: { field: "pageFiles", condition: "notEmpty", template: ". Attach these files: {pageFiles}" },
      frontPage: { condition: "setAsFrontPage", template: ". Set it as the course front page" },
      conditionalAccess: { condition: "conditionalAccess", template: ". {accessCriteria}" },
      publishImmediately: { condition: "true", template: ". Publish immediately so students can see it" },
      additionalInstructions: { condition: "notEmpty", template: ". {additionalInstructions}" },
    },
  },
  {
    id: "create-announcement",
    label: "Create Announcement",
    description: "Create a new announcement in a course",
    categoryId: "create",
    icon: Megaphone,
    fields: [
      { name: "announcementTitle", type: "text", label: "Announcement Title", required: true, colSpan: 2, placeholder: "e.g., Welcome to the Course", defaultValue: "Week 3 Assignment Reminder" },
      { name: "term", type: "term-select", label: "Term", helpText: "Select term to filter courses", defaultValue: "FALL-2025" },
      { name: "courseName", type: "course-select", label: "Course Name", required: true, placeholder: "Type to search courses...", defaultValue: "Introduction to Linguistics" },
      { name: "message", type: "textarea", label: "Message", required: true, rows: 6, placeholder: "Your announcement message...", defaultValue: "Hello everyone! This is a reminder that the Week 3 assignment is due this Friday at 11:59 PM. Please reach out if you have any questions." },
      { name: "attachFiles", type: "checkbox", label: "Attach Files to Announcement", advanced: true, helpText: "Attach additional files", defaultChecked: false },
      { name: "announcementFiles", type: "file-upload", label: "Files to Attach", advanced: true, conditional: { field: "attachFiles", value: true }, helpText: "Drag and drop or click to select files", accept: ".pdf,.doc,.docx,.jpg,.png,.txt" },
      { name: "scheduleDelay", type: "checkbox", label: "Schedule for Later", advanced: true, helpText: "Post the announcement at a specific date/time", defaultChecked: true },
      { name: "postDate", type: "datetime-local", label: "Post Date", advanced: true, conditional: { field: "scheduleDelay", value: true }, defaultValue: "2026-02-24T09:00" },
      { name: "additionalInstructions", type: "textarea", label: "Additional Instructions", rows: 2, placeholder: "Any other requirements?", defaultValue: "Also send this as an email notification." },
    ],
    promptTemplate: 'Create an announcement titled "{announcementTitle}" in the {courseName} course{termInfo} with the message: "{message}"{attachFiles}{postDate}{additionalInstructions}',
    templateRules: {
      termInfo: { field: "term", condition: "notEmpty", template: " in the {termFormatted} term" },
      attachFiles: { field: "announcementFiles", condition: "notEmpty", template: ". Attach these files: {announcementFiles}" },
      postDate: { condition: "notEmpty", template: ". Schedule it to post on {postDate}" },
      additionalInstructions: { condition: "notEmpty", template: ". {additionalInstructions}" },
    },
  },

  // ── MANAGE & REPORT ─────────────────────────────────────────────────────────
  {
    id: "list-assignments",
    label: "List Assignments",
    description: "Get all assignments in a course",
    categoryId: "manage",
    icon: ClipboardList,
    fields: [
      { name: "term", type: "term-select", label: "Term", helpText: "Select term to filter courses", defaultValue: "SPRING-2026" },
      { name: "courseName", type: "course-select", label: "Course Name", required: true, placeholder: "Type to search courses...", defaultValue: "MATH-1010-020-Spring 2026" },
      { name: "additionalInstructions", type: "textarea", label: "Additional Instructions", rows: 2, placeholder: "Any filtering or sorting preferences?", defaultValue: "Show only assignments due in the next 2 weeks." },
    ],
    promptTemplate: "List all assignments in the {courseName} course{termInfo}{additionalInstructions}",
    templateRules: {
      termInfo: { field: "term", condition: "notEmpty", template: " in the {termFormatted} term" },
      additionalInstructions: { condition: "notEmpty", template: ". {additionalInstructions}" },
    },
  },
  {
    id: "list-modules",
    label: "List Modules",
    description: "Get all modules in a course",
    categoryId: "manage",
    icon: Layers,
    fields: [
      { name: "term", type: "term-select", label: "Term", helpText: "Select term to filter courses", defaultValue: "FALL-2025" },
      { name: "courseName", type: "course-select", label: "Course Name", required: true, placeholder: "Type to search courses...", defaultValue: "Introduction to Linguistics" },
      { name: "additionalInstructions", type: "textarea", label: "Additional Instructions", rows: 2, placeholder: "Any additional requirements?", defaultValue: "Include the number of items in each module." },
    ],
    promptTemplate: "List all modules in the {courseName} course{termInfo}{additionalInstructions}",
    templateRules: {
      termInfo: { field: "term", condition: "notEmpty", template: " in the {termFormatted} term" },
      additionalInstructions: { condition: "notEmpty", template: ". {additionalInstructions}" },
    },
  },
  {
    id: "get-module-items",
    label: "Get Module Items",
    description: "View contents of a specific module",
    categoryId: "manage",
    icon: List,
    fields: [
      { name: "moduleName", type: "text", label: "Module Name", required: true, colSpan: 2, placeholder: "e.g., Module 3: Foundations of Money", defaultValue: "Module 3: Foundations of Money" },
      { name: "term", type: "term-select", label: "Term", helpText: "Select term to filter courses", defaultValue: "SPRING-2026" },
      { name: "courseName", type: "course-select", label: "Course Name", required: true, placeholder: "Type to search courses...", defaultValue: "Financial Literacy 101" },
      { name: "courseId", type: "text", label: "Course ID (Optional)", advanced: true, placeholder: "e.g., 1712556", helpText: "Optional: Makes lookup faster", defaultValue: "1712556" },
      { name: "additionalInstructions", type: "textarea", label: "Additional Instructions", rows: 2, placeholder: "Any additional requirements?", defaultValue: "Show completion status for each item." },
    ],
    promptTemplate: "Get module items for {moduleName} in {courseName}{termInfo}{courseId}{additionalInstructions}",
    templateRules: {
      termInfo: { field: "term", condition: "notEmpty", template: " in the {termFormatted} term" },
      courseId: { condition: "notEmpty", template: " (course ID: {courseId})" },
      additionalInstructions: { condition: "notEmpty", template: ". {additionalInstructions}" },
    },
  },
  {
    id: "update-due-date",
    label: "Update Due Date",
    description: "Change the due date for assignments or quizzes",
    categoryId: "manage",
    icon: Calendar,
    fields: [
      { name: "itemDescription", type: "textarea", label: "What items should be updated?", required: true, rows: 3, helpText: 'e.g., "All Chapter quizzes" or "Assignment 1 and Assignment 2"', defaultValue: "All assignments in Week 3" },
      { name: "term", type: "term-select", label: "Term", helpText: "Select term to filter courses", defaultValue: "SPRING-2026" },
      { name: "courseName", type: "course-select", label: "Course Name", placeholder: "Type to search courses...", helpText: "Optional but recommended", defaultValue: "BIO-101-Spring 2026" },
      { name: "newDueDate", type: "datetime-local", label: "New Due Date", required: true, defaultValue: "2026-03-20T23:59" },
      { name: "additionalInstructions", type: "textarea", label: "Additional Instructions", rows: 2, placeholder: "Any additional requirements?", defaultValue: "Send an announcement about the date change." },
    ],
    promptTemplate: "Update the due date for {itemDescription}{courseName}{termInfo} to {newDueDate}{additionalInstructions}",
    templateRules: {
      courseName: { condition: "notEmpty", template: " in the {courseName} course" },
      termInfo: { field: "term", condition: "notEmpty", template: " in the {termFormatted} term" },
      additionalInstructions: { condition: "notEmpty", template: ". {additionalInstructions}" },
    },
  },

  // ── STUDENT MANAGEMENT ──────────────────────────────────────────────────────
  {
    id: "send-message-to-students",
    label: "Send Message to Students",
    description: "Send a message via Canvas inbox or email",
    categoryId: "student-management",
    icon: MessageSquare,
    fields: [
      { name: "term", type: "term-select", label: "Term", helpText: "Select term to filter courses", defaultValue: "SPRING-2026" },
      { name: "courseName", type: "course-select", label: "Course Name", required: true, placeholder: "Type to search courses...", defaultValue: "PSY1012 General Psychology" },
      { name: "recipientType", type: "select", label: "Send To", required: true, defaultValue: "criteria", options: [
        { value: "", label: "Select recipient type" },
        { value: "all", label: "All students in course" },
        { value: "criteria", label: "Students who meet specific criteria" },
        { value: "specific", label: "Specific students by name" },
      ]},
      { name: "criteriaDescription", type: "textarea", label: "Criteria Description", conditional: { field: "recipientType", value: "criteria" }, rows: 2, placeholder: "e.g., \"Students who haven't submitted Assignment 1\"", defaultValue: "Students who haven't logged in during the last 7 days" },
      { name: "studentNames", type: "textarea", label: "Student Names", conditional: { field: "recipientType", value: "specific" }, rows: 3, placeholder: "List student names..." },
      { name: "subject", type: "text", label: "Message Subject", required: true, colSpan: 2, placeholder: "e.g., Check-in: How are you doing?", defaultValue: "Checking in - Let's get back on track" },
      { name: "messageBody", type: "textarea", label: "Message Body", required: true, rows: 8, placeholder: "Your message...", defaultValue: "Hi there! I noticed you haven't logged into the course recently and wanted to check in. Is there anything I can help with? Please let me know if you have questions or need support." },
      { name: "sendAs", type: "select", label: "Send As", advanced: true, defaultValue: "both", options: [
        { value: "", label: "Canvas message only" },
        { value: "email", label: "Email notification" },
        { value: "both", label: "Both message and email" },
      ]},
      { name: "additionalInstructions", type: "textarea", label: "Additional Instructions", rows: 2, placeholder: "Any other requirements?" },
    ],
    promptTemplate: 'Send a message to {recipientType} in {courseName}{termInfo} with subject "{subject}" and message: "{messageBody}"{sendAs}{additionalInstructions}',
    templateRules: {
      termInfo: { field: "term", condition: "notEmpty", template: " in the {termFormatted} term" },
      sendAs: { condition: "notEmpty", template: ". Send as {sendAs}" },
      additionalInstructions: { condition: "notEmpty", template: ". {additionalInstructions}" },
    },
  },
  {
    id: "find-students-not-logged-in",
    label: "Students Not Logged In",
    description: "Find students who haven't logged into a course",
    categoryId: "student-management",
    icon: UserX,
    fields: [
      { name: "term", type: "term-select", label: "Term", helpText: "Select term to filter courses", defaultValue: "SPRING-2026" },
      { name: "courseName", type: "course-select", label: "Course Name", required: true, placeholder: "Type to search courses...", defaultValue: "PSY1012 General Psychology" },
      { name: "timeframe", type: "select", label: "Timeframe", defaultValue: "in the last 7 days", options: [
        { value: "", label: "Ever (never logged in)" },
        { value: "in the last 7 days", label: "Last 7 days" },
        { value: "in the last 14 days", label: "Last 14 days" },
        { value: "in the last 30 days", label: "Last 30 days" },
      ]},
      { name: "includeLastLogin", type: "checkbox", label: "Include Last Login Date", advanced: true, helpText: "Show when each student last logged in", defaultChecked: true },
      { name: "additionalInstructions", type: "textarea", label: "Additional Instructions", rows: 2, placeholder: "What should we do with this list?", defaultValue: "Send them an encouraging email to check in." },
    ],
    promptTemplate: "Get a list of students who have not logged into the {courseName} course{termInfo}{timeframe}{includeLastLogin}{additionalInstructions}",
    templateRules: {
      termInfo: { field: "term", condition: "notEmpty", template: " in the {termFormatted} term" },
      timeframe: { condition: "notEmpty", template: " {timeframe}" },
      includeLastLogin: { condition: "true", template: ". Include their last login date" },
      additionalInstructions: { condition: "notEmpty", template: ". {additionalInstructions}" },
    },
  },
  {
    id: "find-students-incomplete-module",
    label: "Students With Incomplete Module",
    description: "Find students who haven't completed a module",
    categoryId: "student-management",
    icon: CircleX,
    fields: [
      { name: "moduleName", type: "text", label: "Module Name", required: true, colSpan: 2, placeholder: "e.g., Unit 2", defaultValue: "Unit 2" },
      { name: "term", type: "term-select", label: "Term", helpText: "Select term to filter courses", defaultValue: "FALL-2025" },
      { name: "courseName", type: "course-select", label: "Course Name", required: true, placeholder: "Select a course", defaultValue: "Principles of Teaching & Learning" },
      { name: "additionalInstructions", type: "textarea", label: "Additional Instructions", rows: 2, placeholder: "Any additional requirements?", defaultValue: "Include their progress percentage for the module." },
    ],
    promptTemplate: "Find students who have not completed the {moduleName} module in the {courseName} course{termInfo}{additionalInstructions}",
    templateRules: {
      termInfo: { field: "term", condition: "notEmpty", template: " in the {termFormatted} term" },
      additionalInstructions: { condition: "notEmpty", template: ". {additionalInstructions}" },
    },
  },
  {
    id: "find-students-by-grade",
    label: "Students By Grade Threshold",
    description: "Find students below a certain grade",
    categoryId: "student-management",
    icon: BarChart2,
    fields: [
      { name: "gradeThreshold", type: "select", label: "Grade Threshold", required: true, defaultValue: "less than a C", options: [
        { value: "", label: "Select threshold" },
        { value: "less than a C", label: "Below C" },
        { value: "less than a D", label: "Below D (failing)" },
        { value: "less than 70%", label: "Below 70%" },
        { value: "less than 60%", label: "Below 60%" },
        { value: "less than 50%", label: "Below 50%" },
      ]},
      { name: "term", type: "term-select", label: "Term", helpText: "Select term to filter courses", defaultValue: "SPRING-2026" },
      { name: "courseName", type: "course-select", label: "Course Name", required: true, placeholder: "Select a course", defaultValue: "Introduction to Psychology" },
      { name: "courseId", type: "text", label: "Course ID (Optional)", advanced: true, placeholder: "e.g., 1698972", defaultValue: "1698972" },
      { name: "additionalInstructions", type: "textarea", label: "Additional Instructions", rows: 2, placeholder: "Any additional requirements?", defaultValue: "Offer them extra credit opportunities." },
    ],
    promptTemplate: "Find students with grades {gradeThreshold} in {courseName}{termInfo}{courseId}{additionalInstructions}",
    templateRules: {
      termInfo: { field: "term", condition: "notEmpty", template: " in the {termFormatted} term" },
      courseId: { condition: "notEmpty", template: " (course ID: {courseId})" },
      additionalInstructions: { condition: "notEmpty", template: ". {additionalInstructions}" },
    },
  },
  {
    id: "find-low-engagement",
    label: "Low Engagement Students",
    description: "Find students with low participation",
    categoryId: "student-management",
    icon: AlertTriangle,
    fields: [
      { name: "term", type: "term-select", label: "Term", helpText: "Select term to filter courses", defaultValue: "FALL-2025" },
      { name: "courseName", type: "course-select", label: "Course Name", required: true, placeholder: "Select a course", defaultValue: "BIB1520 - Biblical Studies" },
      { name: "additionalInstructions", type: "textarea", label: "Additional Instructions", rows: 2, placeholder: "What defines low engagement for you?", defaultValue: "Include students with less than 50% page views and no discussion posts." },
    ],
    promptTemplate: "Find students with low engagement in the {courseName} course{termInfo}{additionalInstructions}",
    templateRules: {
      termInfo: { field: "term", condition: "notEmpty", template: " in the {termFormatted} term" },
      additionalInstructions: { condition: "notEmpty", template: ". {additionalInstructions}" },
    },
  },
  {
    id: "list-missing-submissions",
    label: "List Missing Submissions",
    description: "Find students who haven't submitted an assignment",
    categoryId: "student-management",
    icon: ClipboardX,
    fields: [
      { name: "assignmentName", type: "text", label: "Assignment Name", required: true, colSpan: 2, placeholder: "e.g., Homework 1", defaultValue: "Homework 1" },
      { name: "term", type: "term-select", label: "Term", helpText: "Select term to filter courses", defaultValue: "SPRING-2026" },
      { name: "courseName", type: "course-select", label: "Course Name", required: true, placeholder: "Select a course", defaultValue: "MATH-1010-020-Spring 2026" },
      { name: "includeZeroScores", type: "checkbox", label: "Include Students with Zero Scores", advanced: true, helpText: "Also show students who submitted but received 0 points", defaultChecked: true },
      { name: "additionalInstructions", type: "textarea", label: "Additional Instructions", rows: 2, placeholder: "Any additional requirements?", defaultValue: "Send them a reminder email about the missing work." },
    ],
    promptTemplate: 'Show me students who haven\'t submitted "{assignmentName}" in {courseName}{termInfo}{includeZeroScores}{additionalInstructions}',
    templateRules: {
      termInfo: { field: "term", condition: "notEmpty", template: " in the {termFormatted} term" },
      includeZeroScores: { condition: "true", template: ". Include students with zero scores" },
      additionalInstructions: { condition: "notEmpty", template: ". {additionalInstructions}" },
    },
  },
  {
    id: "get-assignment-submissions",
    label: "Get Assignment Submissions",
    description: "View all submissions for an assignment",
    categoryId: "student-management",
    icon: Inbox,
    fields: [
      { name: "assignmentName", type: "text", label: "Assignment Name", required: true, colSpan: 2, placeholder: "e.g., Final Essay", defaultValue: "Final Essay" },
      { name: "term", type: "term-select", label: "Term", helpText: "Select term to filter courses", defaultValue: "FALL-2025" },
      { name: "courseName", type: "course-select", label: "Course Name", required: true, placeholder: "Select a course", defaultValue: "English 101" },
      { name: "filterBy", type: "select", label: "Filter Submissions", advanced: true, options: [
        { value: "", label: "All submissions" },
        { value: "graded", label: "Only graded" },
        { value: "ungraded", label: "Only ungraded" },
        { value: "late", label: "Only late submissions" },
      ]},
      { name: "includeComments", type: "checkbox", label: "Include Submission Comments", advanced: true, defaultChecked: true },
      { name: "additionalInstructions", type: "textarea", label: "Additional Instructions", rows: 2, placeholder: "Any additional requirements?", defaultValue: "Show submission timestamps." },
    ],
    promptTemplate: 'Get all submissions for "{assignmentName}" in {courseName}{termInfo}{filterBy}{includeComments}{additionalInstructions}',
    templateRules: {
      termInfo: { field: "term", condition: "notEmpty", template: " in the {termFormatted} term" },
      filterBy: { condition: "notEmpty", template: ", showing only {filterBy} submissions" },
      includeComments: { condition: "true", template: ". Include submission comments" },
      additionalInstructions: { condition: "notEmpty", template: ". {additionalInstructions}" },
    },
  },

  // ── COURSE ANALYSIS ─────────────────────────────────────────────────────────
  {
    id: "analyze-design-features",
    label: "Analyze Design Features",
    description: "Identify standout design features in a course",
    categoryId: "course-analysis",
    icon: LayoutDashboard,
    fields: [
      { name: "term", type: "term-select", label: "Term", helpText: "Select term to filter courses", defaultValue: "SPRING-2026" },
      { name: "courseName", type: "course-select", label: "Course Name", required: true, placeholder: "Select a course", defaultValue: "Financial Literacy 101" },
      { name: "courseId", type: "text", label: "Course ID (Optional)", advanced: true, placeholder: "e.g., 1712556", defaultValue: "1712556" },
      { name: "additionalInstructions", type: "textarea", label: "Additional Instructions", rows: 2, placeholder: "Any specific aspects to focus on?", defaultValue: "Focus on accessibility and visual design elements." },
    ],
    promptTemplate: "Analyze the design features of {courseName}{termInfo}{courseId} and highlight what stands out{additionalInstructions}",
    templateRules: {
      termInfo: { field: "term", condition: "notEmpty", template: " in the {termFormatted} term" },
      courseId: { condition: "notEmpty", template: " (course ID: {courseId})" },
      additionalInstructions: { condition: "notEmpty", template: ". {additionalInstructions}" },
    },
  },
  {
    id: "evaluate-backward-design",
    label: "Backward Design Evaluation",
    description: "Evaluate course from backward design perspective",
    categoryId: "course-analysis",
    icon: RefreshCw,
    fields: [
      { name: "term", type: "term-select", label: "Term", helpText: "Select term to filter courses", defaultValue: "SPRING-2026" },
      { name: "courseName", type: "course-select", label: "Course Name", required: true, placeholder: "Select a course", defaultValue: "Introduction to Philosophy" },
      { name: "additionalInstructions", type: "textarea", label: "Additional Instructions", rows: 2, placeholder: "Any specific aspects to evaluate?", defaultValue: "Focus on alignment between learning outcomes and assessments." },
    ],
    promptTemplate: "Evaluate the {courseName} course{termInfo} from a backward design point of view{additionalInstructions}",
    templateRules: {
      termInfo: { field: "term", condition: "notEmpty", template: " in the {termFormatted} term" },
      additionalInstructions: { condition: "notEmpty", template: ". {additionalInstructions}" },
    },
  },
  {
    id: "get-design-tips",
    label: "Instructional Design Tips",
    description: "Get improvement suggestions for a course",
    categoryId: "course-analysis",
    icon: Lightbulb,
    fields: [
      { name: "term", type: "term-select", label: "Term", helpText: "Select term to filter courses", defaultValue: "FALL-2025" },
      { name: "courseName", type: "course-select", label: "Course Name", required: true, placeholder: "Select a course", defaultValue: "Biology 101" },
      { name: "courseUrl", type: "text", label: "Course URL (Optional)", advanced: true, placeholder: "e.g., https://canvas.edu/courses/12345" },
      { name: "additionalInstructions", type: "textarea", label: "Additional Instructions", rows: 2, placeholder: "Any specific areas of concern?", defaultValue: "Focus on improving student engagement and interaction." },
    ],
    promptTemplate: "Provide instructional design tips for {courseName}{termInfo}{courseUrl}{additionalInstructions}",
    templateRules: {
      termInfo: { field: "term", condition: "notEmpty", template: " in the {termFormatted} term" },
      courseUrl: { condition: "notEmpty", template: ": {courseUrl}" },
      additionalInstructions: { condition: "notEmpty", template: ". {additionalInstructions}" },
    },
  },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

export function getActionsByCategory(categoryId: string): ActionConfig[] {
  return ACTIONS.filter((a) => a.categoryId === categoryId)
}

function formatDateTime(value: string): string {
  if (!value) return value
  const date = new Date(value)
  if (isNaN(date.getTime())) return value
  return date.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}

function formatTerm(value: string): string {
  const parts = value.split("-")
  if (parts.length === 2) {
    const season = parts[0].charAt(0).toUpperCase() + parts[0].slice(1).toLowerCase()
    return `${season} ${parts[1]}`
  }
  return value
}

function valToString(val: unknown): string {
  if (val === null || val === undefined || val === false) return ""
  if (val === true) return "true"
  return String(val)
}

function interpolate(str: string, values: Record<string, string>): string {
  return str.replace(/\{(\w+)\}/g, (_, key) => values[key] ?? "")
}

function checkCondition(
  condition: string,
  ruleField: string | undefined,
  key: string,
  values: Record<string, string>,
): boolean {
  if (condition === "notEmpty") {
    const v = values[ruleField ?? key] ?? ""
    return v !== "" && v !== "false"
  }
  if (condition === "true") {
    const v = values[ruleField ?? key] ?? ""
    return v === "true"
  }
  if (condition === "false") {
    const v = values[ruleField ?? key] ?? ""
    return v === "" || v === "false"
  }
  // condition is a field name to check for truthiness
  const v = values[condition] ?? ""
  return v !== "" && v !== "false"
}

export function generatePrompt(
  action: ActionConfig,
  formData: Record<string, unknown>,
): string {
  // Build string values map
  const values: Record<string, string> = {}
  for (const [k, v] of Object.entries(formData)) {
    values[k] = valToString(v)
  }
  values.termFormatted = formatTerm(values.term ?? "")

  // Format datetime fields to be human-readable
  for (const field of action.fields) {
    if (field.type === "datetime-local" && values[field.name]) {
      values[field.name] = formatDateTime(values[field.name])
    }
  }

  // Evaluate template rules → build replacement map
  const ruleReplacements: Record<string, string> = {}
  for (const [key, rule] of Object.entries(action.templateRules)) {
    const conditionMet = checkCondition(rule.condition, rule.field, key, values)
    ruleReplacements[key] = conditionMet ? interpolate(rule.template, values) : ""
  }

  // Merge: rule replacements take precedence for their keys
  const allValues = { ...values, ...ruleReplacements }

  // Replace all {placeholders} in promptTemplate
  const result = interpolate(action.promptTemplate, allValues)

  // Clean up whitespace artifacts
  return result
    .replace(/\s{2,}/g, " ")
    .replace(/\s+\./g, ".")
    .replace(/\s+,/g, ",")
    .trim()
}

export function getDefaultFormData(action: ActionConfig): Record<string, unknown> {
  const data: Record<string, unknown> = {}
  for (const field of action.fields) {
    if (field.type === "checkbox") {
      data[field.name] = field.defaultChecked ?? false
    } else {
      data[field.name] = field.defaultValue ?? ""
    }
  }
  return data
}
