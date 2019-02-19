import React from 'react';
import { Helmet } from 'react-helmet';
import MembersGallery from '../components/MembersGallery';

function NotFound() {
  return (
    <div>
      <Helmet title="We are URF" />
      <MembersGallery />

      <div className="ContainerProse">
        <p>
          University Radio Falmer (URF) is the radio station of the University
          of Sussex Students’ Union, and is run entirely by student volunteers.
          URF is one of the oldest student radio stations in the country, being
          established in 1976, and is also one of the only non play-listed radio
          stations. We want our shows to reflect exactly what the presenters
          want to play, and you the listeners want to hear, so student DJs are
          given the freedom to determine the content and music for their shows,
          which is something we are very proud of. The huge variety of shows we
          have on the schedule reflects this: from news and discussion shows, to
          specialist and unsigned music shows, to cheesey 90’s pop and most
          recently society based shows!
        </p>
        <p>
          Whether you enjoy the buzz of being on air, you’d rather help out
          behind the scenes or be part of one of the teams, or even if you just
          want to listen to some great shows, we’ve got something for everyone.
          Getting involved in student radio is not only fun, but also can be
          incredibly rewarding, and is great work experience which looks great
          on your CV! Past members have gone on to work for Juice 107.2FM, the
          BBC and many other local, national and international media outlets.
        </p>

        <p>
          We often have outsiders come in to do talks for the members, which is
          something we want to pursue more of. Recently we have had the Pips
          which is an organisation helping students be apart of radio. Yearly
          the team goes to the SRA conference (student radio association) where
          we are trained on planning, production and the different aspects of
          radio. Therefore if you have any questions do not hesitate to contact
          the team.
        </p>
      </div>
    </div>
  );
}

export default NotFound;
