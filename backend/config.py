import os

class Config:
    # Flask secret key
    SECRET_KEY = os.getenv("SECRET_KEY", "super-secret-key")

    # SQL Server connection
    # Replace <USERNAME> and <PASSWORD> with your actual SQL Server credentials
    SQLALCHEMY_DATABASE_URI = (
        "mssql+pyodbc://(localdb)\MSSQLLocalDB/RenewlyDB"
        "?driver=ODBC+Driver+17+for+SQL+Server"
        "&trusted_connection=yes"
    )

    SQLALCHEMY_TRACK_MODIFICATIONS = False
