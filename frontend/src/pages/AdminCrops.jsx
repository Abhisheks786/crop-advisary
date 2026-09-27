import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, X, CheckCircle2, Wheat, Sparkles } from 'lucide-react';
import { getCrops, addCrop, updateCrop, deleteCrop } from '../services/cropService';
import { getCropVisuals } from '../utils/cropMedia';
import Button from '../components/UI/Button';
import ButtonGroup from '../components/UI/ButtonGroup';

const AdminCrops = () => {
  const [cropsList, setCropsList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCrop, setEditingCrop] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formState, setFormState] = useState({
    crop_name: '',
    category: 'Cereal',
    season: ['Rabi'],
    suitable_soil: ['Loamy'],
    min_ph: 6.0,
    max_ph: 7.5,
    water_requirement: 'Medium',
    risk_level: 'Low',
    crop_duration_days: 120,
    expected_yield_quintal_per_hectare: 35
  });

  const loadCrops = async () => {
    setLoading(true);
    try {
      const res = await getCrops();
      setCropsList(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to load crops:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCrops();
  }, []);

  const handleOpenAdd = () => {
    setEditingCrop(null);
    setFormState({
      crop_name: '',
      category: 'Cereal',
      season: ['Rabi'],
      suitable_soil: ['Loamy'],
      min_ph: 6.0,
      max_ph: 7.5,
      water_requirement: 'Medium',
      risk_level: 'Low',
      crop_duration_days: 120,
      expected_yield_quintal_per_hectare: 35
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (crop) => {
    setEditingCrop(crop);
    setFormState({
      crop_name: crop.crop_name || crop.name,
      category: crop.category || 'Cereal',
      season: crop.season || ['Rabi'],
      suitable_soil: crop.suitable_soil || ['Loamy'],
      min_ph: crop.min_ph || 6.0,
      max_ph: crop.max_ph || 7.5,
      water_requirement: crop.water_requirement || 'Medium',
      risk_level: crop.risk_level || 'Low',
      crop_duration_days: crop.crop_duration_days || 120,
      expected_yield_quintal_per_hectare: crop.expected_yield_quintal_per_hectare || 35
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (cropId) => {
    if (!window.confirm('Are you sure you want to deactivate this crop from recommendations?')) return;
    try {
      await deleteCrop(cropId);
      loadCrops();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleSaveCrop = async (e) => {
    e.preventDefault();
    try {
      if (editingCrop) {
        await updateCrop(editingCrop._id || editingCrop.crop_name, formState);
      } else {
        await addCrop(formState);
      }
      setIsModalOpen(false);
      loadCrops();
    } catch (err) {
      console.error('Save failed:', err);
    }
  };

  const filteredCrops = cropsList.filter(c => 
    (c.crop_name || c.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.category || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 fade-in">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FAFAF7] text-[#333320] text-[11px] font-bold border border-[#E8E6D5] mb-1">
              <span>Offline Agricultural Dataset Management</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display tracking-tight">
              Crop Master Database & Metadata
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Add, calibrate, and manage crop physiological attributes used by the scoring engine.
            </p>
          </div>

          <Button
            variant="primary"
            onClick={handleOpenAdd}
            icon={Plus}
            className="px-5 py-3 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all self-start sm:self-auto"
          >
            Add New Crop
          </Button>
        </div>

        {/* Search */}
        <div className="mt-6 pt-6 border-t border-slate-100">
          <div className="relative max-w-md">
            <Search size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by crop name or category..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:bg-white focus:border-[#5FA83D] outline-none"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="pb-3 px-4">Crop Name</th>
                <th className="pb-3 px-4">Category</th>
                <th className="pb-3 px-4">Season</th>
                <th className="pb-3 px-4">Water Requirement</th>
                <th className="pb-3 px-4">pH Window</th>
                <th className="pb-3 px-4">Yield (q/ha)</th>
                <th className="pb-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCrops.map((crop, idx) => {
                const cName = crop.crop_name || crop.name;
                const vis = getCropVisuals(cName);

                return (
                  <tr key={crop._id || idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div className="flex items-center gap-2.5">
                        <img src={vis.image} alt={cName} className="w-8 h-8 rounded-lg object-cover" />
                        <span>{vis.emoji} {cName}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      {crop.category || 'General'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 font-semibold text-slate-700">
                        {Array.isArray(crop.season) ? crop.season.join(', ') : crop.season || 'Rabi'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-sky-800 font-bold">
                      {crop.water_requirement || 'Medium'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-mono">
                      {crop.min_ph || 6.0} – {crop.max_ph || 7.5}
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-slate-900">
                      {crop.expected_yield_quintal_per_hectare || crop.expected_yield || 35}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <ButtonGroup>
                        <Button
                          variant="ghost"
                          onClick={() => handleOpenEdit(crop)}
                          className="p-1.5 rounded-lg text-[#4A4A2E] hover:bg-[#FAFAF7] transition-colors"
                          title="Edit Crop"
                        >
                          <Edit2 size={15} />
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => handleDelete(crop._id || cName)}
                          className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete Crop"
                        >
                          <Trash2 size={15} />
                        </Button>
                      </ButtonGroup>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Crop Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 font-display">
                {editingCrop ? `Edit Crop: ${formState.crop_name}` : 'Add New Crop Profile'}
              </h3>
              <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X size={18} />
              </Button>
            </div>

            <form onSubmit={handleSaveCrop} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Crop Name</label>
                <input
                  type="text"
                  required
                  value={formState.crop_name}
                  onChange={e => setFormState({ ...formState, crop_name: e.target.value })}
                  placeholder="e.g., Pearl Millet"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#5FA83D] outline-none font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Category</label>
                  <select
                    value={formState.category}
                    onChange={e => setFormState({ ...formState, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none font-medium"
                  >
                    <option value="Cereal">Cereal</option>
                    <option value="Pulse">Pulse</option>
                    <option value="Oilseed">Oilseed</option>
                    <option value="Cash Crop">Cash Crop</option>
                    <option value="Vegetable">Vegetable</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Water Need</label>
                  <select
                    value={formState.water_requirement}
                    onChange={e => setFormState({ ...formState, water_requirement: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none font-medium"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Min pH</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formState.min_ph}
                    onChange={e => setFormState({ ...formState, min_ph: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Max pH</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formState.max_ph}
                    onChange={e => setFormState({ ...formState, max_ph: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Duration (Days)</label>
                  <input
                    type="number"
                    value={formState.crop_duration_days}
                    onChange={e => setFormState({ ...formState, crop_duration_days: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Expected Yield (q/ha)</label>
                  <input
                    type="number"
                    value={formState.expected_yield_quintal_per_hectare}
                    onChange={e => setFormState({ ...formState, expected_yield_quintal_per_hectare: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none font-bold"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <ButtonGroup>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl font-bold"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    type="submit"
                    className="px-5 py-2 rounded-xl font-bold"
                  >
                    Save to Dataset
                  </Button>
                </ButtonGroup>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCrops;
