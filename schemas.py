from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class TestStepBase(BaseModel):
    step_number: int
    action: str
    expected_result: str
    actual_result: Optional[str] = None
    status: Optional[str] = "NOT_STARTED"

class TestStepCreate(TestStepBase):
    pass

class TestStep(TestStepBase):
    id: int
    test_case_id: int

    class Config:
        orm_mode = True

class TestCaseBase(BaseModel):
    title: str
    description: str
    priority: int
    status: Optional[str] = "NOT_STARTED"

class TestCaseCreate(TestCaseBase):
    test_steps: List[TestStepCreate] = []

class TestCase(TestCaseBase):
    id: int
    created_at: datetime
    updated_at: datetime
    test_steps: List[TestStep] = []

    class Config:
        orm_mode = True
