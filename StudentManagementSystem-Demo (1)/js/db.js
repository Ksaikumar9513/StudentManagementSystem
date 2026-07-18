/**
 * db.js
 * ------------------------------------------------------------
 * A mock database layer that mimics the Java DAO classes from
 * the real backend (StudentDAO, CourseDAO, MarksDAO, AttendanceDAO),
 * but stores data in the browser's localStorage instead of Oracle.
 *
 * This exists ONLY so the UI can be demoed live on static hosts
 * like Netlify/GitHub Pages, which cannot run Java/Servlets/JDBC.
 * The real project (see /backend-java) uses actual JDBC + Oracle SQL.
 * ------------------------------------------------------------
 */

const DB = (function () {
    const KEYS = {
        students: 'sms_students',
        courses: 'sms_courses',
        marks: 'sms_marks',
        attendance: 'sms_attendance',
        admins: 'sms_admins',
        session: 'sms_session'
    };

    function seed() {
        if (!localStorage.getItem(KEYS.courses)) {
            const courses = [
                { courseId: 1, courseName: 'Computer Science Engineering', courseCode: 'CSE', durationYears: 4, fees: 120000 },
                { courseId: 2, courseName: 'Information Technology', courseCode: 'IT', durationYears: 4, fees: 110000 },
                { courseId: 3, courseName: 'Electronics & Communication Engineering', courseCode: 'ECE', durationYears: 4, fees: 105000 },
                { courseId: 4, courseName: 'Electrical & Electronics Engineering', courseCode: 'EEE', durationYears: 4, fees: 100000 },
                { courseId: 5, courseName: 'Mechanical Engineering', courseCode: 'ME', durationYears: 4, fees: 95000 },
                { courseId: 6, courseName: 'Civil Engineering', courseCode: 'CE', durationYears: 4, fees: 90000 },
                { courseId: 7, courseName: 'Chemical Engineering', courseCode: 'CHE', durationYears: 4, fees: 95000 },
                { courseId: 8, courseName: 'Aeronautical Engineering', courseCode: 'AE', durationYears: 4, fees: 130000 },
                { courseId: 9, courseName: 'Biotechnology Engineering', courseCode: 'BT', durationYears: 4, fees: 100000 },
                { courseId: 10, courseName: 'Artificial Intelligence & Machine Learning', courseCode: 'AIML', durationYears: 4, fees: 135000 },
                { courseId: 11, courseName: 'Data Science & Engineering', courseCode: 'DS', durationYears: 4, fees: 130000 },
                { courseId: 12, courseName: 'Automobile Engineering', courseCode: 'AUTO', durationYears: 4, fees: 95000 }
            ];
            localStorage.setItem(KEYS.courses, JSON.stringify(courses));
        }

        if (!localStorage.getItem(KEYS.students)) {
            // Password hash below is SHA-256('demo123')
            const students = [
                {
                    studentId: 1, fullName: 'Aditi Sharma', email: 'aditi@example.com',
                    password: 'd3ad9315b7be5dd53b31a273b3b3aba5defe700808305aa16a3062b76658a791',
                    phone: '9876543210', gender: 'Female', address: 'Bengaluru', courseId: 1, status: 'ACTIVE'
                },
                {
                    studentId: 2, fullName: 'Rahul Verma', email: 'rahul@example.com',
                    password: 'd3ad9315b7be5dd53b31a273b3b3aba5defe700808305aa16a3062b76658a791',
                    phone: '9876500000', gender: 'Male', address: 'Mumbai', courseId: 2, status: 'ACTIVE'
                }
            ];
            localStorage.setItem(KEYS.students, JSON.stringify(students));
        }

        if (!localStorage.getItem(KEYS.marks)) {
            const marks = [
                { marksId: 1, studentId: 1, subject: 'Data Structures', semester: 3, marksObtained: 88, maxMarks: 100, grade: 'A' },
                { marksId: 2, studentId: 1, subject: 'Operating Systems', semester: 3, marksObtained: 76, maxMarks: 100, grade: 'B' },
                { marksId: 3, studentId: 2, subject: 'Digital Electronics', semester: 3, marksObtained: 92, maxMarks: 100, grade: 'A+' }
            ];
            localStorage.setItem(KEYS.marks, JSON.stringify(marks));
        }

        if (!localStorage.getItem(KEYS.admins)) {
            // Password hash below is SHA-256('admin123')
            const admins = [
                { adminId: 1, username: 'admin', password: '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', fullName: 'System Administrator' }
            ];
            localStorage.setItem(KEYS.admins, JSON.stringify(admins));
        }

        if (!localStorage.getItem(KEYS.attendance)) {
            localStorage.setItem(KEYS.attendance, JSON.stringify([]));
        }
    }

    function get(key) { return JSON.parse(localStorage.getItem(key) || '[]'); }
    function set(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
    function nextId(list, field) {
        return list.length === 0 ? 1 : Math.max(...list.map(x => x[field])) + 1;
    }

    // SHA-256 hashing via the browser's built-in Web Crypto API — no external
    // library needed. Note: same caveat as the Java version (see PasswordUtil.java) —
    // a salted, slow hash (bcrypt) is the correct production choice.
    async function hashPassword(plainText) {
        const enc = new TextEncoder().encode(plainText);
        const hashBuffer = await crypto.subtle.digest('SHA-256', enc);
        return Array.from(new Uint8Array(hashBuffer))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }

    // ---------- AUTH ----------
    async function adminLogin(username, password) {
        const admins = get(KEYS.admins);
        const hashed = await hashPassword(password);
        return admins.some(a => a.username === username && a.password === hashed);
    }

    async function addAdmin(admin) {
        const admins = get(KEYS.admins);
        if (admins.some(a => a.username === admin.username)) {
            return { success: false, message: 'That username is already taken.' };
        }
        admin.adminId = nextId(admins, 'adminId');
        admin.password = await hashPassword(admin.password);
        admins.push(admin);
        set(KEYS.admins, admins);
        return { success: true };
    }

    function getAdminByUsername(username) {
        return get(KEYS.admins).find(a => a.username === username) || null;
    }

    async function updateAdminCredentials(currentUsername, currentPassword, newUsername, newPassword) {
        const admins = get(KEYS.admins);
        const idx = admins.findIndex(a => a.username === currentUsername);

        if (idx === -1) return { success: false, message: 'Account not found.' };

        const currentHashed = await hashPassword(currentPassword);
        if (admins[idx].password !== currentHashed) {
            return { success: false, message: 'Current password is incorrect.' };
        }
        if (newUsername !== currentUsername && admins.some(a => a.username === newUsername)) {
            return { success: false, message: 'That username is already taken.' };
        }

        admins[idx].username = newUsername;
        if (newPassword) admins[idx].password = await hashPassword(newPassword);
        set(KEYS.admins, admins);

        return { success: true, username: newUsername };
    }

    async function studentLogin(email, password) {
        const students = get(KEYS.students);
        const hashed = await hashPassword(password);
        return students.find(s => s.email === email && s.password === hashed) || null;
    }

    async function registerStudent(student) {
        const students = get(KEYS.students);
        if (students.some(s => s.email === student.email)) {
            return { success: false, message: 'Email already registered.' };
        }
        student.studentId = nextId(students, 'studentId');
        student.password = await hashPassword(student.password);
        student.status = 'ACTIVE';
        students.push(student);
        set(KEYS.students, students);
        return { success: true, student };
    }

    function setSession(data) { sessionStorage.setItem(KEYS.session, JSON.stringify(data)); }
    function getSession() { return JSON.parse(sessionStorage.getItem(KEYS.session) || 'null'); }
    function clearSession() { sessionStorage.removeItem(KEYS.session); }

    // ---------- STUDENTS ----------
    function getAllStudents() {
        const students = get(KEYS.students);
        const courses = get(KEYS.courses);
        return students.map(s => ({
            ...s,
            courseName: (courses.find(c => c.courseId == s.courseId) || {}).courseName || '-'
        }));
    }

    function getStudentById(id) {
        return getAllStudents().find(s => s.studentId == id) || null;
    }

    function searchStudents(keyword) {
        const kw = keyword.toLowerCase();
        return getAllStudents().filter(s => s.fullName.toLowerCase().includes(kw));
    }

    function updateStudent(updated) {
        const students = get(KEYS.students);
        const idx = students.findIndex(s => s.studentId == updated.studentId);
        if (idx === -1) return false;
        students[idx] = { ...students[idx], ...updated };
        set(KEYS.students, students);
        return true;
    }

    function deleteStudent(id) {
        let students = get(KEYS.students);
        students = students.filter(s => s.studentId != id);
        set(KEYS.students, students);
        return true;
    }

    // ---------- COURSES ----------
    function getAllCourses() { return get(KEYS.courses); }

    function addCourse(course) {
        const courses = get(KEYS.courses);
        course.courseId = nextId(courses, 'courseId');
        courses.push(course);
        set(KEYS.courses, courses);
        return true;
    }

    // ---------- MARKS ----------
    function calculateGrade(obtained, max) {
        const pct = (obtained / max) * 100;
        if (pct >= 90) return 'A+';
        if (pct >= 80) return 'A';
        if (pct >= 70) return 'B';
        if (pct >= 60) return 'C';
        if (pct >= 40) return 'D';
        return 'F';
    }

    function addMarks(entry) {
        const marks = get(KEYS.marks);
        entry.marksId = nextId(marks, 'marksId');
        entry.grade = calculateGrade(entry.marksObtained, entry.maxMarks);
        marks.push(entry);
        set(KEYS.marks, marks);
        return true;
    }

    function getMarksByStudent(studentId) {
        return get(KEYS.marks).filter(m => m.studentId == studentId);
    }

    function getOverallPercentage(studentId) {
        const list = getMarksByStudent(studentId);
        if (list.length === 0) return 0;
        const totalObtained = list.reduce((sum, m) => sum + Number(m.marksObtained), 0);
        const totalMax = list.reduce((sum, m) => sum + Number(m.maxMarks), 0);
        return totalMax > 0 ? (totalObtained / totalMax) * 100 : 0;
    }

    // ---------- ATTENDANCE ----------
    function markAttendance(studentId, status) {
        const records = get(KEYS.attendance);
        records.push({ studentId: Number(studentId), status, date: new Date().toISOString() });
        set(KEYS.attendance, records);
        return true;
    }

    function getAttendancePercentage(studentId) {
        const records = get(KEYS.attendance).filter(a => a.studentId == studentId);
        if (records.length === 0) return 0;
        const present = records.filter(a => a.status === 'PRESENT').length;
        return (present / records.length) * 100;
    }

    // ---------- RESET (handy for demo purposes) ----------
    function resetDemoData() {
        Object.values(KEYS).forEach(k => localStorage.removeItem(k));
        seed();
    }

    seed();

    return {
        adminLogin, addAdmin, getAdminByUsername, updateAdminCredentials, studentLogin, registerStudent,
        setSession, getSession, clearSession,
        getAllStudents, getStudentById, searchStudents, updateStudent, deleteStudent,
        getAllCourses, addCourse,
        addMarks, getMarksByStudent, getOverallPercentage,
        markAttendance, getAttendancePercentage,
        resetDemoData
    };
})();
