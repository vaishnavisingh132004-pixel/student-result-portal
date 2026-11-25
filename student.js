
if (requireRole("student")) {
    loadStudentDashboard();
}

async function loadStudentDashboard() {
    try {
        const student = await API.get("/api/students/me");

        document.getElementById("profile").innerHTML = `
            <p><strong>Name:</strong> ${escapeHTML(student.name)}</p>
            <p><strong>Roll Number:</strong> ${escapeHTML(student.rollNo)}</p>
            <p><strong>Email:</strong> ${escapeHTML(student.email)}</p>
            <p><strong>Course:</strong> ${escapeHTML(student.course)}</p>
            <p><strong>Department:</strong> ${escapeHTML(student.department)}</p>
            <p><strong>Semester:</strong> ${escapeHTML(student.semester)}</p>
            <p><strong>Phone:</strong> ${escapeHTML(student.phone)}</p>
        `;

        const results = await API.get("/api/results/my");

        document.getElementById("examCount").textContent =
            results.length;

        if (results.length > 0) {
            const latest = results[0].summary;

            document.getElementById("percentage").textContent =
                latest.percentage + "%";

            document.getElementById("grade").textContent =
                latest.grade;
        }

        displayResults(results);

    } catch (error) {
        document.getElementById("resultsContainer").textContent =
            error.message;
    }
}

function displayResults(results) {
    const container =
        document.getElementById("resultsContainer");

    if (results.length === 0) {
        container.innerHTML = "<p>No examination results available.</p>";
        return;
    }

    container.innerHTML = results.map((result, index) => `
        <section class="result-card" id="result-${index}">

            <div class="result-header">
                <div>
                    <h2>${escapeHTML(result.examName)}</h2>
                    <p>Academic Year:
                       ${escapeHTML(result.academicYear)}</p>
                </div>

                <span class="status ${
                    result.summary.status === "PASS"
                        ? "pass"
                        : "fail"
                }">
                    ${escapeHTML(result.summary.status)}
                </span>
            </div>

            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Subject</th>
                            <th>Marks Obtained</th>
                            <th>Maximum Marks</th>
                            <th>Passing Marks</th>
                        </tr>
                    </thead>

                    <tbody>
                        ${result.subjects.map(subject => `
                            <tr>
                                <td>${escapeHTML(subject.subjectName)}</td>
                                <td>${subject.marks}</td>
                                <td>${subject.maxMarks}</td>
                                <td>${subject.passingMarks}</td>
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
            </div>

            <div class="result-summary">
                <p><strong>Total:</strong>
                    ${result.summary.totalMarks}/
                    ${result.summary.maxMarks}
                </p>

                <p><strong>Percentage:</strong>
                    ${result.summary.percentage}%
                </p>

                <p><strong>Grade:</strong>
                    ${escapeHTML(result.summary.grade)}
                </p>

                <button onclick="printResult(${index})">
                    Print Marksheet
                </button>
            </div>

        </section>
    `).join("");
}

// Print individual marksheet
function printResult(index) {
    const result = document.getElementById(`result-${index}`);

    if (!result) return;

    const printWindow = window.open("", "_blank");

    if (!printWindow) {
        alert("Please allow pop-ups to print the marksheet.");
        return;
    }

    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Student Marksheet</title>
            <style>
                body {
                    font-family: Arial;
                    padding: 30px;
                }

                h1, h2, p {
                    text-align: center;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 25px;
                }

                td, th {
                    border: 1px solid #333;
                    padding: 12px;
                    text-align: center;
                }

                button {
                    display: none;
                }

                .result-header {
                    text-align: center;
                }

                .status {
                    font-weight: bold;
                }
            </style>
        </head>
        <body>
            <h1>STUDENT RESULT PORTAL</h1>
            <h2>EXAMINATION MARKSHEET</h2>

            ${result.innerHTML}
        </body>
        </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    printWindow.onload = () => {
        printWindow.print();
    };
}
