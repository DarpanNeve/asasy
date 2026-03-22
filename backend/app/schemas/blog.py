from pydantic import BaseModel, Field, HttpUrl, validator
from typing import Optional, List
from datetime import datetime
from app.models.blog import PostType, PostStatus
import re

class BlogPostCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: str = Field(..., min_length=1, max_length=500)
    content: str = Field(..., min_length=1)
    image_url: Optional[HttpUrl] = None
    post_type: PostType = PostType.BLOG
    meta_title: Optional[str] = Field(None, max_length=60)
    meta_description: Optional[str] = Field(None, max_length=160)
    author_name: str = Field(..., min_length=1)
    author_email: Optional[str] = None
    featured: bool = False
    
    @validator('title')
    def validate_title(cls, v):
        if not v.strip():
            raise ValueError('Title cannot be empty')
        return v.strip()
    
    def generate_slug(self) -> str:
        """Generate URL-friendly slug from title"""
        slug = re.sub(r'[^\w\s-]', '', self.title.lower())
        slug = re.sub(r'[-\s]+', '-', slug)
        return slug.strip('-')

class BlogPostUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, min_length=1, max_length=500)
    content: Optional[str] = Field(None, min_length=1)
    image_url: Optional[HttpUrl] = None
    meta_title: Optional[str] = Field(None, max_length=60)
    meta_description: Optional[str] = Field(None, max_length=160)
    author_name: Optional[str] = Field(None, min_length=1)
    author_email: Optional[str] = None
    featured: Optional[bool] = None

class BlogPostResponse(BaseModel):
    id: str
    title: str
    slug: str
    description: str
    image_url: Optional[str] = None
    post_type: PostType
    status: PostStatus
    author_name: str
    published_at: Optional[datetime] = None
    view_count: int
    featured: bool
    created_at: datetime
    updated_at: datetime

class BlogPostDetailResponse(BlogPostResponse):
    content: str
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None

class BlogPostListResponse(BaseModel):
    posts: List[BlogPostResponse]
    total: int
    page: int
    pages: int
    has_next: bool
    has_prev: bool