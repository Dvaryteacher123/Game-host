import { useState, useEffect } from 'react';
import { db, storage } from '../../firebase/config';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';
import { Game } from '../../types';

const Games = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<Partial<Game>>({
    title: '',
    description: '',
    category: '',
    version: '',
    size: '',
    androidVersion: '',
    publisher: '',
    releaseDate: '',
    downloadLink: '',
    featured: false,
    published: true,
  });
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [screenshots, setScreenshots] = useState<File[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchGames = async () => {
    const snapshot = await getDocs(collection(db, 'games'));
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Game[];
    setGames(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let coverUrl = '';
      let screenshotUrls: string[] = [];
      if (coverFile) {
        const coverRef = ref(storage, `games/${Date.now()}_cover`);
        await uploadBytes(coverRef, coverFile);
        coverUrl = await getDownloadURL(coverRef);
      }
      if (screenshots.length) {
        for (const file of screenshots) {
          const ref = ref(storage, `games/${Date.now()}_screenshot`);
          await uploadBytes(ref, file);
          const url = await getDownloadURL(ref);
          screenshotUrls.push(url);
        }
      }
      const gameData = {
        ...formData,
        coverImage: coverUrl,
        screenshots: screenshotUrls,
        views: 0,
        downloads: 0,
        rating: 0,
        createdAt: new Date(),
      };
      if (editingId) {
        await updateDoc(doc(db, 'games', editingId), gameData);
        toast.success('Game updated');
      } else {
        await addDoc(collection(db, 'games'), gameData);
        toast.success('Game added');
      }
      resetForm();
      fetchGames();
    } catch (error) {
      toast.error('Error saving game');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      version: '',
      size: '',
      androidVersion: '',
      publisher: '',
      releaseDate: '',
      downloadLink: '',
      featured: false,
      published: true,
    });
    setCoverFile(null);
    setScreenshots([]);
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this game?')) {
      await deleteDoc(doc(db, 'games', id));
      toast.success('Game deleted');
      fetchGames();
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Games</h1>
        <button
          onClick={() => resetForm()}
          className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition"
        >
          + Add Game
        </button>
      </div>

      <form onSubmit={handleSubmit} className="glass p-6 rounded-2xl mb-8 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="p-2 bg-white/5 rounded border border-white/10"
            required
          />
          <input
            type="text"
            placeholder="Category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="p-2 bg-white/5 rounded border border-white/10"
            required
          />
          <input
            type="text"
            placeholder="Version"
            value={formData.version}
            onChange={(e) => setFormData({ ...formData, version: e.target.value })}
            className="p-2 bg-white/5 rounded border border-white/10"
          />
          <input
            type="text"
            placeholder="Size (e.g., 2.5 GB)"
            value={formData.size}
            onChange={(e) => setFormData({ ...formData, size: e.target.value })}
            className="p-2 bg-white/5 rounded border border-white/10"
          />
          <input
            type="text"
            placeholder="Android Version"
            value={formData.androidVersion}
            onChange={(e) => setFormData({ ...formData, androidVersion: e.target.value })}
            className="p-2 bg-white/5 rounded border border-white/10"
          />
          <input
            type="text"
            placeholder="Publisher"
            value={formData.publisher}
            onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
            className="p-2 bg-white/5 rounded border border-white/10"
          />
          <input
            type="date"
            placeholder="Release Date"
            value={formData.releaseDate}
            onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
            className="p-2 bg-white/5 rounded border border-white/10"
          />
          <input
            type="url"
            placeholder="Download Link"
            value={formData.downloadLink}
            onChange={(e) => setFormData({ ...formData, downloadLink: e.target.value })}
            className="p-2 bg-white/5 rounded border border-white/10"
          />
        </div>
        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full p-2 bg-white/5 rounded border border-white/10"
          rows={4}
        />
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            />
            Featured
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
            />
            Published
          </label>
        </div>
        <div className="flex gap-4">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
          />
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setScreenshots(Array.from(e.target.files || []))}
          />
        </div>
        <button
          type="submit"
          className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:scale-105 transition"
        >
          {editingId ? 'Update' : 'Add'} Game
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {games.map((game) => (
          <div key={game.id} className="glass p-4 rounded-xl border border-white/10">
            <img src={game.coverImage} alt={game.title} className="w-full h-40 object-cover rounded" />
            <h3 className="text-lg font-semibold mt-2">{game.title}</h3>
            <p className="text-sm text-white/50">{game.category}</p>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => {
                  setEditingId(game.id);
                  setFormData(game);
                }}
                className="px-3 py-1 bg-blue-600 rounded text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(game.id)}
                className="px-3 py-1 bg-red-600 rounded text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
};

export default Games;
