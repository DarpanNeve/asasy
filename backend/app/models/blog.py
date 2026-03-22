from beanie import Document, Indexed
from pydantic import Field, HttpUrl
from typing import Optional
from datetime import datetime
from enum import Enum

class PostType(str, Enum):
    BLOG = "blog"
    PRESS_RELEASE = "press_release"

class PostStatus(str, Enum):
    DRAFT = "draft"
    PUBLISHED = "published"
    ARCHIVED = "archived"

class BlogPost(Document):
    title: str = Field(..., min_length=1, max_length=200)
    slug: str = Field(..., description="URL-friendly version of title")
    description: str = Field(..., min_length=1, max_length=500, description="Short description/excerpt")
    content: str = Field(..., min_length=1, description="Full content of the post")
    image_url: Optional[HttpUrl] = Field(None, description="Featured image URL")
    
    # Post metadata
    post_type: PostType = PostType.BLOG
    status: PostStatus = PostStatus.DRAFT
    
    # SEO fields
    meta_title: Optional[str] = Field(None, max_length=60)
    meta_description: Optional[str] = Field(None, max_length=160)
    
    # Author information
    author_name: str = Field(..., description="Author name")
    author_email: Optional[str] = Field(None, description="Author email")
    
    # Publishing
    published_at: Optional[datetime] = None
    featured: bool = False
    
    # Engagement
    view_count: int = 0
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "blog_posts"
        indexes = [
            "slug",
            "post_type",
            "status",
            "published_at",
            "featured",
            [("post_type", 1), ("status", 1), ("published_at", -1)],
        ]
    
    def publish(self):
        """Publish the post"""
        self.status = PostStatus.PUBLISHED
        if not self.published_at:
            self.published_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()
    
    def unpublish(self):
        """Unpublish the post"""
        self.status = PostStatus.DRAFT
        self.updated_at = datetime.utcnow()
    
    def increment_views(self):
        """Increment view count"""
        self.view_count += 1
    
    def to_public_dict(self) -> dict:
        """Return public-facing dictionary"""
        return {
            "id": str(self.id),
            "title": self.title,
            "slug": self.slug,
            "description": self.description,
            "image_url": str(self.image_url) if self.image_url else None,
            "post_type": self.post_type,
            "author_name": self.author_name,
            "published_at": self.published_at.isoformat() if self.published_at else None,
            "view_count": self.view_count,
            "featured": self.featured
        }
    
    def to_detail_dict(self) -> dict:
        """Return detailed dictionary including content"""
        base_dict = self.to_public_dict()
        base_dict.update({
            "content": self.content,
            "meta_title": self.meta_title,
            "meta_description": self.meta_description,
        })
        return base_dict