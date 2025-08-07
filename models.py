from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime
from sqlalchemy.orm import relationship
from database import Base

class TestCase(Base):
    __tablename__ = "test_cases"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    priority = Column(Integer)
    status = Column(String)
    created_at = Column(DateTime)
    updated_at = Column(DateTime)

    test_steps = relationship("TestStep", back_populates="test_case")

class TestStep(Base):
    __tablename__ = "test_steps"

    id = Column(Integer, primary_key=True, index=True)
    test_case_id = Column(Integer, ForeignKey("test_cases.id"))
    step_number = Column(Integer)
    action = Column(String)
    expected_result = Column(String)
    actual_result = Column(String)
    status = Column(String)

    test_case = relationship("TestCase", back_populates="test_steps")
