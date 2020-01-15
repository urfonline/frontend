import React, { useState } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../types';

interface IProps {
	dispatch: any;
}

interface ITextEntryProps {
	title: string;
	helptext?: string;
	id: string;
	type?: string;
	minimum?: number;
	optional?: boolean;
}

function TextEntry(props: ITextEntryProps) {
	return <div className="TextEntry">
		<label htmlFor={props.id} title={props.helptext}>{props.title}</label>
		{props.helptext && <div className="meta">{props.helptext}</div>}
		<input type={props.type || "text"} className="TextEntry__input"
			id={props.id} placeholder={props.title} required={!props.optional}/>
	</div>
}

function LongTextEntry(props: ITextEntryProps) {
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

	return <div className="TextEntry LongTextEntry">
		<label htmlFor={props.id} title={props.helptext}>{props.title}</label>
		{props.helptext && <div className="meta">{props.helptext}</div>}
		<textarea className="TextEntry__input" id={props.id}
			required={true} rows={rows}
			onChange={autoGrow}
			placeholder={props.title} minLength={props.minimum || 0}/>
	</div>
}

function ApplicationForm(_props: IProps) {
	return <div className="Container ApplicationForm">
		<div className="FormHeader">
			<h1>Apply for a show</h1>
			<p>Just fill out the form below and we'll take a look</p>
		</div>
		<form id="applyform">
			<TextEntry title="Name of Show" id="name"/>
			<TextEntry title="Short Description" id="shortDescription"
				helptext="A short tagline for your show"/>
			<LongTextEntry title="Long Description" id="longDescription"
				minimum={200}
				helptext="A longer description for your show (min. 200 characters)"/>

			<TextEntry title="Facebook URL" id="socialFacebookUrl"
				helptext="(optional) If you have a Facebook page for your show, paste its URL here."
				optional={true}/>
		</form>
	</div>
}

export default connect(
	(_state: RootState) => ({}),
)(ApplicationForm)
