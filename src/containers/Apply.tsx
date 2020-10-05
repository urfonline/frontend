import React, { useState } from 'react';
import {
  BoolInput,
  CategoryInput,
  ColorInput,
  EmojiInput, ImageUploadInput,
  LongTextInput,
  SubmitInput,
  TextInput,
  TimeSlotInput,
} from '../components/Form';
import gql from 'graphql-tag';
import { useMutation, useQuery } from 'react-apollo-hooks';
import { API_HOST } from '../config';
import { formToMutation } from '../utils/forms';

interface IProps {
	dispatch: any;
}

const ApplyMutation = gql`
  mutation applyForShow(
    $name: String!
    $hostName: String!
    $contactEmail: String!
    $contactPhone: String!
    $producerName: String
    $shortDescription: String!
    $longDescription: String!
    $category: String!
    $new: Boolean
    $biweekly: Boolean
    $brandColor: String!
    $emojiDescription: String!
    $firstSlot: TimeSlotInput!
    $secondSlot: TimeSlotInput!
    $thirdSlot: TimeSlotInput!
    $cover: String
    $banner: String
    $socialFacebookUrl: String
    $socialMixcloudHandle: String
    $socialTwitterHandle: String
    $socialInstagramHandle: String
  ) {
    apply(
      name: $name,
      hostName: $hostName,
      contactEmail: $contactEmail,
      contactPhone: $contactPhone,
      producerName: $producerName,
      shortDescription: $shortDescription,
      longDescription: $longDescription,
      category: $category,
      new: $new,
      biweekly: $biweekly,
      brandColor: $brandColor,
      emojiDescription: $emojiDescription,
      firstSlot: $firstSlot,
      secondSlot: $secondSlot,
      thirdSlot: $thirdSlot,
      coverFilename: $cover,
      bannerFilename: $banner,
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
  const [statusMsg, setStatusMsg] = useState("Submit");

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

  function uploadImage(to: string, file: File) {
    return new Promise((resolve, reject) => {
      let req = new XMLHttpRequest();

      let form = new FormData();
      form.append('file', file, file.name);

      req.withCredentials = false;
      req.responseType = 'json';
      req.onload = function() {
        let data = req.response;

        if (data.success) {
          resolve(data.filename);
        } else {
          reject();
        }
      };

      req.open("POST", `${API_HOST}/applications/upload/${to}`);
      req.send(form);
    });
  }

  async function handleSubmit(e: any) {
    e.preventDefault();

    let form = e.target;
    let elements = form.elements;
    let variables = formToMutation(form);

    ['firstSlot', 'secondSlot', 'thirdSlot'].forEach((key) => {
      variables[key] = {
        day: variables[key + 'Day'],
        hour: variables[key + 'Time']
      };
    });

    if (elements['cover'].value) {
      setStatusMsg("Uploading cover...");
      variables['cover'] = await uploadImage('cover', elements['cover'].files[0]);
    }

    if (elements['banner'].value) {
      setStatusMsg("Uploading banner...");
      variables['banner'] = await uploadImage('banner', elements['banner'].files[0]);
    }

    try {
      setStatusMsg("Submitting form...");
      let data: any = await submitApplication({ variables: variables });
      let { apply } = data.data;

      if (apply.success) {
        setDone(true);
        setError("");
      } else {
        setError(apply.problems[0]);
        setStatusMsg("Try again");
      }
    } catch (err) {
      setError(err.message);
    }
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
			<TextInput title="Name of Show" id="name" maximum={80}/>
      <TextInput title="Your Name" id="hostName" maximum={80}/>
			<TextInput title="Contact Email" id="contactEmail" type="email"
        helptext="An email we can contact you with"/>
      <TextInput title="Contact Phone" id="contactPhone" type="tel"
        helptext="A phone number we can contact you with" maximum={20}/>
      <TextInput title="Producer's Name" id="producerName"
        helptext="Your producer or co-host's name (Optional)"
        optional={true} maximum={80}/>
      <BoolInput title="Are you a new show?" id="new"
        helptext="Check this box if you're a new show, so we know who needs training"/>

			<TextInput title="Short Description" id="shortDescription"
				helptext="A short tagline for your show" maximum={90}/>
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
      <ImageUploadInput id="cover" title="Show Photo" to="cover"
        helptext="Upload a square photo to use as your show image (Optional)"/>
      <ImageUploadInput id="banner" title="Show Banner" to="banner"
        helptext={"Upload a rectangular photo as your show banner (Optional"+
                  ", recommended size 1280x720)"}/>

      <BoolInput id="biweekly" title="Bi-weekly?"
        helptext="Check this box if you want a biweekly show"/>
      <TimeSlotInput id="firstSlot" title="First Slot Request"
        helptext="Pick your first-choice slot (time and day)"/>
      <TimeSlotInput id="secondSlot" title="Second Slot Request"
        helptext="Pick your second-choice slot (time and day)"/>
      <TimeSlotInput id="thirdSlot" title="Third Slot Request"
        helptext="Pick your third-choice slot (time and day)"/>

			<TextInput title="Facebook URL" id="socialFacebookUrl" type="url"
				helptext="(optional) If you have a Facebook page for your show, paste its URL here"
				optional={true}/>
			<TextInput title="Mixcloud Handle" id="socialMixcloudHandle"
				helptext="(optional) If you have a Mixcloud page for your show, add your handle here"
				optional={true} maximum={35}/>
			<TextInput title="Twitter @" id="socialTwitterHandle"
				helptext="(optional) If you have a Twitter page for your show, add your @ here"
				optional={true} maximum={35}/>
			<TextInput title="Instagram Handle" id="socialInstagramHandle"
				helptext="(optional) If you have an Instagram page for your show, add your handle here"
				optional={true} maximum={35}/>
      {error && <div className="Error">{error}</div>}
			<SubmitInput text={statusMsg || "Submit"}/>
		</form>
	</div>
}

export default ApplicationForm;
