import { useState } from "react";

function TaskManager() {
  const [users, setUsers] = useState([]);
  const [showCard, setShowCard] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [editId, setEditId] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (!formData.name || !formData.email) {
      alert("All fields required");
      return;
    }

    if (editId !== null) {
      setUsers(
        users.map((user) =>
          user.id === editId ? { ...user, ...formData } : user
        )
      );
      setEditId(null);
    } else {
      const newUser = {
        id: Date.now(),
        ...formData,
      };
      setUsers([...users, newUser]);
    }

    setFormData({ name: "", email: "" });
    setShowCard(false);
  };

  const handleEdit = (user) => {
    setFormData({ name: user.name, email: user.email });
    setEditId(user.id);
    setShowCard(true);
  };

  const handleDelete = (id) => {
    setUsers(users.filter((user) => user.id !== id));
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
          {users.map((user, index) => (
            <tr key={user.id}>
              <td>{index + 1}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <button
                  className="edit-btn"
                  onClick={() => handleEdit(user)}
                >
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(user.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TaskManager;
