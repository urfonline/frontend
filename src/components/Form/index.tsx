import React, { useState } from 'react';
import { BaseEmoji, Picker } from 'emoji-mart';
import { TwitterPicker, ColorResult } from 'react-color';
import tinycolor from 'tinycolor2';

interface IInputProps {
  id: string;
  title: string;
  helptext?: string;
}

interface ITextInputProps extends IInputProps {
  type?: string;
  minimum?: number;
  optional?: boolean;
}

export function TextInput(props: ITextInputProps) {
  return <div className="StyledInput">
    <label htmlFor={props.id} title={props.helptext}>{props.title}</label>
    {props.helptext && <div className="meta">{props.helptext}</div>}
    <input type={props.type || "text"} className="StyledInput__input"
           name={props.id} placeholder={props.title} required={!props.optional}/>
  </div>
}

export function LongTextInput(props: ITextInputProps) {
  let [rows, setRows] = useState(3);

  function autoGrow(e: any) {
    let ta: any = e.target;

    if (ta.textLength == 0) {
      setRows(3);
      return;
    }

    if (ta.scrollHeight > ta.clientHeight) {
      let diff = ta.scrollHeight - ta.clientHeight;
      let delta = Math.ceil(diff / 27);

      setRows(rows + delta);
    }
  }

  return <div className="StyledInput LongTextInput">
    <label htmlFor={props.id} title={props.helptext}>{props.title}</label>
    {props.helptext && <div className="meta">{props.helptext}</div>}
    <textarea className="StyledInput__input" name={props.id}
              required={true} rows={rows}
              onChange={autoGrow}
              placeholder={props.title} minLength={props.minimum || 0}/>
  </div>
}

export function EmojiInput(props: IInputProps) {
  let [open, setOpen] = useState(false);
  let [emoji, setEmoji] = useState('\ud83d\udcfb');

  function handleSelect(emojiData: BaseEmoji) {
    setEmoji(emojiData.native);
  }

  let timer: number = 0;
  function handleExit() {
    // @ts-ignore
    timer = setTimeout(() => setOpen(false), 0);
  }

  function handleRejoin() {
    if (timer) clearTimeout(timer);
  }

  function handleKey(e: any) {
    if (e.which == 27) setOpen(false);
  }

  return <div className="StyledInput EmojiInput" onBlurCapture={handleExit}
              onFocusCapture={handleRejoin} onKeyDown={handleKey}>
    <label htmlFor={props.id} title={props.helptext}>{props.title}</label>
    {props.helptext && <div className="meta">{props.helptext}</div>}
    <input type="button" name={props.id} value={emoji}
           onClick={() => setOpen(!open)}/>
    {open && <Picker set="twitter" title="Pick an emoji" emoji="radio"
            onSelect={handleSelect}/>}
  </div>
}

export function ColorInput(props: IInputProps) {
  let [open, setOpen] = useState(false);
  let [color, setColor] = useState('#ff0000');

  function handleSelect(color: ColorResult) {
    setColor(color.hex);
  }

  let timer: number = 0;
  function handleExit() {
    // @ts-ignore
    timer = setTimeout(() => setOpen(false), 0);
  }

  function handleRejoin() {
    if (timer) clearTimeout(timer);
  }

  function handleKey(e: any) {
    if (e.which == 27) setOpen(false);
  }

  return <div className="StyledInput ColorInput" onBlurCapture={handleExit}
              onFocusCapture={handleRejoin} onKeyDown={handleKey}>
    <label htmlFor={props.id} title={props.helptext}>{props.title}</label>
    {props.helptext && <div className="meta">{props.helptext}</div>}
    <input type="button" name={props.id} style={{
      backgroundColor: color,
      color: tinycolor(color).isLight() ? "#000000" : "#ffffff"
    }} value={color} onClick={() => setOpen(!open)}/>
    {open && <TwitterPicker color={color}
                            onChangeComplete={handleSelect}/>}
  </div>
}
