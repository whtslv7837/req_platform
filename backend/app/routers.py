from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas

router = APIRouter()


@router.post("/employees", response_model=schemas.EmployeeRead, status_code=status.HTTP_201_CREATED)
def create_employee(payload: schemas.EmployeeCreate, db: Session = Depends(get_db)):
    employee = models.Employee(**payload.model_dump())
    db.add(employee)
    db.commit()
    db.refresh(employee)
    return employee


@router.get("/employees", response_model=List[schemas.EmployeeRead])
def list_employees(db: Session = Depends(get_db)):
    return db.query(models.Employee).all()


@router.get("/employees/{employee_id}", response_model=schemas.EmployeeWithDetails)
def get_employee(employee_id: int, db: Session = Depends(get_db)):
    employee = (
        db.query(models.Employee)
        .filter(models.Employee.id == employee_id)
        .first()
    )
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    return employee


@router.post("/goals", response_model=schemas.GoalRead, status_code=status.HTTP_201_CREATED)
def create_goal(payload: schemas.GoalCreate, db: Session = Depends(get_db)):
    # убедимся, что сотрудник существует
    employee = db.query(models.Employee).filter(models.Employee.id == payload.employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    goal = models.Goal(**payload.model_dump())
    db.add(goal)
    db.commit()
    db.refresh(goal)
    return goal


@router.get("/goals", response_model=List[schemas.GoalRead])
def list_goals(db: Session = Depends(get_db)):
    return db.query(models.Goal).all()


@router.get("/goals/{goal_id}", response_model=schemas.GoalWithDetails)
def get_goal(goal_id: int, db: Session = Depends(get_db)):
    goal = db.query(models.Goal).filter(models.Goal.id == goal_id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")

    # обогатим цель данными по сотруднику
    return schemas.GoalWithDetails(
        id=goal.id,
        employee_id=goal.employee_id,
        title=goal.title,
        description=goal.description,
        due_date=goal.due_date,
        employee_full_name=goal.employee.full_name,
        employee_position=goal.employee.position,
        reviews=goal.reviews,
    )

@router.post("/reviews", response_model=schemas.ReviewRead, status_code=status.HTTP_201_CREATED)
def create_review(payload: schemas.ReviewCreate, db: Session = Depends(get_db)):
    employee = db.query(models.Employee).filter(models.Employee.id == payload.employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    if payload.goal_id is not None:
        goal = db.query(models.Goal).filter(models.Goal.id == payload.goal_id).first()
        if not goal:
            raise HTTPException(status_code=404, detail="Goal not found")

    review = models.Review(**payload.model_dump())
    db.add(review)
    db.commit()
    db.refresh(review)
    return review


@router.get("/reviews", response_model=List[schemas.ReviewRead])
def list_reviews(db: Session = Depends(get_db)):
    return db.query(models.Review).all()


