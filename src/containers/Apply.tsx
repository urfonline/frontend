import React, { useState } from 'react';
import {
  CategoryInput,
  ColorInput,
  EmojiInput,
  LongTextInput,
  SubmitInput,
  TextInput,
  TimeSlotInput,
} from '../components/Form';
import gql from 'graphql-tag';
import { useMutation, useQuery } from 'react-apollo-hooks';

interface IProps {
	dispatch: any;
}

const ApplyMutation = gql`
  mutation applyForShow(
    $name: String!
    $contactEmail: String!
    $shortDescription: String!
    $longDescription: String!
    $category: String!
    $brandColor: String!
    $emojiDescription: String!
    $firstSlot: TimeSlotInput!
    $secondSlot: TimeSlotInput!
    $thirdSlot: TimeSlotInput!
    $socialFacebookUrl: String
    $socialMixcloudHandle: String
    $socialTwitterHandle: String
    $socialInstagramHandle: String
  ) {
    apply(
      name: $name,
      contactEmail: $contactEmail,
      shortDescription: $shortDescription,
      longDescription: $longDescription,
      category: $category,
      brandColor: $brandColor,
      emojiDescription: $emojiDescription,
      firstSlot: $firstSlot,
      secondSlot: $secondSlot,
      thirdSlot: $thirdSlot,
      socialFacebookUrl: $socialFacebookUrl,
      socialMixcloudHandle: $socialMixcloudHandle,
      socialTwitterHandle: $socialTwitterHandle,
      socialInstagramHandle: $socialInstagramHandle,
    ) {
      success, problems
    }
  }
`;

const ApplicationsQuery = gql`
  query ApplicationsQuery {
    applicationSettings {
      applicationsOpen
      applyPageSubtitle
    }
  }
`;

function ApplicationForm(_props: IProps) {
  const submitApplication = useMutation(ApplyMutation);
  const {data, loading} = useQuery(ApplicationsQuery);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  if (loading) {
    return <div className="Container ApplicationForm">
      <h1>Loading...</h1>
    </div>
  }

  let {applicationsOpen, applyPageSubtitle} = data.applicationSettings;

  if (!applicationsOpen) {
    return <div className="Container ApplicationForm">
      <div className="FormHeader">
        <h1>Applications are closed</h1>
        <p>{applyPageSubtitle || "Please check back later!"}</p>
      </div>
    </div>
  }

  function handleSubmit(e: any) {
    e.preventDefault();

    let form = e.target;
    let elements = form.elements;
    let variables: any = {};

    for (let i = 0; i < elements.length; i++) {
      let name = elements[i].name;

      variables[name] = elements[i].value;
    }

    ['firstSlot', 'secondSlot', 'thirdSlot'].forEach((key) => {
      variables[key] = {
        day: variables[key + 'Day'],
        hour: variables[key + 'Time']
      };
    });

    submitApplication({
      variables: variables
    }).then((data: any) => {
      if (data.apply.success) {
        setDone(true);
        setError("");
      } else {
        setError(data.apply.problems[0])
      }
    }).catch((err: any) => setError(err.message));
  }

  if (done) {
    return <div className="Container ApplicationForm">
      <div className="FormHeader">
        <h1>Application submitted</h1>
        <p>
          Thanks for submitting your application! We'll get back to you ASAP.
        </p>
      </div>
    </div>
  }

	return <div className="Container ApplicationForm">
		<div className="FormHeader">
			<h1>Apply for a show</h1>
			<p>{applyPageSubtitle ||
          "Just fill out the form below and we'll take a look"}</p>
		</div>
		<form id="applyform" onSubmit={handleSubmit}>
			<TextInput title="Name of Show" id="name"/>
			<TextInput title="Contact Email" id="contactEmail" type="email"
        helptext="An email we can contact you by"/>

			<TextInput title="Short Description" id="shortDescription"
				helptext="A short tagline for your show"/>
			<LongTextInput title="Long Description" id="longDescription"
				minimum={200}
				helptext="A longer description for your show (min. 200 characters)"/>
      <CategoryInput id="category" title="Show Category"
        helptext="Pick the category that best describes your show."/>
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
			<TextInput title="Mixcloud Handle" id="socialMixcloudHandle"
				helptext="(optional) If you have a Mixcloud page for your show, add your handle here"
				optional={true}/>
			<TextInput title="Twitter @" id="socialTwitterHandle"
				helptext="(optional) If you have a Twitter page for your show, add your @ here"
				optional={true}/>
			<TextInput title="Instagram Handle" id="socialInstagramHandle"
				helptext="(optional) If you have an Instagram page for your show, add your handle here"
				optional={true}/>
      {error && <div className="Error">{error}</div>}
			<SubmitInput/>
		</form>
	</div>
}

export default ApplicationForm;
