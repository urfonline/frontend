import React from 'react';
import sample from 'lodash/sample';
import { Helmet } from 'react-helmet';

import hk1 from './artandcrap/hk_1.jpg';
import sb1 from './artandcrap/sb_1.png';
import ep1 from './artandcrap/ep_1.jpg';
import jt1 from './artandcrap/jt_1.jpg';
import sf1 from './artandcrap/sf_1.jpg';
import mm1 from './artandcrap/mm_1.jpg';
import rb1 from './artandcrap/rb_1.jpg';

interface Art {
  image: string;
  credit: string;
}

const ART_MAP: Art[] = [
  { image: hk1, credit: 'Hannah Kingwell', },
  { image: sb1, credit: 'Sam Berkay', },
  { image: ep1, credit: 'Eddy Pugsley', },
  { image: jt1, credit: 'Jamie Topp', },
  { image: sf1, credit: 'Susanna Fantoni', },
  { image: mm1, credit: 'Michael Melville', },
  { image: rb1, credit: 'Reece Selby', },
];


function NotFound() {
  const art: Art = sample(ART_MAP) || ART_MAP[0];

  return (
    <div className="Container ErrorPage">
      <Helmet>
        <title>404 (Not found)</title>
      </Helmet>
      <h1 className="Page__heading">404 (Not found)</h1>
      <figure className="ErrorPage__figure">
        <img className="ErrorPage__image" src={art.image} />
        <figcaption className="ErrorPage__caption">This piece of error art was crafted by {art.credit}</figcaption>
      </figure>
    </div>
  );
}

export default NotFound;
