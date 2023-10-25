//Importing the express module into our application
const express = require('express');
const cors = require('cors');
//Initalizing variables
const app = express();


const PORT = 8000;

//My data
/**Information about and overview about Gurpreet Kaur */
const overViewDetails = [{
    firstName : "Gurpreet", 
    lastName : "Kaur",
    title: "Computer Programmer Intern",
    summary : "Proactive Computer Programming and Analysis student with expertise in Java, HTML5, CSS3, SQL, and React. Eager to contribute technical proficiency to a co-op internship [ Winter 2024, Jan-Apr], complemented by superior communication abilities and a distinguished background in customer relations."

}]
/**Skill sets */
const skillsDetails = [{
    skill : "Front-end Developement: Proficient in HTML5, CSS3, and React"
},
{
    skill : "Database Design & Management:  SQL"
},
{
    skill : "Data Structures: XML/JSON"
},
{
    skill : "System Analysis and Design"
},
{
    skill : "Communication & Collaboration: Proven ability to lead teams, relay requirements and manage projects."
},
]
/**Edcuation history */
const educationDetails = [{
    instituationName : "Humber College Institute of Technology and Advanced Learning",
    address : "Etobicoke, ON",
    diploma : "Computer Programming and Analysis (Co-op)",
    year : "Sept. 2022 - Dec. 2025",
    additional : "Dean's List [ Fall 2022, Winter 2023]"
},
{
    instituationName : "Sheridan College Institute of Technology and Advanced Learning",
    address : "Brampton, ON",
    diploma : "Architectural Technician",
    year : "Jan. 2012 - May 2013",
    additional : "Completed with Honours"
}
]
/**Professional work experience */
const workHistoryDetails = [{
    role : "Pharmacy Assisstant",
    company : "SilverFox Pharmacy Inc.",
    location : "Burlington, ON",
    year : "Apr.- Jul. 2022, Apr.- Jul.2023",
    responsibility : [
        "Collaborated closely with team members to streamline daily operations, leveraging healthcare systems to enhance communication with nursing homes and retirement facilities.",
        "Enhanced patient care by liaising with medical professionals, reducing system errors by up to 30% through proprietary software integrations.",
        "Managed administrative tasks, ensuring data confidentiality."
]
},
{
    role : "Pharmacy Assisstant/Overnight Supervisor",
    company : "Shoppers DrugMart",
    location : "Mississauga, ON",
    year : "Dec. 2013 - Apr. 2022",
    responsibility : [
        "Liaised with superiors to streamlined prescription processes, achieving faster intake and turnover rates.",
        "Managed inventory control systems, ensuring timely stock availability.",
        "Resolved team conflicts and customer issues, maintaining a harmonious work atmosphere.",
        "Oversaw end-of-day responsibilities, including cash office management."
]
},
{
    role : "Office Services Representative",
    company : "Hershey's Canada Inc.",
    location : "Mississauga, ON",
    year : "Dec. 2013 - Apr. 2022",
    responsibility : [
        "Efficiently managed communication, redirecting calls and emails to appropriate teams.",
        "Maintained office supply levels, reporting shortages proactively.",
        "Processed invoices, ensuring accurate and timely bill payments and assisted with fleet management."
]
}
]

app.use(cors({
    origin: "http://localhost:3000"
}));
/**Setting up the basic route that **responds** to the 
 * GET request on the root ("/") URL*/
app.get('/', (req, res) => {
    res.send("Welcome to Gurpreet's Resume Application!");
});
/**Setting up the Oveview route that **responds** to the 
 * GET request on the root ("/getOverView") URL*/
app.get('/getOverview', (req, res) => {
    res.send(overViewDetails);
});
/**Setting up the skills route that **responds** to the 
 * GET request on the root ("/getSkill") URL*/
app.get('/getSkill', (req, res) => {
    res.send(skillsDetails);
});
/**Setting up the education route that **responds** to the 
 * GET request on the root ("/getEdu") URL*/
app.get('/getEdu', (req, res) => {
    res.send(educationDetails);
});
/**Setting up the experience route that **responds** to the 
 * GET request on the root ("/getExp") URL*/
app.get('/getExp', (req, res) => {
    res.send(workHistoryDetails);
});


//Instructing our app to listen for incoming requests on port 8000
app.listen(8000, () => {
    console.log(`Resume App is running on http://localhost ${PORT}`);
});
