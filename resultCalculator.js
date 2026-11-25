
function calculateResult(subjects) {
    const totalMarks = subjects.reduce(
        (sum, subject) => sum + subject.marks, 0
    );

    const maxMarks = subjects.reduce(
        (sum, subject) => sum + subject.maxMarks, 0
    );

    const percentage = maxMarks > 0
        ? Number((totalMarks / maxMarks * 100).toFixed(2))
        : 0;

    const passed = subjects.every(
        subject => subject.marks >= subject.passingMarks
    );

    let grade;

    if (!passed) {
        grade = "F";
    } else if (percentage >= 90) {
        grade = "A+";
    } else if (percentage >= 80) {
        grade = "A";
    } else if (percentage >= 70) {
        grade = "B";
    } else if (percentage >= 60) {
        grade = "C";
    } else if (percentage >= 50) {
        grade = "D";
    } else {
        grade = "E";
    }

    return {
        totalMarks,
        maxMarks,
        percentage,
        grade,
        status: passed ? "PASS" : "FAIL"
    };
}

module.exports = calculateResult;
