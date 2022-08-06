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
  const [autoSubmit, setAutoSubmit] = React.useState(false);
  const [errorIndexes, setErrorIndexes] = React.useState<number[]>([]);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  //track alphaNumeric state to determine when to error for invalid fields
  React.useEffect(() => {
    if (allowAlphaNumeric) {
      setErrorIndexes([]);
      return;
    }
    setErrorIndexes(
      input.reduce((acc, item, index) => {
        if (isNaN(Number(item))) {
          acc.push(index);
        }
        return acc;
      }, [])
    );
  }, [allowAlphaNumeric, input]);

  // autosubmit form filled up
  React.useEffect(() => {
    if (autoSubmit && input.length === limit) {
      buttonRef.current?.click();
    }
  }, [input]);

  //autofocus input on mouseenrer
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

  const focusInput = (index: number) => {
    inputRefs.current[index]?.focus();
  };

  const onDelete = (index: number) => {
    input[index] = '';
    setInput(input.filter(Boolean));
    focusInput(index - 1);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value.trim();
    // determine next empty box to jump to after filling a box
    const nextActiveInput = inputRefs.current?.find(
      (inp) => !inp?.value.length
    );
    if (!value.length) return;

    // do not accept input if alphanumeric not allowed and input isn't a number
    if (!allowAlphaNumeric && isNaN(Number(value[value.length - 1]))) {
      return;
    }

    // if new value is entered into a box, replace old value with it
    if (value.length > 1) {
      const newInput = findNewinput(input[index], value);
      //confirm latest input conforms to rule before replacing
      if (!allowAlphaNumeric && isNaN(Number(newInput))) {
        return;
      }
      input[index] = newInput;
      setInput(input.filter(Boolean));
      nextActiveInput?.focus();
      return;
    }
    input[index] = value;
    setInput(input.filter(Boolean));
    setErrorIndexes([]);
    // focus on next input once an input field is done with

    nextActiveInput?.focus();
  };

  const onSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      window.alert('submitted otp: ' + input.join(''));
      setLoading(false);
    }, 2000);
  };

  // allow use of arrow keys for navigation
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    const key = e.keyCode || e.charCode;
    switch (key) {
      //backspace & delete
      case 8:
      case 46: {
        onDelete(index);
        return false;
      }
      case 37:
      case 40:
        focusInput((index - 1 + limit) % limit);
        break;
      case 38:
      case 39:
        focusInput((index + 1) % limit);
        break;
    }
  };
  const handleFocus = (index: number) => {
    setActiveIndex(index);
  };
  return (
    <React.Fragment>
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
                onChange={(e) => handleInputChange(e, index)}
                active={activeIndex === index}
                ref={(el) => inputRefs.current?.push(el)}
                onFocus={() => handleFocus(index)}
                showInput={showInput}
                onKeyDown={(e) => handleKeyDown(e, index)}
                error={errorIndexes.includes(index)}
              />
            );
          })}
        </div>
        <div
          style={{
            display: 'flex',
            gap: 20,
            justifyContent: 'center',
            padding: 20,
          }}
        >
          <button
            style={{
              width: 200,
              height: 40,
              background: 'red',
              color: 'white',
              outline: 'none',
              border: 'none',
              borderRadius: 5,
            }}
            onClick={() => {
              setInput([]);
              inputRefs.current?.[0].focus();
            }}
          >
            Clear
          </button>
          <button
            style={{
              width: 200,
              height: 40,
              background: 'green',
              color: 'white',
              outline: 'none',
              border: 'none',
              borderRadius: 5,
            }}
            ref={buttonRef}
            disabled={input.length < limit || !!errorIndexes.length}
            onClick={onSubmit}
          >
            {loading ? 'Submitting' : 'Submit'}
          </button>
        </div>
        <h2>Controls</h2>
      </div>
      <div style={{ display: 'flex', gap: '20px', flexFlow: 'column' }}>
        <div title="set number of input boxes">
          <input
            type="number"
            min={4}
            max={16}
            value={limit}
            onChange={(e) => {
              const { value } = e.target;
              // setLimit(+value < 4 ? 4 : +value > 16 ? 16 : +value);
              setLimit(+value);
            }}
          />{' '}
          <label>Limit</label>
        </div>
        <div title="Submit form automatically when input is filled">
          <input
            type="checkbox"
            checked={autoSubmit}
            onChange={(e) => setAutoSubmit(e.target.checked)}
          />{' '}
          <label>AutoSubmit</label>
        </div>
        <div title="Shows text in input box if set to true">
          <input
            type="checkbox"
            checked={showInput}
            onChange={(e) => setShowInput(e.target.checked)}
          />{' '}
          <label>Show Input</label>
        </div>
        <div title="allow numbers and letters">
          <input
            type="checkbox"
            checked={allowAlphaNumeric}
            onChange={(e) => setAllowAlphaNumeric(e.target.checked)}
          />{' '}
          <label>Allow Alphanumeric</label>
        </div>
      </div>
    </React.Fragment>
  );
}
