import { Helmet } from 'react-helmet';
import React from 'react';
import Logo from '../img/logo-short-opt.svg';

export default function ApiError({ error }: { error: Error }) {
  return <div className="Container ErrorPage">
    <Helmet title="Server error" />
    <br/>
    <Logo style={{ width: "500px" }}/>
    <div>
      <h1 className="Page__heading">Server Error</h1>
      <div className="caption">Our website may be offline, but the radio carries on... &#128251;</div>
      <p className="caption">Our tech team is working to fix this ASAP &#128295;</p>
      <h3>If you see a techie, show them this message:</h3>
      <p><code>Failed to contact API: {error.message}</code></p>
    </div>
  </div>
}
