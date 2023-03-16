import React from "react";

function OneJob(props) {
    const { state } = props.location;
    console.log(state);

  return (
    <>
      <div className="job">{state.title}</div>
      <div className="job">{state.job_description}</div>
      <div className="job">{state.location}</div>
    </>
  );
}

export default OneJob;
