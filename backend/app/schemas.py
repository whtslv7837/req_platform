from datetime import date, datetime
from typing import Optional, List

from pydantic import BaseModel, Field


class EmployeeBase(BaseModel):
    full_name: str = Field(..., max_length=255)
    position: str = Field(..., max_length=255)
    hire_date: date


class EmployeeCreate(EmployeeBase):
    pass


class EmployeeRead(EmployeeBase):
    id: int

    class Config:
        from_attributes = True


class GoalBase(BaseModel):
    title: str = Field(..., max_length=255)
    description: Optional[str] = None
    due_date: Optional[date] = None


class GoalCreate(GoalBase):
    employee_id: int


class GoalRead(GoalBase):
    id: int
    employee_id: int

    class Config:
        from_attributes = True


class ReviewBase(BaseModel):
    score: int = Field(..., ge=1, le=5)
    comment: Optional[str] = None


class ReviewCreate(ReviewBase):
    employee_id: int
    goal_id: Optional[int] = None


class ReviewRead(ReviewBase):
    id: int
    employee_id: int
    goal_id: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True


class EmployeeWithDetails(EmployeeRead):
    goals: List[GoalRead] = []
    reviews: List[ReviewRead] = []


class GoalWithDetails(GoalRead):
    employee_full_name: str
    employee_position: str
    reviews: List[ReviewRead] = []

