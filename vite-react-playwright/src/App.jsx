import { useEffect, useMemo, useState } from "react";
import "./App.css";
import * as XLSX from "xlsx";

const FINAL_CLASS_LEVEL = 12;
const DEFAULT_SETTINGS = {
  promotion_month: 4,
  promotion_day: 1,
  first_class_year: 2027,
  fee_due_day: 1,
};
const DEFAULT_BIRTH_DATE = "2021-03-24";
const DEFAULT_MONTHLY_FEE = 11550;
const DEFAULT_PAYMENT_FREQUENCY = "Monthly";
const WEEK_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function buildWeeklyRoutine() {
  return [
    {
      slot: "8:30 AM",
      monday: "Wake up and freshen up",
      tuesday: "Wake up and freshen up",
      wednesday: "Wake up and freshen up",
      thursday: "Wake up and freshen up",
      friday: "Wake up and freshen up",
      saturday: "Wake up slowly and freshen up",
      sunday: "Wake up slowly and freshen up",
    },
    {
      slot: "8:45 AM",
      monday: "Milk and light breakfast",
      tuesday: "Milk and light breakfast",
      wednesday: "Milk and light breakfast",
      thursday: "Milk and light breakfast",
      friday: "Milk and light breakfast",
      saturday: "Family breakfast",
      sunday: "Family breakfast",
    },
    {
      slot: "9:00 AM",
      monday: "Get ready for school",
      tuesday: "Get ready for school",
      wednesday: "Get ready for school",
      thursday: "Get ready for school",
      friday: "Get ready for school",
      saturday: "Drawing or story time",
      sunday: "Prayer, story, or free play",
    },
    {
      slot: "9:30 AM - 3:00 PM",
      monday: "School",
      tuesday: "School",
      wednesday: "School",
      thursday: "School",
      friday: "School",
      saturday: "Outdoor play and outing",
      sunday: "Family time and relaxed learning",
    },
    {
      slot: "4:00 PM",
      monday: "After-school meal",
      tuesday: "After-school meal",
      wednesday: "After-school meal",
      thursday: "After-school meal",
      friday: "After-school meal",
      saturday: "Home lunch",
      sunday: "Home lunch",
    },
    {
      slot: "5:00 PM",
      monday: "Rest and free play",
      tuesday: "Rest and free play",
      wednesday: "Rest and free play",
      thursday: "Rest and free play",
      friday: "Rest and free play",
      saturday: "Crafts or pretend play",
      sunday: "Visit family or quiet play",
    },
    {
      slot: "6:30 PM",
      monday: "Outdoor activity",
      tuesday: "Outdoor activity",
      wednesday: "Outdoor activity",
      thursday: "Outdoor activity",
      friday: "Outdoor activity",
      saturday: "Park or cycling",
      sunday: "Evening walk",
    },
    {
      slot: "7:30 PM",
      monday: "Prep revision",
      tuesday: "Prep revision",
      wednesday: "Prep revision",
      thursday: "Prep revision",
      friday: "Prep revision",
      saturday: "Rhymes and picture books",
      sunday: "Light revision only",
    },
    {
      slot: "8:00 PM",
      monday: "Dinner",
      tuesday: "Dinner",
      wednesday: "Dinner",
      thursday: "Dinner",
      friday: "Dinner",
      saturday: "Dinner",
      sunday: "Dinner",
    },
    {
      slot: "9:00 PM",
      monday: "Story and calm-down routine",
      tuesday: "Story and calm-down routine",
      wednesday: "Story and calm-down routine",
      thursday: "Story and calm-down routine",
      friday: "Story and calm-down routine",
      saturday: "Story and family time",
      sunday: "Story and prep for Monday",
    },
    {
      slot: "11:30 PM",
      monday: "Current bedtime noted",
      tuesday: "Current bedtime noted",
      wednesday: "Current bedtime noted",
      thursday: "Current bedtime noted",
      friday: "Current bedtime noted",
      saturday: "Current bedtime noted",
      sunday: "Current bedtime noted",
    },
  ];
}

function buildWeeklyMealPlan() {
  return [
    {
      slot: "Breakfast",
      monday: "Milk + poha",
      tuesday: "Milk + idli",
      wednesday: "Milk + upma",
      thursday: "Milk + oats",
      friday: "Milk + egg toast",
      saturday: "Paratha + curd",
      sunday: "Dosa or cheela",
    },
    {
      slot: "School Snack",
      monday: "Banana",
      tuesday: "Apple slices",
      wednesday: "Makhana",
      thursday: "Homemade sandwich",
      friday: "Fruit box",
      saturday: "Coconut water + fruit",
      sunday: "Seasonal fruit",
    },
    {
      slot: "Lunch",
      monday: "Roti sabzi",
      tuesday: "Dal rice",
      wednesday: "Veg pulao",
      thursday: "Paneer roll",
      friday: "Khichdi",
      saturday: "Dal chawal",
      sunday: "Rice + curry + veg",
    },
    {
      slot: "After School Meal",
      monday: "Curd rice",
      tuesday: "Stuffed paratha",
      wednesday: "Roti sabzi",
      thursday: "Dal chawal",
      friday: "Paneer sandwich",
      saturday: "Homemade noodles or pulao",
      sunday: "Family lunch leftovers",
    },
    {
      slot: "Evening Snack",
      monday: "Fruit bowl",
      tuesday: "Sprouts chaat",
      wednesday: "Boiled corn",
      thursday: "Smoothie",
      friday: "Dry fruits milk",
      saturday: "Homemade cutlet",
      sunday: "Roasted makhana",
    },
    {
      slot: "Dinner",
      monday: "Dal + roti + veg",
      tuesday: "Khichdi + curd",
      wednesday: "Roti + paneer + salad",
      thursday: "Rice + dal + veg",
      friday: "Paratha + curd",
      saturday: "Light pulao + raita",
      sunday: "Simple home dinner",
    },
  ];
}
const DEFAULT_TEACHER_NOTES = [
  { id: 1, teacher: "Class Teacher", title: "Strong classroom participation", note: "Amishi responds warmly in circle time and enjoys picture-based learning tasks.", action: "Keep encouraging speaking in full sentences at home." },
  { id: 2, teacher: "Activity Teacher", title: "Creative confidence", note: "She shows strong interest in colouring, pretend play, and music-based activities.", action: "Offer one open-ended art activity each week." },
  { id: 3, teacher: "Support Note", title: "Number writing practice", note: "Counting is improving well; written number formation needs a little more repetition.", action: "Practice tracing and object counting together for 10 minutes." },
];
const DEFAULT_REPORT_CARDS = [
  { id: 1, term: "Term 1", area: "Language & Phonics", score: 78, remark: "Good recognition and listening confidence." },
  { id: 2, term: "Term 1", area: "Math Readiness", score: 71, remark: "Solid counting; keep building number writing." },
  { id: 3, term: "Term 1", area: "Art & Creativity", score: 88, remark: "Excellent enthusiasm and expression." },
  { id: 4, term: "Term 1", area: "Life Skills", score: 74, remark: "Growing independence with routines." },
];

const DEFAULT_HOLIDAYS = [
  { id: 1, name: "Independence Day", startDate: "2026-08-15", endDate: "2026-08-15", description: "National holiday celebrating India's independence" },
  { id: 2, name: "Raksha Bandhan", startDate: "2026-08-28", endDate: "2026-08-28", description: "Festival celebrating the bond between siblings" },
  { id: 3, name: "Janmashtami", startDate: "2026-09-07", endDate: "2026-09-07", description: "Birthday of Lord Krishna" },
  { id: 4, name: "Dussehra", startDate: "2026-10-02", endDate: "2026-10-02", description: "Victory of good over evil" },
  { id: 5, name: "Diwali", startDate: "2026-11-08", endDate: "2026-11-10", description: "Festival of lights" },
  { id: 6, name: "Christmas", startDate: "2026-12-25", endDate: "2026-12-25", description: "Christian festival" },
];

// Helper function to export timetable to Excel
function exportTimetableToExcel(weeklyTimetable, childName, currentClass) {
  const data = weeklyTimetable.map((entry) => ({
    "Time Slot": entry.slot,
    Monday: entry.monday,
    Tuesday: entry.tuesday,
    Wednesday: entry.wednesday,
    Thursday: entry.thursday,
    Friday: entry.friday,
    Saturday: entry.saturday,
    Sunday: entry.sunday,
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Timetable");
  XLSX.writeFile(workbook, `${childName}_Timetable_${currentClass}.xlsx`);
}

// Helper function to export food plan to Excel
function exportFoodPlanToExcel(weeklyMealPlan, childName, currentClass) {
  const data = weeklyMealPlan.map((meal) => ({
    "Meal Slot": meal.slot,
    Monday: meal.monday,
    Tuesday: meal.tuesday,
    Wednesday: meal.wednesday,
    Thursday: meal.thursday,
    Friday: meal.friday,
    Saturday: meal.saturday,
    Sunday: meal.sunday,
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Food Plan");
  XLSX.writeFile(workbook, `${childName}_FoodPlan_${currentClass}.xlsx`);
}

// Helper function to export timetable to PDF
function exportTimetableToPDF(weeklyTimetable, childName, currentClass) {
  let html = `
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { text-align: center; color: #333; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        th { background-color: #4CAF50; color: white; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        .footer { margin-top: 20px; text-align: center; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <h1>Daily Timetable - ${childName} (${currentClass})</h1>
      <table>
        <thead>
          <tr>
            <th>Time Slot</th>
            <th>Monday</th>
            <th>Tuesday</th>
            <th>Wednesday</th>
            <th>Thursday</th>
            <th>Friday</th>
            <th>Saturday</th>
            <th>Sunday</th>
          </tr>
        </thead>
        <tbody>
  `;

  weeklyTimetable.forEach((entry) => {
    html += `
      <tr>
        <td>${entry.slot}</td>
        <td>${entry.monday}</td>
        <td>${entry.tuesday}</td>
        <td>${entry.wednesday}</td>
        <td>${entry.thursday}</td>
        <td>${entry.friday}</td>
        <td>${entry.saturday}</td>
        <td>${entry.sunday}</td>
      </tr>
    `;
  });

  html += `
        </tbody>
      </table>
      <div class="footer">
        <p>Generated on ${new Date().toLocaleDateString("en-IN")}</p>
      </div>
    </body>
    </html>
  `;

  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${childName}_Timetable_${currentClass}.pdf`;
  
  // Create an iframe to print to PDF
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  document.body.appendChild(iframe);
  iframe.srcdoc = html;
  iframe.onload = () => {
    iframe.contentWindow.print();
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 1000);
  };
}

// Helper function to export food plan to PDF
function exportFoodPlanToPDF(weeklyMealPlan, childName, currentClass) {
  let html = `
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { text-align: center; color: #333; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        th { background-color: #FF9800; color: white; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        .footer { margin-top: 20px; text-align: center; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <h1>Daily Food Plan - ${childName} (${currentClass})</h1>
      <table>
        <thead>
          <tr>
            <th>Meal Slot</th>
            <th>Monday</th>
            <th>Tuesday</th>
            <th>Wednesday</th>
            <th>Thursday</th>
            <th>Friday</th>
            <th>Saturday</th>
            <th>Sunday</th>
          </tr>
        </thead>
        <tbody>
  `;

  weeklyMealPlan.forEach((meal) => {
    html += `
      <tr>
        <td>${meal.slot}</td>
        <td>${meal.monday}</td>
        <td>${meal.tuesday}</td>
        <td>${meal.wednesday}</td>
        <td>${meal.thursday}</td>
        <td>${meal.friday}</td>
        <td>${meal.saturday}</td>
        <td>${meal.sunday}</td>
      </tr>
    `;
  });

  html += `
        </tbody>
      </table>
      <div class="footer">
        <p>Generated on ${new Date().toLocaleDateString("en-IN")}</p>
      </div>
    </body>
    </html>
  `;

  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  document.body.appendChild(iframe);
  iframe.srcdoc = html;
  iframe.onload = () => {
    iframe.contentWindow.print();
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 1000);
  };
}

function parseLocalDate(dateText) {
  const [year, month, day] = dateText.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatIsoDate(dateValue) {
  if (dateValue instanceof Date) {
    return `${dateValue.getFullYear()}-${String(dateValue.getMonth() + 1).padStart(2, "0")}-${String(dateValue.getDate()).padStart(2, "0")}`;
  }
  return dateValue;
}

function calculateAge(today = new Date(), birthDateText = DEFAULT_BIRTH_DATE) {
  const birthDate = parseLocalDate(birthDateText);
  let years = today.getFullYear() - birthDate.getFullYear();
  if (
    today.getMonth() < birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())
  ) {
    years -= 1;
  }
  return years;
}

function getPromotionAnchor(settings) {
  return new Date(settings.first_class_year, settings.promotion_month - 1, settings.promotion_day);
}

function calculateCurrentClass(today = new Date(), settings = DEFAULT_SETTINGS) {
  const firstClassDate = getPromotionAnchor(settings);
  if (today < firstClassDate) {
    return "Prep";
  }

  let promotedYears = today.getFullYear() - firstClassDate.getFullYear();
  if (
    today.getMonth() < firstClassDate.getMonth() ||
    (today.getMonth() === firstClassDate.getMonth() && today.getDate() < firstClassDate.getDate())
  ) {
    promotedYears -= 1;
  }

  return `Class ${Math.min(promotedYears + 1, FINAL_CLASS_LEVEL)}`;
}

function calculateSchoolYear(today = new Date(), settings = DEFAULT_SETTINGS) {
  const startYear =
    today.getMonth() + 1 > settings.promotion_month ||
    (today.getMonth() + 1 === settings.promotion_month && today.getDate() >= settings.promotion_day)
      ? today.getFullYear()
      : today.getFullYear() - 1;
  return `${startYear}-${String(startYear + 1).slice(-2)}`;
}

function getNextPromotionDate(today = new Date(), settings = DEFAULT_SETTINGS) {
  const currentClass = calculateCurrentClass(today, settings);
  if (currentClass === `Class ${FINAL_CLASS_LEVEL}`) {
    return null;
  }

  const firstClassDate = getPromotionAnchor(settings);
  if (today < firstClassDate) {
    return formatIsoDate(firstClassDate);
  }

  const nextYear =
    today.getMonth() + 1 > settings.promotion_month ||
    (today.getMonth() + 1 === settings.promotion_month && today.getDate() >= settings.promotion_day)
      ? today.getFullYear() + 1
      : today.getFullYear();
  return `${nextYear}-${String(settings.promotion_month).padStart(2, "0")}-${String(settings.promotion_day).padStart(2, "0")}`;
}

function buildTimeline(settings = DEFAULT_SETTINGS, birthDate = DEFAULT_BIRTH_DATE) {
  const items = [];
  const prepDate = new Date(settings.first_class_year - 1, settings.promotion_month - 1, settings.promotion_day);
  items.push({
    label: "Prep",
    promotion_date: formatIsoDate(prepDate),
    school_year: calculateSchoolYear(prepDate, settings),
    age: calculateAge(prepDate, birthDate),
    detail: "Play-based school readiness, social confidence, and joyful routines.",
  });

  for (let classLevel = 1; classLevel <= FINAL_CLASS_LEVEL; classLevel += 1) {
    const classDate = new Date(settings.first_class_year + classLevel - 1, settings.promotion_month - 1, settings.promotion_day);
    items.push({
      label: `Class ${classLevel}`,
      promotion_date: formatIsoDate(classDate),
      school_year: calculateSchoolYear(classDate, settings),
      age: calculateAge(classDate, birthDate),
      detail: "Automatic annual promotion milestone.",
    });
  }

  return items;
}

function buildFeeHistory(settings = DEFAULT_SETTINGS, schoolYear, amount = DEFAULT_MONTHLY_FEE) {
  const startYear = Number(schoolYear.split("-")[0]);
  return Array.from({ length: 12 }, (_, index) => {
    const month = ((settings.promotion_month - 1 + index) % 12) + 1;
    const year = month >= settings.promotion_month ? startYear : startYear + 1;
    const dueDate = new Date(year, month - 1, Math.min(settings.fee_due_day, 28));
    return {
      month_key: `${year}-${String(month).padStart(2, "0")}`,
      due_date: formatIsoDate(dueDate),
      amount,
      status: "Unpaid",
      paid_on: null,
    };
  });
}

function getClassPlan(currentClass) {
  const classNumber = Number.parseInt(currentClass.replace(/[^0-9]/g, ""), 10);

  if (currentClass === "Prep") {
    return {
      tabLabel: "Prep Plan",
      heading: "Prep foundations and playful routines",
      badge: "Age 5 now",
      tracks: [
        { title: "Phonics play", detail: "Letter sounds, picture-word matching, and rhyming games." },
        { title: "Number sense", detail: "Count objects, compare quantities, and recognise number shapes." },
        { title: "Social confidence", detail: "Taking turns, asking for help, and naming feelings clearly." },
        { title: "Creative expression", detail: "Drawing, music, pretend play, and open-ended storytelling." },
      ],
      actions: [
        "Keep learning blocks short and playful.",
        "Notice curiosity more than speed.",
        "Use stories, songs, and movement every day.",
      ],
      timetable: [
        { time: "8:30 AM", title: "Wake up and freshen up", detail: "Water, wash, toilet routine, and calm start." },
        { time: "8:45 AM", title: "Milk and light breakfast", detail: "Something easy before school prep begins." },
        { time: "9:00 AM", title: "Get ready for school", detail: "Uniform, bag check, and simple conversation before leaving." },
        { time: "9:30 AM - 3:00 PM", title: "School time", detail: "Classroom learning, play, lunch, and social time." },
        { time: "3:30 PM", title: "Return home and freshen up", detail: "Change clothes, wash hands, and settle down." },
        { time: "4:00 PM", title: "Lunch or evening meal", detail: "Home meal with dal, roti/rice, and vegetables." },
        { time: "5:00 PM", title: "Rest and free play", detail: "Relaxing play, drawing, or quiet time without pressure." },
        { time: "6:30 PM", title: "Outdoor activity", detail: "Cycling, playground, or movement for at least 45 minutes." },
        { time: "7:30 PM", title: "Prep revision block", detail: "10-15 minutes of phonics, counting, or picture reading." },
        { time: "8:00 PM", title: "Dinner", detail: "Balanced dinner with protein, vegetables, and water." },
        { time: "9:00 PM", title: "Story and calm-down routine", detail: "Bedtime story, cuddles, and screen-free winding down." },
        { time: "11:30 PM", title: "Current bedtime noted", detail: "This is the time you shared. For a 5-year-old, an earlier bedtime would usually support energy and learning better." },
      ],
      mealPlan: [
        { slot: "8:45 AM breakfast", menu: "Milk plus poha, idli, upma, oats, or egg with toast.", note: "Keep it light and school-friendly." },
        { slot: "11:00 AM school snack", menu: "Banana, apple slices, makhana, or homemade sandwich.", note: "Easy to eat and not too messy." },
        { slot: "1:00 PM school lunch", menu: "Roti sabzi, dal rice, veg pulao, paneer roll, or khichdi.", note: "Try one protein item daily." },
        { slot: "4:00 PM after school meal", menu: "Dal chawal, curd rice, stuffed paratha, or roti with sabzi.", note: "This helps refill energy after school." },
        { slot: "6:00 PM evening snack", menu: "Fruit, sprouts chaat, boiled corn, smoothie, or nuts powder milk.", note: "Prefer fresh snacks over packaged food." },
        { slot: "8:00 PM dinner", menu: "Simple home dinner with dal, vegetables, roti/rice, and curd.", note: "Keep dinner calm and not too heavy before bed." },
      ],
      weeklyTimetable: buildWeeklyRoutine(),
      weeklyMealPlan: buildWeeklyMealPlan(),
    };
  }

  if (classNumber >= 1 && classNumber <= 5) {
    return {
      tabLabel: `Class ${classNumber} Planner`,
      heading: "Primary school focus areas",
      badge: "Foundation years",
      tracks: [
        { title: "Reading fluency", detail: "Strengthen vocabulary, reading confidence, and comprehension." },
        { title: "Math habits", detail: "Daily practice with number operations and problem solving." },
        { title: "Project learning", detail: "Encourage speaking, drawing, and hands-on curiosity." },
        { title: "Independent routines", detail: "Homework rhythm, school bag responsibility, and self-management." },
      ],
      actions: [
        "Review weak subjects weekly, not only before exams.",
        "Balance academics with hobbies and sleep.",
        "Keep parent-teacher notes in one place.",
      ],
      timetable: [],
      mealPlan: [],
      weeklyTimetable: [],
      weeklyMealPlan: [],
    };
  }

  if (classNumber >= 6 && classNumber <= 8) {
    return {
      tabLabel: `Class ${classNumber} Planner`,
      heading: "Middle school growth plan",
      badge: "Exploration years",
      tracks: [
        { title: "Concept depth", detail: "Build stronger understanding in science, math, and languages." },
        { title: "Study systems", detail: "Introduce revision schedules, notebooks, and test reflection." },
        { title: "Interest mapping", detail: "Track subjects, sports, arts, and co-curricular strengths." },
        { title: "Digital discipline", detail: "Keep screens purposeful and study time protected." },
      ],
      actions: [
        "Start goal-setting every term.",
        "Watch for confidence dips during transitions.",
        "Keep hobbies active alongside academics.",
      ],
      timetable: [],
      mealPlan: [],
      weeklyTimetable: [],
      weeklyMealPlan: [],
    };
  }

  return {
    tabLabel: `${currentClass} Planner`,
    heading: "Senior school planning",
    badge: "Decision years",
    tracks: [
      { title: "Board exam readiness", detail: "Track syllabus completion, mock tests, and weak chapters." },
      { title: "Stream planning", detail: "Review interest fit for science, commerce, humanities, or other paths." },
      { title: "Career exploration", detail: "Add mentors, entrance timelines, and portfolio milestones." },
      { title: "Wellbeing guardrails", detail: "Protect sleep, recovery, and emotional support during exam pressure." },
    ],
    actions: [
      "Break yearly goals into monthly checkpoints.",
      "Keep exam prep visible but realistic.",
      "Review future pathways together, not reactively.",
    ],
    timetable: [],
    mealPlan: [],
    weeklyTimetable: [],
    weeklyMealPlan: [],
  };
}

function buildFallbackData() {
  const settings = { ...DEFAULT_SETTINGS };
  const schoolYear = calculateSchoolYear(new Date(), settings);
  const feeHistory = buildFeeHistory(settings, schoolYear, DEFAULT_MONTHLY_FEE);
  return {
    profile: {
      child_name: "Amishi Singh",
      start_class: "Prep",
      current_class: calculateCurrentClass(new Date(), settings),
      age: calculateAge(new Date(), DEFAULT_BIRTH_DATE),
      school_year: schoolYear,
      focus_message: "Build joyful routines, language confidence, and early number sense.",
      photo_path: "/images/amishi.jpg",
      birth_date: DEFAULT_BIRTH_DATE,
      monthly_fee: DEFAULT_MONTHLY_FEE,
      payment_frequency: DEFAULT_PAYMENT_FREQUENCY,
      next_promotion_date: getNextPromotionDate(new Date(), settings),
    },
    settings,
    class_timeline: buildTimeline(settings, DEFAULT_BIRTH_DATE),
    fee_summary: {
      school_year: schoolYear,
      yearly_total: DEFAULT_MONTHLY_FEE * 12,
      paid_total: 0,
      unpaid_total: DEFAULT_MONTHLY_FEE * 12,
      history: feeHistory,
    },
    summaries: [
      { id: 1, label: "Learning readiness", value: "82%", note: "Strong interest in stories, sounds, and hands-on activities." },
      { id: 2, label: "Attendance rhythm", value: "18 / 20 days", note: "Consistent school routine with healthy energy most mornings." },
      { id: 3, label: "Confidence level", value: "Growing", note: "Speaking up more during circle time and family conversations." },
      { id: 4, label: "School Fees", value: "Rs 11,550 / month", note: "Fee payment is planned and paid monthly." },
    ],
    subjects: [
      { id: 1, name: "Language & Phonics", progress: 78, note: "Recognises most letters and enjoys rhyming games." },
      { id: 2, name: "Math Readiness", progress: 71, note: "Counting objects well; next step is number writing confidence." },
      { id: 3, name: "Art & Creativity", progress: 88, note: "Very expressive with drawing, music, and pretend play." },
      { id: 4, name: "Life Skills", progress: 74, note: "Packing her bag and cleaning up toys with gentle reminders." },
    ],
    milestones: [
      { id: 1, title: "Recognise uppercase letters", status: "On track", note: "26 of 26 letters introduced with playful revision." },
      { id: 2, title: "Count to 50", status: "In progress", note: "Comfortable till 35 independently." },
      { id: 3, title: "Follow 2-step instructions", status: "Strong", note: "Handles classroom and home routines with less prompting." },
      { id: 4, title: "Share feelings clearly", status: "Growing", note: "Uses simple feeling words instead of only reacting." },
    ],
    habits: [
      { id: 1, title: "Reading together", progress: "5 / 7 days", note: "Picture books, phonics cards, or bedtime stories." },
      { id: 2, title: "Outdoor play", progress: "6 / 7 days", note: "Movement helps sleep, focus, and confidence." },
      { id: 3, title: "Independent task", progress: "4 / 7 days", note: "Shoes, toy cleanup, or choosing clothes." },
      { id: 4, title: "Creative practice", progress: "5 / 7 days", note: "Drawing, clay, music, or pretend-play storytelling." },
    ],
    roadmap: [
      { id: 1, phase: "Prep to UKG", detail: "Focus on play-based literacy, routine, social confidence, and curiosity." },
      { id: 2, phase: "Classes 1 to 2", detail: "Strengthen reading fluency, number sense, handwriting, and classroom independence." },
      { id: 3, phase: "Classes 3 to 5", detail: "Build project learning, foundational science, communication, and discipline." },
      { id: 4, phase: "Classes 6 to 8", detail: "Track subject strengths, hobbies, and healthy study habits without pressure." },
      { id: 5, phase: "Classes 9 to 12", detail: "Plan academic streams, exams, career interests, and wellbeing together." },
    ],
    activities: [
      { id: 1, entry_date: "2026-04-16", category: "Social", detail: "Shared crayons with a friend after one reminder." },
      { id: 2, entry_date: "2026-04-15", category: "Health", detail: "Slept on time and woke up cheerful for school." },
      { id: 3, entry_date: "2026-04-14", category: "Home", detail: "Counted fruit pieces at snack time and got to 24 correctly." },
      { id: 4, entry_date: "2026-04-13", category: "School", detail: "Matched picture cards to beginning sounds and loved story time." },
    ],
    parent_notes: [
      { id: 1, note: "Celebrate effort, not speed.", category: "Mindset", created_at: "2026-04-16T10:30:00Z" },
      { id: 2, note: "Review school readiness every quarter, not every day.", category: "Planning", created_at: "2026-04-15T10:30:00Z" },
      { id: 3, note: "Keep one weekend block free for family outings and open play.", category: "Balance", created_at: "2026-04-14T10:30:00Z" },
    ],
    teacher_notes: DEFAULT_TEACHER_NOTES,
    report_cards: DEFAULT_REPORT_CARDS,
    meta: {
      last_updated: "2026-04-17T10:00:00Z",
      data_mode: "sample",
      promotion_rule: "Class updates every year on 1 April. First move to Class 1 starts in 2027. Fees are due on day 1 of each month.",
    },
  };
}

// Determine API base URL based on environment
// IMPORTANT: This MUST use the production URL when deployed
// Do NOT use empty string or relative paths - they won't work with CORS
const API_BASE = (() => {
  const hostname = window.location.hostname;
  const protocol = window.location.protocol;
  
  console.log("🔍 DEBUG: hostname =", hostname, "protocol =", protocol);
  
  // Local development only
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    const localUrl = "https://kid-progress-dashboard.onrender.com";
    console.log("✅ LOCAL MODE: Using", localUrl);
    return localUrl;
  }
  
  // Production: ALWAYS use full HTTPS URL for Render
  const productionUrl = "https://kid-progress-dashboard.onrender.com";
  console.log("✅ PRODUCTION MODE: Using", productionUrl);
  return productionUrl;
})()

console.log("📡 API_BASE initialized as:", API_BASE);

function formatDate(dateText) {
  return parseLocalDate(dateText).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

function statusClass(status) {
  return status.toLowerCase().replace(/\s+/g, "-");
}

export default function App() {
  const [dashboard, setDashboard] = useState(buildFallbackData());
  const [loading, setLoading] = useState(true);
  const [saveState, setSaveState] = useState("idle");
  const [settingsState, setSettingsState] = useState("idle");
  const [note, setNote] = useState("");
  const [settingsForm, setSettingsForm] = useState(DEFAULT_SETTINGS);
  const [activeTab, setActiveTab] = useState("overview");
  const [activeSubjectTab, setActiveSubjectTab] = useState(null);
  const [theme, setTheme] = useState("light");

  // Theme switching effect
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        const response = await fetch(`${API_BASE}/api/dashboard`);
        if (!response.ok) {
          throw new Error("Unable to load dashboard");
        }
        const data = await response.json();
        if (active) {
          setDashboard(data);
          setSettingsForm(data.settings);
        }
      } catch {
        if (active) {
          const fallback = buildFallbackData();
          setDashboard(fallback);
          setSettingsForm(fallback.settings);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadDashboard();
    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!note.trim()) {
      return;
    }

    setSaveState("saving");
    try {
      const response = await fetch(`${API_BASE}/api/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note, category: "Parent note" }),
      });
      if (!response.ok) {
        throw new Error("Unable to save note");
      }
      const data = await response.json();
      setDashboard(data);
      setSettingsForm(data.settings);
      setNote("");
      setSaveState("saved");
    } catch {
      const createdAt = new Date().toISOString();
      setDashboard((current) => ({
        ...current,
        parent_notes: [{ id: Date.now(), note, category: "Parent note", created_at: createdAt }, ...current.parent_notes].slice(0, 6),
      }));
      setNote("");
      setSaveState("saved-offline");
    }
  }

  async function handleSettingsSubmit(event) {
    event.preventDefault();
    setSettingsState("saving");
    try {
      const response = await fetch(`${API_BASE}/api/settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settingsForm),
      });
      if (!response.ok) {
        throw new Error("Unable to save settings");
      }
      const data = await response.json();
      setDashboard(data);
      setSettingsForm(data.settings);
      setSettingsState("saved");
    } catch {
      const offline = buildFallbackData();
      const mergedSettings = {
        promotion_month: Number(settingsForm.promotion_month),
        promotion_day: Number(settingsForm.promotion_day),
        first_class_year: Number(settingsForm.first_class_year),
        fee_due_day: Number(settingsForm.fee_due_day),
      };
      const schoolYear = calculateSchoolYear(new Date(), mergedSettings);
      setDashboard({
        ...offline,
        settings: mergedSettings,
        profile: {
          ...offline.profile,
          current_class: calculateCurrentClass(new Date(), mergedSettings),
          school_year: schoolYear,
          next_promotion_date: getNextPromotionDate(new Date(), mergedSettings),
        },
        class_timeline: buildTimeline(mergedSettings, offline.profile.birth_date),
        fee_summary: {
          school_year: schoolYear,
          yearly_total: offline.profile.monthly_fee * 12,
          paid_total: 0,
          unpaid_total: offline.profile.monthly_fee * 12,
          history: buildFeeHistory(mergedSettings, schoolYear, offline.profile.monthly_fee),
        },
        meta: {
          ...offline.meta,
          promotion_rule: `Class updates every year on ${mergedSettings.promotion_day} ${new Date(2000, mergedSettings.promotion_month - 1, mergedSettings.promotion_day).toLocaleString("en-IN", { month: "long" })}. First move to Class 1 starts in ${mergedSettings.first_class_year}. Fees are due on day ${mergedSettings.fee_due_day} of each month.`,
        },
      });
      setSettingsState("saved-offline");
    }
  }

  async function handleFeeStatusChange(monthKey, status) {
    try {
      const response = await fetch(`${API_BASE}/api/fees`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ month_key: monthKey, status }),
      });
      if (!response.ok) {
        throw new Error("Unable to update fee status");
      }
      const data = await response.json();
      setDashboard(data);
      setSettingsForm(data.settings);
    } catch {
      setDashboard((current) => {
        const history = current.fee_summary.history.map((entry) =>
          entry.month_key === monthKey
            ? { ...entry, status, paid_on: status === "Paid" ? formatIsoDate(new Date()) : null }
            : entry,
        );
        const paidTotal = history.filter((entry) => entry.status === "Paid").reduce((sum, entry) => sum + entry.amount, 0);
        const yearlyTotal = history.reduce((sum, entry) => sum + entry.amount, 0);
        return {
          ...current,
          fee_summary: {
            ...current.fee_summary,
            history,
            paid_total: paidTotal,
            unpaid_total: yearlyTotal - paidTotal,
            yearly_total: yearlyTotal,
          },
        };
      });
    }
  }

  const stageLabel = useMemo(() => `${dashboard.profile.current_class} learner • ${dashboard.profile.age} years old`, [dashboard.profile]);

  const nextPromotionLabel = useMemo(() => {
    if (!dashboard.profile.next_promotion_date) {
      return "Class 12 is the final auto-promotion stage.";
    }
    return `Next class update: ${formatDate(dashboard.profile.next_promotion_date)} ${parseLocalDate(dashboard.profile.next_promotion_date).getFullYear()}`;
  }, [dashboard.profile.next_promotion_date]);

  const classPlan = useMemo(() => getClassPlan(dashboard.profile.current_class), [dashboard.profile.current_class]);
  const teacherNotes = dashboard.teacher_notes ?? DEFAULT_TEACHER_NOTES;
  const reportCards = dashboard.report_cards ?? DEFAULT_REPORT_CARDS;

  useEffect(() => {
    if (!dashboard.subjects?.length) {
      return;
    }

    if (!activeSubjectTab || !dashboard.subjects.some((subject) => subject.id === activeSubjectTab)) {
      setActiveSubjectTab(dashboard.subjects[0].id);
    }
  }, [dashboard.subjects, activeSubjectTab]);

  const selectedSubject = useMemo(
    () => dashboard.subjects?.find((subject) => subject.id === activeSubjectTab) ?? dashboard.subjects?.[0],
    [dashboard.subjects, activeSubjectTab],
  );

  const tabs = useMemo(
    () => [
      { id: "overview", label: "Overview", icon: "OV", tone: "sand" },
      { id: "holidays", label: "Holidays", icon: "HD", tone: "rose" },
      { id: "class", label: classPlan.tabLabel, icon: "CL", tone: "coral" },
      { id: "timetable", label: "Timetable", icon: "TT", tone: "mint" },
      { id: "food", label: "Food", icon: "FD", tone: "gold" },
      { id: "fees", label: "Fees", icon: "FE", tone: "gold" },
      { id: "timeline", label: "Timeline", icon: "TL", tone: "mint" },
      { id: "teacher", label: "Teacher Notes", icon: "TN", tone: "sky" },
      { id: "reports", label: "Reports", icon: "RP", tone: "rose" },
      { id: "notes", label: "Notes", icon: "NT", tone: "plum" },
      { id: "settings", label: "Settings", icon: "ST", tone: "slate" },
    ],
    [classPlan.tabLabel],
  );

  return (
    <div className="portal-shell">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Kid Progress Dashboard</p>
          <h1>Track {dashboard.profile.child_name}&apos;s journey from {dashboard.profile.start_class} to Class 12.</h1>
          <p className="subtitle">A calm, practical dashboard for school progress, habits, milestones, future planning, and fee tracking.</p>
          <div className="hero-meta">
            <span className="hero-chip">{stageLabel}</span>
            <span className="hero-chip">School year {dashboard.profile.school_year}</span>
            <span className="hero-chip warm-chip">Focus: {dashboard.profile.focus_message}</span>
          </div>
          <div className="hero-actions">
            <button type="button" onClick={() => setActiveTab("notes")}>Add parent note</button>
            <button type="button" className="ghost-button" onClick={() => setActiveTab("settings")}>Open settings</button>
            
            <div className="theme-switcher" style={{ display: "flex", gap: "8px", alignItems: "center", marginLeft: "auto" }}>
              <span style={{ fontSize: "0.9rem", color: "rgba(255, 248, 242, 0.7)" }}>Theme:</span>
              <button
                type="button"
                className={`theme-btn ${theme === "light" ? "active" : ""}`}
                onClick={() => setTheme("light")}
                title="Light Theme"
                style={{
                  padding: "6px 12px",
                  borderRadius: "4px",
                  border: `2px solid ${theme === "light" ? "rgba(255, 248, 242, 0.8)" : "rgba(255, 248, 242, 0.2)"}`,
                  background: theme === "light" ? "rgba(255, 248, 242, 0.2)" : "transparent",
                  color: "rgba(255, 248, 242, 0.9)",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  fontWeight: theme === "light" ? "600" : "400",
                  transition: "all 0.3s ease"
                }}
              >
                ☀️ Light
              </button>
              <button
                type="button"
                className={`theme-btn ${theme === "dark" ? "active" : ""}`}
                onClick={() => setTheme("dark")}
                title="Dark Theme"
                style={{
                  padding: "6px 12px",
                  borderRadius: "4px",
                  border: `2px solid ${theme === "dark" ? "rgba(255, 248, 242, 0.8)" : "rgba(255, 248, 242, 0.2)"}`,
                  background: theme === "dark" ? "rgba(255, 248, 242, 0.2)" : "transparent",
                  color: "rgba(255, 248, 242, 0.9)",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  fontWeight: theme === "dark" ? "600" : "400",
                  transition: "all 0.3s ease"
                }}
              >
                🌙 Dark
              </button>
              <button
                type="button"
                className={`theme-btn ${theme === "high-contrast" ? "active" : ""}`}
                onClick={() => setTheme("high-contrast")}
                title="High Contrast Theme"
                style={{
                  padding: "6px 12px",
                  borderRadius: "4px",
                  border: `2px solid ${theme === "high-contrast" ? "rgba(255, 248, 242, 0.8)" : "rgba(255, 248, 242, 0.2)"}`,
                  background: theme === "high-contrast" ? "rgba(255, 248, 242, 0.2)" : "transparent",
                  color: "rgba(255, 248, 242, 0.9)",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  fontWeight: theme === "high-contrast" ? "600" : "400",
                  transition: "all 0.3s ease"
                }}
              >
                ⚡ High Contrast
              </button>
            </div>
          </div>
        </div>

        <div className="hero-panel" aria-label="App status">
          <div className="profile-panel-head">
            <img className="profile-photo" src={dashboard.profile.photo_path} alt={`${dashboard.profile.child_name} profile`} />
            <div>
              <p className="panel-title">Progress snapshot</p>
              <h2 className="profile-name">{dashboard.profile.child_name}</h2>
              <p className="profile-subtitle">{stageLabel}</p>
              <p className="profile-subtitle">Birthday: {formatDate(dashboard.profile.birth_date)} {parseLocalDate(dashboard.profile.birth_date).getFullYear()}</p>
              <p className="profile-subtitle">Fees: Rs {dashboard.profile.monthly_fee?.toLocaleString("en-IN")} / month ({dashboard.profile.payment_frequency?.toLowerCase()})</p>
            </div>
          </div>
          <ol className="workflow">
            <li>Track day-to-day learning without turning childhood into a report card.</li>
            <li>See which subjects, habits, social skills, and school fees need attention.</li>
            <li>Keep one shared family view from prep all the way to class 12.</li>
            <li>{dashboard.meta.promotion_rule}</li>
            <li>{dashboard.meta.data_mode === "live" ? "Connected to the Python + SQLite backend." : "Showing sample data until the Python backend starts."}</li>
          </ol>
        </div>
      </section>

      <section className="summary-grid" aria-label="Child summary">
        {dashboard.summaries.map((card) => (
          <article className="summary-card" key={card.id}>
            <p className="card-label">{card.label}</p>
            <h2>{card.value}</h2>
            <p className="card-note">{card.note}</p>
          </article>
        ))}
      </section>

      <section className="tabs-shell" aria-label="Dashboard tabs">
        <div className="tabs-row" role="tablist" aria-label="Class-based dashboard tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`tab-button tone-${tab.tone} ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon" aria-hidden="true">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <section className="full-width-grid" aria-label="Overview tab">
            <article className="surface planner-section">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">Subject Progress</p>
                  <h3>Foundation for today, visibility for the years ahead</h3>
                </div>
                <span className="badge">Current learning</span>
              </div>
              <div className="stack-list">
                {dashboard.subjects.map((subject) => (
                  <div className="subject-card" key={subject.id}>
                    <div className="subject-copy">
                      <div>
                        <p className="item-title">{subject.name}</p>
                        <p className="item-meta">{subject.note}</p>
                      </div>
                      <strong className="progress-copy">{subject.progress}%</strong>
                    </div>
                    <div className="progress-bar" aria-hidden="true"><span style={{ width: `${subject.progress}%` }} /></div>
                  </div>
                ))}
              </div>
            </article>

            <article className="surface">
              <div className="section-heading"><div><p className="eyebrow">Milestones</p><h3>What she is building right now</h3></div><span className="badge success">Age focus</span></div>
              <div className="stack-list">
                {dashboard.milestones.map((item) => (
                  <div className="list-item growth-item" key={item.id}>
                    <div><p className="item-title">{item.title}</p><p className="item-meta">{item.note}</p></div>
                    <strong className={`status-pill ${statusClass(item.status)}`}>{item.status}</strong>
                  </div>
                ))}
              </div>
            </article>

            <article className="surface">
              <div className="section-heading"><div><p className="eyebrow">Recent Activity</p><h3>Moments worth remembering</h3></div><span className="badge">Latest entries</span></div>
              <div className="stack-list">
                {dashboard.activities.map((activity) => (
                  <div className="list-item compact" key={activity.id}>
                    <div><p className="item-title">{activity.category}</p><p className="item-meta">{activity.detail}</p></div>
                    <strong className="progress-copy">{formatDate(activity.entry_date)}</strong>
                  </div>
                ))}
              </div>
            </article>

            <article className="surface">
              <div className="section-heading"><div><p className="eyebrow">Daily Timetable</p><h3>Today&apos;s school-day flow</h3></div><span className="badge">Quick view</span></div>
              <div className="table-wrap">
                {classPlan.weeklyTimetable.length > 0 ? (
                  <table className="planner-table weekly-table">
                    <thead>
                      <tr>
                        <th>Time</th>
                        {WEEK_DAYS.map((day) => (
                          <th key={day}>{day}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {classPlan.weeklyTimetable.slice(0, 5).map((entry) => (
                        <tr key={`overview-${entry.slot}`}>
                          <td>{entry.slot}</td>
                          <td>{entry.monday}</td>
                          <td>{entry.tuesday}</td>
                          <td>{entry.wednesday}</td>
                          <td>{entry.thursday}</td>
                          <td>{entry.friday}</td>
                          <td>{entry.saturday}</td>
                          <td>{entry.sunday}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="list-item compact">
                    <div><p className="item-meta">Timetable details are available for the current class plan.</p></div>
                  </div>
                )}
              </div>
            </article>

            <article className="surface">
              <div className="section-heading"><div><p className="eyebrow">Daily Food Plan</p><h3>Today&apos;s meal rhythm</h3></div><span className="badge success">Quick view</span></div>
              <div className="table-wrap">
                {classPlan.weeklyMealPlan.length > 0 ? (
                  <table className="planner-table weekly-table">
                    <thead>
                      <tr>
                        <th>Meal</th>
                        {WEEK_DAYS.map((day) => (
                          <th key={day}>{day}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {classPlan.weeklyMealPlan.slice(0, 4).map((meal) => (
                        <tr key={`overview-${meal.slot}`}>
                          <td>{meal.slot}</td>
                          <td>{meal.monday}</td>
                          <td>{meal.tuesday}</td>
                          <td>{meal.wednesday}</td>
                          <td>{meal.thursday}</td>
                          <td>{meal.friday}</td>
                          <td>{meal.saturday}</td>
                          <td>{meal.sunday}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="list-item compact">
                    <div><p className="item-meta">Food plan details are available for the current class plan.</p></div>
                  </div>
                )}
              </div>
            </article>
          </section>
        )}

        {activeTab === "holidays" && (
          <section className="full-width-grid" aria-label="Holidays tab">
            <article className="surface planner-section">
              <div className="section-heading"><div><p className="eyebrow">Holiday Calendar</p><h3>School and national holidays for the academic year</h3></div><span className="badge warm">Mark your calendar</span></div>
              <div className="holidays-grid">
                {DEFAULT_HOLIDAYS.map((holiday) => {
                  const startDate = parseLocalDate(holiday.startDate);
                  const endDate = parseLocalDate(holiday.endDate);
                  const isMultiDay = startDate.getTime() !== endDate.getTime();
                  
                  return (
                    <article className="holiday-card" key={holiday.id}>
                      <div className="holiday-header">
                        <h3 className="holiday-name">{holiday.name}</h3>
                        <span className="holiday-badge">{isMultiDay ? "Multi-day" : "1 day"}</span>
                      </div>
                      <div className="holiday-dates">
                        <p className="holiday-date">
                          <strong>Start:</strong> {formatDate(holiday.startDate)} {startDate.getFullYear()}
                        </p>
                        {isMultiDay && (
                          <p className="holiday-date">
                            <strong>End:</strong> {formatDate(holiday.endDate)} {endDate.getFullYear()}
                          </p>
                        )}
                      </div>
                      <p className="holiday-description">{holiday.description}</p>
                    </article>
                  );
                })}
              </div>
            </article>

            <article className="surface">
              <div className="section-heading"><div><p className="eyebrow">Holiday Count</p><h3>Overview for this academic year</h3></div><span className="badge success">Planning</span></div>
              <div className="holidays-stats">
                <div className="stat-card">
                  <p className="stat-label">Total Holidays</p>
                  <h3 className="stat-value">{DEFAULT_HOLIDAYS.length}</h3>
                  <p className="stat-meta">Days off from school</p>
                </div>
                <div className="stat-card">
                  <p className="stat-label">Multi-day Holidays</p>
                  <h3 className="stat-value">
                    {DEFAULT_HOLIDAYS.filter((h) => parseLocalDate(h.startDate).getTime() !== parseLocalDate(h.endDate).getTime()).length}
                  </h3>
                  <p className="stat-meta">Extended breaks</p>
                </div>
                <div className="stat-card">
                  <p className="stat-label">Upcoming Holidays</p>
                  <h3 className="stat-value">
                    {DEFAULT_HOLIDAYS.filter((h) => parseLocalDate(h.startDate) > new Date()).length}
                  </h3>
                  <p className="stat-meta">In the calendar</p>
                </div>
              </div>
            </article>

            <article className="surface">
              <div className="section-heading"><div><p className="eyebrow">Planning Tips</p><h3>Make the most of holiday breaks</h3></div><span className="badge">Parent guide</span></div>
              <div className="stack-list">
                <div className="list-item">
                  <div><p className="item-title">Plan activities ahead</p><p className="item-meta">Use longer holidays to plan special outings or learning activities with your child.</p></div>
                </div>
                <div className="list-item">
                  <div><p className="item-title">Keep a routine</p><p className="item-meta">Even on holidays, maintain some daily routines like meal times and bedtime to keep stability.</p></div>
                </div>
                <div className="list-item">
                  <div><p className="item-title">Balance rest and activity</p><p className="item-meta">Mix relaxation with creative play, outdoor time, and age-appropriate learning.</p></div>
                </div>
                <div className="list-item">
                  <div><p className="item-title">Communicate with school</p><p className="item-meta">Check with the school for any special holiday schedules or activities.</p></div>
                </div>
              </div>
            </article>
          </section>
        )}

        {activeTab === "class" && (
          <section className="content-grid" aria-label="Class tab">
            <article className="surface planner-section">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">{classPlan.tabLabel}</p>
                  <h3>{classPlan.heading}</h3>
                </div>
                <span className="badge success">{classPlan.badge}</span>
              </div>
              <div className="subject-tabs-row" role="tablist" aria-label="Subject tabs">
                {dashboard.subjects.map((subject) => (
                  <button
                    key={subject.id}
                    type="button"
                    role="tab"
                    aria-selected={activeSubjectTab === subject.id}
                    className={`subject-tab ${activeSubjectTab === subject.id ? "active" : ""}`}
                    onClick={() => setActiveSubjectTab(subject.id)}
                  >
                    {subject.name}
                  </button>
                ))}
              </div>
              {selectedSubject && (
                <div className="subject-detail-card">
                  <p className="note-category">Selected Subject</p>
                  <h4>{selectedSubject.name}</h4>
                  <p className="item-meta">{selectedSubject.note}</p>
                  <div className="progress-bar" aria-hidden="true"><span style={{ width: `${selectedSubject.progress}%` }} /></div>
                  <p className="strong-copy">Current progress: {selectedSubject.progress}%</p>
                </div>
              )}
              <div className="class-focus-grid">
                {classPlan.tracks.map((track) => (
                  <article className="timeline-card" key={track.title}>
                    <p className="note-category">Focus Area</p>
                    <h4>{track.title}</h4>
                    <p className="item-meta">{track.detail}</p>
                  </article>
                ))}
              </div>
            </article>

            <article className="surface">
              <div className="section-heading"><div><p className="eyebrow">Weekly Habits</p><h3>Small routines that support this class</h3></div><span className="badge warm">Home rhythm</span></div>
              <div className="stack-list">
                {dashboard.habits.map((habit) => (
                  <div className="list-item" key={habit.id}>
                    <div><p className="item-title">{habit.title}</p><p className="item-meta">{habit.note}</p></div>
                    <strong className="progress-copy">{habit.progress}</strong>
                  </div>
                ))}
              </div>
            </article>

            <article className="surface">
              <div className="section-heading"><div><p className="eyebrow">Daily Timetable</p><h3>School day flow for {dashboard.profile.current_class}</h3></div><span className="badge">9:30 AM - 3:00 PM</span></div>
              <div className="table-wrap">
                {classPlan.timetable.length > 0 ? (
                  <table className="planner-table">
                    <thead>
                      <tr>
                        <th>Time</th>
                        <th>Activity</th>
                        <th>Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {classPlan.timetable.map((entry) => (
                        <tr key={`${entry.time}-${entry.title}`}>
                          <td>{entry.time}</td>
                          <td>{entry.title}</td>
                          <td>{entry.detail}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="list-item compact">
                    <div><p className="item-meta">Daily timetable will adapt automatically as Amishi moves into higher classes.</p></div>
                  </div>
                )}
              </div>
            </article>

            <article className="surface">
              <div className="section-heading"><div><p className="eyebrow">Daily Food Plan</p><h3>Simple meal rhythm for a school day</h3></div><span className="badge success">Home + school</span></div>
              <div className="table-wrap">
                {classPlan.mealPlan.length > 0 ? (
                  <table className="planner-table">
                    <thead>
                      <tr>
                        <th>Meal Slot</th>
                        <th>Menu</th>
                        <th>Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {classPlan.mealPlan.map((meal) => (
                        <tr key={meal.slot}>
                          <td>{meal.slot}</td>
                          <td>{meal.menu}</td>
                          <td>{meal.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="list-item compact">
                    <div><p className="item-meta">Meal planning will become more academic-day oriented for higher classes.</p></div>
                  </div>
                )}
              </div>
            </article>

            <article className="surface">
              <div className="section-heading"><div><p className="eyebrow">Parent Actions</p><h3>How to support this stage calmly</h3></div><span className="badge">Next steps</span></div>
              <div className="stack-list">
                {classPlan.actions.map((action) => (
                  <div className="list-item compact" key={action}>
                    <div><p className="item-meta strong-copy">{action}</p></div>
                  </div>
                ))}
              </div>
            </article>
          </section>
        )}

        {activeTab === "fees" && (
          <section className="content-grid" aria-label="Fees tab">
            <article className="surface planner-section">
              <div className="section-heading"><div><p className="eyebrow">Fee Tracker</p><h3>Monthly due dates, status, and school-year totals</h3></div><span className="badge success">Billing</span></div>
              <div className="fee-summary-grid">
                <div className="summary-mini-card">
                  <p className="card-label">Yearly Fee Total</p>
                  <h3>Rs {dashboard.fee_summary.yearly_total.toLocaleString("en-IN")}</h3>
                  <p className="item-meta">For school year {dashboard.fee_summary.school_year}</p>
                </div>
                <div className="summary-mini-card">
                  <p className="card-label">Paid So Far</p>
                  <h3>Rs {dashboard.fee_summary.paid_total.toLocaleString("en-IN")}</h3>
                  <p className="item-meta">Monthly payments marked as paid</p>
                </div>
                <div className="summary-mini-card">
                  <p className="card-label">Still Unpaid</p>
                  <h3>Rs {dashboard.fee_summary.unpaid_total.toLocaleString("en-IN")}</h3>
                  <p className="item-meta">Due day is {dashboard.settings.fee_due_day} every month</p>
                </div>
              </div>
              <div className="fee-history-list">
                {dashboard.fee_summary.history.map((entry) => (
                  <div className="fee-item" key={entry.month_key}>
                    <div>
                      <p className="item-title">{parseLocalDate(`${entry.month_key}-01`).toLocaleString("en-IN", { month: "long", year: "numeric" })}</p>
                      <p className="item-meta">Due: {formatDate(entry.due_date)} {parseLocalDate(entry.due_date).getFullYear()} • Rs {entry.amount.toLocaleString("en-IN")}</p>
                      <p className="item-meta">{entry.status === "Paid" && entry.paid_on ? `Paid on ${formatDate(entry.paid_on)} ${parseLocalDate(entry.paid_on).getFullYear()}` : "Not marked as paid yet"}</p>
                    </div>
                    <div className="fee-actions">
                      <span className={`status-pill ${entry.status === "Paid" ? "strong" : "in-progress"}`}>{entry.status}</span>
                      <button type="button" className="table-button" onClick={() => handleFeeStatusChange(entry.month_key, entry.status === "Paid" ? "Unpaid" : "Paid")}>{entry.status === "Paid" ? "Mark unpaid" : "Mark paid"}</button>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </section>
        )}

        {activeTab === "timetable" && (
          <section className="full-width-grid" aria-label="Timetable tab">
            <article className="surface planner-section">
              <div className="section-heading"><div><p className="eyebrow">Daily Timetable</p><h3>Full day routine based on her current class</h3></div><span className="badge">9:30 AM - 3:00 PM school</span></div>
              <div className="download-actions" style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
                <button
                  type="button"
                  className="download-button excel"
                  onClick={() => exportTimetableToExcel(classPlan.weeklyTimetable, dashboard.profile.child_name, dashboard.profile.current_class)}
                >
                  📥 Download as Excel
                </button>
                <button
                  type="button"
                  className="download-button pdf"
                  onClick={() => exportTimetableToPDF(classPlan.weeklyTimetable, dashboard.profile.child_name, dashboard.profile.current_class)}
                >
                  📄 Download as PDF
                </button>
              </div>
              <div className="table-wrap">
                {classPlan.weeklyTimetable.length > 0 ? (
                  <table className="planner-table weekly-table">
                    <thead>
                      <tr>
                        <th>Time</th>
                        {WEEK_DAYS.map((day) => (
                          <th key={day}>{day}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {classPlan.weeklyTimetable.map((entry) => (
                        <tr key={`tab-${entry.slot}`}>
                          <td>{entry.slot}</td>
                          <td>{entry.monday}</td>
                          <td>{entry.tuesday}</td>
                          <td>{entry.wednesday}</td>
                          <td>{entry.thursday}</td>
                          <td>{entry.friday}</td>
                          <td>{entry.saturday}</td>
                          <td>{entry.sunday}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="list-item compact">
                    <div><p className="item-meta">This timetable will update automatically as Amishi moves into higher classes.</p></div>
                  </div>
                )}
              </div>
            </article>
          </section>
        )}

        {activeTab === "food" && (
          <section className="full-width-grid" aria-label="Food tab">
            <article className="surface planner-section">
              <div className="section-heading"><div><p className="eyebrow">Daily Food Plan</p><h3>Full meal schedule for a school day</h3></div><span className="badge success">Healthy rhythm</span></div>
              <div className="download-actions" style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
                <button
                  type="button"
                  className="download-button"
                  onClick={() => exportFoodPlanToExcel(classPlan.weeklyMealPlan, dashboard.profile.child_name, dashboard.profile.current_class)}
                  style={{ padding: "8px 16px", backgroundColor: "#FFC107", color: "#333", border: "none", borderRadius: "4px", cursor: "pointer" }}
                >
                  📥 Download as Excel
                </button>
                <button
                  type="button"
                  className="download-button"
                  onClick={() => exportFoodPlanToPDF(classPlan.weeklyMealPlan, dashboard.profile.child_name, dashboard.profile.current_class)}
                  style={{ padding: "8px 16px", backgroundColor: "#FF9800", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                >
                  📄 Download as PDF
                </button>
              </div>
              <div className="table-wrap">
                {classPlan.weeklyMealPlan.length > 0 ? (
                  <table className="planner-table weekly-table">
                    <thead>
                      <tr>
                        <th>Meal Slot</th>
                        {WEEK_DAYS.map((day) => (
                          <th key={day}>{day}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {classPlan.weeklyMealPlan.map((meal) => (
                        <tr key={`food-${meal.slot}`}>
                          <td>{meal.slot}</td>
                          <td>{meal.monday}</td>
                          <td>{meal.tuesday}</td>
                          <td>{meal.wednesday}</td>
                          <td>{meal.thursday}</td>
                          <td>{meal.friday}</td>
                          <td>{meal.saturday}</td>
                          <td>{meal.sunday}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="list-item compact">
                    <div><p className="item-meta">Food planning will update with the demands of later classes.</p></div>
                  </div>
                )}
              </div>
            </article>
          </section>
        )}


        {activeTab === "teacher" && (
          <section className="content-grid" aria-label="Teacher tab">
            <article className="surface planner-section">
              <div className="section-heading"><div><p className="eyebrow">Teacher Notes</p><h3>Feedback and follow-ups from school</h3></div><span className="badge success">School view</span></div>
              <div className="class-focus-grid">
                {teacherNotes.map((entry) => (
                  <article className="timeline-card" key={entry.id}>
                    <p className="note-category">{entry.teacher}</p>
                    <h4>{entry.title}</h4>
                    <p className="item-meta">{entry.note}</p>
                    <p className="strong-copy">Action: {entry.action}</p>
                  </article>
                ))}
              </div>
            </article>
          </section>
        )}

        {activeTab === "reports" && (
          <section className="content-grid" aria-label="Reports tab">
            <article className="surface planner-section">
              <div className="section-heading"><div><p className="eyebrow">Exam And Report Card</p><h3>Simple academic snapshot for the current stage</h3></div><span className="badge warm">Term view</span></div>
              <div className="reports-grid">
                {reportCards.map((report) => (
                  <article className="timeline-card" key={report.id}>
                    <p className="note-category">{report.term}</p>
                    <h4>{report.area}</h4>
                    <p className="strong-copy">Score: {report.score}%</p>
                    <p className="item-meta">{report.remark}</p>
                  </article>
                ))}
              </div>
            </article>

            <article className="surface">
              <div className="section-heading"><div><p className="eyebrow">Summary</p><h3>What the report card is saying</h3></div><span className="badge">Snapshot</span></div>
              <div className="stack-list">
                <div className="list-item compact"><div><p className="item-title">Best current area</p><p className="item-meta">Art & Creativity remains Amishi's strongest visible area right now.</p></div></div>
                <div className="list-item compact"><div><p className="item-title">Most important follow-up</p><p className="item-meta">Keep phonics and number writing steady with small daily practice.</p></div></div>
                <div className="list-item compact"><div><p className="item-title">Parent review rhythm</p><p className="item-meta">Review report-card trends once per term with teacher notes beside them.</p></div></div>
              </div>
            </article>
          </section>
        )}

        {activeTab === "timeline" && (
          <section className="content-grid" aria-label="Timeline tab">
            <article className="surface planner-section">
              <div className="section-heading"><div><p className="eyebrow">Class Progression</p><h3>Plan ahead without rushing her childhood</h3></div><span className="badge success">Long view</span></div>
              <div className="promotion-note"><p className="item-title">Automatic annual update</p><p className="item-meta">{nextPromotionLabel}</p></div>
              <div className="timeline-grid">
                {dashboard.class_timeline.map((entry) => (
                  <article className="timeline-card" key={entry.label}>
                    <p className="note-category">{entry.label}</p>
                    <h4>{formatDate(entry.promotion_date)} {parseLocalDate(entry.promotion_date).getFullYear()}</h4>
                    <p className="item-meta">School year {entry.school_year}</p>
                    <p className="item-meta">Estimated age {entry.age}</p>
                  </article>
                ))}
              </div>
            </article>

            <article className="surface">
              <div className="section-heading"><div><p className="eyebrow">Roadmap</p><h3>Year bands for parent planning</h3></div><span className="badge warm">Reference</span></div>
              <div className="stack-list">
                {dashboard.roadmap.map((item) => (
                  <div className="list-item compact" key={item.id}>
                    <div><p className="item-title">{item.phase}</p><p className="item-meta">{item.detail}</p></div>
                  </div>
                ))}
              </div>
            </article>
          </section>
        )}

        {activeTab === "notes" && (
          <section className="bottom-grid" aria-label="Notes tab">
            <article className="surface notes-panel">
              <div className="section-heading"><div><p className="eyebrow">Parent Notes</p><h3>Small reminders that shape the big picture</h3></div><span className={`badge ${dashboard.meta.data_mode === "live" ? "success" : "warm"}`}>{dashboard.meta.data_mode === "live" ? "Live backend" : "Sample mode"}</span></div>
              <div className="notes-grid">
                {dashboard.parent_notes.map((entry) => (
                  <article className="note-card" key={entry.id}>
                    <p className="note-category">{entry.category}</p>
                    <p>{entry.note}</p>
                    <span className="note-date">{formatDate(entry.created_at.slice(0, 10))}</span>
                  </article>
                ))}
              </div>
            </article>

            <article className="surface note-form-panel">
              <div className="section-heading"><div><p className="eyebrow">Quick Update</p><h3>Add today&apos;s parent observation</h3></div></div>
              <form className="note-form" onSubmit={handleSubmit}>
                <label htmlFor="parent-note" className="form-label">What did you notice today?</label>
                <textarea id="parent-note" value={note} onChange={(event) => setNote(event.target.value)} rows="5" placeholder="Example: She counted stairs by herself and was excited to read signboards." />
                <button type="submit" disabled={saveState === "saving"}>{saveState === "saving" ? "Saving..." : "Save note"}</button>
                <p className="form-hint">{loading ? "Loading dashboard..." : saveState === "saved" ? "Saved to the Python backend." : saveState === "saved-offline" ? "Saved in the screen for now. Start the backend to persist notes in SQLite." : "Use this for school wins, habits, behaviour, or things to discuss with teachers."}</p>
              </form>
            </article>
          </section>
        )}

        {activeTab === "settings" && (
          <section className="bottom-grid" aria-label="Settings tab">
            <article className="surface settings-panel" id="settings-panel">
              <div className="section-heading"><div><p className="eyebrow">Settings</p><h3>Change promotion and fee due dates later</h3></div><span className="badge">Planner controls</span></div>
              <form className="settings-form" onSubmit={handleSettingsSubmit}>
                <label className="field-label">Promotion month
                  <input type="number" min="1" max="12" value={settingsForm.promotion_month} onChange={(event) => setSettingsForm((current) => ({ ...current, promotion_month: event.target.value }))} />
                </label>
                <label className="field-label">Promotion day
                  <input type="number" min="1" max="31" value={settingsForm.promotion_day} onChange={(event) => setSettingsForm((current) => ({ ...current, promotion_day: event.target.value }))} />
                </label>
                <label className="field-label">First Class 1 year
                  <input type="number" min="2020" max="2050" value={settingsForm.first_class_year} onChange={(event) => setSettingsForm((current) => ({ ...current, first_class_year: event.target.value }))} />
                </label>
                <label className="field-label">Fee due day
                  <input type="number" min="1" max="31" value={settingsForm.fee_due_day} onChange={(event) => setSettingsForm((current) => ({ ...current, fee_due_day: event.target.value }))} />
                </label>
                <button type="submit" disabled={settingsState === "saving"}>{settingsState === "saving" ? "Saving..." : "Save settings"}</button>
                <p className="form-hint">{settingsState === "saved" ? "Saved to the backend and fee timeline updated." : settingsState === "saved-offline" ? "Updated on screen. Start the backend to persist these settings." : "Use this if your school follows a different annual promotion date or fee due day."}</p>
              </form>
            </article>

            <article className="surface">
              <div className="section-heading"><div><p className="eyebrow">Roadmap</p><h3>Year bands for parent planning</h3></div><span className="badge warm">Reference</span></div>
              <div className="stack-list">
                {dashboard.roadmap.map((item) => (
                  <div className="list-item compact" key={item.id}>
                    <div><p className="item-title">{item.phase}</p><p className="item-meta">{item.detail}</p></div>
                  </div>
                ))}
              </div>
            </article>
          </section>
        )}
      </section>
    </div>
  );
}
