from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from typing import Optional, List
import secrets
from datetime import datetime

from app.models.blog import BlogPost, PostType, PostStatus
from app.schemas.blog import (
    BlogPostCreate,
    BlogPostUpdate,
    BlogPostResponse,
    BlogPostDetailResponse,
    BlogPostListResponse
)
from app.core.config import settings

router = APIRouter()
security = HTTPBasic()


def verify_admin_credentials(credentials: HTTPBasicCredentials = Depends(security)):
    """Verify admin credentials for blog management"""
    is_correct_username = secrets.compare_digest(credentials.username, settings.ADMIN_USERNAME)
    is_correct_password = secrets.compare_digest(credentials.password, settings.ADMIN_PASSWORD)

    if not (is_correct_username and is_correct_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid admin credentials",
            headers={"WWW-Authenticate": "Basic"},
        )
    return credentials


# Public endpoints
@router.get("/posts", response_model=BlogPostListResponse)
async def get_published_posts(
        post_type: Optional[PostType] = None,
        page: int = Query(1, ge=1),
        limit: int = Query(10, ge=1, le=50),
        featured_only: bool = False
):
    """Get published blog posts and press releases"""

    # Build query
    query = {"status": PostStatus.PUBLISHED}
    if post_type:
        query["post_type"] = post_type
    if featured_only:
        query["featured"] = True

    # Calculate skip
    skip = (page - 1) * limit

    # Get posts
    posts = await BlogPost.find(query).sort([("published_at", -1)]).skip(skip).limit(limit).to_list()
    total = await BlogPost.find(query).count()

    # Calculate pagination
    pages = (total + limit - 1) // limit
    has_next = page < pages
    has_prev = page > 1

    return BlogPostListResponse(
        posts=[
            BlogPostResponse(
                id=str(post.id),
                title=post.title,
                slug=post.slug,
                description=post.description,
                image_url=str(post.image_url) if post.image_url else None,
                post_type=post.post_type,
                status=post.status,
                author_name=post.author_name,
                published_at=post.published_at,
                view_count=post.view_count,
                featured=post.featured,
                created_at=post.created_at,
                updated_at=post.updated_at
            )
            for post in posts
        ],
        total=total,
        page=page,
        pages=pages,
        has_next=has_next,
        has_prev=has_prev
    )


@router.get("/posts/{slug}", response_model=BlogPostDetailResponse)
async def get_post_by_slug(slug: str):
    """Get a specific post by slug"""

    post = await BlogPost.find_one({"slug": slug, "status": PostStatus.PUBLISHED})
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )

    # Increment view count
    post.increment_views()
    await post.save()

    return BlogPostDetailResponse(
        id=str(post.id),
        title=post.title,
        slug=post.slug,
        description=post.description,
        content=post.content,
        image_url=str(post.image_url) if post.image_url else None,
        post_type=post.post_type,
        status=post.status,
        author_name=post.author_name,
        published_at=post.published_at,
        view_count=post.view_count,
        featured=post.featured,
        created_at=post.created_at,
        updated_at=post.updated_at,
        meta_title=post.meta_title,
        meta_description=post.meta_description
    )


# Admin endpoints
@router.post("/admin/posts", response_model=BlogPostResponse)
async def create_post(
        post_data: BlogPostCreate,
        credentials: HTTPBasicCredentials = Depends(verify_admin_credentials)
):
    """Create a new blog post or press release"""

    # Generate slug
    slug = post_data.generate_slug()

    # Check if slug already exists
    existing_post = await BlogPost.find_one({"slug": slug})
    if existing_post:
        # Append timestamp to make it unique
        slug = f"{slug}-{int(datetime.utcnow().timestamp())}"

    # Create post
    post = BlogPost(
        title=post_data.title,
        slug=slug,
        description=post_data.description,
        content=post_data.content,
        image_url=post_data.image_url,
        post_type=post_data.post_type,
        meta_title=post_data.meta_title,
        meta_description=post_data.meta_description,
        author_name=post_data.author_name,
        author_email=post_data.author_email,
        featured=post_data.featured,
        status= PostStatus.PUBLISHED,
    )

    await post.insert()

    return BlogPostResponse(
        id=str(post.id),
        title=post.title,
        slug=post.slug,
        description=post.description,
        image_url=str(post.image_url) if post.image_url else None,
        post_type=post.post_type,
        status=post.status,
        author_name=post.author_name,
        published_at=post.published_at,
        view_count=post.view_count,
        featured=post.featured,
        created_at=post.created_at,
        updated_at=post.updated_at
    )


@router.get("/admin/posts", response_model=BlogPostListResponse)
async def get_all_posts_admin(
        post_type: Optional[PostType] = None,
        status: Optional[PostStatus] = None,
        page: int = Query(1, ge=1),
        limit: int = Query(10, ge=1, le=50),
        credentials: HTTPBasicCredentials = Depends(verify_admin_credentials)
):
    """Get all posts for admin (including drafts)"""

    # Build query
    query = {}
    if post_type:
        query["post_type"] = post_type
    if status:
        query["status"] = status

    # Calculate skip
    skip = (page - 1) * limit

    # Get posts
    posts = await BlogPost.find(query).sort([("created_at", -1)]).skip(skip).limit(limit).to_list()
    total = await BlogPost.find(query).count()

    # Calculate pagination
    pages = (total + limit - 1) // limit
    has_next = page < pages
    has_prev = page > 1

    return BlogPostListResponse(
        posts=[
            BlogPostResponse(
                id=str(post.id),
                title=post.title,
                slug=post.slug,
                description=post.description,
                image_url=str(post.image_url) if post.image_url else None,
                post_type=post.post_type,
                status=post.status,
                author_name=post.author_name,
                published_at=post.published_at,
                view_count=post.view_count,
                featured=post.featured,
                created_at=post.created_at,
                updated_at=post.updated_at
            )
            for post in posts
        ],
        total=total,
        page=page,
        pages=pages,
        has_next=has_next,
        has_prev=has_prev
    )


@router.put("/admin/posts/{post_id}", response_model=BlogPostResponse)
async def update_post(
        post_id: str,
        post_data: BlogPostUpdate,
        credentials: HTTPBasicCredentials = Depends(verify_admin_credentials)
):
    """Update a blog post"""

    post = await BlogPost.get(post_id)
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )

    # Update fields
    update_data = post_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(post, field, value)

    # Update slug if title changed
    if post_data.title:
        new_slug = post_data.generate_slug() if hasattr(post_data, 'generate_slug') else post.slug
        if new_slug != post.slug:
            # Check if new slug exists
            existing_post = await BlogPost.find_one({"slug": new_slug, "id": {"$ne": post.id}})
            if not existing_post:
                post.slug = new_slug

    post.updated_at = datetime.utcnow()
    await post.save()

    return BlogPostResponse(
        id=str(post.id),
        title=post.title,
        slug=post.slug,
        description=post.description,
        image_url=str(post.image_url) if post.image_url else None,
        post_type=post.post_type,
        status=post.status,
        author_name=post.author_name,
        published_at=post.published_at,
        view_count=post.view_count,
        featured=post.featured,
        created_at=post.created_at,
        updated_at=post.updated_at
    )


@router.post("/admin/posts/{post_id}/publish")
async def publish_post(
        post_id: str,
        credentials: HTTPBasicCredentials = Depends(verify_admin_credentials)
):
    """Publish a blog post"""

    post = await BlogPost.get(post_id)
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )

    post.publish()
    await post.save()

    return {"message": "Post published successfully"}


@router.post("/admin/posts/{post_id}/unpublish")
async def unpublish_post(
        post_id: str,
        credentials: HTTPBasicCredentials = Depends(verify_admin_credentials)
):
    """Unpublish a blog post"""

    post = await BlogPost.get(post_id)
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )

    post.unpublish()
    await post.save()

    return {"message": "Post unpublished successfully"}


@router.delete("/admin/posts/{post_id}")
async def delete_post(
        post_id: str,
        credentials: HTTPBasicCredentials = Depends(verify_admin_credentials)
):
    """Delete a blog post"""

    post = await BlogPost.get(post_id)
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )

    await post.delete()

    return {"message": "Post deleted successfully"}