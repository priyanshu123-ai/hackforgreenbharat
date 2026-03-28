import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { AuthContext } from "../components/context/context";
import { serverUrl } from "../config";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import {
  Heart,
  MessageCircle,
  Trash2,
  Send,
  Plus,
  X,
  Car,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  MapPin,
  Calendar,
  Users,
  Globe,
} from "lucide-react";

// ─── helpers ────────────────────────────────────────────────────────────────
const API = `${serverUrl}/api/v11`;

const getToken = () => {
  const u = JSON.parse(localStorage.getItem("user"));
  return u?.token || u?.accessToken || null;
};

const authHeaders = () => ({ Authorization: `Bearer ${getToken()}` });

const timeAgo = (date) => {
  const diff = (Date.now() - new Date(date)) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const avatarLetter = (name) => (name ? name.charAt(0).toUpperCase() : "?");

// ─── sub-components ──────────────────────────────────────────────────────────

const Avatar = ({ src, name, size = 40 }) =>
  src ? (
    <img
      src={src}
      alt={name}
      style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover" }}
    />
  ) : (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "linear-gradient(135deg,#22c55e,#14b8a6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 700,
        fontSize: size * 0.4,
        color: "#0a0f0d",
        flexShrink: 0,
      }}
    >
      {avatarLetter(name)}
    </div>
  );

const RideBadge = () => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      background: "rgba(59,130,246,0.15)",
      border: "1px solid rgba(59,130,246,0.35)",
      color: "#60a5fa",
      padding: "2px 10px",
      borderRadius: 20,
      fontSize: 11,
      fontWeight: 600,
      marginBottom: 8,
    }}
  >
    <Car size={12} />
    Ride Share
  </span>
);

// ─── CreatePostModal ─────────────────────────────────────────────────────────

const CreatePostModal = ({ user, onCreated, onClose }) => {
  const [text, setText] = useState("");
  const [postType, setPostType] = useState("thought");
  const [rideFrom, setRideFrom] = useState("");
  const [rideTo, setRideTo] = useState("");
  const [rideDate, setRideDate] = useState("");
  const [seats, setSeats] = useState(1);
  const [loading, setLoading] = useState(false);
  const textRef = useRef(null);

  useEffect(() => textRef.current?.focus(), []);

  const handleSubmit = async () => {
    if (!text.trim()) return toast.error("Please write something!");
    setLoading(true);
    try {
      const payload = {
        text,
        postType,
        ...(postType === "rideshare" && {
          rideDetails: { from: rideFrom, to: rideTo, date: rideDate, seats },
        }),
      };
      const res = await axios.post(`${API}/post`, payload, {
        headers: authHeaders(),
      });
      onCreated(res.data.post);
      toast.success("Post shared! 🌿");
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={overlay}>
      <div style={modalBox}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ margin: 0, color: "#fff", fontSize: 18, fontWeight: 700 }}>Create Post</h2>
          <button onClick={onClose} style={iconBtn}>
            <X size={18} />
          </button>
        </div>

        {/* Type toggle */}
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          {[
            { val: "thought", label: "💬 Thought", icon: Lightbulb },
            { val: "rideshare", label: "🚗 Ride Share", icon: Car },
          ].map(({ val, label }) => (
            <button
              key={val}
              onClick={() => setPostType(val)}
              style={{
                ...typeBtn,
                background: postType === val ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.05)",
                borderColor: postType === val ? "#22c55e" : "rgba(255,255,255,0.1)",
                color: postType === val ? "#22c55e" : "#9ca3af",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Author row */}
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 14 }}>
          <Avatar src={user?.profile?.profilePhoto} name={user?.name} size={40} />
          <span style={{ color: "#d1fae5", fontWeight: 600, fontSize: 14 }}>{user?.name}</span>
        </div>

        {/* Text area */}
        <textarea
          ref={textRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={postType === "rideshare" ? "Describe your ride — route, timing, cost split…" : "Share your eco thought, tip, or experience…"}
          maxLength={1000}
          style={textArea}
        />
        <div style={{ textAlign: "right", fontSize: 11, color: "#6b7280", marginBottom: 12 }}>
          {text.length}/1000
        </div>

        {/* Ride details */}
        {postType === "rideshare" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
            <div style={fieldWrap}>
              <MapPin size={13} color="#22c55e" />
              <input
                placeholder="From"
                value={rideFrom}
                onChange={(e) => setRideFrom(e.target.value)}
                style={fieldInput}
              />
            </div>
            <div style={fieldWrap}>
              <MapPin size={13} color="#14b8a6" />
              <input
                placeholder="To"
                value={rideTo}
                onChange={(e) => setRideTo(e.target.value)}
                style={fieldInput}
              />
            </div>
            <div style={fieldWrap}>
              <Calendar size={13} color="#22c55e" />
              <input
                type="date"
                value={rideDate}
                onChange={(e) => setRideDate(e.target.value)}
                style={{ ...fieldInput, colorScheme: "dark" }}
              />
            </div>
            <div style={fieldWrap}>
              <Users size={13} color="#14b8a6" />
              <input
                type="number"
                min={1}
                max={10}
                placeholder="Seats"
                value={seats}
                onChange={(e) => setSeats(e.target.value)}
                style={fieldInput}
              />
            </div>
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            ...primaryBtn,
            width: "100%",
            opacity: loading ? 0.7 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Posting…" : "Share Post 🌱"}
        </button>
      </div>
    </div>
  );
};

// ─── CommentSection ──────────────────────────────────────────────────────────

const CommentSection = ({ postId, initialComments, user }) => {
  const [comments, setComments] = useState(initialComments || []);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post(
        `${API}/comment/${postId}`,
        { text },
        { headers: authHeaders() }
      );
      setComments(res.data.comments);
      setText("");
    } catch {
      toast.error("Login to comment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 12, marginTop: 12 }}>
      {comments.map((c, i) => (
        <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
          <Avatar src={c.author?.profile?.profilePhoto} name={c.author?.name} size={28} />
          <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 10, padding: "6px 12px", flex: 1 }}>
            <span style={{ color: "#22c55e", fontSize: 12, fontWeight: 600 }}>{c.author?.name} </span>
            <span style={{ color: "#d1d5db", fontSize: 13 }}>{c.text}</span>
          </div>
        </div>
      ))}

      {user && (
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 8 }}>
          <Avatar src={user?.profile?.profilePhoto} name={user?.name} size={28} />
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="Write a comment…"
            style={{
              flex: 1,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 20,
              padding: "7px 14px",
              color: "#fff",
              fontSize: 13,
              outline: "none",
            }}
          />
          <button
            onClick={submit}
            disabled={loading}
            style={{
              background: "linear-gradient(135deg,#22c55e,#14b8a6)",
              border: "none",
              borderRadius: "50%",
              width: 34,
              height: 34,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            <Send size={14} color="#0a0f0d" />
          </button>
        </div>
      )}
    </div>
  );
};

// ─── PostCard ────────────────────────────────────────────────────────────────

const PostCard = ({ post, user, onDelete }) => {
  const [liked, setLiked] = useState(
    post.likes?.some((id) => id === user?._id || id?.toString() === user?._id)
  );
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
  const [showComments, setShowComments] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const toggleLike = async () => {
    if (!user) return toast.error("Login to like posts");
    try {
      const res = await axios.put(`${API}/like/${post._id}`, {}, { headers: authHeaders() });
      setLiked(res.data.liked);
      setLikeCount(res.data.likes);
    } catch {
      toast.error("Failed to like");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this post?")) return;
    setDeleting(true);
    try {
      await axios.delete(`${API}/post/${post._id}`, { headers: authHeaders() });
      onDelete(post._id);
      toast.success("Post deleted");
    } catch {
      toast.error("Failed to delete");
      setDeleting(false);
    }
  };

  const isOwner = user && post.author?._id === user._id;

  return (
    <div style={card}>
      {/* Author row */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <Avatar src={post.author?.profile?.profilePhoto} name={post.author?.name} size={44} />
        <div style={{ flex: 1 }}>
          <div style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>{post.author?.name}</div>
          <div style={{ color: "#6b7280", fontSize: 12 }}>{timeAgo(post.createdAt)}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {post.postType === "rideshare" ? (
            <Car size={16} color="#60a5fa" />
          ) : (
            <Globe size={16} color="#22c55e" />
          )}
          {isOwner && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              style={{ ...iconBtn, color: "#ef4444" }}
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Badge */}
      {post.postType === "rideshare" && <RideBadge />}

      {/* Text */}
      <p style={{ color: "#e5e7eb", fontSize: 14, lineHeight: 1.65, margin: "0 0 12px" }}>
        {post.text}
      </p>

      {/* Ride details */}
      {post.postType === "rideshare" && post.rideDetails?.from && (
        <div style={rideCard}>
          <div style={rideRow}>
            <MapPin size={13} color="#22c55e" />
            <span style={{ color: "#d1d5db", fontSize: 13 }}>
              <b style={{ color: "#9ca3af" }}>From:</b> {post.rideDetails.from}
            </span>
          </div>
          <div style={rideRow}>
            <MapPin size={13} color="#14b8a6" />
            <span style={{ color: "#d1d5db", fontSize: 13 }}>
              <b style={{ color: "#9ca3af" }}>To:</b> {post.rideDetails.to}
            </span>
          </div>
          {post.rideDetails.date && (
            <div style={rideRow}>
              <Calendar size={13} color="#a78bfa" />
              <span style={{ color: "#d1d5db", fontSize: 13 }}>
                <b style={{ color: "#9ca3af" }}>Date:</b> {post.rideDetails.date}
              </span>
            </div>
          )}
          {post.rideDetails.seats && (
            <div style={rideRow}>
              <Users size={13} color="#f59e0b" />
              <span style={{ color: "#d1d5db", fontSize: 13 }}>
                <b style={{ color: "#9ca3af" }}>Seats:</b> {post.rideDetails.seats}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <button
          onClick={toggleLike}
          style={{
            ...actionBtn,
            color: liked ? "#ef4444" : "#6b7280",
          }}
        >
          <Heart size={16} fill={liked ? "#ef4444" : "none"} stroke={liked ? "#ef4444" : "#6b7280"} />
          <span>{likeCount}</span>
        </button>

        <button
          onClick={() => setShowComments((s) => !s)}
          style={{ ...actionBtn, color: "#6b7280" }}
        >
          <MessageCircle size={16} />
          <span>{post.comments?.length || 0}</span>
          {showComments ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {/* Comments */}
      {showComments && (
        <CommentSection
          postId={post._id}
          initialComments={post.comments || []}
          user={user}
        />
      )}
    </div>
  );
};

// ─── Main Page ───────────────────────────────────────────────────────────────

const Community = () => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);

  const fetchPosts = async (type = "all") => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/posts`, { params: { type } });
      setPosts(res.data.posts || []);
    } catch {
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(filter);
  }, [filter]);

  const handleCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const handleDelete = (id) => {
    setPosts((prev) => prev.filter((p) => p._id !== id));
  };

  return (
    <div style={pageWrap}>
      <Navbar />
      <div style={pageInner}>
        {/* Hero */}
        <div style={hero}>
          <div style={heroBadge}>
            <span>🌿</span> EcoSense Community
          </div>
          <h1 style={heroTitle}>Connect. Share. Inspire.</h1>
          <p style={heroSub}>
            Share your eco thoughts, green tips, and find ride-share partners to reduce your carbon footprint together.
          </p>
        </div>

        {/* Toolbar */}
        <div style={toolbar}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[
              { val: "all", label: "🌍 All Posts" },
              { val: "thought", label: "💬 Thoughts" },
              { val: "rideshare", label: "🚗 Ride Share" },
            ].map(({ val, label }) => (
              <button
                key={val}
                onClick={() => setFilter(val)}
                style={{
                  ...filterChip,
                  background: filter === val ? "rgba(34,197,94,0.18)" : "rgba(255,255,255,0.05)",
                  borderColor: filter === val ? "#22c55e" : "rgba(255,255,255,0.1)",
                  color: filter === val ? "#22c55e" : "#9ca3af",
                  fontWeight: filter === val ? 700 : 500,
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {user && (
            <button onClick={() => setShowModal(true)} style={primaryBtn}>
              <Plus size={16} />
              New Post
            </button>
          )}
        </div>

        {/* Feed */}
        {loading ? (
          <div style={centerMsg}>
            <div style={spinner} />
            <p style={{ color: "#6b7280", marginTop: 16 }}>Loading community…</p>
          </div>
        ) : posts.length === 0 ? (
          <div style={centerMsg}>
            <div style={{ fontSize: 48 }}>🌱</div>
            <p style={{ color: "#6b7280", marginTop: 12, fontSize: 15 }}>
              No posts yet — be the first to share!
            </p>
            {user && (
              <button onClick={() => setShowModal(true)} style={{ ...primaryBtn, marginTop: 16 }}>
                <Plus size={16} /> Create Post
              </button>
            )}
          </div>
        ) : (
          <div style={feed}>
            {posts.map((p) => (
              <PostCard key={p._id} post={p} user={user} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <CreatePostModal
          user={user}
          onCreated={handleCreated}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default Community;

// ─── Styles ───────────────────────────────────────────────────────────────────

const pageWrap = {
  minHeight: "100vh",
  background: "#0a0f0d",
  fontFamily: "'Inter', 'Segoe UI', sans-serif",
};

const pageInner = {
  maxWidth: 720,
  margin: "0 auto",
  padding: "100px 16px 60px",
};

const hero = {
  textAlign: "center",
  marginBottom: 40,
};

const heroBadge = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  background: "rgba(34,197,94,0.1)",
  border: "1px solid rgba(34,197,94,0.25)",
  borderRadius: 30,
  padding: "5px 16px",
  fontSize: 12,
  color: "#22c55e",
  fontWeight: 600,
  marginBottom: 16,
  letterSpacing: "0.04em",
};

const heroTitle = {
  margin: "0 0 12px",
  fontSize: "clamp(26px, 5vw, 40px)",
  fontWeight: 800,
  background: "linear-gradient(135deg,#22c55e,#14b8a6,#3b82f6)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
};

const heroSub = {
  margin: 0,
  color: "#9ca3af",
  fontSize: 15,
  lineHeight: 1.6,
  maxWidth: 480,
  marginInline: "auto",
};

const toolbar = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  flexWrap: "wrap",
  marginBottom: 28,
};

const filterChip = {
  border: "1px solid",
  borderRadius: 20,
  padding: "6px 16px",
  fontSize: 13,
  cursor: "pointer",
  transition: "all 0.2s",
};

const primaryBtn = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  background: "linear-gradient(135deg,#22c55e,#14b8a6)",
  border: "none",
  borderRadius: 10,
  padding: "9px 20px",
  color: "#0a0f0d",
  fontWeight: 700,
  fontSize: 14,
  cursor: "pointer",
  whiteSpace: "nowrap",
};

const feed = {
  display: "flex",
  flexDirection: "column",
  gap: 16,
};

const card = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 16,
  padding: "20px",
  transition: "border-color 0.2s, box-shadow 0.2s",
};

const actionBtn = {
  display: "inline-flex",
  alignItems: "center",
  gap: 5,
  background: "none",
  border: "none",
  cursor: "pointer",
  fontSize: 13,
  padding: "4px 8px",
  borderRadius: 8,
  transition: "background 0.15s",
};

const rideCard = {
  background: "rgba(59,130,246,0.07)",
  border: "1px solid rgba(59,130,246,0.18)",
  borderRadius: 10,
  padding: "10px 14px",
  marginBottom: 14,
  display: "flex",
  flexDirection: "column",
  gap: 6,
};

const rideRow = {
  display: "flex",
  alignItems: "center",
  gap: 8,
};

const iconBtn = {
  background: "none",
  border: "none",
  cursor: "pointer",
  color: "#6b7280",
  display: "flex",
  alignItems: "center",
  padding: 4,
  borderRadius: 6,
  transition: "color 0.15s",
};

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.7)",
  backdropFilter: "blur(6px)",
  zIndex: 1000,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 16,
};

const modalBox = {
  background: "#0f1917",
  border: "1px solid rgba(34,197,94,0.2)",
  borderRadius: 20,
  padding: 28,
  width: "100%",
  maxWidth: 520,
  maxHeight: "90vh",
  overflowY: "auto",
};

const textArea = {
  width: "100%",
  minHeight: 120,
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 12,
  padding: "12px 14px",
  color: "#fff",
  fontSize: 14,
  lineHeight: 1.6,
  resize: "vertical",
  outline: "none",
  boxSizing: "border-box",
};

const typeBtn = {
  flex: 1,
  border: "1px solid",
  borderRadius: 10,
  padding: "8px 12px",
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
  transition: "all 0.2s",
};

const fieldWrap = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 10,
  padding: "8px 12px",
};

const fieldInput = {
  background: "none",
  border: "none",
  outline: "none",
  color: "#fff",
  fontSize: 13,
  width: "100%",
};

const centerMsg = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "80px 20px",
  textAlign: "center",
};

const spinner = {
  width: 36,
  height: 36,
  border: "3px solid rgba(34,197,94,0.2)",
  borderTopColor: "#22c55e",
  borderRadius: "50%",
  animation: "spin 0.8s linear infinite",
};
