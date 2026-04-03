"""
schemas/models.py — All Pydantic request/response schemas
"""
from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional, List, Literal
from datetime import datetime
import re


# ─────────────────────────────────────────────
#  SHARED
# ─────────────────────────────────────────────
class PaginationMeta(BaseModel):
    total: int
    page: int
    pages: int
    limit: int


class Address(BaseModel):
    street:  Optional[str] = None
    city:    Optional[str] = None
    state:   Optional[str] = None
    pincode: Optional[str] = None
    country: str = "India"


# ─────────────────────────────────────────────
#  AUTH / USER
# ─────────────────────────────────────────────
class RegisterRequest(BaseModel):
    email:    EmailStr
    password: str = Field(min_length=6)
    username: str = Field(min_length=3, max_length=30)
    name:     str
    role:     Literal["farmer", "buyer"]
    phone:    Optional[str] = None
    address:  Optional[Address] = None
    language: Literal["en", "hi", "te", "ta"] = "en"

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v):
        if v and not re.match(r"^[6-9]\d{9}$", v):
            raise ValueError("Invalid Indian mobile number")
        return v


class LoginRequest(BaseModel):
    email:    EmailStr
    password: str


class UpdateProfileRequest(BaseModel):
    name:             Optional[str] = None
    phone:            Optional[str] = None
    address:          Optional[Address] = None
    language:         Optional[str] = None
    bio:              Optional[str] = Field(None, max_length=500)
    farm_name:        Optional[str] = None
    farm_size:        Optional[str] = None
    crops:            Optional[List[str]] = None
    certifications:   Optional[List[str]] = None
    buyer_type:       Optional[Literal["individual", "retailer", "wholesaler", "exporter"]] = None


class UpdatePasswordRequest(BaseModel):
    new_password: str = Field(min_length=6)


# ─────────────────────────────────────────────
#  PRODUCT
# ─────────────────────────────────────────────
PRODUCT_CATEGORIES = [
    "Grains & Cereals", "Vegetables", "Fruits", "Dairy & Eggs",
    "Spices & Herbs", "Processed Foods", "Organic Products",
    "Handmade Products", "Other",
]
PRODUCT_UNITS = ["kg", "g", "litre", "ml", "piece", "dozen", "packet", "box"]


class CreateProductRequest(BaseModel):
    title:               str = Field(max_length=100)
    description:         str = Field(max_length=1000)
    category:            str
    product_type:        Literal["raw", "value-added"] = "raw"
    price:               float = Field(gt=0)
    unit:                str
    stock:               int = Field(ge=0)
    min_order_quantity:  int = 1
    tags:                Optional[List[str]] = []
    is_organic:          bool = False
    is_fair_trade:       bool = False
    location_state:      Optional[str] = None
    location_district:   Optional[str] = None

    @field_validator("category")
    @classmethod
    def validate_category(cls, v):
        if v not in PRODUCT_CATEGORIES:
            raise ValueError(f"Invalid category. Choose from: {PRODUCT_CATEGORIES}")
        return v

    @field_validator("unit")
    @classmethod
    def validate_unit(cls, v):
        if v not in PRODUCT_UNITS:
            raise ValueError(f"Invalid unit. Choose from: {PRODUCT_UNITS}")
        return v


class UpdateProductRequest(BaseModel):
    title:               Optional[str] = None
    description:         Optional[str] = None
    category:            Optional[str] = None
    product_type:        Optional[str] = None
    price:               Optional[float] = None
    unit:                Optional[str] = None
    stock:               Optional[int] = None
    min_order_quantity:  Optional[int] = None
    tags:                Optional[List[str]] = None
    is_organic:          Optional[bool] = None
    is_fair_trade:       Optional[bool] = None
    is_available:        Optional[bool] = None
    location_state:      Optional[str] = None
    location_district:   Optional[str] = None


class ModerateProductRequest(BaseModel):
    status:           Literal["approved", "rejected"]
    rejection_reason: Optional[str] = None


# ─────────────────────────────────────────────
#  ORDER
# ─────────────────────────────────────────────
class OrderItem(BaseModel):
    product_id: str
    quantity:   int = Field(ge=1)


class ShippingAddress(BaseModel):
    name:    str
    street:  str
    city:    str
    state:   str
    pincode: str
    phone:   str


class CreateOrderRequest(BaseModel):
    items:            List[OrderItem]
    shipping_address: ShippingAddress
    shipping_method:  Literal["standard", "express", "priority"] = "standard"
    payment_method:   Literal["upi", "card", "netbanking", "cod"]
    notes:            Optional[str] = None


class UpdateOrderStatusRequest(BaseModel):
    status:          str
    note:            Optional[str] = None
    tracking_number: Optional[str] = None
    tracking_url:    Optional[str] = None


class RaiseDisputeRequest(BaseModel):
    description: str


# ─────────────────────────────────────────────
#  MESSAGE
# ─────────────────────────────────────────────
class SendMessageRequest(BaseModel):
    receiver_id: str
    content:     str = Field(max_length=2000)


# ─────────────────────────────────────────────
#  KNOWLEDGE
# ─────────────────────────────────────────────
class CreateModuleRequest(BaseModel):
    title:        str
    description:  Optional[str] = None
    icon:         str = "MenuBook"
    color:        str = "#4caf50"
    target_role:  Literal["farmer", "buyer", "all"] = "farmer"
    is_published: bool = True
    order:        int = 0


class CreateResourceRequest(BaseModel):
    title:         str
    description:   Optional[str] = None
    url:           Optional[str] = None
    resource_type: Literal["article", "video", "pdf", "link"] = "article"
    tags:          Optional[List[str]] = []


# ─────────────────────────────────────────────
#  REVIEW
# ─────────────────────────────────────────────
class CreateReviewRequest(BaseModel):
    product_id: str
    order_id:   str
    rating:     int = Field(ge=1, le=5)
    comment:    Optional[str] = Field(None, max_length=1000)


class ReplyReviewRequest(BaseModel):
    text: str = Field(max_length=500)
