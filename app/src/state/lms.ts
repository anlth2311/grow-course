/**
 * LMS hook. Every learner action produces an xAPI-shaped statement.
 * A SCORM or xAPI wrapper can pick them up by defining
 *   window.LMS = { send(statement) { ... } }
 * before the course loads. All statements are also kept in window.courseStatements.
 */
export interface CourseStatement {
  verb: 'launched' | 'experienced' | 'answered' | 'responded' | 'interacted' | 'committed' | 'completed';
  object: string;
  result?: Record<string, unknown>;
  bookmark: string;
  progress: number;
  timestamp: string;
}

declare global {
  interface Window {
    LMS?: { send(statement: CourseStatement): void };
    courseStatements?: CourseStatement[];
  }
}

export function sendStatement(st: CourseStatement) {
  (window.courseStatements ??= []).push(st);
  window.LMS?.send?.(st);
}
