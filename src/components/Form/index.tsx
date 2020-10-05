import React, { useState } from 'react';
import { BaseEmoji, Picker } from 'emoji-mart';
import { TwitterPicker, ColorResult } from 'react-color';
import tinycolor from 'tinycolor2';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo-hooks';

interface IInputProps {
  id: string;
  title: string;
  helptext?: string;
}

interface ITextInputProps extends IInputProps {
  type?: string;
  minimum?: number;
  maximum?: number;
  optional?: boolean;
}

export function TextInput(props: ITextInputProps) {
  return <div className="StyledInput">
    <label htmlFor={props.id} title={props.helptext}>{props.title}</label>
    {props.helptext && <div className="meta">{props.helptext}</div>}
    <input type={props.type || "text"} className="StyledInput__input"
           name={props.id} placeholder={props.title} required={!props.optional}
           maxLength={props.maximum || -1}/>
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

export function BoolInput(props: IInputProps) {
  let [checked, setChecked] = useState(false);

  return <div className="StyledInput BoolInput">
    <label htmlFor={props.id} title={props.helptext}>{props.title}</label>
    {props.helptext && <div className="meta">{props.helptext}</div>}

    <input type="checkbox" name={props.id} checked={checked}
           onChange={(e: any) => setChecked(e.target.checked)}/>
    <div className="Flipper" onClick={() => setChecked(!checked)}>
      {checked ? "Yeah!" : "Nope"}
    </div>
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

interface IImageUploadProps extends IInputProps {
  to: string;
}

export function ImageUploadInput(props: IImageUploadProps) {
  return <div className="StyledInput ImageUploadInput">
    <label htmlFor={props.id} title={props.helptext}>{props.title}</label>
    {props.helptext && <div className="meta">{props.helptext}</div>}
    <input type="file" name={props.id}/>
  </div>
}

const CategoryQuery = gql`
  query CategoryQuery {
    allCategories {
      id, name, slug
    }
  }
`;

export function CategoryInput(props: IInputProps) {
  const {data, loading} = useQuery(CategoryQuery);

  if (loading) {
    return <div className="StyledInput">Loading</div>
  }

  return <div className="StyledInput CategoryInput">
    <label htmlFor={props.id} title={props.helptext}>{props.title}</label>
    {props.helptext && <div className="meta">{props.helptext}</div>}
    <select name={props.id} required={true}>
      {data.allCategories.map(
        (category: any) => <option key={category.id} value={category.slug}>
          {category.name}
        </option>
      )}
    </select>
  </div>
}

export function TimeSlotInput(props: IInputProps) {
  return <div className="StyledInput TimeSlotInput">
    <label htmlFor={props.id + "Time"} title={props.helptext}>{props.title}</label>
    {props.helptext && <div className="meta">{props.helptext}</div>}
    <select name={props.id + "Time"} required={true}>
      <option value={9}>9am</option>
      <option value={10}>10am</option>
      <option value={11}>11am</option>
      <option value={12}>12pm</option>
      <option value={13}>1pm</option>
      <option value={14}>2pm</option>
      <option value={15}>3pm</option>
      <option value={16}>4pm</option>
      <option value={17}>5pm</option>
    </select>
    <select name={props.id + "Day"} required={true}>
      <option value={0}>Monday</option>
      <option value={1}>Tuesday</option>
      <option value={2}>Wednesday</option>
      <option value={3}>Thursday</option>
      <option value={4}>Friday</option>
    </select>
  </div>
}

export function SubmitInput({ text }: { text: string; }) {
  return <div className="SubmitInput">
    <input type="submit" value={text}/>
  </div>
}
