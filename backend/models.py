from database import db
from datetime import datetime

class User(db.Model):
    __tablename__ = "Users"

    UserID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    MobileNumber = db.Column(db.String(15), unique=True, nullable=False)
    Email = db.Column(db.String(100), nullable=True)
    IsVerified = db.Column(db.Boolean, default=False)
    CreatedAt = db.Column(db.DateTime, default=datetime.utcnow)

    documents = db.relationship("Document", backref="user", lazy=True)


class Document(db.Model):
    __tablename__ = "Documents"

    DocumentID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    UserID = db.Column(db.Integer, db.ForeignKey("Users.UserID"), nullable=False)
    Title = db.Column(db.String(100), nullable=False)
    DocType = db.Column(db.String(50), nullable=False)
    ExpiryDate = db.Column(db.Date, nullable=False)
    Notes = db.Column(db.Text, nullable=True)
    FilePath = db.Column(db.String(255), nullable=True)
    CreatedAt = db.Column(db.DateTime, default=datetime.utcnow)

    reminders = db.relationship("ReminderLog", backref="document", lazy=True)


class ReminderLog(db.Model):
    __tablename__ = "ReminderLogs"

    ReminderID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    DocumentID = db.Column(db.Integer, db.ForeignKey("Documents.DocumentID"), nullable=False)
    ReminderDate = db.Column(db.DateTime, nullable=False)
    ReminderType = db.Column(db.String(20), nullable=False)
