-- CreateTable
CREATE TABLE "Question" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "examId" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    CONSTRAINT "Question_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "QuestionOption" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "questionId" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "QuestionOption_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "StudentAnswer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "examResultId" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,
    "text" TEXT,
    "optionId" INTEGER,
    CONSTRAINT "StudentAnswer_examResultId_fkey" FOREIGN KEY ("examResultId") REFERENCES "ExamResult" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "StudentAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "StudentAnswer_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "QuestionOption" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ExamResult" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "examId" INTEGER NOT NULL,
    "studentId" INTEGER NOT NULL,
    "grade" REAL,
    "status" TEXT NOT NULL DEFAULT 'submitted',
    "feedback" TEXT,
    CONSTRAINT "ExamResult_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ExamResult_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ExamResult" ("examId", "feedback", "grade", "id", "studentId") SELECT "examId", "feedback", "grade", "id", "studentId" FROM "ExamResult";
DROP TABLE "ExamResult";
ALTER TABLE "new_ExamResult" RENAME TO "ExamResult";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
