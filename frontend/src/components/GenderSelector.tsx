import { useState } from 'react';

interface GenderSelectorProps {
  selected: string;
  setSelected: (value: string) => void;
}

export default function GenderSelector({ selected, setSelected }: GenderSelectorProps) {
  const [showOptions, setShowOptions] = useState(false);
  const [displayText, setDisplayText] = useState('-- Chọn giới tính --');

  const toggleOptions = () => setShowOptions(prev => !prev);

  const handleSelect = (value: string) => {
    setSelected(value); // update parent state
    setDisplayText(value); // update UI
    setShowOptions(false);
  };

  return (
    <div className="form-group">
      <label htmlFor="gender-select">Giới tính</label>
      <div id="gender-wrapper" className="custom-select">
        <div
          id="gender-selected"
          className="selected-option"
          onClick={toggleOptions}
        >
          {displayText}
          <span className="arrow">&#9662;</span>
        </div>
        {showOptions && (
          <div id="gender-options" className="options">
            <div className="option" data-value="Nam" onClick={() => handleSelect('Nam')}>Nam</div>
            <div className="option" data-value="Nữ" onClick={() => handleSelect('Nữ')}>Nữ</div>
          </div>
        )}
      </div>
      <input type="hidden" id="gender-value" name="gender" value={selected} required />
    </div>
  );
}
