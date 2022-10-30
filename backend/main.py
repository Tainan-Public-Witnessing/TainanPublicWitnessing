from flask import Flask, jsonify
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

import firebase_admin
from firebase_admin import firestore

from datetime import datetime
from calendar import monthrange
import requests
import os

from shiftSchedule import ShiftSchedule, ScheduleReminder, ScheduleCompleteReminder
from report import AttendanceReport
from callback import LineNotifyCallback, LineLoginCallback
from vacancy import Tomorrow_VacancyNotify
from assignment import BeforeSevenDays_AssignmentNotify, Tomorrow_AssignmentNotify
from bind import BindUser
from backup import Backup

app = Flask(__name__)
limiter = Limiter(
    app, key_func=get_remote_address, default_limits=["200 per day", "50 per hour"]
)

firebase_admin.initialize_app()
db = firestore.client()


def LineNotify(token, message):
    url = "https://notify-api.line.me/api/notify"
    headers = {"Authorization": f"Bearer {token}"}
    data = {"message": message}
    return requests.post(url, headers=headers, data=data)


@app.route("/line-notify-callback", methods=["POST"])
@limiter.limit("10/minute")
@limiter.limit("10/second")
def line_notify_callback():
    LineNotifyCallback(db)
    return ("", 204)


@app.route("/line-login-callback", methods=["POST"])
def line_login_callback():
    LineLoginCallback(db)
    return ("", 204)


@app.route("/bind-user", methods=["POST"])
def bind_user():
    BindUser(db)
    return ("", 204)


@app.route("/schedule-reminder", methods=["GET"])
def schedule_reminder():
    ScheduleReminder(LineNotify)
    return jsonify({"status": f"已送出排班調整提醒"})


@app.route("/schedule-complete-reminder", methods=["GET"])
def schedule_complete_reminder():
    ScheduleCompleteReminder(LineNotify)
    return jsonify({"status": f"已送出排班完成提醒"})


@app.route("/assignment-notify", methods=["GET"])
def assignment_notify():
    BeforeSevenDays_AssignmentNotify(db, LineNotify)
    Tomorrow_AssignmentNotify(db, LineNotify)
    return jsonify({"status": f"已送出委派提醒"})


@app.route("/vacancy-notify", methods=["GET"])
def vacancy_notify():
    Tomorrow_VacancyNotify(db, LineNotify)
    return jsonify({"status": f"已送出缺席提醒"})


@app.route("/attendance-report", methods=["GET"])
def attendance_report():
    if datetime.now().day == monthrange(datetime.now().year, datetime.now().month)[1]:
        AttendanceReport(db, LineNotify)
        return jsonify({"status": f"已送出報告"})


@app.route("/shift-schedule", methods=["GET"])
def shift_schedule():
    year, month = ShiftSchedule(db)
    return jsonify({"status": f"{year}-{month:02}排班完成"})


@app.route("/backup", methods=["GET"])
def backup():
    Backup()
    return ("", 204)


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
