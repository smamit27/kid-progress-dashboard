from __future__ import annotations

import calendar
import json
import sqlite3
from datetime import date, datetime
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse
import os

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "progress.db"
HOST = os.environ.get("HOST", "0.0.0.0")  # Changed for deployment
PORT = int(os.environ.get("PORT", 8000))
FINAL_CLASS_LEVEL = 12
DEFAULT_PROMOTION_MONTH = 4
DEFAULT_PROMOTION_DAY = 1
DEFAULT_FIRST_CLASS_YEAR = 2027
DEFAULT_FEE_DUE_DAY = 1
DEFAULT_BIRTH_DATE = "2021-03-24"

PROFILE_SEED = {
    "child_name": "Amishi Singh",
    "start_class": "Prep",
    "current_class": "Prep",
    "age": 5,
    "school_year": "2026-27",
    "focus_message": "Build joyful routines, language confidence, and early number sense.",
    "photo_path": "/images/amishi.jpg",
    "birth_date": DEFAULT_BIRTH_DATE,
    "monthly_fee": 11550,
    "payment_frequency": "Monthly",
}

SETTINGS_SEED = {
    "promotion_month": DEFAULT_PROMOTION_MONTH,
    "promotion_day": DEFAULT_PROMOTION_DAY,
    "first_class_year": DEFAULT_FIRST_CLASS_YEAR,
    "fee_due_day": DEFAULT_FEE_DUE_DAY,
}

SUMMARY_SEED = [
    ("Learning readiness", "82%", "Strong interest in stories, sounds, and hands-on activities."),
    ("Attendance rhythm", "18 / 20 days", "Consistent school routine with healthy energy most mornings."),
    ("Confidence level", "Growing", "Speaking up more during circle time and family conversations."),
    ("School Fees", "Rs 11,550 / month", "Fee payment is planned and paid monthly."),
]

SUBJECT_SEED = [
    ("Language & Phonics", 78, "Recognises most letters and enjoys rhyming games."),
    ("Math Readiness", 71, "Counting objects well; next step is number writing confidence."),
    ("Art & Creativity", 88, "Very expressive with drawing, music, and pretend play."),
    ("Life Skills", 74, "Packing her bag and cleaning up toys with gentle reminders."),
]

MILESTONE_SEED = [
    ("Recognise uppercase letters", "On track", "26 of 26 letters introduced with playful revision."),
    ("Count to 50", "In progress", "Comfortable till 35 independently."),
    ("Follow 2-step instructions", "Strong", "Handles classroom and home routines with less prompting."),
    ("Share feelings clearly", "Growing", "Uses simple feeling words instead of only reacting."),
]

HABIT_SEED = [
    ("Reading together", "5 / 7 days", "Picture books, phonics cards, or bedtime stories."),
    ("Outdoor play", "6 / 7 days", "Movement helps sleep, focus, and confidence."),
    ("Independent task", "4 / 7 days", "Shoes, toy cleanup, or choosing clothes."),
    ("Creative practice", "5 / 7 days", "Drawing, clay, music, or pretend-play storytelling."),
]

ROADMAP_SEED = [
    ("Prep to UKG", "Focus on play-based literacy, routine, social confidence, and curiosity."),
    ("Classes 1 to 2", "Strengthen reading fluency, number sense, handwriting, and classroom independence."),
    ("Classes 3 to 5", "Build project learning, foundational science, communication, and discipline."),
    ("Classes 6 to 8", "Track subject strengths, hobbies, and healthy study habits without pressure."),
    ("Classes 9 to 12", "Plan academic streams, exams, career interests, and wellbeing together."),
]

ACTIVITY_SEED = [
    ("2026-04-13", "School", "Matched picture cards to beginning sounds and loved story time."),
    ("2026-04-14", "Home", "Counted fruit pieces at snack time and got to 24 correctly."),
    ("2026-04-15", "Health", "Slept on time and woke up cheerful for school."),
    ("2026-04-16", "Social", "Shared crayons with a friend after one reminder."),
]

NOTE_SEED = [
    ("Celebrate effort, not speed.", "Mindset"),
    ("Review school readiness every quarter, not every day.", "Planning"),
    ("Keep one weekend block free for family outings and open play.", "Balance"),
]


def parse_birth_date(value: str) -> date:
    return date.fromisoformat(value)


def get_promotion_anchor(settings: dict) -> date:
    return date(
        int(settings["first_class_year"]),
        int(settings["promotion_month"]),
        int(settings["promotion_day"]),
    )


def calculate_current_class(on_date: date, settings: dict) -> str:
    first_class_date = get_promotion_anchor(settings)
    if on_date < first_class_date:
        return "Prep"

    promoted_years = on_date.year - first_class_date.year
    if (on_date.month, on_date.day) < (first_class_date.month, first_class_date.day):
        promoted_years -= 1

    class_level = min(promoted_years + 1, FINAL_CLASS_LEVEL)
    return f"Class {class_level}"


def calculate_school_year(on_date: date, settings: dict) -> str:
    promotion_month = int(settings["promotion_month"])
    promotion_day = int(settings["promotion_day"])
    start_year = on_date.year if (on_date.month, on_date.day) >= (promotion_month, promotion_day) else on_date.year - 1
    return f"{start_year}-{str(start_year + 1)[-2:]}"


def calculate_age(on_date: date, birth_date: date) -> int:
    years = on_date.year - birth_date.year
    if (on_date.month, on_date.day) < (birth_date.month, birth_date.day):
        years -= 1
    return years


def get_next_promotion_date(on_date: date, settings: dict) -> str | None:
    current_class = calculate_current_class(on_date, settings)
    if current_class == f"Class {FINAL_CLASS_LEVEL}":
        return None

    promotion_month = int(settings["promotion_month"])
    promotion_day = int(settings["promotion_day"])
    first_class_date = get_promotion_anchor(settings)
    if on_date < first_class_date:
        return first_class_date.isoformat()

    next_year = on_date.year + 1 if (on_date.month, on_date.day) >= (promotion_month, promotion_day) else on_date.year
    return date(next_year, promotion_month, promotion_day).isoformat()


def build_class_timeline(settings: dict, birth_date: date) -> list[dict]:
    promotion_month = int(settings["promotion_month"])
    promotion_day = int(settings["promotion_day"])
    first_class_year = int(settings["first_class_year"])
    timeline = []

    prep_date = date(first_class_year - 1, promotion_month, promotion_day)
    timeline.append(
        {
            "label": "Prep",
            "promotion_date": prep_date.isoformat(),
            "school_year": calculate_school_year(prep_date, settings),
            "age": calculate_age(prep_date, birth_date),
            "detail": "Play-based school readiness, social confidence, and joyful routines.",
        }
    )

    for class_level in range(1, FINAL_CLASS_LEVEL + 1):
        milestone_date = date(first_class_year + class_level - 1, promotion_month, promotion_day)
        timeline.append(
            {
                "label": f"Class {class_level}",
                "promotion_date": milestone_date.isoformat(),
                "school_year": calculate_school_year(milestone_date, settings),
                "age": calculate_age(milestone_date, birth_date),
                "detail": "Automatic annual promotion milestone.",
            }
        )

    return timeline


def get_school_year_months(school_year: str) -> list[tuple[int, int]]:
    start_year = int(school_year.split("-")[0])
    months = []
    for offset in range(12):
        month = ((DEFAULT_PROMOTION_MONTH - 1 + offset) % 12) + 1
        year = start_year if month >= DEFAULT_PROMOTION_MONTH else start_year + 1
        months.append((year, month))
    return months


def build_due_date(year: int, month: int, due_day: int) -> date:
    last_day = calendar.monthrange(year, month)[1]
    return date(year, month, min(due_day, last_day))


def ensure_fee_payments(connection: sqlite3.Connection, settings: dict, monthly_fee: int, school_year: str) -> None:
    cursor = connection.cursor()
    due_day = int(settings.get("fee_due_day", DEFAULT_FEE_DUE_DAY))
    existing = {
        row[0]: row[1]
        for row in cursor.execute(
            "SELECT month_key, status FROM fee_payments WHERE school_year = ?",
            (school_year,),
        ).fetchall()
    }

    for year, month in get_school_year_months(school_year):
        due_date = build_due_date(year, month, due_day)
        month_key = due_date.strftime("%Y-%m")
        if month_key not in existing:
            cursor.execute(
                """
                INSERT INTO fee_payments (month_key, school_year, due_date, amount, status, paid_on)
                VALUES (?, ?, ?, ?, 'Unpaid', NULL)
                """,
                (month_key, school_year, due_date.isoformat(), monthly_fee),
            )
        else:
            cursor.execute(
                "UPDATE fee_payments SET amount = ?, due_date = ?, school_year = ? WHERE month_key = ?",
                (monthly_fee, due_date.isoformat(), school_year, month_key),
            )


def get_connection() -> sqlite3.Connection:
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def init_db() -> None:
    connection = get_connection()
    cursor = connection.cursor()

    cursor.executescript(
        """
        CREATE TABLE IF NOT EXISTS profile (
            id INTEGER PRIMARY KEY CHECK (id = 1),
            child_name TEXT NOT NULL,
            start_class TEXT NOT NULL,
            current_class TEXT NOT NULL,
            age INTEGER NOT NULL,
            school_year TEXT NOT NULL,
            focus_message TEXT NOT NULL,
            photo_path TEXT NOT NULL DEFAULT '/images/amishi.jpg',
            birth_date TEXT NOT NULL DEFAULT '2021-03-24',
            monthly_fee INTEGER NOT NULL DEFAULT 11550,
            payment_frequency TEXT NOT NULL DEFAULT 'Monthly'
        );

        CREATE TABLE IF NOT EXISTS app_settings (
            id INTEGER PRIMARY KEY CHECK (id = 1),
            promotion_month INTEGER NOT NULL,
            promotion_day INTEGER NOT NULL,
            first_class_year INTEGER NOT NULL,
            fee_due_day INTEGER NOT NULL DEFAULT 1
        );

        CREATE TABLE IF NOT EXISTS fee_payments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            month_key TEXT NOT NULL UNIQUE,
            school_year TEXT NOT NULL,
            due_date TEXT NOT NULL,
            amount INTEGER NOT NULL,
            status TEXT NOT NULL,
            paid_on TEXT
        );

        CREATE TABLE IF NOT EXISTS summaries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            label TEXT NOT NULL,
            value TEXT NOT NULL,
            note TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS subjects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            progress INTEGER NOT NULL,
            note TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS milestones (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            status TEXT NOT NULL,
            note TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS habits (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            progress TEXT NOT NULL,
            note TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS roadmap (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            phase TEXT NOT NULL,
            detail TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS activities (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            entry_date TEXT NOT NULL,
            category TEXT NOT NULL,
            detail TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS parent_notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            note TEXT NOT NULL,
            category TEXT NOT NULL,
            created_at TEXT NOT NULL
        );
        """
    )

    profile_columns = {row["name"] for row in cursor.execute("PRAGMA table_info(profile)").fetchall()}
    if "photo_path" not in profile_columns:
        cursor.execute("ALTER TABLE profile ADD COLUMN photo_path TEXT NOT NULL DEFAULT '/images/amishi.jpg'")
    if "birth_date" not in profile_columns:
        cursor.execute("ALTER TABLE profile ADD COLUMN birth_date TEXT NOT NULL DEFAULT '2021-03-24'")
    if "monthly_fee" not in profile_columns:
        cursor.execute("ALTER TABLE profile ADD COLUMN monthly_fee INTEGER NOT NULL DEFAULT 11550")
    if "payment_frequency" not in profile_columns:
        cursor.execute("ALTER TABLE profile ADD COLUMN payment_frequency TEXT NOT NULL DEFAULT 'Monthly'")

    settings_columns = {row["name"] for row in cursor.execute("PRAGMA table_info(app_settings)").fetchall()}
    if settings_columns and "fee_due_day" not in settings_columns:
        cursor.execute("ALTER TABLE app_settings ADD COLUMN fee_due_day INTEGER NOT NULL DEFAULT 1")

    profile_count = cursor.execute("SELECT COUNT(*) FROM profile").fetchone()[0]
    settings_count = cursor.execute("SELECT COUNT(*) FROM app_settings").fetchone()[0]

    if settings_count == 0:
        cursor.execute(
            "INSERT INTO app_settings (id, promotion_month, promotion_day, first_class_year, fee_due_day) VALUES (1, :promotion_month, :promotion_day, :first_class_year, :fee_due_day)",
            SETTINGS_SEED,
        )

    settings = dict(cursor.execute("SELECT * FROM app_settings WHERE id = 1").fetchone())
    today = date.today()
    current_class = calculate_current_class(today, settings)
    school_year = calculate_school_year(today, settings)
    current_age = calculate_age(today, parse_birth_date(PROFILE_SEED["birth_date"]))

    if profile_count == 0:
        cursor.execute(
            """
            INSERT INTO profile (id, child_name, start_class, current_class, age, school_year, focus_message, photo_path, birth_date, monthly_fee, payment_frequency)
            VALUES (1, :child_name, :start_class, :current_class, :age, :school_year, :focus_message, :photo_path, :birth_date, :monthly_fee, :payment_frequency)
            """,
            {
                **PROFILE_SEED,
                "current_class": current_class,
                "school_year": school_year,
                "age": current_age,
            },
        )
    else:
        cursor.execute(
            """
            UPDATE profile
            SET child_name = ?, current_class = ?, age = ?, school_year = ?, photo_path = ?, birth_date = ?, monthly_fee = ?, payment_frequency = ?
            WHERE id = 1
            """,
            (
                PROFILE_SEED["child_name"],
                current_class,
                current_age,
                school_year,
                PROFILE_SEED["photo_path"],
                PROFILE_SEED["birth_date"],
                PROFILE_SEED["monthly_fee"],
                PROFILE_SEED["payment_frequency"],
            ),
        )

    def seed_many(table: str, columns_text: str, rows: list[tuple]) -> None:
        count = cursor.execute(f"SELECT COUNT(*) FROM {table}").fetchone()[0]
        if count == 0:
            placeholders = ", ".join(["?"] * len(rows[0]))
            cursor.executemany(f"INSERT INTO {table} ({columns_text}) VALUES ({placeholders})", rows)

    seed_many("summaries", "label, value, note", SUMMARY_SEED)
    seed_many("subjects", "name, progress, note", SUBJECT_SEED)
    seed_many("milestones", "title, status, note", MILESTONE_SEED)
    seed_many("habits", "title, progress, note", HABIT_SEED)
    seed_many("roadmap", "phase, detail", ROADMAP_SEED)
    seed_many("activities", "entry_date, category, detail", ACTIVITY_SEED)

    notes_count = cursor.execute("SELECT COUNT(*) FROM parent_notes").fetchone()[0]
    if notes_count == 0:
        cursor.executemany(
            "INSERT INTO parent_notes (note, category, created_at) VALUES (?, ?, ?)",
            [(note, category, datetime.utcnow().isoformat()) for note, category in NOTE_SEED],
        )

    ensure_fee_payments(connection, settings, PROFILE_SEED["monthly_fee"], school_year)
    connection.commit()
    connection.close()


class ProgressHandler(BaseHTTPRequestHandler):
    def _send_json(self, payload: dict, status: int = 200) -> None:
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, format, *args):
        """Suppress logging"""
        pass

    def do_OPTIONS(self) -> None:
        self._send_json({"ok": True})

    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        if parsed.path == "/api/health":
            self._send_json({"status": "ok", "date": date.today().isoformat()})
            return

        if parsed.path == "/api/dashboard":
            self._send_json(build_dashboard_payload())
            return

        self._send_json({"error": "Not found"}, status=404)

    def do_POST(self) -> None:
        parsed = urlparse(self.path)
        content_length = int(self.headers.get("Content-Length", 0))
        raw_body = self.rfile.read(content_length)
        try:
            payload = json.loads(raw_body or b"{}")
        except json.JSONDecodeError:
            self._send_json({"error": "Invalid JSON"}, status=400)
            return

        if parsed.path == "/api/notes":
            note = str(payload.get("note", "")).strip()
            category = str(payload.get("category", "General")).strip() or "General"
            if not note:
                self._send_json({"error": "Note is required"}, status=400)
                return

            connection = get_connection()
            cursor = connection.cursor()
            cursor.execute(
                "INSERT INTO parent_notes (note, category, created_at) VALUES (?, ?, ?)",
                (note, category, datetime.utcnow().isoformat()),
            )
            connection.commit()
            connection.close()
            self._send_json(build_dashboard_payload(), status=201)
            return

        if parsed.path == "/api/settings":
            try:
                promotion_month = int(payload.get("promotion_month", DEFAULT_PROMOTION_MONTH))
                promotion_day = int(payload.get("promotion_day", DEFAULT_PROMOTION_DAY))
                first_class_year = int(payload.get("first_class_year", DEFAULT_FIRST_CLASS_YEAR))
                fee_due_day = int(payload.get("fee_due_day", DEFAULT_FEE_DUE_DAY))
                date(first_class_year, promotion_month, promotion_day)
                if fee_due_day < 1 or fee_due_day > 31:
                    raise ValueError
            except (TypeError, ValueError):
                self._send_json({"error": "Invalid promotion settings"}, status=400)
                return

            connection = get_connection()
            cursor = connection.cursor()
            cursor.execute(
                """
                UPDATE app_settings
                SET promotion_month = ?, promotion_day = ?, first_class_year = ?, fee_due_day = ?
                WHERE id = 1
                """,
                (promotion_month, promotion_day, first_class_year, fee_due_day),
            )
            settings = dict(cursor.execute("SELECT * FROM app_settings WHERE id = 1").fetchone())
            profile = dict(cursor.execute("SELECT * FROM profile WHERE id = 1").fetchone())
            today = date.today()
            school_year = calculate_school_year(today, settings)
            ensure_fee_payments(connection, settings, int(profile["monthly_fee"]), school_year)
            cursor.execute(
                "UPDATE profile SET current_class = ?, school_year = ?, age = ? WHERE id = 1",
                (
                    calculate_current_class(today, settings),
                    school_year,
                    calculate_age(today, parse_birth_date(profile["birth_date"])),
                ),
            )
            connection.commit()
            connection.close()
            self._send_json(build_dashboard_payload(), status=200)
            return

        if parsed.path == "/api/fees":
            month_key = str(payload.get("month_key", "")).strip()
            status = str(payload.get("status", "")).strip().title()
            if not month_key or status not in {"Paid", "Unpaid"}:
                self._send_json({"error": "month_key and status are required"}, status=400)
                return

            connection = get_connection()
            cursor = connection.cursor()
            paid_on = date.today().isoformat() if status == "Paid" else None
            cursor.execute(
                "UPDATE fee_payments SET status = ?, paid_on = ? WHERE month_key = ?",
                (status, paid_on, month_key),
            )
            connection.commit()
            connection.close()
            self._send_json(build_dashboard_payload(), status=200)
            return

        self._send_json({"error": "Not found"}, status=404)


def query_rows(connection: sqlite3.Connection, sql: str, params: tuple = ()) -> list[dict]:
    return [dict(row) for row in connection.execute(sql, params).fetchall()]


def build_fee_summary(connection: sqlite3.Connection, school_year: str) -> dict:
    rows = query_rows(
        connection,
        "SELECT month_key, due_date, amount, status, paid_on FROM fee_payments WHERE school_year = ? ORDER BY due_date",
        (school_year,),
    )
    total = sum(row["amount"] for row in rows)
    paid = sum(row["amount"] for row in rows if row["status"] == "Paid")
    unpaid = total - paid
    return {
        "school_year": school_year,
        "yearly_total": total,
        "paid_total": paid,
        "unpaid_total": unpaid,
        "history": rows,
    }


def build_dashboard_payload() -> dict:
    connection = get_connection()
    profile = dict(connection.execute("SELECT * FROM profile WHERE id = 1").fetchone())
    settings = dict(connection.execute("SELECT * FROM app_settings WHERE id = 1").fetchone())
    today = date.today()
    birth_date = parse_birth_date(profile["birth_date"])

    profile["current_class"] = calculate_current_class(today, settings)
    profile["school_year"] = calculate_school_year(today, settings)
    profile["age"] = calculate_age(today, birth_date)
    profile["next_promotion_date"] = get_next_promotion_date(today, settings)

    ensure_fee_payments(connection, settings, int(profile["monthly_fee"]), profile["school_year"])
    fee_summary = build_fee_summary(connection, profile["school_year"])

    payload = {
        "profile": profile,
        "settings": settings,
        "class_timeline": build_class_timeline(settings, birth_date),
        "fee_summary": fee_summary,
        "summaries": query_rows(connection, "SELECT id, label, value, note FROM summaries ORDER BY id"),
        "subjects": query_rows(connection, "SELECT id, name, progress, note FROM subjects ORDER BY progress DESC"),
        "milestones": query_rows(connection, "SELECT id, title, status, note FROM milestones ORDER BY id"),
        "habits": query_rows(connection, "SELECT id, title, progress, note FROM habits ORDER BY id"),
        "roadmap": query_rows(connection, "SELECT id, phase, detail FROM roadmap ORDER BY id"),
        "activities": query_rows(connection, "SELECT id, entry_date, category, detail FROM activities ORDER BY entry_date DESC, id DESC LIMIT 6"),
        "parent_notes": query_rows(connection, "SELECT id, note, category, created_at FROM parent_notes ORDER BY datetime(created_at) DESC LIMIT 6"),
        "meta": {
            "last_updated": datetime.utcnow().isoformat() + "Z",
            "data_mode": "live",
            "promotion_rule": f"Class updates every year on {settings['promotion_day']} {date(2000, settings['promotion_month'], settings['promotion_day']).strftime('%B')}. First move to Class 1 starts in {settings['first_class_year']}. Fees are due on day {settings['fee_due_day']} of each month.",
        },
    }
    connection.commit()
    connection.close()
    return payload


if __name__ == "__main__":
    init_db()
    server = ThreadingHTTPServer((HOST, PORT), ProgressHandler)
    # Print the correct URL based on environment
    backend_url = os.environ.get("BACKEND_URL", f"http://{HOST}:{PORT}")
    print(f"Kid progress backend running on {backend_url}")
    print(f"  Binding to: {HOST}:{PORT}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
