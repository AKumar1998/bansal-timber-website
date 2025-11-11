import React, { useState, useEffect, useMemo } from 'react';

export default function SortingAttributesSection({
  attributes = [],
  loading,
  selectedCategory,
  onAttributesChange
}) {
  const [selected, setSelected] = useState({});

  const optionIdToAttribute = useMemo(() => {
    const map = {};
    (attributes || []).forEach(attr => {
      (attr.options || []).forEach(opt => {
        if (opt.option_id != null) map[String(opt.option_id)] = attr.id;
      });
    });
    return map;
  }, [attributes]);

  useEffect(() => {
    setSelected({});
    if (onAttributesChange) onAttributesChange({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory?.id]);

  if (loading)
    return (
      <div className="p-6 text-center bg-white rounded-xl shadow border border-gray-100 text-gray-500 animate-pulse">
        Loading sorting options...
      </div>
    );

  const blockedCategories = ['All Products', 'Miscellaneous'];
  if (
    !selectedCategory ||
    blockedCategories.includes(selectedCategory.name) ||
    !attributes ||
    attributes.length === 0
  ) {
    return null;
  }

  const toggleOption = (attributeId, optionValue) => {
    setSelected(prev => {
      const next = { ...prev };
      const current = new Set(prev[attributeId] || []);
      const key = typeof optionValue === 'number' ? optionValue : String(optionValue);
      if (current.has(key)) current.delete(key);
      else current.add(key);
      const arr = Array.from(current);
      if (arr.length === 0) delete next[attributeId];
      else next[attributeId] = arr;
      if (onAttributesChange) onAttributesChange(next);
      return next;
    });
  };

  const updateTextAttribute = (attributeId, text) => {
    setSelected(prev => {
      const next = { ...prev };
      if (!text || text.trim() === '') delete next[attributeId];
      else next[attributeId] = [text.trim()];
      if (onAttributesChange) onAttributesChange(next);
      return next;
    });
  };

  const isParentOptionSelected = (parentOptionId) => {
    if (!parentOptionId) return true;
    const parentAttrId = optionIdToAttribute[String(parentOptionId)];
    if (!parentAttrId) return true;
    const sel = selected[parentAttrId] || [];
    if (sel.length === 0) return true;
    return sel.includes(String(parentOptionId)) || sel.includes(parentOptionId);
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md border border-gray-100 mt-4 space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Sort & Filter</h2>

      {(attributes || []).map(attr => (
        <div key={attr.id} className="space-y-3">
          <label className="block text-gray-700 font-medium text-base tracking-wide">
            {attr.name}
          </label>

          {attr.input_type === 'select' ? (
            <div className="flex flex-col space-y-2">
              {(attr.options || []).map(opt => {
                const optionId =
                  opt.option_id != null ? String(opt.option_id) : String(opt.value_text);
                const checked = (selected[attr.id] || []).includes(optionId);
                const disabled = !isParentOptionSelected(opt.parent_option_id);
                return (
                  <label
                    key={optionId}
                    className={`flex items-center px-3 py-2 rounded-lg border cursor-pointer transition-all ${checked
                        ? 'bg-orange-50 border-orange-400 text-orange-600 font-medium'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-orange-300 hover:text-orange-600'
                      } ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                  >
                    <input
                      type="checkbox"
                      disabled={disabled}
                      checked={checked}
                      onChange={() => toggleOption(attr.id, optionId)}
                      className="w-4 h-4 accent-orange-500 cursor-pointer rounded border-gray-300 focus:ring-1 focus:ring-orange-300"
                    />
                    <span className="ml-2 text-sm break-words leading-snug">{opt.value_text}</span>
                  </label>
                );
              })}
            </div>
          ) : (
            <input
              type="text"
              className="border border-gray-300 rounded-lg p-2 w-full text-sm focus:border-orange-400 focus:ring-1 focus:ring-orange-300 outline-none"
              placeholder={`Enter ${attr.name}`}
              value={(selected[attr.id] || []).join(', ')}
              onChange={(e) => updateTextAttribute(attr.id, e.target.value)}
            />
          )}
        </div>
      ))}
    </div>
  );
}

