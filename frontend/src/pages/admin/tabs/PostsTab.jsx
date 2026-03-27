import { useState, useEffect } from "react";
import { FileText, Plus, Edit, EyeOff, Eye, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "../../../services/api";

export default function PostsTab({ type }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    image_url: "",
    post_type: type, // "blog" or "press_release"
    author_name: "Admin",
    featured: false,
  });

  const displayType = type === "blog" ? "Blog Post" : "Press Release";
  const displayTypePlural = type === "blog" ? "Blog Posts" : "Press Releases";

  useEffect(() => {
    fetchPosts();
  }, [type]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/blog/admin/posts?post_type=${type}`);
      setPosts(data.posts);
    } catch (error) {
      console.error(`Error fetching ${displayTypePlural}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingPost ? `/blog/admin/posts/${editingPost.id}` : "/blog/admin/posts";
      if (editingPost) await api.put(url, formData);
      else await api.post(url, formData);

      toast.success(`${editingPost ? "Updated" : "Created"} ${displayType} successfully`);
      setShowForm(false);
      setEditingPost(null);
      setFormData({ title: "", description: "", content: "", image_url: "", post_type: type, author_name: "Admin", featured: false });
      fetchPosts();
    } catch {
      toast.error(`Failed to ${editingPost ? "update" : "create"} ${displayType}`);
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      description: post.description,
      content: post.content || "",
      image_url: post.image_url || "",
      post_type: post.post_type,
      author_name: post.author_name,
      featured: post.featured,
    });
    setShowForm(true);
  };

  const handleDelete = async (postId) => {
    if (!confirm(`Are you sure you want to delete this ${displayType.toLowerCase()}?`)) return;
    try {
      await api.delete(`/blog/admin/posts/${postId}`);
      toast.success(`${displayType} deleted successfully`);
      fetchPosts();
    } catch {
      toast.error(`Failed to delete ${displayType.toLowerCase()}`);
    }
  };

  const handlePublishToggle = async (post) => {
    const action = post.status === "published" ? "unpublish" : "publish";
    try {
      await api.post(`/blog/admin/posts/${post.id}/${action}`);
      toast.success(`Post ${action}ed successfully`);
      fetchPosts();
    } catch {
      toast.error(`Failed to ${action} post`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-neutral-900">{displayTypePlural}</h2>
          <button
            onClick={() => {
              setFormData({ title: "", description: "", content: "", image_url: "", post_type: type, author_name: "Admin", featured: false });
              setEditingPost(null);
              setShowForm(true);
            }}
            className="btn-primary flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" /> Create {displayType}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="card">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-2">
                  <h3 className="font-semibold text-neutral-900">{post.title}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${post.status === "published" ? "bg-success-100 text-success-800" : "bg-warning-100 text-warning-800"}`}>
                    {post.status}
                  </span>
                  {post.featured && <span className="px-2 py-1 text-xs font-medium rounded-full bg-teal-100 text-teal-800">Featured</span>}
                </div>
                <p className="text-neutral-600 text-sm mb-2">{post.description}</p>
                <div className="flex items-center space-x-4 text-xs text-neutral-500">
                  <span>By {post.author_name}</span>
                  <span>{new Date(post.created_at).toLocaleDateString()}</span>
                  <span>{post.view_count} views</span>
                </div>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <button onClick={() => handleEdit(post)} className="btn-outline btn-sm"><Edit className="h-4 w-4 mr-1" /> Edit</button>
                <button onClick={() => handlePublishToggle(post)} className={post.status === "published" ? "btn-outline btn-sm" : "btn-primary btn-sm"}>
                  {post.status === "published" ? <><EyeOff className="h-4 w-4 mr-1" />Unpublish</> : <><Eye className="h-4 w-4 mr-1" />Publish</>}
                </button>
                <button onClick={() => handleDelete(post.id)} className="btn-outline btn-sm text-error-600 hover:bg-error-50"><Trash2 className="h-4 w-4 mr-1" /> Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-neutral-900">{editingPost ? "Edit" : "Create"} {displayType}</h2>
                <button onClick={() => setShowForm(false)} className="text-neutral-400 hover:text-neutral-600">Close</button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Title *</label>
                    <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="input" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Author Name</label>
                    <input type="text" value={formData.author_name} onChange={(e) => setFormData({ ...formData, author_name: e.target.value })} className="input" required />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Description *</label>
                  <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="input" rows={3} required />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Image URL (optional)</label>
                  <input type="url" value={formData.image_url} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} className="input" placeholder="https://example.com/image.jpg" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Content *</label>
                  <textarea value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} className="input" rows={12} placeholder="Write your content here... You can use HTML tags for formatting." required />
                </div>

                <div className="flex items-center">
                  <input type="checkbox" id="featured" checked={formData.featured} onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded" />
                  <label htmlFor="featured" className="ml-2 block text-sm text-neutral-700">Mark as featured</label>
                </div>

                <div className="flex justify-end space-x-4">
                  <button type="button" onClick={() => setShowForm(false)} className="btn-outline">Cancel</button>
                  <button type="submit" className="btn-primary">{editingPost ? "Update" : "Create"} {type === "blog" ? "Post" : "Release"}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
