"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { getAdminPosts, updatePostStatus } from "@/services/api";

interface Post {
  _id: string;
  title: string;
  content: string;
  status: "draft" | "published" | "rejected";
  createdAt: string;
  image?: string;
  createdBy?: {
    name: string;
    email: string;
  };
}

interface AdminPostsResponse {
  data: Post[];
  page: number;
  pages: number;
  total: number;
}

const STATUS_FILTERS = [
  { label: "Pending", value: "" },
  { label: "All", value: "all" },
  { label: "Published", value: "published" },
  { label: "Rejected", value: "rejected" },
  { label: "Draft", value: "draft" },
];

export default function AdminPostsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { page, limit: 10 };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;

      const data: AdminPostsResponse = await getAdminPosts(params);
      setPosts(data.data);
      setPages(data.pages);
      setTotal(data.total);
    } catch {
      showToast("Failed to load posts.", "error");
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, showToast]);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user?.role === "admin") {
      fetchPosts();
    }
  }, [fetchPosts, user]);

  const handleAction = async (postId: string, status: "published" | "rejected") => {
    setActionLoading(postId + status);
    try {
      await updatePostStatus(postId, status);
      showToast(`Post ${status === "published" ? "approved" : "rejected"} successfully.`, "success");
      fetchPosts();
    } catch {
      showToast("Action failed. Please try again.", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchPosts();
  };

  if (authLoading) {
    return (
      <div className="admin-loading">
        <span className="loading-spinner"></span>
      </div>
    );
  }

  if (!user || user.role !== "admin") return null;

  return (
    <main className="admin-container">
      <div className="admin-header">
        <h1 className="admin-title">Post Review</h1>
        <p className="admin-subtitle">{total} post{total !== 1 ? "s" : ""} found</p>
      </div>

      <div className="admin-controls">
        <form onSubmit={handleSearch} className="admin-search-form">
          <input
            type="text"
            className="form-input admin-search-input"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
          <button type="submit" className="admin-search-btn">Search</button>
        </form>

        <div className="admin-filters">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              className={`admin-filter-btn ${statusFilter === f.value ? "active" : ""}`}
              onClick={() => { setStatusFilter(f.value); setPage(1); }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="admin-loading">
          <span className="loading-spinner"></span>
        </div>
      ) : posts.length === 0 ? (
        <div className="admin-empty">No posts to review.</div>
      ) : (
        <div className="admin-posts-list">
          {posts.map((post) => (
            <div key={post._id} className="admin-post-card">
              <div className="admin-post-header">
                <span className={`admin-status-badge status-${post.status}`}>{post.status}</span>
                <span className="admin-post-date">
                  {new Date(post.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit", month: "short", year: "numeric",
                  })}
                </span>
              </div>

              <h2 className="admin-post-title">{post.title}</h2>
              <p className="admin-post-content">{post.content}</p>

              {post.createdBy && (
                <div className="admin-post-author">
                  By <strong>{post.createdBy.name}</strong> &mdash; {post.createdBy.email}
                </div>
              )}

              <div className="admin-post-actions">
                <button
                  className="admin-btn admin-btn-approve"
                  disabled={post.status === "published" || actionLoading !== null}
                  onClick={() => handleAction(post._id, "published")}
                >
                  {actionLoading === post._id + "published" ? (
                    <span className="loading-spinner"></span>
                  ) : (
                    "Approve"
                  )}
                </button>
                <button
                  className="admin-btn admin-btn-reject"
                  disabled={post.status === "rejected" || actionLoading !== null}
                  onClick={() => handleAction(post._id, "rejected")}
                >
                  {actionLoading === post._id + "rejected" ? (
                    <span className="loading-spinner"></span>
                  ) : (
                    "Reject"
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {pages > 1 && (
        <div className="admin-pagination">
          <button
            className="admin-page-btn"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            &larr; Prev
          </button>
          <span className="admin-page-info">Page {page} of {pages}</span>
          <button
            className="admin-page-btn"
            disabled={page >= pages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next &rarr;
          </button>
        </div>
      )}
    </main>
  );
}
