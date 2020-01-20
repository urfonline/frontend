import { useState } from 'react';
import React from 'react';
import { BaseEmoji, Picker } from 'emoji-mart';

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
    setOpen(false);
  }

  return <div className="StyledInput EmojiInput">
    <label htmlFor={props.id} title={props.helptext}>{props.title}</label>
    {props.helptext && <div className="meta">{props.helptext}</div>}
    <input type="button" name={props.id} value={emoji}
           onClick={() => setOpen(!open)}/>
    {open && <Picker set="twitter" title="Pick an emoji"
            onSelect={handleSelect}/>}
  </div>
}
