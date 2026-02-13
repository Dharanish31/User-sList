import { useState, useEffect } from "react";

const API_URL = "http://localhost:5000";

function TaskManager() {
  const [users, setUsers] = useState([]);
  const [showCard, setShowCard] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch users from backend on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/users`);
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
      alert("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!formData.name || !formData.email) {
      alert("All fields required");
      return;
    }

    try {
      setLoading(true);
      if (editId !== null) {
        // Update existing user
        const response = await fetch(`${API_URL}/users/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const updatedUser = await response.json();
        setUsers(users.map((user) => (user._id === editId ? updatedUser : user)));
        setEditId(null);
      } else {
        // Create new user
        const response = await fetch(`${API_URL}/users`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const newUser = await response.json();
        setUsers([...users, newUser]);
      }

      setFormData({ name: "", email: "" });
      setShowCard(false);
    } catch (err) {
      console.error("Error saving user:", err);
      alert("Failed to save user");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setFormData({ name: user.name, email: user.email });
    setEditId(user._id);
    setShowCard(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    
    try {
      setLoading(true);
      await fetch(`${API_URL}/users/${id}`, { method: "DELETE" });
      setUsers(users.filter((user) => user._id !== id));
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>📋 User's List 📋</h1>

      <button className="create-btn" onClick={() => setShowCard(true)}>
        Create
      </button>

      {showCard && (
        <div className="overlay">
          <div className="card">
            <h2>{editId ? "Edit User" : "Create User"}</h2>

            <input
              type="text"
              name="name"
              placeholder="Enter Name"
              value={formData.name}
              onChange={handleChange}
            />

            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleChange}
            />

            <div className="card-buttons">
              <button className="save-btn" onClick={handleSave}>
                Save
              </button>
              <button
                className="cancel-btn"
                onClick={() => setShowCard(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>Loading...</td>
            </tr>
          ) : users.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>No users found</td>
            </tr>
          ) : (
            users.map((user, index) => (
              <tr key={user._id}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(user)}
                    disabled={loading}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(user._id)}
                    disabled={loading}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TaskManager;
