import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Calendar, 
  User, 
  Eye, 
  ArrowLeft,
  Share2,
  Twitter,
  Linkedin,
  Facebook,
  Link as LinkIcon
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { api } from "../services/api";
import toast from "react-hot-toast";

export default function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState([]);

  useEffect(() => {
    if (slug) {
      fetchPost();
      fetchRelatedPosts();
    }
  }, [slug]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/blog/posts/${slug}`);
      setPost(response.data);
      
      // Update page title and meta description
      document.title = response.data.meta_title || response.data.title;
      if (response.data.meta_description) {
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
          metaDescription.setAttribute('content', response.data.meta_description);
        }
      }
    } catch (error) {
      console.error("Failed to fetch blog post:", error);
      if (error.response?.status === 404) {
        toast.error("Blog post not found");
        navigate('/blog');
      } else {
        toast.error("Failed to load blog post");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedPosts = async () => {
    try {
      const response = await api.get("/blog/posts?post_type=blog&limit=3");
      setRelatedPosts(response.data.posts.filter(p => p.slug !== slug));
    } catch (error) {
      console.error("Failed to fetch related posts:", error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = post.title;
    
    let shareUrl = '';
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard!');
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-neutral-900 mb-4">Post not found</h1>
            <button
              onClick={() => navigate('/blog')}
              className="btn-primary"
            >
              Back to Blog
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate('/blog')}
          className="flex items-center text-blue-600 hover:text-blue-700 mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Blog
        </button>

        {/* Article Header */}
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6 leading-tight">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-neutral-600 mb-6">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              {formatDate(post.published_at)}
            </div>
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              {post.author_name}
            </div>
            <div className="flex items-center">
              <Eye className="h-4 w-4 mr-2" />
              {post.view_count} views
            </div>
          </div>

          {/* Featured Image */}
          {post.image_url && (
            <div className="mb-8">
              <img
                src={post.image_url}
                alt={post.title}
                className="w-full h-64 md:h-96 object-cover rounded-xl shadow-lg"
              />
            </div>
          )}

          {/* Share Buttons */}
          <div className="flex items-center space-x-4 py-4 border-y border-neutral-200">
            <span className="text-sm font-medium text-neutral-700">Share:</span>
            <button
              onClick={() => handleShare('twitter')}
              className="p-2 text-neutral-600 hover:text-blue-400 transition-colors"
              title="Share on Twitter"
            >
              <Twitter className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleShare('linkedin')}
              className="p-2 text-neutral-600 hover:text-blue-600 transition-colors"
              title="Share on LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleShare('facebook')}
              className="p-2 text-neutral-600 hover:text-blue-800 transition-colors"
              title="Share on Facebook"
            >
              <Facebook className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleShare('copy')}
              className="p-2 text-neutral-600 hover:text-neutral-800 transition-colors"
              title="Copy link"
            >
              <LinkIcon className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Article Content */}
        <div 
          className="prose prose-lg max-w-none mb-12"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="border-t border-neutral-200 pt-12">
            <h2 className="text-2xl font-bold text-neutral-900 mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.slice(0, 3).map((relatedPost) => (
                <article
                  key={relatedPost.id}
                  className="group cursor-pointer"
                  onClick={() => navigate(`/blog/${relatedPost.slug}`)}
                >
                  {relatedPost.image_url && (
                    <img
                      src={relatedPost.image_url}
                      alt={relatedPost.title}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                  )}
                  <h3 className="font-semibold text-neutral-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {relatedPost.title}
                  </h3>
                  <p className="text-sm text-neutral-600 line-clamp-2">
                    {relatedPost.description}
                  </p>
                </article>
              ))}
            </div>
          </section>
        )}
      </article>

      <Footer />
    </div>
  );
}