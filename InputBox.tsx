import * as React from 'react';

const InputBox = React.forwardRef(
  (
    {
      value,
      active,
      onChange,
      onFocus,
      showInput,
      onKeyDown,
      error,
    }: {
      value: string | undefined;
      active: boolean;
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
      onFocus: () => void;
      showInput: boolean;
      onKeyDown: (e: any) => boolean;
      error: boolean;
    },
    ref: React.ForwardedRef<HTMLInputElement>
  ) => {
    return (
      <div
        style={{
          width: 50,
          height: 50,
          border: active
            ? `3px solid ${!value.length ? 'blue' : error ? 'red' : 'green'}`
            : error && value.length
            ? '1px solid red'
            : value.length && !error
            ? '2px solid green'
            : '1px solid black',
          borderRadius: 2,
          display: 'grid',
          placeItems: 'center',
          cursor: 'pointer',
          position: 'relative',
        }}
      >
        <input
          style={{
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            fontSize: '2rem',
            border: 'none',
            textAlign: 'center',
            outline: 'none',
            background: 'none',
            position: 'absolute',
            opacity: showInput ? 1 : 0,
            caretColor: 'transparent',
          }}
          onFocus={onFocus}
          onKeyDown={onKeyDown}
          type="tel"
          onChange={onChange}
          value={value}
          ref={ref}
        />
        {value && !showInput && (
          <span
            style={{
              width: 8,
              height: 8,
              background: '#000',
              borderRadius: '50%',
            }}
          />
        )}
      </div>
    );
  }
);
export default InputBox;
