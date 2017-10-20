import React from 'react';

import membersOne from '../img/members_1.jpg';
import membersTwo from '../img/members_2.jpg';
import membersThree from '../img/members_3.jpg';

function MembersGallery() {
  return (
    <div className="MembersGallery">
      <h1 className="MembersGallery__title">We. are. URF.</h1>
      <div className="MembersGallery__background">
        <div className="MembersGallery__row MembersGallery__row--left">
          <img className="MembersGallery__image" src={membersOne} />
          <img className="MembersGallery__image" src={membersOne} />
        </div>

        <div className="MembersGallery__row MembersGallery__row--right">
          <img className="MembersGallery__image" src={membersTwo} />
          <img className="MembersGallery__image" src={membersTwo} />
        </div>

        <div className="MembersGallery__row MembersGallery__row--left-faster">
          <img className="MembersGallery__image" src={membersThree} />
          <img className="MembersGallery__image" src={membersThree} />
        </div>
      </div>
    </div>
  );
}

export default MembersGallery;
