import * as React from 'react';
import InputBox from './InputBox';
import './style.css';

export default function App() {
  const [input, setInput] = React.useState([]);
  const [limit, setLimit] = React.useState(6);
  const [activeIndex, setActiveIndex] = React.useState(null);
  const [showInput, setShowInput] = React.useState(true);
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);
  const [allowAlphaNumeric, setAllowAlphaNumeric] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (input.length === limit) {
      buttonRef.current?.click();
    }
  }, [input]);
  React.useLayoutEffect(() => {
    document.addEventListener('mouseenter', () => {
      inputRefs.current?.[activeIndex ?? 0]?.focus();
    });
    return () => {
      window.removeEventListener('mouseenter', () => {
        inputRefs.current?.[activeIndex ?? 0]?.focus();
      });
    };
  }, [activeIndex]);

  
  const findNewinput = (oldInput: string, newInput: string) => {
    return newInput[(newInput.indexOf(oldInput) + 1) % 2] || '';
  };
  const focusLastInput = () => {
    inputRefs.current
      ?.slice(0)
      .reverse()
      .find((inp) => inp?.value.length)
      ?.focus();
  };
  const handleChange = (e, index) => {
    console.log(index);
    const { value } = e.target;
    if (!allowAlphaNumeric && isNaN(Number(value[value.length - 1]))) {
      return;
    }
    if (value.length > 1) {
      input[index] = findNewinput(input[index], value);
      setInput(input.filter(Boolean));
      return;
    }
    input[index] = value;
    setInput(input.filter(Boolean));
    const nextActiveInput = inputRefs.current?.find(
      (inp) => !inp?.value.length
    );
    nextActiveInput?.focus();
  };

  const onSubmit = () => {
    setLoading(true);

    setTimeout(() => {
      window.alert('submitted otp: ' + input.join(''));
      setLoading(false);
    }, 2000);
  };
  const handleKeyDown = (e) => {
    var key = e.keyCode || e.charCode;

    if (key == 8 || key == 46) {
      focusLastInput();
      return false;
    }
  };
  const handleInputClick = (index) => {
    setActiveIndex(index);
    inputRef.current?.focus();
  };

  const handleFocus = (index) => {
    setActiveIndex(index);
    console.log('active index', index);
  };
  return (
    <div style={{ display: 'flex', flexFlow: 'column' }}>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '20px',
          margin: '50px auto',
          width: 'fit-content',
          height: 'fit-content',
        }}
      >
        {Array.from(Array(limit).keys()).map((_, index) => {
          return (
            <InputBox
              value={input[index] || ''}
              onClick={() => handleInputClick(index)}
              onChange={(e) => handleChange(e, index)}
              active={
                activeIndex === index
                //&& document.activeElement === inputRefs.current?.[index]
              }
              ref={(el) => inputRefs.current?.push(el)}
              onFocus={() => handleFocus(index)}
              showInput={showInput}
              onKeyDown={handleKeyDown}
            />
          );
        })}
      </div>
      <button
        style={{
          width: 200,
          margin: 'auto',
          height: 40,
          background: 'green',
          color: 'white',
          outline: 'none',
          border: 'none',
          borderRadius: 5,
        }}
        ref={buttonRef}
        disabled={input.length < limit}
        onClick={onSubmit}
      >
        {loading ? 'Submitting' : 'Submit'}
      </button>
    </div>
  );
}
