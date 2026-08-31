// require("dotenv").config({
//     path:__dirname+"./../../.env"
// });
// const mongoose = require("mongoose");
// const {googleSheetSchema} = require("./../schema/formSchema");

// const GoogleSheet = new mongoose.model("ChEA_GoogleSheet", googleSheetSchema);

// // // const jsonwebtoken = require("jsonwebtoken");
// // // const jwtKey = process.env.jwtKey;


// (async() => {
//     await new GoogleSheet({sheetId:"1ojzVTjp0NKEqErfFO82uqasrURVVZqW1hQptbryfQmE"}).save();
// })();

// // // let data = {
// // //     name:"Asad Noor",
// // //     rollNumber:"25B0333",
// // //     role:"cr",
// // //     division:"s1",
// // //     batch:2025
// // // }
// // // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiQXNhZCBOb29yIiwicm9sbE51bWJlciI6IjI1QjAzMzMiLCJyb2xlIjoiY3IiLCJkaXZpc2lvbiI6InMxIiwiYmF0Y2giOjIwMjUsImlhdCI6MTc4NjQ1MDI5MX0.VcKoIc0dpDFtNxeI1mP_L4A50iThOzCbUucdJGykjVA
// // // console.log(jsonwebtoken.sign(data, jwtKey));
// // const {userSchema} = require("./../schema/userSchema.js");

// // const User = new mongoose.model("ChEA_User", userSchema);

// // let sampleData = [
// // {
// //     rollNumber: "25B0334",
// //     name: "Aarav Sharma",
// //     role: "student",
// //     department: "chemical",
// //     batch: "2025",
// //     linkedin: "",
// //     resume: "",
// //     profilePhoto: ""
// // },
// // {
// //     rollNumber: "25B0335",
// //     name: "Diya Patel",
// //     role: "student",
// //     department: "chemical",
// //     batch: "2025",
// //     linkedin: "",
// //     resume: "",
// //     profilePhoto: ""
// // },
// // {
// //     rollNumber: "25B0333",
// //     name: "Asad Noor",
// //     role: "cr",
// //     department: "chemical",
// //     batch: "2025",
// //     linkedin: "",
// //     resume: "",
// //     profilePhoto: ""
// // },
// // {
// //     rollNumber: "25B0337",
// //     name: "Ananya Singh",
// //     role: "student",
// //     department: "chemical",
// //     batch: "2025",
// //     linkedin: "",
// //     resume: "",
// //     profilePhoto: ""
// // },
// // {
// //     rollNumber: "25B0338",
// //     name: "Kabir Mehta",
// //     role: "Council",
// //     department: "chemical",
// //     batch: "2025",
// //     linkedin: "",
// //     resume: "",
// //     profilePhoto: ""
// // },

// // {
// //     rollNumber: "24B0301",
// //     name: "Mehul Joshi",
// //     role: "student",
// //     department: "chemical",
// //     batch: "2024",
// //     linkedin: "",
// //     resume: "",
// //     profilePhoto: ""
// // },
// // {
// //     rollNumber: "24B0302",
// //     name: "Sneha Iyer",
// //     role: "student",
// //     department: "chemical",
// //     batch: "2024",
// //     linkedin: "",
// //     resume: "",
// //     profilePhoto: ""
// // },
// // {
// //     rollNumber: "24B0303",
// //     name: "Yash Desai",
// //     role: "student",
// //     department: "chemical",
// //     batch: "2024",
// //     linkedin: "",
// //     resume: "",
// //     profilePhoto: ""
// // },

// // {
// //     rollNumber: "26B0321",
// //     name: "Arjun Kulkarni",
// //     role: "student",
// //     department: "chemical",
// //     batch: "2026",
// //     linkedin: "",
// //     resume: "",
// //     profilePhoto: ""
// // },
// // {
// //     rollNumber: "26B0322",
// //     name: "Nidhi Shah",
// //     role: "student",
// //     department: "chemical",
// //     batch: "2026",
// //     linkedin: "",
// //     resume: "",
// //     profilePhoto: ""
// // }
// // ];

// // async function addToDB(data) {
// //     for(let i = 0;i<data.length;i++) {
// //         let d = sampleData[i];
// //         d.createdAt = new Date().getTime();
// //         let res = await (new User(d).save());
// //         console.log(res);
// //     }
// // }
// // const runFunc = async() => {
// //     await addToDB(sampleData);
// // }

// // module.exports = {runFunc};


// const { messaging } = require("../../config/firebaseAdmin");
// async function sendNotification(token) {
//     const message = {
//         token: token,
//         notification: {
//             title: "ChEA App",
//             body: "Hello! This is a test notification.",
//             imageUrl: "https://cheaiitb.in/assets/ChEA2-wZg-WnYX.png"
//         },
//         data: {
//         targetUrl: "/profile"
//     }
//     };

// const response = await messaging.send(message);
//     console.log("Notification sent:", response);
// }

// sendNotification("cOaNJhu1RH6Jzq4vAnF_Wy:APA91bEyww5Y7cWnFEQm4yZyCxmEs1CSVU8109MLZjJ4obmQY7n4xyz6GgHCJpwK3WvDDIhicCCWWuP72jEq6E6j7jyc7gpsV6NippLvGafXbGQN_5j3gTU");

// module.exports = { sendNotification };


// const { google } = require("googleapis");
// const { auth } = require("./../../config/google");

// const spreadsheetId = "1e9knTRGi-aN9epODXzBuDzA9Z_-EgFFv2bz1q5ewulo";

// async function testSheet() {
//     try {
//         const sheets = google.sheets({
//             version: "v4",
//             auth
//         });
//         const response = await sheets.spreadsheets.values.append({
//             spreadsheetId,
//             range: "Sheet1",
//             valueInputOption: "USER_ENTERED",
//             requestBody: {
//                 values: [
//                     [
//                         "230010001",
//                         "Aditya",
//                         "CHE301",
//                         "Yes"
//                     ]
//                 ]
//             }
//         });

//         console.log("Row added successfully!");
//         console.log(
//             "Updated range:",
//             response.data.updates.updatedRange
//         );

//     } catch (err) {
//         console.error("Failed to append row:");

//         if (err.response?.data) {
//             console.error(
//                 JSON.stringify(err.response.data, null, 2)
//             );
//         } else {
//             console.error(err);
//         }
//     }
// }

// testSheet();
// const mongoose = require("mongoose");
// const {nanoid} = require("nanoid");
// const {networkSchema} = require("./../schema/networkSchema.js");

// const Network = new mongoose.model("ChEA_Network", networkSchema);


// let sampleData = [
// {
//     nId: "N001",
//     name: "Aarav Sharma",
//     status: "Student",
//     domain: "Developer",
//     skills: ["JavaScript", "Node.js", "MongoDB"],
//     linkedIn: "https://linkedin.com/in/aarav-sharma",
//     email: "aarav.sharma@example.com",
//     pfpLink: "",
//     experience: "2 years",
//     isVisible: true,
//     company: "Google",
//     role: "Software Engineer Intern",
//     year: "2025",
//     quote: "Build things that matter.",
//     createdById: "25B0334"
// },
// {
//     nId: "N002",
//     name: "Diya Patel",
//     status: "Student",
//     domain: "AI/ML",
//     skills: ["Python", "TensorFlow", "Machine Learning"],
//     linkedIn: "https://linkedin.com/in/diya-patel",
//     email: "diya.patel@example.com",
//     pfpLink: "",
//     experience: "1 year",
//     isVisible: true,
//     company: "Microsoft",
//     role: "ML Research Intern",
//     year: "2025",
//     quote: "Stay curious.",
//     createdById: "25B0335"
// },
// {
//     nId: "N003",
//     name: "Asad Noor",
//     status: "Working",
//     domain: "Backend",
//     skills: ["Java", "Spring Boot", "PostgreSQL"],
//     linkedIn: "https://linkedin.com/in/asad-noor",
//     email: "asad.noor@example.com",
//     pfpLink: "",
//     experience: "3 years",
//     isVisible: true,
//     company: "Amazon",
//     role: "Backend Engineer",
//     year: "2025",
//     quote: "Consistency beats intensity.",
//     createdById: "25B0333"
// },
// {
//     nId: "N004",
//     name: "Ananya Singh",
//     status: "Student",
//     domain: "Frontend",
//     skills: ["React", "TypeScript", "CSS"],
//     linkedIn: "https://linkedin.com/in/ananya-singh",
//     email: "ananya.singh@example.com",
//     pfpLink: "",
//     experience: "1.5 years",
//     isVisible: true,
//     company: "Adobe",
//     role: "Frontend Developer Intern",
//     year: "2025",
//     quote: "Make it simple.",
//     createdById: "25B0337"
// },
// {
//     nId: "N005",
//     name: "Kabir Mehta",
//     status: "Working",
//     domain: "DevOps",
//     skills: ["Docker", "Kubernetes", "AWS"],
//     linkedIn: "https://linkedin.com/in/kabir-mehta",
//     email: "kabir.mehta@example.com",
//     pfpLink: "",
//     experience: "4 years",
//     isVisible: false,
//     company: "Cisco",
//     role: "DevOps Engineer",
//     year: "2025",
//     quote: "Automate everything you can.",
//     createdById: "25B0338"
// },
// {
//     nId: "N006",
//     name: "Mehul Joshi",
//     status: "Student",
//     domain: "Cybersecurity",
//     skills: ["Linux", "Networking", "Cybersecurity"],
//     linkedIn: "https://linkedin.com/in/mehul-joshi",
//     email: "mehul.joshi@example.com",
//     pfpLink: "",
//     experience: "2 years",
//     isVisible: true,
//     company: "Deloitte",
//     role: "Security Analyst Intern",
//     year: "2024",
//     quote: "Think like an attacker, defend like an engineer.",
//     createdById: "24B0301"
// },
// {
//     nId: "N007",
//     name: "Sneha Iyer",
//     status: "Student",
//     domain: "Blockchain",
//     skills: ["Solidity", "Ethereum", "JavaScript"],
//     linkedIn: "https://linkedin.com/in/sneha-iyer",
//     email: "sneha.iyer@example.com",
//     pfpLink: "",
//     experience: "2 years",
//     isVisible: true,
//     company: "Polygon",
//     role: "Blockchain Developer Intern",
//     year: "2024",
//     quote: "Decentralize the future.",
//     createdById: "24B0302"
// },
// {
//     nId: "N008",
//     name: "Yash Desai",
//     status: "Working",
//     domain: "Product",
//     skills: ["Product Management", "Figma", "Analytics"],
//     linkedIn: "https://linkedin.com/in/yash-desai",
//     email: "yash.desai@example.com",
//     pfpLink: "",
//     experience: "5 years",
//     isVisible: true,
//     company: "Flipkart",
//     role: "Product Manager",
//     year: "2024",
//     quote: "Solve the right problem.",
//     createdById: "24B0303"
// },
// {
//     nId: "N009",
//     name: "Arjun Kulkarni",
//     status: "Student",
//     domain: "Data Science",
//     skills: ["Python", "Pandas", "SQL", "Statistics"],
//     linkedIn: "https://linkedin.com/in/arjun-kulkarni",
//     email: "arjun.kulkarni@example.com",
//     pfpLink: "",
//     experience: "1 year",
//     isVisible: false,
//     company: "NVIDIA",
//     role: "Data Science Intern",
//     year: "2026",
//     quote: "Data tells a story.",
//     createdById: "26B0321"
// },
// {
//     nId: "N010",
//     name: "Nidhi Shah",
//     status: "Student",
//     domain: "UI/UX",
//     skills: ["Figma", "UI Design", "UX Research"],
//     linkedIn: "https://linkedin.com/in/nidhi-shah",
//     email: "nidhi.shah@example.com",
//     pfpLink: "",
//     experience: "2.5 years",
//     isVisible: true,
//     company: "Atlassian",
//     role: "UI/UX Designer Intern",
//     year: "2026",
//     quote: "Design is how it works.",
//     createdById: "26B0322"
// }
// ];


// async function addToDB(data) {
//     for(let i = 0;i<data.length;i++) {
//         sampleData[i].nId = nanoid(20);
//         sampleData[i].createdAt = new Date().getTime();
//         let d = sampleData[i];
//         d.createdAt = new Date().getTime();
//         let res = await (new Network(d).save());
//         console.log(res);
//     }
// }

// const runFunc = async() => {
//     await addToDB(sampleData);
// }


// module.exports = {runFunc};