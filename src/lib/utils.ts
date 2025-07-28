import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// card data in the card one
export const cardData = {
  title: "Course Content",
  modules: [
    {
      name: "Module 1: Foundations of Assessment and Test Development",
      documents: [
        {
          id: 1,
          name: "Clarifying the Purposes of Educational Assessment",
          mapping: "Clarifying the Purposes of Educational Assessment",
          path: "C:\\Users\\user\\Desktop\\Tasks\\Durbeen\\ResearchArticles\\research_mds\\larifying the purposes of educational assessment.md",
          source: "Clarifying the purposes of educational assessment",
          chapter: null,
          viewpath:
            "/docs/clarifying-the-purposes-of-educational-assessment.md",
        },
        {
          id: 2,
          name: "A Review of the Literature on Marking Reliability",
          mapping: "A Review of the Literature on Marking Reliability",
          path: "C:\\Users\\user\\Desktop\\Tasks\\Durbeen\\ResearchArticles\\research_mds\\A review of the literature on marking reliability.md",
          source: "**A REVIEW OF THE LITERATURE ON MARKING RELIABILITY**",
          chapter: null,
          viewpath:
            "/docs/a-review-of-the-literature-on-marking-reliability.md",
        },
        {
          id: 3,
          name: "A Teacher's Guide to Alternative Assessment",
          mapping: "A Teachers Guide to Alternative Assessment",
          path: "C:\\Users\\user\\Desktop\\Tasks\\Durbeen\\ResearchArticles\\research_mds\\A Teacher s Guide to Alternative Assessment  Taking the First Steps.md",
          source: "A Teacher's Guide to Alternative Assessment:",
          chapter: null,
          viewpath: "/docs/a-teacher-s-guide-to-alternative-assessment.md",
        },
        {
          id: 4,
          name: "Chapter 1: Classroom Assessment – Every Student a Learner",
          mapping: "Chapter 1 Classroom Assessment Every Student a Learner",
          path: "C:\\Users\\user\\Desktop\\Tasks\\Durbeen\\ReferenceBooks\\classroom_assessment\\chapter_mds\\chapter1_classroom_assessment_every_student_a_learner.md",
          source:
            "Classroom Assessment for Student Learning Jan Chappuis et al. Second Edition",
          chapter: "Chapter 1: Classroom Assessment: Every Student a Learner",
          viewpath:
            "/docs/chapter1_classroom_assessment_every_student_a_learner.md",
        },
        {
          id: 5,
          name: "Language Effects in International Testing: The Case of PISA 2006 Science Items",
          mapping:
            "Language Effects in International Testing The Case of PISA 2006 Science Items",
          path: "C:\\Users\\user\\Desktop\\Tasks\\Durbeen\\ResearchArticles\\research_mds\\Language effects in international testing  the case of PISA 2006 science items.md",
          source:
            "Language effects in international testing: the case of PISA 2006 science items",
          chapter: null,
          viewpath:
            "/docs/language-effects-in-international-testing-the-case-of-pisa-2006-science-items.md",
        },
      ],
    },
    {
      name: "Module 2: Designing Assessments — Tools, Types, and Techniques",
      documents: [
        {
          id: 1,
          name: "Chapter 2: Clear Purpose in Assessment for Learning",
          mapping: "chapter 2 clear purpose assessment for and of learning",
          path: "C:\\Users\\user\\Desktop\\Tasks\\Durbeen\\ReferenceBooks\\classroom_assessment\\chapter_mds\\chapter2_clear_purpose_assessment_for_and_of_learning.md",
          source:
            "Classroom Assessment for Student Learning Jan Chappuis et al. Second Edition",
          chapter:
            "Chapter 2: Clear Purpose: Assessment *for* and *of* Learning",
          viewpath:
            "/docs/chapter2_clear_purpose_assessment_for_and_of_learning.md",
        },
        {
          id: 2,
          name: "Chapter 3: Clear Targets",
          mapping: "Chapter 3 Clear Targets",
          path: "C:\\Users\\user\\Desktop\\Tasks\\Durbeen\\ReferenceBooks\\classroom_assessment\\chapter_mds\\chapter3_clear_targets.md",
          source:
            "Classroom Assessment for Student Learning Jan Chappuis et al. Second Edition",
          chapter: "**Chapter 3 Learning Targets**",
          viewpath: "/docs/chapter3_clear_targets.md",
        },
        {
          id: 3,
          name: "Chapter 4: Sound Design",
          mapping: "Chapter 4 Sound Design",
          path: "C:\\Users\\user\\Desktop\\Tasks\\Durbeen\\ReferenceBooks\\classroom_assessment\\chapter_mds\\chapter4_sound_design.md",
          source:
            "Classroom Assessment for Student Learning Jan Chappuis et al. Second Edition",
          chapter: "Chapter 4: Sound Design",
          viewpath: "/docs/chapter4_sound_design.md",
        },
        {
          id: 4,
          name: "Chapter 5: Selected Response Assessment",
          mapping: "Chapter 5 Selected Response Assessment",
          path: "C:\\Users\\user\\Desktop\\Tasks\\Durbeen\\ReferenceBooks\\classroom_assessment\\chapter_mds\\chapter5_selected_response_assessment.md",
          source:
            "Classroom Assessment for Student Learning Jan Chappuis et al. Second Edition",
          chapter: "Chapter 5:  Selected Response Assessment",
          viewpath: "/docs/chapter5_selected_response_assessment.md",
        },
        {
          id: 5,
          name: "Chapter 6: Written Response Assessment",
          mapping: "Chapter 6 Written Response Assessment",
          path: "C:\\Users\\user\\Desktop\\Tasks\\Durbeen\\ReferenceBooks\\classroom_assessment\\chapter_mds\\chapter6_written_response_assessment.md",
          source:
            "Classroom Assessment for Student Learning Jan Chappuis et al. Second Edition",
          chapter: "Chapter 6:  Written Response Assessment",
          viewpath: "/docs/chapter6_written_response_assessment.md",
        },
        {
          id: 6,
          name: "Chapter 7: Performance Assessment",
          mapping: "Chapter 7 Performance Assessment",
          path: "C:\\Users\\user\\Desktop\\Tasks\\Durbeen\\ReferenceBooks\\classroom_assessment\\chapter_mds\\chapter7_performance_assessment.md",
          source:
            "Classroom Assessment for Student Learning Jan Chappuis et al. Second Edition",
          chapter: "Chapter 7: Performance Assessment",
          viewpath: "/docs/chapter7_performance_assessment.md",
        },
        {
          id: 7,
          name: "Chapter 8: Personal Communication as Classroom Assessment",
          mapping: "Chapter 8 Personal Communication as Classroom Assessment",
          path: "C:\\Users\\user\\Desktop\\Tasks\\Durbeen\\ReferenceBooks\\classroom_assessment\\chapter_mds\\chapter8_personal_communication_as_classroom_assessment.md",
          source:
            "Classroom Assessment for Student Learning Jan Chappuis et al. Second Edition",
          chapter: "Chapter 8: Personal Communication as Classroom Assessment",
          viewpath:
            "/docs/chapter8_personal_communication_as_classroom_assessment.md",
        },
      ],
    },
    {
      name: "Module 3: Interpreting, Recording, and Using Assessment Data",
      documents: [
        {
          id: 1,
          name: "Chapter 9: Record Keeping & Tracking Student Learning",
          mapping: "Chapter 9 Record Keeping & Tracking Student Learning",
          path: "C:\\Users\\user\\Desktop\\Tasks\\Durbeen\\ReferenceBooks\\classroom_assessment\\chapter_mdschapter9_record_keeping_tracking_student_learning.md",
          source:
            "Classroom Assessment for Student Learning Jan Chappuis et al. Second Edition",
          chapter: "Chapter 9: Record Keeping: Tracking Student Learning",
          viewpath:
            "/docs/chapter9_record_keeping_tracking_student_learning.md",
        },
        {
          id: 2,
          name: "Chapter 10: Converting Summative Assessment Information into Grades",
          mapping:
            "Chapter 10 Converting Summative Assessment Information into Grades",
          path: "C:\\Users\\user\\Desktop\\Tasks\\Durbeen\\ReferenceBooks\\classroom_assessment\\chapter_mds\\chapter10_coverting_summativr_assessment_information_into_grades.md",
          source:
            "Classroom Assessment for Student Learning Jan Chappuis et al. Second Edition",
          chapter:
            "Chapter 10: Converting Summative Assessment Information into Grades",
          viewpath:
            "/docs/chapter10_coverting_summativr_assessment_information_into_grades.md",
        },
        {
          id: 3,
          name: "Chapter 11: Learning Targets",
          mapping: "Chapter 11 Learning Targets",
          path: "C:\\Users\\user\\Desktop\\Tasks\\Durbeen\\ReferenceBooks\\classroom_assessment\\chapter_mdschapter11_learning_targets.md",
          source:
            "Classroom Assessment for Student Learning Jan Chappuis et al. Second Edition",
          chapter: "Chapter 11: Portfolios",
          viewpath: "/docs/chapter11_learning_targets.md",
        },
        {
          id: 4,
          name: "Chapter 12: Conferences about and with Students",
          mapping: "Chapter 12 Conferences about and with Students",
          path: "C:\\Users\\user\\Desktop\\Tasks\\Durbeen\\ReferenceBooks\\classroom_assessment\\chapter_mds\\chapter12_conferences_about_and_with_students.md",
          source:
            "Classroom Assessment for Student Learning Jan Chappuis et al. Second Edition",
          chapter: "Chapter 12:  Conferences About and with Students",
          viewpath: "/docs/chapter12_conferences_about_and_with_students.md",
        },
        {
          id: 5,
          name: "Criteria, Comparison and Past Experiences: How Do Teachers Make Judgements when Marking Coursework?",
          mapping:
            "Criteria, Comparison and Past Experiences How Do Teachers Make Judgements when Marking Coursework",
          path: "C:\\Users\\user\\Desktop\\Tasks\\Durbeen\\ResearchArticles\\research_mds\\Criteria, comparison and past experiences  how do teachers make judgements when marking coursework.md",
          source:
            "Criteria, comparison and past experiences: how do teachers make judgements when marking coursework?",
          chapter: null,
          viewpath:
            "/docs/criteria-comparison-and-past-experiences-how-do-teachers-make-judgements-when-marking-coursework.md",
        },
        {
          id: 6,
          name: "Portfolio Purposes: Teachers Exploring the Relationship between Evaluation and Learning",
          mapping:
            "Portfolio Purposes Teachers Exploring the Relationship between Evaluation and Learning",
          path: "C:\\Users\\user\\Desktop\\Tasks\\Durbeen\\ResearchArticles\\research_mds\\Portfolio Purposes.md",
          source:
            "Portfolio Purposes: Teachers Exploring the Relationshi Between Evaluation an Learning",
          chapter: null,
          viewpath:
            "/docs/portfolio-purposes-teachers-exploring-the-relationshi-between-evaluation-an-learning.md",
        },
        {
          id: 7,
          name: "Southeast Missouri State University Rubric Examples",
          mapping: "Southeast Missouri State University Rubric Examples",
          path: "C:\\Users\\user\\Desktop\\Tasks\\Durbeen\\ReferenceBooks\\southeast_missouri\\Southeast Missouri State University (2005) Rubric examples.md",
          source: "Southeast Massouri State University Rubric Examples",
          chapter: null,
          viewpath:
            "/docs/southeast-missouri-state-university-rubric-examples.md",
        },
        {
          id: 8,
          name: "Ongoing Issues in Test Fairness",
          mapping: "Ongoing Issues in Test Fairness",
          path: "C:\\Users\\user\\Desktop\\TasksDurbeen\\ResearchArticles\\research_mds\\Ongoing issues in test fairness.md",
          source: "Ongoing issues in test fairness",
          chapter: null,
          viewpath: "/docs/ongoing-issues-in-test-fairness.md",
        },
      ],
    },
    {
      name: "Module 4: Critical Perspectives and Challenges in Assessment",
      documents: [
        {
          id: 1,
          name: "A Review of Multiple-Choice Item Writing Guidelines for Classroom Assessment",
          mapping:
            "A Review of Multiple Choice Item Writing Guidelines for Classroom Assessment",
          path: "C:\\Users\\user\\Desktop\\Tasks\\Durbeen\\ResearchArticles\\research_mds\\A Review of Multiple-Choice Item-Writing Guidelines for Classroom Assessment.md",
          source:
            "A Review of Multiple-Choice Item-Writing Guidelines for Classroom Assessment",
          chapter: null,
          viewpath:
            "/docs/a-review-of-multiple-choice-item-writing-guidelines-for-classroom-assessment.md",
        },
        {
          id: 2,
          name: "Does Washback Exist?",
          mapping: "Does Washback Exist",
          path: "C:\\Users\\user\\Desktop\\Tasks\\Durbeen\\ResearchArticles\\research_mds\\Does Washback Exists.md",
          source: "Does Washback Exist?",
          chapter: null,
          viewpath: "/docs/does-washback-exist.md",
        },
        {
          id: 3,
          name: "Can a Picture Ruin a Thousand Words: The Effects of Visual Resources in Exam Questions",
          mapping:
            "Can a Picture Ruin a Thousand Words The Effects of Visual Resources in Exam Questions",
          path: "C:\\Users\\user\\Desktop\\Tasks\\Durbeen\\ResearchArticles\\research_mds\\Can a picture ruin a thousand words  The effects of visual resources in exam questions.md",
          source:
            "Can a picture ruin a thousand words?The effects of visual resources in exam questions",
          chapter: null,
          viewpath:
            "/docs/can-a-picture-ruin-a-thousand-words-the-effects-of-visual-resources-in-exam-questions.md",
        },
        {
          id: 4,
          name: "Deficiency, Contamination, and the Signal Processing Metaphor",
          mapping:
            "Deficiency Contamination and the Signal Processing Metaphor",
          path: "C:\\Users\\userDesktop\\Tasks\\Durbeen\\ResearchArticles\\research_mds\\Deficiency, Contamination, and the Signal Processing Metaphor.md",
          source:
            "Deficiency, Contamination, and the Signal Processing Metaphor",
          chapter: null,
          viewpath:
            "/docs/deficiency-contamination-and-the-signal-processing-metaphor.md",
        },
        {
          id: 5,
          name: "Macro and Micro Validation: Beyond the Five Sources Framework for Classifying Validation Evidence and Analysis",
          mapping:
            "Macro and Micro Validation Beyond the Five Sources Framework for Classifying Validation Evidence and Analysis",
          path: "C:\\Users\\user\\Desktop\\Tasks\\Durbeen\\ResearchArticles\\research_mds\\Macro- and Micro-Validation- Beyond the ΓÇÿFive SourcesΓÇÖ Framework for Classifying Validation Evidence and Analysis.md",
          source:
            "Macro- and Micro-Validation: Beyond the ‘Five Sources’ Framework for Classifying Validation Evidence and Analysis",
          chapter: null,
          viewpath:
            "/docs/macro-and-micro-validation-beyond-the-five-sources-framework-for-classifying-validation-evidence-and-analysis.md",
        },
        {
          id: 6,
          name: "Threats to the Valid Use of Assessments",
          mapping: "Threats to the Valid Use of Assessments",
          path: "C:\\Users\\user\\Desktop\\Tasks\\Durbeen\\ResearchArticles\\research_mds\\Threats to the Valid Use of Assessments.md",
          source: "Threats to the Valid Use of Assessments",
          chapter: null,
          viewpath: "/docs/threats-to-the-valid-use-of-assessments.md",
        },
      ],
    },
  ],
  audioOverview: true,
  notesAndHighlights: true,
};
