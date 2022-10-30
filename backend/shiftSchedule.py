from firebase_admin import firestore
import pandas as pd
import uuid
from calendar import monthrange
from datetime import datetime, timedelta
from dateutil import tz
import os


def ScheduleReminder(LineNotify):
    token = os.getenv("grouptoken")
    month = (datetime.now() + timedelta(days=32)).month
    message = f"\n【排班提醒】\n\n今天是15號，如果你{month}月份有一些安排需要調整班表，請在今天晚上12點以前完成，謝謝你們的合作"
    LineNotify(token, message)


def ScheduleCompleteReminder(LineNotify):
    token = os.getenv("grouptoken")
    month = (datetime.now() + timedelta(days=32)).month
    year = (datetime.now() + timedelta(days=32)).year
    message = f"\n【部門公告】 {year}年{month}月 班表開放查詢\n\n各位弟兄、姊妹你們好\n{year}年{month}月的班表已開放查詢。\n\n如有問題，請聯繫管理者( http://nav.cx/54fnY0o )。\n\n★我們每個人都有可能收到委派，請務必到網站上確認自己的班表"
    LineNotify(token, message)


def ShiftSchedule(db):
    tpe = tz.gettz("Asia/Taipei")
    expired = datetime(datetime.today().year + 2, 1, 1, tzinfo=tpe)
    month = (datetime.today() + timedelta(days=32)).month
    year = (datetime.today() + timedelta(days=32)).year
    days = monthrange(year, month)[1]
    ref = db.collection("MonthlyData").document(f"{year}-{month:02}")
    available = []
    # 抓取每個人的班表
    for doc in db.collection_group("Schedule").where("assign", "==", True).stream():
        name = doc.reference.parent.parent.id
        user = doc.to_dict()
        if "partnerUuid" in user:
            partner = user["partnerUuid"]
        else:
            partner = ""
        for weekday in user["availableHours"]:
            for shifthour in user["availableHours"][weekday]:
                available.append(
                    {
                        "name": name,
                        "partner": partner,
                        "weekday": int(weekday),
                        "shiftHoursUuid": shifthour,
                        "attendence": user["availableHours"][weekday][shifthour],
                        "unavailableDates": user["unavailableDates"],
                    }
                )
    df = pd.DataFrame(available)

    batch = db.batch()
    upper_limit = 10  # 每月每個人的上限
    full = []
    statistics = {}
    yesterdayShift = []
    personalShifts = {}

    def adjustWeight(row):
        if row["name"] not in statistics:
            return row["weight"] * 10
        else:
            return row["weight"]

    def choose_participants(signup, attendence):
        choosen = []
        if len(signup) <= attendence:
            df.loc[signup.index, "attendence"] -= 1
            choosen = signup["name"].to_list()
        else:
            while len(choosen) < attendence:
                reminder_participants = signup[
                    signup["name"].apply(lambda x: x not in choosen)
                ].copy()
                sum = (6 - reminder_participants["attendence"]).sum()
                reminder_participants["weight"] = reminder_participants[
                    "attendence"
                ].apply(lambda x: (6 - x) / sum)
                reminder_participants["weight"] = reminder_participants.apply(
                    adjustWeight, axis=1
                )
                choosed = reminder_participants.sample(
                    1, weights=reminder_participants["weight"]
                )
                partner = choosed["partner"].values[0]
                if not partner or partner not in signup["name"].values:
                    choosen.append(choosed["name"].values[0])
                    df.loc[choosed.index, "attendence"] -= 1
                elif len(choosen) == attendence - 1:
                    for participant in choosen:
                        if not signup[signup["name"] == participant]["partner"].values:
                            choosen.remove(participant)
                            choosen.extend([choosed["name"].values[0], partner])
                            df.loc[
                                signup[signup["name"] == participant].index,
                                "attendence",
                            ] += 1
                            df.loc[choosed.index, "attendence"] -= 1
                            df.loc[
                                signup[signup["name"] == partner].index, "attendence"
                            ] -= 1
                            break
                elif len(choosen) < attendence - 1:
                    choosen.extend([choosed["name"].values[0], partner])
                    df.loc[choosed.index, "attendence"] -= 1
                    df.loc[signup[signup["name"] == partner].index, "attendence"] -= 1
                else:
                    continue
        return choosen

    for day in range(1, days + 1):
        todayShift = []
        date = datetime(year, month, day)
        date_str = date.strftime("%Y-%m-%d")
        if date.isoweekday() == 7:
            weekday = 0
        else:
            weekday = date.isoweekday()
        shifts = db.collection("SiteShifts").where("weekday", "==", weekday).get()
        for shift in shifts:
            attendence = shift.to_dict()["attendence"]
            siteUuid = shift.to_dict()["siteUuid"]
            shiftHoursUuid = shift.to_dict()["shiftHoursUuid"]
            signup = df[
                (df["weekday"] == weekday)
                & (df["shiftHoursUuid"] == shiftHoursUuid)
                & (df["unavailableDates"].apply(lambda x: date_str not in x))
                & (df["name"].apply(lambda x: x not in todayShift))
                & (df["name"].apply(lambda x: x not in yesterdayShift))
                & (df["name"].apply(lambda x: x not in full))
            ].copy()
            result = choose_participants(signup, attendence)
            todayShift.extend(result)
            uuid_ = str(uuid.uuid4())
            for person in result:
                if person not in personalShifts:
                    personalShifts[person] = [uuid_]
                else:
                    personalShifts[person].append(uuid_)
                if person in statistics:
                    statistics[person] += 1
                else:
                    statistics[person] = 1
                if statistics[person] >= upper_limit:
                    full.append(person)

            batch.set(
                ref.collection("Shifts").document(uuid_),
                {
                    "activate": True,
                    "crewUuids": result,
                    "date": f"{year}-{month:02d}-{day:02d}",
                    "shiftHoursUuid": shiftHoursUuid,
                    "siteUuid": siteUuid,
                    "uuid": uuid_,
                    "expiredAt": expired,
                },
            )

        yesterdayShift = todayShift
    batch.commit()
    ref_person = ref.collection("PersonalShifts")
    for person in personalShifts:
        data = {
            "shiftUuids": personalShifts[person],
            "uuid": person,
            "expiredAt": expired,
        }
        batch.set(ref_person.document(person), data)
    batch.set(ref, {"expiredAt": expired})
    batch.commit()

    # 刪除前一個月的unavailableDates
    last_month = datetime.now()
    month = last_month.month
    year = last_month.year
    days = monthrange(year, month)[1]
    expiredDates = [
        (datetime(year, month, 1) + timedelta(days=i)).strftime("%Y-%m-%d")
        for i in range(0, days)
    ]
    users = db.collection_group("Schedule").where("unavailableDates", "!=", []).get()
    batch = db.batch()
    for user in users:
        batch.update(
            user.reference, {"unavailableDates": firestore.ArrayRemove(expiredDates)}
        )
    batch.commit()
    return year, month
