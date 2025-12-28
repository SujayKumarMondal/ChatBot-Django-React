import os
from urllib.parse import quote
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from dotenv import load_dotenv

load_dotenv()

# Database Configuration
DB_NAME = os.getenv("DB_NAME", "")
DB_USER = os.getenv("DB_USER", "")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")

# URL-encode the password to handle special characters
encoded_password = quote(DB_PASSWORD, safe='')

# Create connection string
# If DB_NAME is not set, fall back to a local sqlite database for easy local dev.
if DB_NAME:
    DATABASE_URL = f"postgresql://{DB_USER}:{encoded_password}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
else:
    sqlite_path = os.path.join(os.path.dirname(__file__), "db.sqlite3")
    DATABASE_URL = f"sqlite:///{sqlite_path}"

# Create engine
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    """Dependency injection for database sessions"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Initialize database tables"""
    from models import Base
    Base.metadata.create_all(bind=engine)