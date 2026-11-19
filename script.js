
const students = {
    "101": {
        password: "student123",
        name: "Rahul Sharma",
        roll: "101",
        course: "B.Tech",
        department: "Computer Science",

        results: {
            "1": [
                {code:"CS101",subject:"Programming in C",max:100,marks:85},
                {code:"MA101",subject:"Mathematics",max:100,marks:78},
                {code:"PH101",subject:"Physics",max:100,marks:82},
                {code:"EC101",subject:"Electronics",max:100,marks:74},
                {code:"EN101",subject:"English",max:100,marks:90}
            ],

            "2": [
                {code:"CS201",subject:"Data Structures",max:100,marks:88},
                {code:"MA201",subject:"Mathematics II",max:100,marks:80},
                {code:"CS202",subject:"DBMS",max:100,marks:92},
                {code:"CS203",subject:"Digital Electronics",max:100,marks:76},
                {code:"CS204",subject:"Computer Organization",max:100,marks:84}
            ]
        }
    }
};

let currentStudent = null;

// LOGIN FUNCTION

function login() {
    const roll = document.getElementById("roll").value.trim();
    const password = document.getElementById("password").value;

    const student = students[roll];

    if(student && student.password === password) {
        currentStudent = student;

        document.getElementById("loginPage").style.display = "none";
        document.getElementById("dashboard").style.display = "block";

        loadStudent();
        showResult();
    }
    else {
        document.getElementById("error").textContent =
            "Invalid Roll Number or Password!";
    }
}

// LOAD STUDENT DETAILS

function loadStudent() {
    document.getElementById("welcome").textContent =
        "Hello, " + currentStudent.name;

    document.getElementById("name").textContent =
        currentStudent.name;

    document.getElementById("studentRoll").textContent =
        currentStudent.roll;

    document.getElementById("course").textContent =
        currentStudent.course;

    document.getElementById("department").textContent =
        currentStudent.department;

    document.getElementById("markName").textContent =
        currentStudent.name;

    document.getElementById("markRoll").textContent =
        currentStudent.roll;

    document.getElementById("markCourse").textContent =
        currentStudent.course;
}

// GRADE FUNCTION

function getGrade(percentage) {
    if(percentage >= 90) return "A+";
    if(percentage >= 80) return "A";
    if(percentage >= 70) return "B";
    if(percentage >= 60) return "C";
    if(percentage >= 50) return "D";
    return "F";
}

// DISPLAY RESULT

function showResult() {
    if(!currentStudent) return;

    const semester =
        document.getElementById("semester").value;

    const subjects =
        currentStudent.results[semester];

    let total = 0;
    let maximum = 0;
    let failed = false;

    const table =
        document.getElementById("resultTable");

    table.innerHTML = "";

    subjects.forEach(item => {
        const percentage = item.marks / item.max * 100;
        const grade = getGrade(percentage);
        const status = item.marks >= 35 ? "PASS" : "FAIL";

        if(status === "FAIL") failed = true;

        total += item.marks;
        maximum += item.max;

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${item.code}</td>
            <td>${item.subject}</td>
            <td>${item.max}</td>
            <td>${item.marks}</td>
            <td>${grade}</td>
            <td class="${status === "PASS" ? "pass" : "fail"}">
                ${status}
            </td>
        `;

        table.appendChild(row);
    });

    const percentage = total / maximum * 100;
    const grade = getGrade(percentage);
    const status = failed ? "FAIL" : "PASS";

    document.getElementById("subjects").textContent =
        subjects.length;

    document.getElementById("total").textContent =
        total + "/" + maximum;

    document.getElementById("percentage").textContent =
        percentage.toFixed(2) + "%";

    document.getElementById("grade").textContent = grade;

    document.getElementById("resultPercentage").textContent =
        percentage.toFixed(2) + "%";

    document.getElementById("status").textContent = status;

    document.getElementById("markSemester").textContent =
        "Semester " + semester;

    document.getElementById("markTotal").textContent =
        total + "/" + maximum;

    document.getElementById("markPercent").textContent =
        percentage.toFixed(2) + "%";

    document.getElementById("markGrade").textContent = grade;

    document.getElementById("markStatus").textContent = status;
}

// LOGOUT FUNCTION

function logout() {
    currentStudent = null;

    document.getElementById("dashboard").style.display = "none";
    document.getElementById("loginPage").style.display = "flex";

    document.getElementById("roll").value = "";
    document.getElementById("password").value = "";
    document.getElementById("error").textContent = "";
}
