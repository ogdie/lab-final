import { useState, useRef, useEffect } from 'react';
import MentionAutocomplete from './MentionAutocomplete';

export default function MentionTextarea({ 
  value, 
  onChange, 
  placeholder, 
  style, 
  rows = 1,
  theme = 'light',
  ...props 
}) {
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(null);
  const textareaRef = useRef(null);
  const containerRef = useRef(null);

  const handleChange = (e) => {
    const newValue = e.target.value;
    const cursorPos = e.target.selectionStart;
    
    onChange(e);
    
    const textBeforeCursor = newValue.substring(0, cursorPos);
    const isTypingMention = /@[a-zA-Z0-9_\-\s]*$/.test(textBeforeCursor);
    
    if (isTypingMention) {
      setShowAutocomplete(true);
      setCursorPosition(cursorPos);
    } else {
      setShowAutocomplete(false);
      setCursorPosition(null);
    }
  };

  const handleSelectUser = (newText, newCursorPos) => {
    if (textareaRef.current) {
      const syntheticEvent = {
        target: {
          value: newText,
          selectionStart: newCursorPos,
          selectionEnd: newCursorPos
        },
        currentTarget: textareaRef.current,
        preventDefault: () => {},
        stopPropagation: () => {}
      };
      
      textareaRef.current.value = newText;
      
      onChange(syntheticEvent);
      
      requestAnimationFrame(() => {
        if (textareaRef.current) {
          textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
          setCursorPosition(newCursorPos);
        }
      });
    }
    setShowAutocomplete(false);
    setCursorPosition(null);
  };

  const handleKeyDown = (e) => {
    if (showAutocomplete && (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter')) {
      e.preventDefault();
      return;
    }
  };

  const handleClick = () => {
    if (textareaRef.current) {
      setCursorPosition(textareaRef.current.selectionStart);
    }
  };
  const {
    width,
    flex,
    padding,
    border,
    borderRadius,
    background,
    color,
    fontSize,
    minHeight,
    resize,
    ...textareaStyleProps
  } = style || {};

  return (
    <div 
      ref={containerRef} 
      style={{ 
        position: 'relative', 
        flex: flex || (style?.flex === undefined ? undefined : 1),
        width: width || '100%',
        padding: padding || 0,
        border: border || 'none',
        borderRadius: borderRadius || 0,
        background: background || 'transparent',
        color: color || 'inherit',
        fontSize: fontSize || 'inherit',
        minHeight: minHeight || 'auto',
        ...textareaStyleProps
      }}
    >
      <textarea
        {...props}
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onClick={handleClick}
        onKeyUp={handleClick}
        placeholder={placeholder}
        style={{ 
          width: '100%',
          border: 'none',
          outline: 'none',
          background: 'transparent',
          resize: resize || 'none',
          fontFamily: 'inherit',
          fontSize: 'inherit',
          color: 'inherit',
          padding: 0,
          margin: 0,
          boxSizing: 'border-box'
        }}
        rows={rows}
      />
      {showAutocomplete && cursorPosition !== null && (
        <MentionAutocomplete
          text={value}
          cursorPosition={cursorPosition}
          onSelectUser={handleSelectUser}
          onClose={() => setShowAutocomplete(false)}
          containerRef={containerRef}
          theme={theme}
        />
      )}
    </div>
  );
}