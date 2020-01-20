import React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../types';
import { ColorInput, EmojiInput, LongTextInput, TextInput, TimeSlotInput } from '../components/Form';

interface IProps {
	dispatch: any;
}

function ApplicationForm(_props: IProps) {
	return <div className="Container ApplicationForm">
		<div className="FormHeader">
			<h1>Apply for a show</h1>
			<p>Just fill out the form below and we'll take a look</p>
		</div>
		<form id="applyform">
			<TextInput title="Name of Show" id="name"/>
			<TextInput title="Contact Email" id="contactEmail" type="email"
        helptext="An email we can contact you by"/>

			<TextInput title="Short Description" id="shortDescription"
				helptext="A short tagline for your show"/>
			<LongTextInput title="Long Description" id="longDescription"
				minimum={200}
				helptext="A longer description for your show (min. 200 characters)"/>
			<EmojiInput id="emojiDescription" title="Emoji Description"
        helptext="Pick an emoji that represents your show!"/>
      <ColorInput id="brandColor" title="Brand Color"
        helptext={"Pick a color to brand your show page with (click to select)"+
                  ", or specify a hex color code"}/>
      <TimeSlotInput id="firstSlot" title="First Slot Request"
        helptext="Pick your first-choice slot (time and day)"/>
      <TimeSlotInput id="secondSlot" title="Second Slot Request"
        helptext="Pick your second-choice slot (time and day)"/>
      <TimeSlotInput id="thirdSlot" title="Third Slot Request"
        helptext="Pick your third-choice slot (time and day)"/>

			<TextInput title="Facebook URL" id="socialFacebookUrl"
				helptext="(optional) If you have a Facebook page for your show, paste its URL here"
				optional={true}/>
		</form>
	</div>
}

export default connect(
	(_state: RootState) => ({}),
)(ApplicationForm)
